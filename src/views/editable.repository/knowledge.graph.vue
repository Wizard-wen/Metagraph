<template>
  <div class="graph-box">
    <knowledge-connection></knowledge-connection>
    <div class="graph-content">
      <ant-modal
        title="关联知识点"
        v-model:visible="isModalVisible"
        :confirm-loading="modalConfirmLoading"
        cancelText="取消"
        okText="关联"
        @cancel="handleModalCancel"
        @ok="handleModalOk">
        <ant-form
          ref="knowledgeFormRef"
          :model="knowledgeFormState">
          <ant-form-item label="所属知识点" name="knowledgeEntityId">
            <ant-select
              v-model:value="knowledgeFormState.knowledgeEntityId"
              placeholder="input search text">
              <ant-select-option v-for="d in knowledgeInEdgeList" :key="d.entity.id">
                {{ d.content.name }}
              </ant-select-option>
            </ant-select>
          </ant-form-item>
          <ant-form-item label="源知识点" name="originKnowledgeEntityId">
            <ant-select
              v-model:value="knowledgeFormState.originKnowledgeEntityId"
              :disabled="true"
              placeholder="input search text">
              <ant-select-option v-for="d in knowledgeInEdgeList" :key="d.entity.id">
                {{ d.content.name }}
              </ant-select-option>
            </ant-select>
          </ant-form-item>
          <ant-form-item label="目标知识点" name="targetKnowledgeEntityId">
            <ant-select
              v-model:value="knowledgeFormState.targetKnowledgeEntityId"
              :disabled="true"
              placeholder="input search text">
              <ant-select-option v-for="d in knowledgeInEdgeList" :key="d.entity.id">
                {{ d.content.name }}
              </ant-select-option>
            </ant-select>
          </ant-form-item>
        </ant-form>
      </ant-modal>
      <div class="graph-top">
        <div style="height: 50px;" class="graph-control">
          <zoom-in-icon style="font-size: 30px;line-height: 50px;" @click="handleZoomInGraph"/>
          <zoom-out-icon style="font-size: 30px;line-height: 50px;" @click="handleZoomOutGraph"/>
        </div>
        <div id="container" class="graph-graph"></div>
        <div id="mini-map-container" class="graph-mini-map"></div>

      </div>
      <div class="graph-bottom">

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Addon, Graph, NodeView } from '@antv/x6';
import { RandomLayout } from '@antv/layout';
import { EntityCompletelyListItemType, KnowledgeModelType } from 'edu-graph-constant';
import {
  defineComponent, onMounted, computed, reactive, ref, onUnmounted, watch
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ActionEnum, MutationEnum, useStore } from '@/store';
import { ConfigService } from '@/config/config.service';
import { magnetAvailabilityHighlighter, MyShape } from '@/components/graph/my.shape';
import { RepositoryApiService } from '@/api.service';
import { EdgeApiService } from '@/api.service/edge.api.service';
import ZoomInIcon from '@/components/icons/zoom.in.icon.vue';
import ZoomOutIcon from '@/components/icons/zoom.out.icon.vue';
import { WebsocketService } from '@/service/websocket.service';
import KnowledgeConnection from './knowledge.graph/knowledge.connection.vue';

export default defineComponent({
  name: 'knowledge.graph',
  components: {
    KnowledgeConnection,
    ZoomInIcon,
    ZoomOutIcon
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const repositoryGraphEdges = computed(() => store.state.repositoryEditor.repositoryEdgeList);
    const repositoryGraphNodes = computed(() => store.state.repositoryEditor.knowledgeList);
    const isEditable = computed(() => store.state.repositoryEditor.editable);
    const isExtendTreeGraphShow = ref(false);
    const isPreTreeGraphShow = ref(false);
    const isUserOwnRepository = ref(false);
    const graph = computed<{
      graph?: Graph,
      dnd?: Addon.Dnd
    }>(() => store.state.repositoryEditor.graph);

    function update(view: NodeView) {
      const { cell } = view;
      if (cell instanceof MyShape) {
        cell.getInPorts().forEach((port) => {
          const portNode = view.findPortElem(port.id!, 'portBody');
          view.unhighlight(portNode, {
            highlighter: magnetAvailabilityHighlighter,
          });
        });
        cell.updateInPorts(graph.value.graph!);
      }
    }

    const knowledgeInEdgeList = ref<EntityCompletelyListItemType[]>([]);
    // modal
    const isModalVisible = ref<boolean>(false);
    const modalConfirmLoading = ref<boolean>(false);
    // form
    const knowledgeFormRef = ref();
    const knowledgeFormState = reactive<{
      knowledgeEntityId?: string;
      targetKnowledgeEntity?: EntityCompletelyListItemType;
      targetKnowledgeEntityId?: string;
      originKnowledgeEntity?: EntityCompletelyListItemType;
      originKnowledgeEntityId?: string;
      temporaryEdgeId?: string;
    }>({
      knowledgeEntityId: undefined,
      targetKnowledgeEntityId: undefined,
      originKnowledgeEntityId: undefined
    });

    const handleModalOk = async () => {
      if (knowledgeFormState.originKnowledgeEntityId === undefined
        || knowledgeFormState.targetKnowledgeEntityId === undefined
        || knowledgeFormState.knowledgeEntityId === undefined
        || knowledgeFormState.targetKnowledgeEntity === undefined
        || knowledgeFormState.originKnowledgeEntity === undefined) {
        return;
      }
      let entity: any = knowledgeFormState.targetKnowledgeEntity;
      if (knowledgeFormState.knowledgeEntityId === knowledgeFormState.originKnowledgeEntityId) {
        entity = knowledgeFormState.originKnowledgeEntity;
      }
      modalConfirmLoading.value = true;
      await EdgeApiService.create({
        originKnowledgeEntityId: knowledgeFormState.originKnowledgeEntityId,
        knowledgeEntityId: knowledgeFormState.knowledgeEntityId,
        targetKnowledgeEntityId: knowledgeFormState.targetKnowledgeEntityId,
        edgeRepositoryEntityId: route.query.repositoryEntityId as string,
        description: `From ${(entity.content as KnowledgeModelType).name}`
      });
      modalConfirmLoading.value = false;
      isModalVisible.value = false;
      // todo 刷新页面，否则新创建的节点不在图数据model中
    };
    const handleModalCancel = async () => {
      if (knowledgeFormState.temporaryEdgeId) {
        graph.value.graph?.removeEdge(knowledgeFormState.temporaryEdgeId);
      }
    };
    const websocketService = ref<WebsocketService>();
    onUnmounted(() => {
      store.commit(MutationEnum.SET_IS_SPINNING, { status: true });
      // 关闭websocket
      websocketService.value?.close();
      websocketService.value = undefined;
      // 销毁图
      graph.value.graph?.dispose();
      store.commit(MutationEnum.SET_IS_SPINNING, { status: false });
    });
    watch(isEditable, (newValue) => {
      if (newValue) {
        websocketService.value = new WebsocketService(ConfigService.websocketBaseURL, [
          {
            event: 'graph',
            handler(message) {
              console.log(message);
            }
          }
        ]);
      }
    });
    const checkIfUserOwnRepository = async () => {
      if (localStorage.getItem('user') === null) {
        return false;
      }
      const result = await RepositoryApiService.checkIfUserOwnRepository({
        repositoryEntityId: route.query.repositoryEntityId as string
      });
      if (result.data) {
        return result.data.hasAuth;
      }
      return false;
    };
    onMounted(async () => {
      store.commit(MutationEnum.SET_IS_SPINNING, { status: true });
      isUserOwnRepository.value = await checkIfUserOwnRepository();
      store.commit(MutationEnum.SET_REPOSITORY_EDITABLE, {
        status: isUserOwnRepository.value
      });
      // 初始化图
      store.commit(MutationEnum.INIT_GRAPH);
      await store.dispatch(ActionEnum.GET_EDGE_LIST_BY_REPOSITORY_ID, {
        repositoryEntityId: route.query.repositoryEntityId as string,
        hasAuth: isUserOwnRepository.value
      });
      if (graph.value.graph === undefined) {
        return;
      }
      // const gridLayout = new RandomLayout({
      //   type: 'random',
      //   width: window.innerWidth.valueOf() - 520,
      //   height: (window.innerHeight.valueOf() - 100) * 0.6,
      //   center: [300, 200],
      // });
      // const newModel = gridLayout.layout({
      //   edges: repositoryGraphEdges.value as any,
      //   nodes: repositoryGraphNodes.value as any
      // });
      repositoryGraphNodes.value.forEach((item: any) => {
        console.log(item);
        graph.value.graph?.addNode(item);
      });
      repositoryGraphEdges.value.forEach((item: any) => graph.value.graph?.addEdge(item));
      // graph.value.graph.fromJSON(newModel);
      // graph.value.graph.centerContent();
      graph.value.graph.on('edge:connected', async ({ edge, previousView, currentView }) => {
        console.log(edge);
        knowledgeFormState.temporaryEdgeId = edge.id;
        if (edge.getSourceCell() === null || edge.getTargetCell() === null) {
          return;
        }
        if (previousView) {
          update(previousView as NodeView);
        }
        if (currentView) {
          update(currentView as NodeView);
        }
        const sourceCellData = edge.getSourceCell()?.data;
        const targetCellData = edge.getTargetCell()?.data;
        knowledgeInEdgeList.value = [sourceCellData, targetCellData];
        knowledgeFormState.originKnowledgeEntityId = sourceCellData.entity.id;
        knowledgeFormState.targetKnowledgeEntityId = targetCellData.entity.id;
        knowledgeFormState.originKnowledgeEntity = sourceCellData;
        knowledgeFormState.targetKnowledgeEntity = targetCellData;
        isModalVisible.value = true;
      });
      graph.value.graph.on('edge:selected', ({ cell, edge }) => {
        console.log(edge, cell);
        edge.setAttrs({
          line: {
            stroke: '#7c68fc', // 指定 path 元素的填充色
          },
        });
      });
      graph.value.graph.on('edge:unselected', ({ cell, edge }) => {
        console.log(edge, cell);
        edge.setAttrs({
          line: {
            stroke: '#000', // 指定 path 元素的填充色
          },
        });
      });
      graph.value.graph.on('node:click', async ({ cell }) => {
        store.commit(MutationEnum.SET_SELECTED_ENTITY_ID, { id: cell.id });
        await store.dispatch(ActionEnum.GET_PRE_EXTEND_KNOWLEDGE_LIST, {
          repositoryEntityId: route.query.repositoryEntityId as string,
          knowledgeEntityId: cell.id
        });
      });
      graph.value.graph.on('node:moved', async ({ x, y, node }) => {
        console.log(x, y, node.data);
        websocketService.value?.send({
          event: 'graph',
          data: {
            entityId: node.data.entity.id,
            x,
            y
          }
        });
      });
      graph.value.graph.on('edge:removed', ({ edge, options }) => {
        console.log(edge, options);
      });
      graph.value.graph.on('edge:mouseenter', ({ edge }) => {
        if (localStorage.getItem('user') && isUserOwnRepository.value) {
          edge.addTools([
            'source-arrowhead',
            'target-arrowhead',
            {
              name: 'button-remove',
              args: {
                distance: -30,
              },
            },
          ]);
        }
      });
      graph.value.graph.on('edge:mouseleave', ({ edge }) => {
        edge.removeTools();
      });
      store.commit(MutationEnum.SET_IS_SPINNING, { status: false });
    });

    const handleZoomInGraph = () => {
      graph.value.graph?.zoom(0.1);
    };
    const handleZoomOutGraph = () => {
      graph.value.graph?.zoom(-0.1);
    };

    return {
      isExtendTreeGraphShow,
      isPreTreeGraphShow,
      // modal
      isModalVisible,
      modalConfirmLoading,
      handleModalOk,
      handleModalCancel,
      // form
      knowledgeFormRef,
      knowledgeFormState,
      knowledgeInEdgeList,
      handleZoomInGraph,
      handleZoomOutGraph,

    };
  },
});
</script>

<style lang="scss" scoped>
@import "../../style/common";

.graph-box {
  display: flex;

  .graph-content {
    width: calc(100vw - 520px);
    min-height: calc(100vh - 56px);

    .graph-top {
      position: relative;
      height: 100%;

      .graph-control {
        position: absolute;
        right: 10px;
        top: 0;
        z-index: 999;
      }

      .graph-graph {
        position: relative;

      }

      .graph-mini-map {
        border: 1px solid #ccc;
        z-index: 9999;
        height: 200px;
        position: fixed;
        bottom: 0px;
        right: 300px;
      }
    }

    //.graph-bottom {
    //  height: 20%;
    //}
  }
}

.app-content {
  flex: 1;
  height: 240px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.x6-node [magnet="true"] {
  cursor: crosshair;
  transition: none;
}

.x6-node [magnet="true"]:hover {
  opacity: 1;
}

.x6-node [magnet="true"][port-group="in"] {
  cursor: move;
}

.my-port {
  width: 100%;
  height: 100%;
  border: 1px solid #808080;
  border-radius: 100%;
  background: #eee;
}

.my-port.connected {
  width: 0;
  height: 0;
  margin-top: 5px;
  margin-left: 1px;
  border-width: 5px 4px 0;
  border-style: solid;
  border-color: #808080 transparent transparent;
  border-radius: 0;
  background-color: transparent;
}

.x6-port-body.available {
  overflow: visible;
}

.x6-port-body.available body {
  overflow: visible;
}

.x6-port-body.available body > div::before {
  content: " ";
  float: left;
  width: 20px;
  height: 20px;
  margin-top: -5px;
  margin-left: -5px;
  border-radius: 50%;
  background-color: rgba(57, 202, 116, 0.6);
  box-sizing: border-box;
}

.x6-port-body.available body > div::after {
  content: " ";
  float: left;
  clear: both;
  width: 10px;
  height: 10px;
  margin-top: -15px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #39ca74;
  position: relative;
  z-index: 10;
  box-sizing: border-box;
}

.x6-port-body.adsorbed {
  overflow: visible;
}

.x6-port-body.adsorbed body {
  overflow: visible;
}

.x6-port-body.adsorbed body > div::before {
  content: " ";
  float: left;
  width: 28px;
  height: 28px;
  margin-top: -9px;
  margin-left: -9px;
  border-radius: 50%;
  background-color: rgba(57, 202, 116, 0.6);
  box-sizing: border-box;
}

.x6-port-body.adsorbed body > div::after {
  content: " ";
  float: left;
  clear: both;
  width: 10px;
  height: 10px;
  margin-top: -19px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #39ca74;
  position: relative;
  z-index: 10;
  box-sizing: border-box;
}

</style>
