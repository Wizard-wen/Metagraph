<template>
  <div class="knowledge-map">
    <knowledge-map-header
      @search="handleSearch"></knowledge-map-header>
    <div class="content">
      <div class="left">
        <knowledge-map-sidebar></knowledge-map-sidebar>
      </div>
      <div class="right">
        <div class="control">
          <ZoomInOutlined
            style="font-size: 25px; margin-right: 10px;cursor: pointer"
            @click="zoomIn"></ZoomInOutlined>
          <ZoomOutOutlined
            style="font-size: 25px;cursor: pointer" @click="zoomOut"></ZoomOutOutlined>
        </div>
        <ant-spin :spinning="isLoading">
          <div id="container" style="background: #fff"></div>
        </ant-spin>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Spin as AntSpin } from 'ant-design-vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { insertCss } from 'insert-css';
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons-vue';
import { getKnowledgePath, KnowledgeMap } from '@/views/knowledge-map/knowledge.map';
import KnowledgeMapHeader from '@/views/knowledge-map/knowledge-map-header.vue';
import KnowledgeMapSidebar from '@/views/knowledge-map/knowledge-map-sidebar.vue';

insertCss(`
  .g6-component-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #000;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
`);

const isLoading = ref(false);
const isPathLoading = ref(false);
const knowledgeMap = new KnowledgeMap();

async function handleSearch(params: {
  targetNode: string,
  sourceNode: string,
  direction: 'left' | 'right'
}) {
  isPathLoading.value = true;
  await getKnowledgePath(params);
  isPathLoading.value = false;
}

function zoomIn() {
  knowledgeMap.zoomIn();
}

function zoomOut() {
  knowledgeMap.zoomOut();
}

onMounted(async () => {
  isLoading.value = true;
  await knowledgeMap.initGraph();
  isLoading.value = false;
});

onUnmounted(() => {
  knowledgeMap.destroy();
});

</script>

<style scoped lang="scss">
@import '../style/common.scss';

.knowledge-map {
  height: 100vh;
  width: 100%;
  position: relative;

  .content {
    position: absolute;
    top: 56px;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;

    .left {
      width: 260px;
      height: 100%;
      border-right: 1px solid $borderColor;

      .left-header {
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid $borderColor;
      }
    }

    .right {
      height: 100%;
      flex: 1;
      overflow: hidden;
      position: relative;

      .control {
        padding: 5px 10px;
        position: absolute;
        z-index: 4;
        right: 0;
        top: 0;
        .control-icon {
          font-size: 25px;
          cursor: pointer
        }
      }
    }
  }

  &::v-deep(.g6-component-contextmenu-1) {
    .title {
      font-size: 12px;
      padding: 2px;
      font-weight: bold;
      border-bottom: 1px solid #ddd;
      margin-bottom: 0;
    }

    .context-menu-list {
      padding: 2px;
      margin: 0;

      li {
        text-align: left;
        list-style: none;
        margin: 0;
        padding: 3px 4px;
        cursor: pointer;
        color: salmon;
        transition: all linear 0.1s;

        &:hover {
          background: rgba(255, 111, 75, 0.1);
        }
      }
    }

    //padding: 0 !important;
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #545454;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }

}

.g6-topo-container {
  position: relative;

  .g6-topo-toolbar {
    position: absolute;
    z-index: 3;
    right: 10px;
    top: 10px;
    background: #fff;

    .g6-topo-toolbar_list {
      display: flex;
      border: 1px solid #ddd;
    }

    .g6-topo-toolbar_item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 4px 12px;
      cursor: pointer;

      .topo-icon {
        font-size: 17px;
        margin-bottom: 5px;
      }

      .topo-label {
        user-select: none;
      }

      &:hover {
        color: salmon;
      }
    }

    .g6-topo-toolbar_item.disabled {
      cursor: not-allowed;
      color: rgba(0, 0, 0, 0.3);

      &:hover {
        color: rgba(0, 0, 0, 0.3);
      }
    }
  }

  .g6-topo {
    width: 100%;
    height: 100%;

    canvas {
      position: relative;
      z-index: 1;
    }

    .g6-grid-container {
      z-index: 0 !important;
    }

    .g6-component-contextmenu {
      z-index: 3;
    }

    .g6-component-tooltip {
      border: none;
      border-radius: 4px;
      font-size: 12px;
      color: #545454;
      background-color: transparent;
      padding: 10px 8px;
      box-shadow: none;
      z-index: 4;
    }
  }
}

.g6-minimap {
  position: absolute !important;
  z-index: 4;
  bottom: 0;
}

.g6-component-contextmenu {
  &::v-deep(.title) {
    font-size: 15px;
    padding: 5px 8px;
    padding-right: 20px;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
  }

  &::v-deep(.context-menu-list) {
    padding: 5px 8px;
    margin: 0;

    li {
      list-style: none;
      margin: 0;
      padding: 3px 4px;
      cursor: pointer;
      color: salmon;
      transition: all linear 0.1s;

      &:hover {
        background: rgba(255, 111, 75, 0.1);
      }
    }
  }

  padding: 0 !important;
}
</style>
