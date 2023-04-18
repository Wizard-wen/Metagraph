<template>
  <div class="sidebar">
    <metagraph-tab-bar
      :is-editable="isEditable"
      :current-key="currentBar"
      @selectedChange="handleBarChange"
      :element-tabs="elementTabs"></metagraph-tab-bar>
    <div class="content">
      <toolbar-entity-list
        @createOrBindEntity="handleOpenCreateOrBindEntityModal"
        v-if="currentBar === 'EntityList'"></toolbar-entity-list>
      <alternative-knowledge-list
        v-if="currentBar === 'Alternative'"
        @createOrBindEntity="handleOpenCreateOrBindEntityModal"
        @refreshSection="handleRefreshSection"></alternative-knowledge-list>
    </div>
  </div>
  <create-or-bind-knowledge-modal
    v-if="isCreateOrBindEntityModalShow"
    :search-value="initSearchText"
    @close="handleCreateOrBindEntityModalClose"
    :is-modal-visible="isCreateOrBindEntityModalShow"></create-or-bind-knowledge-modal>
</template>

<script lang="ts" setup>
import { RepositoryEditor } from '@/views/repository-editor/model/repository.editor';
import {
  UploadAndParseTextService
} from '@/views/repository-editor/model/upload.and.parse.text.service';
import { SectionModelType } from 'metagraph-constant';
import { defineEmits, inject, ref } from 'vue';
import { isEditableKey, repositoryEntityIdKey } from '@/views/repository-editor/model/provide.type';

import MetagraphTabBar from '@/components/metagraph-tab-bar.vue';
import ToolbarEntityList from './right-sidebar/bind-entity-list.vue';
import AlternativeKnowledgeList from './right-sidebar/alternative-knowledge-list.vue';
import CreateOrBindKnowledgeModal
  from './right-sidebar/create-or-bind-knowledge-modal/create-or-bind-knowledge-modal.vue';

const isEditable = inject(isEditableKey, ref(false));
const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
const currentBar = ref<string>('EntityList');

// create or bind knowledge modal的初始化搜索字段
const initSearchText = ref();

const isCreateOrBindEntityModalShow = ref(false);

const repositoryEditor = new RepositoryEditor();
const emit = defineEmits(['refreshSection']);
const elementTabs = ref<{ value: string; label: string; isAuth: boolean }[]>([
  {
    label: '知识点',
    value: 'EntityList',
    isAuth: false
  },
  {
    label: '素材',
    value: 'Alternative',
    isAuth: true
  },
]);

function handleBarChange(value: string) {
  currentBar.value = value;
}

function handleRefreshSection(params: any) {
  emit('refreshSection', params);
}

// async function handleCloseParseTextModal(params: {
//   type: 'Section' | 'void' | 'Alternative'
//   sectionModel?: SectionModelType
// }) {
//   if (params.type === 'Section' && params.sectionModel) {
//     emit('refreshSection', {
//       sectionId: params.sectionModel.id
//     });
//   }
//   if (params.type === 'Alternative') {
//     await repositoryEditor.getAlternativeKnowledgeList(repositoryEntityId.value);
//   }
//   uploadAndParseTextService.clearData();
//   isParseWordModalShow.value = false;
// }

async function handleCreateOrBindEntityModalClose() {
  isCreateOrBindEntityModalShow.value = false;
  await repositoryEditor.getRepositoryBindEntityList(repositoryEntityId.value);
}

function handleOpenCreateOrBindEntityModal(params?: {
  searchText: string
}) {
  if (params) {
    initSearchText.value = params.searchText;
  } else {
    initSearchText.value = undefined;
  }
  isCreateOrBindEntityModalShow.value = true;
}

</script>

<style lang="scss" scoped>
@import '../../style/common.scss';

.sidebar {
  border-left: solid 1px $borderColor;
  background-color: #fff;
  min-height: 100%;
  display: flex;
  flex-direction: column;

  .content {
    font-size: 13px;
    overflow-y: auto;
  }
}
</style>
