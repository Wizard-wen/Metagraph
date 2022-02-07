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
    <ant-spin :spinning="isKnowledgeRelationLoading">
      <div class="content">
        <template v-if="toolbarState === 'pre'">
          <ant-card class="card-header" title="知识库内">
            <div class="card-content">
              <div
                v-for="(item, index) in entityRelationEdges.preInnerList"
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
                v-for="(item, index) in entityRelationEdges.preOuterList"
                :key="index"
                data-type="rect"
                class="dnd-rect"
                :class="{'is-active': !repositoryEntityIdList.includes(item.entity.id)}"
                :draggable="!repositoryEntityIdList.includes(item.entity.id)"
                @mousedown="startDrag($event, item)">
                {{ item.content.name }}
              </div>
            </div>
          </ant-card>
        </template>
        <template v-else>
          <ant-card class="card-header" title="知识库内">
            <div class="card-content">
              <div
                v-for="(item, index) in entityRelationEdges.extendInnerList"
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
                v-for="(item, index) in entityRelationEdges.extendOuterList"
                :key="index"
                data-type="rect"
                class="dnd-rect"
                :class="{'is-active': !repositoryEntityIdList.includes(item.entity.id)}"
                :draggable="!repositoryEntityIdList.includes(item.entity.id)"
                @mousedown="startDrag($event, item)">
                {{ item.content.name }}
              </div>
            </div>
          </ant-card>
        </template>
      </div>
    </ant-spin>

  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, inject, onMounted, ref
} from 'vue';
import type { EntityCompletelyListItemType } from 'metagraph-constant';
import { repositoryEntityIdKey } from '@/views/repository-editor/provide.type';
import {
  graph,
  dnd,
  KnowledgeGraphData,
  entityRelationEdges,
  isKnowledgeRelationLoading
} from '@/views/repository-editor/knowledge-graph-panel/knowledge.graph.data';
import { repositoryBindEntityList } from '../repository-editor';

export default defineComponent({
  name: 'knowledge.connection',
  setup() {
    const repositoryEntityIdList = computed(
      () => repositoryBindEntityList.target.map((item) => item.entity.id)
    );
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
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    let knowledgeGraphData: KnowledgeGraphData;
    onMounted(() => {
      knowledgeGraphData = new KnowledgeGraphData();
    });
    // 拖拽节点
    // todo 定制不可拖拽节点样式
    const startDrag = (event: MouseEvent, entity: EntityCompletelyListItemType) => {
      if (graph.value === undefined || dnd.value === undefined) {
        throw new Error('Graph not init');
      }
      // 如果当前边所对应的节点已经在仓库中，不可拖拽
      if (repositoryEntityIdList.value.includes(entity.entity.id)) {
        return;
      }
      knowledgeGraphData.dragNodeToPanel({
        event,
        entity,
        repositoryEntityId: repositoryEntityId.value
      });
    };
    return {
      toolbarElementList,
      toolbarState,
      setToolbarState,
      startDrag,
      repositoryEntityIdList,
      entityRelationEdges,
      isKnowledgeRelationLoading
    };
  }
});
</script>

<style scoped lang="scss">
@import '../../../style/common';

.toolbar {
  border-left: solid 1px $borderColor;
  background-color: #fff;
  min-height: 100%;
  width: 220px;
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
