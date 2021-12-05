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
          :rules="knowledgeEdgeFormRules"
          ref="knowledgeEdgeFormRef"
          :model="knowledgeEdgeFormState">
          <ant-form-item label="所属知识点" name="knowledgeEntityId">
            <ant-select
              v-model:value="knowledgeEdgeFormState.knowledgeEntityId"
              placeholder="input search text">
              <ant-select-option v-for="d in knowledgeInEdgeList" :key="d.entity.id">
                {{ d.content.name }}
              </ant-select-option>
            </ant-select>
          </ant-form-item>
          <ant-form-item label="源知识点" name="originKnowledgeEntityId">
            <ant-select
              v-model:value="knowledgeEdgeFormState.originKnowledgeEntityId"
              :disabled="true"
              placeholder="input search text">
              <ant-select-option v-for="d in knowledgeInEdgeList" :key="d.entity.id">
                {{ d.content.name }}
              </ant-select-option>
            </ant-select>
          </ant-form-item>
          <ant-form-item label="目标知识点" name="targetKnowledgeEntityId">
            <ant-select
              v-model:value="knowledgeEdgeFormState.targetKnowledgeEntityId"
              :disabled="true"
              placeholder="input search text">
              <ant-select-option v-for="d in knowledgeInEdgeList" :key="d.entity.id">
                {{ d.content.name }}
              </ant-select-option>
            </ant-select>
          </ant-form-item>
          <ant-form-item label="关联描述" name="description">
            <ant-input
              v-model:value="knowledgeEdgeFormState.description"
              placeholder="请填写关联理由">
            </ant-input>
          </ant-form-item>
        </ant-form>
      </ant-modal>
      <div class="graph-top">
        <div style="height: 50px;" class="graph-control">
          <zoom-in-icon style="font-size: 30px;line-height: 50px;" @click="handleZoomInGraph"/>
          <zoom-out-icon style="font-size: 30px;line-height: 50px;" @click="handleZoomOutGraph"/>
        </div>
        <div style="display: flex">
          <div id="container" class="graph-graph"></div>
        </div>
        <div id="mini-map-container" class="graph-mini-map"></div>
      </div>
      <div class="graph-bottom">

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import * as AntvX6 from '@antv/x6';
import { EntityCompletelyListItemType, KnowledgeModelType } from 'edu-graph-constant';
import {
  defineComponent, onMounted, computed, reactive, ref, onUnmounted, watch, inject, createVNode
} from 'vue';
import { useRoute } from 'vue-router';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { repositoryEntityIdKey } from '@/views/repository-editor/provide.type';
import { ActionEnum, MutationEnum, useStore } from '@/store';
import { ConfigService } from '@/config/config.service';
import { RepositoryApiService } from '@/api.service';
import ZoomInIcon from '@/components/icons/zoom.in.icon.vue';
import ZoomOutIcon from '@/components/icons/zoom.out.icon.vue';
import { WebsocketService } from '@/service/websocket.service';
import KnowledgeConnection from './knowledge-graph-panel/knowledge.connection.vue';
import {
  knowledgeEdgeFormRules,
  knowledgeEdgeFormRef,
  knowledgeEdgeFormState,
  KnowledgeGraphPanel
} from './knowledge-graph-panel/knowledge.graph.panel';

export default defineComponent({
  name: 'knowledge.graph',
  components: {
    KnowledgeConnection,
    ZoomInIcon,
    ZoomOutIcon,
    ExclamationCircleOutlined
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const userModel = computed(() => store.state.user.user);
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    const knowledgeGraphPanel = new KnowledgeGraphPanel();
    const repositoryGraphEdges = computed(() => store.state.repositoryEditor.repositoryEdgeList);
    const repositoryGraphNodes = computed(() => store.state.repositoryEditor.knowledgeList);
    const isEditable = computed(() => store.state.repositoryEditor.editable);
    const isExtendTreeGraphShow = ref(false);
    const isPreTreeGraphShow = ref(false);
    const isUserOwnRepository = ref(false);
    const graph = computed<{
      graph?: AntvX6.Graph,
      dnd?: AntvX6.Addon.Dnd
    }>(() => store.state.repositoryEditor.graph);

    const knowledgeInEdgeList = ref<EntityCompletelyListItemType[]>([]);
    // modal
    const isModalVisible = ref<boolean>(false);
    const modalConfirmLoading = ref<boolean>(false);

    const handleModalOk = async () => {
      const errorMessage = await knowledgeGraphPanel.validateEdge();
      if (errorMessage) {
        return;
      }
      modalConfirmLoading.value = true;
      await knowledgeGraphPanel.createEdge(repositoryEntityId.value);
      modalConfirmLoading.value = false;
      isModalVisible.value = false;
      // todo 刷新页面，否则新创建的节点不在图数据model中
    };
    const handleModalCancel = async () => {
      if (knowledgeEdgeFormState.temporaryEdgeId) {
        graph.value.graph?.removeEdge(knowledgeEdgeFormState.temporaryEdgeId);
      }
      message.info('取消创建关联');
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
        console.log('初始化')
        websocketService.value = new WebsocketService(ConfigService.websocketBaseURL, [
          {
            event: 'graph',
            handler(info) {
              console.log(info);
            }
          }
        ]);
      }
    });
    const checkIfUserOwnRepository = async () => {
      if (!userModel.value) {
        return false;
      }
      const result = await RepositoryApiService.checkIfUserOwnRepository({
        repositoryEntityId: repositoryEntityId.value
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
        repositoryEntityId: repositoryEntityId.value,
        hasAuth: isUserOwnRepository.value
      });
      if (graph.value.graph === undefined) {
        return;
      }
      repositoryGraphNodes.value.forEach((item: any) => {
        console.log(item);
        graph.value.graph?.addNode(item);
      });
      repositoryGraphEdges.value.forEach((item: any) => graph.value.graph?.addEdge(item));
      graph.value.graph.on('edge:connected', async ({ edge, previousView, currentView }) => {
        if (edge.getSourceCell() === null || edge.getTargetCell() === null) {
          return;
        }
        const sourceCellData = edge.getSourceCell()?.data;
        const targetCellData = edge.getTargetCell()?.data;
        knowledgeInEdgeList.value = [sourceCellData, targetCellData];
        knowledgeGraphPanel.setKnowledgeEdgeFormState({
          temporaryEdgeId: edge.id,
          originKnowledgeEntityId: sourceCellData.entity.id,
          targetKnowledgeEntityId: targetCellData.entity.id,
          originKnowledgeEntity: sourceCellData,
          targetKnowledgeEntity: targetCellData
        });
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
      graph.value.graph.on('edge:change:connector', ({ cell, edge }) => {
        console.log(edge, cell, '------edge:change:connector');
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
          repositoryEntityId: repositoryEntityId.value,
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
        // Modal.confirm({
        //   title: '确定删除知识关联?',
        //   icon: createVNode(ExclamationCircleOutlined),
        //   content: '删除关系操作不可恢复，请谨慎操作',
        //   async onOk() {
        //     await knowledgeGraphPanel.removeEdge({
        //       id: edge.id,
        //       repositoryEntityId: repositoryEntityId.value
        //     });
        //   },
        //   onCancel() {
        //     message.info('放弃删除关联');
        //   },
        // });
      });
      graph.value.graph.on('edge:mouseenter', ({ edge }) => {
        if (userModel.value && isUserOwnRepository.value) {
          // hover展示删除按钮
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
      // knowledgeFormRef,
      // knowledgeFormState,
      knowledgeInEdgeList,
      handleZoomInGraph,
      handleZoomOutGraph,
      knowledgeEdgeFormRules,
      knowledgeEdgeFormRef,
      knowledgeEdgeFormState
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
