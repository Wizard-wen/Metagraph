<template>
  <div class="sidebar">
    <div class="tabs">
      <div
        class="tab"
        :class="{ 'active': tab.value === toolbarState }"
        v-for="tab in elementShowTabs"
        :key="tab.value"
        @click="setToolbarState(tab.value)"
      >{{ tab.label }}
      </div>
    </div>
    <div class="content">
      <toolbar-entity-list
        @createOrBindEntity="handleOpenCreateOrBindEntityModal"
        v-if="toolbarState === 'EntityList'"></toolbar-entity-list>
      <alternative-knowledge-list
        v-if="toolbarState === 'Alternative'"
        @createOrBindEntity="handleOpenCreateOrBindEntityModal"
        @open="handleOpenParseTextModal"></alternative-knowledge-list>
    </div>
  </div>
  <upload-and-parse-text-modal
    v-if="isParseWordModalShow"
    :is-upload-modal-shown="isParseWordModalShow"
    @close="handleCloseParseTextModal"></upload-and-parse-text-modal>
  <create-or-bind-knowledge-modal
    v-if="isCreateOrBindEntityModalShow"
    :search-value="initSearchText"
    @close="handleCreateOrBindEntityModalClose"
    :is-modal-visible="isCreateOrBindEntityModalShow"></create-or-bind-knowledge-modal>
</template>

<script lang="ts">
import { RepositoryEditor } from '@/views/repository-editor/model/repository.editor';
import { UploadAndParseTextService } from '@/views/repository-editor/model/upload.and.parse.text.service';
import { SectionModelType } from 'metagraph-constant';
import {
  computed, defineComponent, reactive, inject, ref
} from 'vue';
import { isEditableKey, repositoryEntityIdKey } from '@/views/repository-editor/model/provide.type';
import UploadAndParseTextModal from '@/views/repository-editor/section-article-tip-tap/upload-and-parse-text-modal.vue';
import ToolbarEntityList from './right-sidebar/bind-entity-list.vue';
// import ToolbarKnowledgeEdge from './right-sidebar/right-sidebar.knowledge.edge.vue';
import AlternativeKnowledgeList from './right-sidebar/alternative-knowledge-list.vue';
import CreateOrBindKnowledgeModal
  from './right-sidebar/create-or-bind-knowledge-modal/create-or-bind-knowledge-modal.vue';

export default defineComponent({
  name: 'right-sidebar',
  components: {
    UploadAndParseTextModal,
    ToolbarEntityList,
    AlternativeKnowledgeList,
    CreateOrBindKnowledgeModal
  },
  emits: ['refreshSection'],
  setup(props, { emit }) {
    const isEditable = inject(isEditableKey, ref(false));
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    const toolbarState = ref<'EntityList' | 'Alternative'>('EntityList');
    // create or bind knowledge modal的初始化搜索字段
    const initSearchText = ref();
    const isParseWordModalShow = ref(false);
    const isCreateOrBindEntityModalShow = ref(false);
    // 实例化类
    const uploadAndParseTextService = new UploadAndParseTextService();
    const repositoryEditor = new RepositoryEditor();
    const elementTabs = reactive<{
      target: { value: string; label: string; isAuth: boolean }[]
    }>({
      target: [
        {
          label: '绑定知识点',
          value: 'EntityList',
          isAuth: false
        },
        // { label: '知识链路', value: 'KnowledgeEdge' },
        {
          label: '备选知识点',
          value: 'Alternative',
          isAuth: true
        },
      ]
    });
    const elementShowTabs = computed(() => {
      if (isEditable.value) {
        return elementTabs.target;
      }
      return elementTabs.target.filter((item) => !item.isAuth);
    });
    function setToolbarState(value: 'EntityList' | 'Alternative') {
      toolbarState.value = value;
    }
    const currentPanelComponent = computed(() => {
      const panelMap: { [key: string]: unknown } = {
        EntityList: ToolbarEntityList,
        // KnowledgeEdge: ToolbarKnowledgeEdge,
        Alternative: AlternativeKnowledgeList
      };
      return panelMap[toolbarState.value] || null;
    });

    function handleOpenParseTextModal() {
      console.log('open');
      isParseWordModalShow.value = true;
    }

    async function handleCloseParseTextModal(params: {
      type: 'Section' | 'void' | 'Alternative'
      sectionModel?: SectionModelType
    }) {
      if (params.type === 'Section' && params.sectionModel) {
        emit('refreshSection', {
          sectionId: params.sectionModel.id
        });
      }
      if (params.type === 'Alternative') {
        await repositoryEditor.getAlternativeKnowledgeList(repositoryEntityId.value);
      }
      uploadAndParseTextService.clearData();
      isParseWordModalShow.value = false;
    }

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

    return {
      initSearchText,
      toolbarState,
      elementTabs,
      elementShowTabs,
      currentPanelComponent,
      isParseWordModalShow,
      setToolbarState,
      handleOpenParseTextModal,
      handleCloseParseTextModal,
      isCreateOrBindEntityModalShow,
      handleCreateOrBindEntityModalClose,
      handleOpenCreateOrBindEntityModal
    };
  },
});
</script>

<style lang="scss" scoped>
@import '../../style/common';

.sidebar {
  border-left: solid 1px $borderColor;
  background-color: #fff;
  min-height: 100%;
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
    overflow: scroll;
  }
}
</style>
