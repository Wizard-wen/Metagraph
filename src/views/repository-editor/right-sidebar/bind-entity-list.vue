<template>
  <div class="right-sidebar-container">
    <div class="control-button-content">
      <ant-button class="full-button-style" @click="handleModalShow" v-if="editable">
        <template #icon>
          <PlusOutlined/>
        </template>
        引用/创建知识点
      </ant-button>
    </div>
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
      <template v-if="currentBar === 'unpublished'">
        <mention-entity-list
          v-if="unpublishedDraftKnowledgeList.length"
          :operation-list="unpublishedOperationList"
          @control="handleUnpublishedControl($event)"
          :is-editable="editable"
          :list-data="unpublishedDraftKnowledgeList"
        ></mention-entity-list>
        <empty-view v-else></empty-view>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import EmptyView from '@/components/empty-view/empty-view.vue';
import { Button as AntButton } from 'ant-design-vue';
import { computed, defineEmits, inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { EntityCompletelyListItemType, KnowledgeResponseType } from 'metagraph-constant';
import {
  repositoryBindEntityList,
  unpublishedDraftKnowledgeList
} from '@/views/repository-editor/model/repository.editor';
import { isEditableKey, repositoryEntityIdKey } from '@/views/repository-editor/model/provide.type';
import { useStore } from '@/store';
import { KnowledgePreview } from '@/views/knowledge-preview/knowledge.preview';
import CheckBar from '@/components/metagraph-tab-bar.vue';
import MentionEntityList from '@/views/repository-editor/mention-entity-list.vue';

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
  },
  {
    label: '草稿',
    value: 'unpublished',
    isAuth: true
  },
]);
const publishedOperationList = ref([
  { type: 'edit', name: '编辑原创知识点' },
  { type: 'view', name: '查看原创知识点' }
]);
const unpublishedOperationList = ref([
  { type: 'edit', name: '编辑草稿知识点' }
]);
const mentionOperationList = ref([
  { type: 'view', name: '查看引用知识点' }
]);
const emit = defineEmits(['createOrBindEntity']);
const router = useRouter();
const knowledgePreview = new KnowledgePreview();
const editable = inject(isEditableKey, ref(false));
const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
const entityList = computed(() => repositoryBindEntityList.value
  .filter((item) => item.entity.entityType === 'Knowledge'));

const selectedEntityId = computed(() => '');

const handleModalShow = () => {
  emit('createOrBindEntity');
};

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
@import './right-sidebar.scss';

.control-button-content {
  padding: 10px 15px;
  border-bottom: 1px solid $borderColor;

  .full-button-style {
    width: 100%;
    font-size: 12px;
    border-radius: 4px;
  }
}

.entity-list-item {
  height: 32px;
  line-height: 32px;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #e7e9e8;
    //@include list-item-highlight;
    //text-indent: 5px;
  }

  .text {
    .icon {
      text-indent: 0;
      font-size: 14px;
    }
  }

  .text-no-icon {
    padding-left: 17px;
  }

  .control {
    font-size: 16px;
    line-height: 35px;
  }
}

.sub-title {
  height: 32px;
  line-height: 32px;
  text-align: left;
  font-size: 12px;
  padding-left: 10px;
  color: #0006;
}

.entity-list-item-active {
  @include list-item-highlight;
}

</style>
