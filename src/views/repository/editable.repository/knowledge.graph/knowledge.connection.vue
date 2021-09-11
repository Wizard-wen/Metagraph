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
        <ant-card class="card-header" title="inner repository">
          <div class="card-content">
            <div
              v-for="(item, index) in preInnerKnowledgeList"
              :key="index"
              data-type="rect"
              class="dnd-rect">
              {{ item.content.name }}
            </div>
          </div>
        </ant-card>
        <ant-card class="card-header" title="outer repository">
          <div class="card-content">
            <div
              v-for="(item, index) in preOuterKnowledgeList"
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
        <ant-card class="card-header" title="inner repository">
          <div class="card-content">
            <div
              v-for="(item, index) in extendInnerKnowledgeList"
              :key="index"
              data-type="rect"
              class="dnd-rect">
              {{ item.content.name }}
            </div>
          </div>
        </ant-card>
        <ant-card class="card-header" title="outer repository">
          <div class="card-content">
            <div
              v-for="(item, index) in extendOuterKnowledgeList"
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
  </div>
</template>

<script lang="ts">
import { Addon, Graph } from '@antv/x6';
import {
  computed, defineComponent, ref
} from 'vue';
import { useStore } from '@/store';
import { useRoute } from 'vue-router';
import type { EntityCompletelyListItemType, KnowledgeModelType } from 'edu-graph-constant';

export default defineComponent({
  name: 'knowledge.connection',
  setup() {
    // todo 判断一下外部仓库连接边所对应的节点是否已经在当前仓库中
    // 如果已经在仓库中，就不允许再重复拖拽
    const store = useStore();
    const route = useRoute();
    const { repositoryEntityId } = route.params;
    const preInnerKnowledgeList = computed(() => store.state.repositoryEdit.preInnerKnowledgeList);
    const extendInnerKnowledgeList = computed(() => store.state.repositoryEdit.extendInnerKnowledgeList);
    const preOuterKnowledgeList = computed(() => store.state.repositoryEdit.preOuterKnowledgeList);
    const extendOuterKnowledgeList = computed(() => store.state.repositoryEdit.extendOuterKnowledgeList);
    const repositoryEntityIdList = computed(() => store.getters.repositoryEntityIdList);
    const graph = computed<{
      graph?: Graph,
      dnd?: Addon.Dnd
    }>(() => store.state.repositoryEdit.graph);
    const toolbarElementList = [
      { label: '前置', value: 'pre' },
      { label: '导出', value: 'extend' },
    ];
    const toolbarState = ref('pre');
    const setToolbarState = (value: 'pre' | 'extend') => {
      toolbarState.value = value;
    };
    // 拖拽节点
    // todo 定制不可拖拽节点样式
    const startDrag = (event: MouseEvent, entity: EntityCompletelyListItemType) => {
      if (graph.value.graph === undefined || graph.value.dnd === undefined) {
        throw new Error('Graph not init');
      }
      // todo 如果当前边所对应的节点已经在仓库中，不可拖拽
      if (repositoryEntityIdList.value.includes(entity.entity.id)) {
        return;
      }
      const node = graph.value.graph.createNode({
        id: entity.entity.id,
        height: 30,
        width: 100,
        label: (entity.content as KnowledgeModelType).name,
        data: {
          entity,
          repositoryEntityId
        },
        ports: [
          {
            id: entity.entity.id,
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
          },
        ]
      });
      graph.value.dnd.start(node, event);
    };
    return {
      toolbarElementList,
      toolbarState,
      setToolbarState,
      preInnerKnowledgeList,
      // 某个选中知识点的导出知识点树
      preOuterKnowledgeList,
      extendInnerKnowledgeList,
      extendOuterKnowledgeList,
      startDrag,
      repositoryEntityIdList
    };
  }
});
</script>

<style scoped lang="scss">
@import '../../../../style/common';

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
        border: 1px solid #31d0c6;
      }
    }
  }
}
</style>
