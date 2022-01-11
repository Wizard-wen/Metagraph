<template>
  <div class="graph-box">
    <knowledge-connection></knowledge-connection>
    <div class="graph-content">
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
      <div class="graph-bottom"></div>
    </div>
  </div>
  <edge-create-modal
    v-if="isModalVisible"
    :is-modal-visible="isModalVisible"
    @close="isModalVisible = false"></edge-create-modal>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, ref, onUnmounted, inject
} from 'vue';
import EdgeCreateModal from '@/views/repository-editor/knowledge-graph-panel/edge-create-modal.vue';
import {
  KnowledgeGraphData,
  graph,
  initWebSocket,
  isModalVisible
} from '@/views/repository-editor/knowledge-graph-panel/knowledge.graph.data';
import { isEditableKey, repositoryEntityIdKey } from '@/views/repository-editor/provide.type';
import { MutationEnum, useStore } from '@/store';
import ZoomInIcon from '@/components/icons/zoom.in.icon.vue';
import ZoomOutIcon from '@/components/icons/zoom.out.icon.vue';
import KnowledgeConnection from './knowledge-graph-panel/knowledge-relation.vue';
import {
  knowledgeEdgeFormRules,
  knowledgeEdgeFormRef,
  knowledgeEdgeFormState,
} from './knowledge-graph-panel/knowledge.graph.panel';

export default defineComponent({
  name: 'knowledge-graph-panel',
  components: {
    EdgeCreateModal,
    KnowledgeConnection,
    ZoomInIcon,
    ZoomOutIcon
  },
  setup() {
    const store = useStore();
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    const isEditable = inject(isEditableKey, ref(false));
    const isExtendTreeGraphShow = ref(false);
    const isPreTreeGraphShow = ref(false);
    let knowledgeGraphData: KnowledgeGraphData;
    onUnmounted(() => {
      store.commit(MutationEnum.SET_IS_SPINNING, { status: true });
      if (isEditable.value) {
        knowledgeGraphData.closeWebSocket();
      }
      knowledgeGraphData.destroy();
      store.commit(MutationEnum.SET_IS_SPINNING, { status: false });
    });
    // const checkIfUserOwnRepository = async () => {
    //   if (!userModel.value) {
    //     return false;
    //   }
    //   const result = await RepositoryApiService.checkIfUserOwnRepository({
    //     repositoryEntityId: repositoryEntityId.value
    //   });
    //   if (result.data) {
    //     return result.data.hasAuth;
    //   }
    //   return false;
    // };
    onMounted(async () => {
      knowledgeGraphData = new KnowledgeGraphData();
      store.commit(MutationEnum.SET_IS_SPINNING, { status: true });
      if (isEditable.value) {
        initWebSocket();
      }
      await knowledgeGraphData.initData(repositoryEntityId.value, isEditable.value);
      store.commit(MutationEnum.SET_IS_SPINNING, { status: false });
    });

    const handleZoomInGraph = () => {
      graph.value?.zoom(0.1);
    };
    const handleZoomOutGraph = () => {
      graph.value?.zoom(-0.1);
    };

    return {
      isExtendTreeGraphShow,
      isPreTreeGraphShow,
      isModalVisible,
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
        z-index: 999;
        height: 200px;
        position: fixed;
        bottom: 0;
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
