<template>
  <div class="right-sidebar-container">
    <check-bar
      :is-editable="false"
      :current-key="currentBar"
      @selectedChange="handleBarChange"
      :element-tabs="elementTabs"></check-bar>
    <div class="right-sidebar-content">
      <template v-if="currentBar === 'published'">
        <mention-entity-list
          v-if="entityList.length"
          :operation-list="publishedOperationList"
          @control="handlePublishedControl($event)"
          :is-editable="false"
          :list-data="entityList"
        ></mention-entity-list>
        <empty-view v-else></empty-view>
      </template>
      <template v-if="currentBar === 'mention'">
        <mention-entity-list
          v-if="entityList.length"
          :operation-list="mentionOperationList"
          @control="handleMentionControl($event)"
          :is-editable="false"
          :list-data="entityList"
        ></mention-entity-list>
        <empty-view v-else></empty-view>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EmptyView from '@/components/empty-view/empty-view.vue';
import { computed, ref } from 'vue';
import { EditOutlined, EyeOutlined } from '@ant-design/icons-vue';
import type { EntityCompletelyListItemType } from '@metagraph/constant';
import {
  repositoryBindEntityList
} from '@/views/repository-editor-preview/model/repository-editor-preview';
import { KnowledgePreview } from '@/views/knowledge-preview/knowledge.preview';
import CheckBar from '@/components/metagraph-tab-bar.vue';
import MentionEntityList
  from '@/views/repository-editor/right-sidebar/bind-entity-list/mention-entity-list.vue';

const currentBar = ref<string>('published');

function handleBarChange(value: string) {
  currentBar.value = value;
}

const elementTabs = ref<{ value: string; label: string; isAuth: boolean }[]>([
  {
    label: '原创',
    value: 'published',
    isAuth: false
  },
  {
    label: '引用',
    value: 'mention',
    isAuth: false
  }
]);
const publishedOperationList = ref([
  { type: 'edit', name: '编辑', component: EditOutlined },
  { type: 'view', name: '查看', component: EyeOutlined }
]);
const mentionOperationList = ref([
  { type: 'view', name: '查看', component: EyeOutlined }
]);

const knowledgePreview = new KnowledgePreview();
const entityList = computed(() => repositoryBindEntityList.value
  .filter((item) => item.entity.entityType === 'Knowledge'));

function handleMentionControl(params: {
  type: string;
  item: EntityCompletelyListItemType
}) {
  if(params.type === 'view') {
    knowledgePreview.handleShowKnowledgeDrawer(params.item.entity.id, 'published');
  }
}

function handlePublishedControl(params: {
  type: string;
  item: EntityCompletelyListItemType
}) {
  if(params.type === 'view') {
    knowledgePreview.handleShowKnowledgeDrawer(params.item.entity.id, 'published');
  }
}

</script>

<style scoped lang="scss">
@import '../../../style/common';

.right-sidebar-content {
  height: calc(100vh - 135px);
  padding: 10px;
  overflow-y: auto;
}

</style>
