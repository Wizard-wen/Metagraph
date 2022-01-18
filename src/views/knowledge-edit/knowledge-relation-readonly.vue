<template>
  <div class="toolbar">
    <div class="tabs">
      <div
        class="tab"
        :class="{ 'active': tab.value === toolbarState }"
        v-for="tab in toolbarElementList"
        :key="tab.value"
        @click="setToolbarState(tab.value)">{{ tab.label }}
      </div>
    </div>
    <div class="content">
      <template v-if="toolbarState === 'pre'">
        <ant-card class="card-header" title="知识库内">
          <div class="card-content">
            <div
              v-for="(item, index) in edges.target.preInnerList"
              :key="index"
              data-type="rect"
              class="dnd-rect">
              {{ item.content.name }}
            </div>
          </div>
        </ant-card>
        <ant-card class="card-header" title="知识库外">
          <div class="card-content">
            <div
              v-for="(item, index) in edges.target.preOuterList"
              :key="index"
              data-type="rect"
              class="dnd-rect">
              {{ item.content.name }}
            </div>
          </div>
        </ant-card>
      </template>
      <template v-else>
        <ant-card class="card-header" title="仓库内">
          <div class="card-content">
            <div
              v-for="(item, index) in edges.target.extendInnerList"
              :key="index"
              data-type="rect"
              class="dnd-rect">
              {{ item.content.name }}
            </div>
          </div>
        </ant-card>
        <ant-card class="card-header" title="仓库外">
          <div class="card-content">
            <div
              v-for="(item, index) in edges.target.extendOuterList"
              :key="index"
              data-type="rect"
              class="dnd-rect">
              {{ item.content.name }}
            </div>
          </div>
        </ant-card>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref
} from 'vue';
import { edges } from './model/knowledge.edit';

export default defineComponent({
  name: 'knowledge-relation-readonly',
  setup() {
    const toolbarElementList = [
      {
        label: '前置',
        value: 'pre'
      },
      {
        label: '导出',
        value: 'extend'
      },
    ];
    const toolbarState = ref('pre');
    const setToolbarState = (value: 'pre' | 'extend') => {
      toolbarState.value = value;
    };
    // 拖拽节点
    return {
      toolbarElementList,
      toolbarState,
      setToolbarState,
      edges,
    };
  }
});
</script>

<style scoped lang="scss">
@import '../../style/common';

.toolbar {
  //border-left: solid 1px $borderColor;
  background-color: #fff;
  min-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  .tabs {
    height: 32px;
    font-size: 12px;
    flex-shrink: 0;
    display: flex;

    .tab {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $lightGray;
      border-bottom: 1px solid $borderColor;
      cursor: pointer;

      &.active {
        background-color: #fff;
        border-bottom-color: #fff;
      }

      & + .tab {
        border-left: 1px solid $borderColor;
      }
    }
  }

  .content {
    font-size: 13px;
    height: calc(100vh - 88px);

    .card-header {
      & ::v-deep(.ant-card-head) {
        min-height: 35px;
      }

      & ::v-deep(.ant-card-head-title) {
        padding: 0;
        line-height: 35px;
        height: 35px;
      }

      & ::v-deep(.ant-card-body) {
        padding: 15px 5px;
        height: calc(100% - 35px);
      }

      height: 50%;

      .card-content {
        height: 100%;
        overflow: scroll;
      }

      .dnd-rect {
        width: calc(100% - 6px);
        height: 40px;
        border: 1px solid $borderColor;
        text-align: center;
        line-height: 40px;
        margin: 3px auto;
        cursor: move;
      }

      .is-active {
        border: 1px solid #1890FF;
      }
    }
  }
}
</style>
