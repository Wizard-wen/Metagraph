<template>
  <div class="toolbar">
    <metagraph-tab-bar
      :is-editable="true"
      :current-key="currentBar"
      @selectedChange="handleBarChange"
      :element-tabs="toolbarElementList"></metagraph-tab-bar>
    <div class="search-bar">
      <SearchOutlined class="search-icon"/>
      <input type="text" class="search-input" placeholder="搜索知识关联">
      <ControlOutlined class="search-control"/>
    </div>
    <metagraph-tab-bar
      :is-editable="true"
      :current-key="currentMentionBar"
      @selectedChange="handleMentionBarChange"
      :element-tabs="mentionStatusList"></metagraph-tab-bar>
    <div class="content">
      <div class="card-content" v-if="currentShow === 'preMentioned'">
        <normal-relation-list
          :relation-list="entityRelationEdges.preInnerList"></normal-relation-list>
      </div>
      <div class="card-content" v-if="currentShow === 'preUnmentioned'">
        <!--        <div-->
        <!--          v-for="(item, index) in entityRelationEdges.preOuterList"-->
        <!--          :key="index"-->
        <!--          data-type="rect"-->
        <!--          class="dnd-rect"-->
        <!--          :class="{'is-active': item.isDraggable}"-->
        <!--          :draggable="item.isDraggable"-->
        <!--          @mousedown="startDrag($event, item.item)">-->
        <!--          {{ item.item.content.name }}-->
        <!--        </div>-->

        <draggable-relation-list
          :relation-list="entityRelationEdges.preOuterList"
          @handleDrag="startDrag"></draggable-relation-list>
      </div>
      <div class="card-content" v-if="currentShow === 'extendMentioned'">
        <normal-relation-list
          :relation-list="entityRelationEdges.extendInnerList"></normal-relation-list>
      </div>
      <div class="card-content" v-if="currentShow === 'extendUnmentioned'">
        <!--        <div-->
        <!--          v-for="(item, index) in entityRelationEdges.extendOuterList"-->
        <!--          :key="index"-->
        <!--          data-type="rect"-->
        <!--          class="dnd-rect"-->
        <!--          :class="{'is-active': item.isDraggable}"-->
        <!--          :draggable="item.isDraggable"-->
        <!--          @mousedown="startDrag($event, item.item)">-->
        <!--          {{ item.item.content.name }}-->
        <!--        </div>-->
        <draggable-relation-list
          :relation-list="entityRelationEdges.extendOuterList"
          @handleDrag="startDrag"></draggable-relation-list>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ControlOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { computed, inject, onMounted, ref } from 'vue';
import type { EntityCompletelyListItemType } from 'metagraph-constant';
import { repositoryEntityIdKey } from '@/views/repository-editor/model/provide.type';
import MetagraphTabBar from '@/components/metagraph-tab-bar.vue';
import {
  dnd,
  entityRelationEdges,
  graph,
  KnowledgeGraphData
} from './knowledge.graph.data';
import NormalRelationList
  from './normal-relation-list.vue';
import DraggableRelationList
  from './draggable-relation-list.vue';
import { repositoryBindEntityList } from '../model/repository.editor';

const repositoryEntityIdList = computed(
  () => repositoryBindEntityList.value.map((item) => item.entity.id)
);
const toolbarElementList = ref<{ value: string; label: string; isAuth: boolean }[]>([
  {
    label: '前置',
    value: 'pre',
    isAuth: false
  },
  {
    label: '导出',
    value: 'extend',
    isAuth: false
  },
]);

const currentBar = ref<string>('pre');

function handleBarChange(value: string) {
  currentBar.value = value;
}

const mentionStatusList = ref<{ value: string; label: string; isAuth: boolean }[]>([
  {
    label: '已引用',
    value: 'mentioned',
    isAuth: false
  },
  {
    label: '未引用',
    value: 'unmentioned',
    isAuth: false
  },
]);

const currentMentionBar = ref<string>('mentioned');

function handleMentionBarChange(value: string) {
  currentMentionBar.value = value;
}

const currentShow = computed(() => {
  if (currentBar.value === 'pre' && currentMentionBar.value === 'mentioned') {
    return 'preMentioned';
  }
  if (currentBar.value === 'pre' && currentMentionBar.value === 'unmentioned') {
    return 'preUnmentioned';
  }
  if (currentBar.value === 'extend' && currentMentionBar.value === 'mentioned') {
    return 'extendMentioned';
  }
  if (currentBar.value === 'extend' && currentMentionBar.value === 'unmentioned') {
    return 'extendUnmentioned';
  }
  return 'preMentioned';
});

const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
let knowledgeGraphData: KnowledgeGraphData;
onMounted(() => {
  knowledgeGraphData = new KnowledgeGraphData();
});

// 拖拽节点
// todo 定制不可拖拽节点样式
const startDrag = (params: { event: MouseEvent, entity: EntityCompletelyListItemType }) => {
  if (graph.value === undefined || dnd.value === undefined) {
    throw new Error('Graph not init');
  }
  // 如果当前边所对应的节点已经在仓库中，不可拖拽
  if (repositoryEntityIdList.value.includes(params.entity.entity.id)) {
    return;
  }
  knowledgeGraphData.dragNodeToPanel({
    ...params,
    repositoryEntityId: repositoryEntityId.value
  });
};

</script>

<style scoped lang="scss">
@import '../../../style/common';

.toolbar {
  border-right: solid 1px $borderColor;
  background-color: #fff;
  min-height: 100%;
  width: 280px;
  display: flex;
  flex-direction: column;

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
