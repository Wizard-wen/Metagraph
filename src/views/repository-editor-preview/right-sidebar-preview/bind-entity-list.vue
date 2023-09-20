<template>
  <div class="right-sidebar-container">
    <check-bar
      :is-editable="editable"
      :current-key="currentBar"
      @selectedChange="handleBarChange"
      :element-tabs="elementTabs"></check-bar>
    <div class="right-sidebar-content">
      <template v-if="currentBar === 'published'">
        <mention-entity-list
          v-if="entityList.length"
          :operation-list="publishedOperationList"
          @control="handlePublishedControl($event)"
          :is-editable="editable"
          :list-data="entityList"
        ></mention-entity-list>
        <empty-view v-else></empty-view>
      </template>
      <template v-if="currentBar === 'mention'">
        <mention-entity-list
          v-if="entityList.length"
          :operation-list="mentionOperationList"
          @control="handleMentionControl($event)"
          :is-editable="editable"
          :list-data="entityList"
        ></mention-entity-list>
        <empty-view v-else></empty-view>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EmptyView from '@/components/empty-view/empty-view.vue';
import { computed, defineEmits, inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type { EntityCompletelyListItemType, KnowledgeResponseType } from '@metagraph/constant';
import {
  repositoryBindEntityList
} from '@/views/repository-editor-preview/model/repository-editor-preview';
import { isEditableKey, repositoryEntityIdKey } from '@/views/repository-editor/model/provide.type';
import { KnowledgePreview } from '@/views/knowledge-preview/knowledge.preview';
import CheckBar from '@/components/metagraph-tab-bar.vue';
import MentionEntityList from '@/views/repository-editor/right-sidebar/bind-entity-list/mention-entity-list.vue';

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
const emit = defineEmits(['createOrBindEntity']);
const router = useRouter();
const knowledgePreview = new KnowledgePreview();
const editable = inject(isEditableKey, ref(false));
const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
const entityList = computed(() => repositoryBindEntityList.value
  .filter((item) => item.entity.entityType === 'Knowledge'));

function handleMentionControl(params: {
  type: string;
  item: EntityCompletelyListItemType
}) {
  if (params.type === 'view') {
    knowledgePreview.handleShowKnowledgeDrawer(params.item.entity.id, 'published');
  }
}

function handlePublishedControl(params: {
  type: string;
  item: EntityCompletelyListItemType
}) {
  if (params.type === 'view') {
    knowledgePreview.handleShowKnowledgeDrawer(params.item.entity.id, 'published');
  } else {
    router.push({
      name: 'KnowledgeEdit',
      query: {
        publishedKnowledgeEntityId: params.item.entity.id,
        draftKnowledgeEntityId: (params.item.content as KnowledgeResponseType).draft?.entityId,
        repositoryEntityId: repositoryEntityId.value
      }
    })
      .then();
  }
}

function handleUnpublishedControl(params: {
  type: string;
  item: EntityCompletelyListItemType
}) {
  if (params.type === 'edit') {
    router.push({
      name: 'KnowledgeEdit',
      query: {
        draftKnowledgeEntityId: params.item.entity.id,
        repositoryEntityId: repositoryEntityId.value
      }
    })
      .then();
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
