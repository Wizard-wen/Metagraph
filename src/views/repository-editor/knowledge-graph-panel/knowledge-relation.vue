<template>
  <div :class="['toolbar', selectedGraphNodeEntityId ? '' : 'hide-style']">
    <metagraph-tab-bar
      :is-editable="true"
      :current-key="currentBar"
      @selectedChange="handleBarChange"
      :element-tabs="menuList"></metagraph-tab-bar>
    <graph-panel-config v-if="currentBar === 'panel'"></graph-panel-config>
    <knowledge-panel-config v-if="currentBar === 'knowledge'"></knowledge-panel-config>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import MetagraphTabBar from '@/components/metagraph-tab-bar.vue';
import KnowledgePanelConfig
  from '@/views/repository-editor/knowledge-graph-panel/knowledge-relation/knowledge-panel-config.vue';
import GraphPanelConfig
  from '@/views/repository-editor/knowledge-graph-panel/knowledge-relation/graph-panel-config.vue';
import { selectedGraphNodeEntityId } from './knowledge.graph.data';

const currentBar = ref<string>('panel');

function handleBarChange(value: string) {
  currentBar.value = value;
}

const menuList = ref<{ value: string; label: string; isAuth: boolean }[]>([
  {
    label: '面板',
    value: 'panel',
    isAuth: false
  },
  {
    label: '知识点',
    value: 'knowledge',
    isAuth: false
  },
  {
    label: '知识关联',
    value: 'unmentioned',
    isAuth: false
  },
]);

computed(() => {
  if (selectedGraphNodeEntityId.value) {
    return [
      {
        label: '面板',
        value: 'panel',
        isAuth: false
      },
      {
        label: '知识点',
        value: 'knowledge',
        isAuth: false
      },
    ]
  }
});
</script>

<style scoped lang="scss">
@import '../../../style/common';

.hide-style {

}

.toolbar {
  border-right: solid 1px $borderColor;
  background-color: #fff;
  min-height: 100%;
  width: 280px;
  display: flex;
  flex-direction: column;

  .knowledge-name {
    display: flex;
    height: 45px;
    align-items: center;
    border-bottom: 1px solid $borderColor;
    padding-left: 8px;
    font-weight: bold;

    .icon-style {
      margin-right: 8px;
      font-size: 14px;
    }
  }

  .search-bar {
    height: 40px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $borderColor;

    .search-icon {
      height: 32px;
      width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }

    .search-input {
      display: block;
      height: 32px;
      flex: 1;
      border: none;
      outline: none;
      font-size: 12px;
    }

    .search-control {
      font-size: 16px;
      height: 32px;
      width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .title {
    height: 32px;
    line-height: 32px;
    text-align: left;
    font-size: 12px;
    padding-left: 10px;
    color: #0006;
  }

  .content {
    font-size: 13px;
    height: calc(100vh - 88px);
    padding: 8px;

    .card-content {
      height: 100%;
      overflow-y: auto;
    }

    .dnd-rect {
      width: calc(100% - 6px);
      height: 32px;
      border: 1px solid $borderColor;
      text-align: center;
      line-height: 32px;
      margin: 3px auto;
      cursor: move;
    }

    .is-active {
      border: 1px solid #1890FF;
    }

    .card-header {
      & ::v-deep(.ant-card-head) {
        min-height: 35px;
      }

      & ::v-deep(.ant-card-head-title) {
        padding: 0;
        line-height: 35px;
        height: 35px;
        font-size: 14px;
      }

      & ::v-deep(.ant-card-body) {
        padding: 15px 5px;
        height: calc(100% - 35px);
      }


    }
  }
}
</style>
