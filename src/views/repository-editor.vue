<template>
  <ant-spin :spinning="isRepositoryEditorLoading" class="repository-page">
    <repository-editor-header
      @viewChange="handleChangeView"
      :view-status="viewStatus"
      :saving-status="isSaving"
      v-if="repositoryModel.target"
    ></repository-editor-header>
    <div class="editable">
      <div class="section-view" v-if="viewStatus === 'section'">
        <section-tree></section-tree>
        <div class="text-content">
          <section-article-tip-tap
            v-if="repositoryEntityId"
            :entityId="repositoryEntityId"
            :editable="isEditable"
            @clickMention="handleClickMention($event)"
            @mention="handleMention($event)">
          </section-article-tip-tap>
        </div>
        <div class="style-panel">
          <right-sidebar></right-sidebar>
        </div>
      </div>
      <div v-else class="section-view">
        <div class="graph-content">
          <knowledge-graph-panel></knowledge-graph-panel>
        </div>
        <div class="style-panel">
          <right-sidebar></right-sidebar>
        </div>
      </div>
    </div>
  </ant-spin>
  <knowledge-drawer-content
    v-if="knowledgeDrawerState.isShow"
    :is-visible="knowledgeDrawerState.isShow"
    :knowledge-entity-id="knowledgeDrawerState.entityId"
    @close="handleCloseKnowledgeDrawer" :type="'published'"></knowledge-drawer-content>
</template>

<script lang="ts">
import { JSONContent } from '@tiptap/vue-3';
import {
  defineComponent, ref, onBeforeMount, onUnmounted, provide
} from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { Empty, Spin } from 'ant-design-vue';
import {
  SectionTreeService
} from '@/views/repository-editor/section-tree/section.tree';
import {
  RepositoryEditor,
  repositoryModel,
  sectionEntityId,
  isPublicRepository,
  isRepositoryEditorLoading
} from '@/views/repository-editor/repository-editor';

import { KnowledgeDrawerContent, knowledgeDrawerState } from '@/business';
import RightSidebar from './repository-editor/right-sidebar.vue';
import SectionTree from './repository-editor/section-tree.vue';
import SectionArticleTipTap from './repository-editor/section-article.vue';
import KnowledgeGraphPanel from './repository-editor/knowledge-graph-panel.vue';
import { isEditableKey, repositoryEntityIdKey } from './repository-editor/provide.type';
import RepositoryEditorHeader from './repository-editor/repository-editor-header/repository-editor-header.vue';

export default defineComponent({
  name: 'repository-editor',
  components: {
    KnowledgeDrawerContent,
    RightSidebar,
    SectionTree,
    SectionArticleTipTap,
    KnowledgeGraphPanel,
    RepositoryEditorHeader,
    AntSpin: Spin
  },
  setup() {
    const route = useRoute();
    // 当前知识库entityId
    const repositoryEntityId = ref<string>(route.query.repositoryEntityId as string);
    const isEditable = ref<boolean>((route.query.type as string) === 'edit');
    const sectionTreeService = new SectionTreeService();
    provide(repositoryEntityIdKey, repositoryEntityId);
    provide(isEditableKey, isEditable);
    const repositoryEditorService = new RepositoryEditor();
    // 视图状态
    const viewStatus = ref<'section' | 'graph'>('section');
    const isSaving = ref();

    // 切换视图状态
    async function handleChangeView(view: 'section' | 'graph') {
      viewStatus.value = view;
      if (view === 'section') {
        await sectionTreeService.getSectionTree(repositoryEntityId.value);
      }
    }

    const preventContextmenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    onBeforeMount(async () => {
      isRepositoryEditorLoading.value = true;
      await Promise.all([
        repositoryEditorService.getRepositoryByEntityId(repositoryEntityId.value),
        repositoryEditorService.getRepositoryBindEntityList(repositoryEntityId.value),
        sectionTreeService.getSectionTree(repositoryEntityId.value)
      ]);
      if (isEditable.value) {
        await repositoryEditorService.getOwnDraftKnowledgeList(repositoryEntityId.value)
      }
      isRepositoryEditorLoading.value = false;
      document.addEventListener('contextmenu', preventContextmenu);
    });
    onUnmounted(() => {
      document.removeEventListener('contextmenu', preventContextmenu);
    });

    onBeforeRouteUpdate(async (to, from) => {
      if (to.query.repositoryEntityId !== from.query.repositoryEntityId) {
        isRepositoryEditorLoading.value = true;
        repositoryEntityId.value = to.query.repositoryEntityId as string;
        await Promise.all([
          repositoryEditorService.getRepositoryByEntityId(repositoryEntityId.value),
          repositoryEditorService.getRepositoryBindEntityList(repositoryEntityId.value),
          sectionTreeService.getSectionTree(repositoryEntityId.value)
        ]);
        isRepositoryEditorLoading.value = false;
      }
    });

    function handleClickMention(event: { id: string, name: string }) {
      knowledgeDrawerState.isShow = true;
      knowledgeDrawerState.entityId = event.id;
    }

    function handleCloseKnowledgeDrawer() {
      knowledgeDrawerState.isShow = false;
    }

    const saveSectionArticle = async (params: {
      content: JSONContent,
      contentHtml: string
    }) => {
      isSaving.value = 'saving...';
      await sectionTreeService.saveSectionArticle({
        content: params.content,
        contentHtml: params.contentHtml
      });
      isSaving.value = 'saved';
      setTimeout(() => {
        isSaving.value = undefined;
      }, 500);
    };
    const handleMention = (params: {
      name: string, id: string, success: () => string, fail: () => string,
      content: JSONContent,
      contentHtml: string
    }) => {
      repositoryEditorService.handleMention({
        ...params,
        repositoryEntityId: repositoryEntityId.value
      });
    };
    return {
      isRepositoryEditorLoading,
      repositoryModel,
      viewStatus,
      saveSectionArticle,
      isEditable,
      sectionEntityId,
      repositoryEntityId,
      handleMention,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      isPublicRepository,
      handleChangeView,
      handleClickMention,
      isSaving,
      knowledgeDrawerState,
      handleCloseKnowledgeDrawer
    };
  }
});
</script>

<style scoped lang="scss">
@import "../style/common.scss";

.repository-page {
  height: 100vh;
  overflow-y: auto;
}

.editable {
  height: calc(100vh - 56px);

  .section-view {
    height: 100%;
    display: flex;

    .section-tree {
      width: 220px;
      height: 100%;
      border-right: solid 1px #eee;
      background-color: #fff;
    }

    .text-content {
      width: calc(100% - 520px);
      height: 100%;
    }

    .graph-content {
      width: calc(100% - 300px);
      height: calc(100vh - 56px);
    }

    .style-panel {
      width: 300px;
      height: 100%;
      background-color: #fff;
    }
  }

  .text-content {
    //height: calc(100vh - 56px);
    //overflow-y: auto;
  }

}

</style>
