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
            @mention="handleMention($event)"
            @saveSectionArticle="saveSectionArticle($event)">
          </section-article-tip-tap>
        </div>
        <div class="style-panel">
          <toolbar></toolbar>
        </div>
      </div>
      <div v-else class="section-view">
        <div class="graph-content">
          <knowledge-graph-panel></knowledge-graph-panel>
        </div>
        <div class="style-panel">
          <toolbar></toolbar>
        </div>
      </div>
    </div>
  </ant-spin>
  <knowledge-drawer-content
    v-if="knowledgeDrawer.isShow"
    :is-visible="knowledgeDrawer.isShow"
    :knowledge-entity-id="knowledgeDrawer.entityId"
    @close="knowledgeDrawer.isShow = false"></knowledge-drawer-content>
</template>

<script lang="ts">
import { JSONContent } from '@tiptap/vue-3';
import {
  defineComponent, ref, onBeforeMount, onUnmounted, provide, nextTick
} from 'vue';
import { useRoute } from 'vue-router';
import { Empty } from 'ant-design-vue';
import { SectionArticleTiptapTextEditor } from '@/components/tiptap-text-editor/section.article.tiptap.text.editor';
import {
  sectionArticleTiptapTextEditor,
  sectionTree,
  SectionTreeService
} from '@/views/repository-editor/section-tree/section.tree';
import {
  RepositoryEditor,
  repositoryModel,
  sectionEntityId,
  isPublicRepository,
  knowledgeDrawer,
  isRepositoryEditorLoading
} from '@/views/repository-editor/repository-editor';

import Toolbar from './repository-editor/toolbar.vue';
import SectionTree from './repository-editor/section-tree.vue';
import SectionArticleTipTap from './repository-editor/section-article.vue';
import KnowledgeGraphPanel from './repository-editor/knowledge-graph-panel.vue';
import { isEditableKey, repositoryEntityIdKey } from './repository-editor/provide.type';
import RepositoryEditorHeader from './repository-editor/repository-editor-header/repository-editor-header.vue';
import { KnowledgeDrawerContent } from '@/business';

export default defineComponent({
  name: 'editable.repository',
  components: {
    KnowledgeDrawerContent,
    Toolbar,
    SectionTree,
    SectionArticleTipTap,
    KnowledgeGraphPanel,
    RepositoryEditorHeader
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
    const sectionArticleTiptapTextEditor = new SectionArticleTiptapTextEditor(
      repositoryEntityId.value,
      isEditable.value
    );
    // 视图状态
    const viewStatus = ref<'section' | 'graph'>('section');

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
    const isSaving = ref();
    onBeforeMount(async () => {
      isRepositoryEditorLoading.value = true;
      await Promise.all([
        repositoryEditorService.getRepositoryByEntityId(repositoryEntityId.value),
        repositoryEditorService.getRepositoryBindEntityList(repositoryEntityId.value),
        sectionTreeService.getSectionTree(repositoryEntityId.value)
      ]);
      isRepositoryEditorLoading.value = false;
      document.addEventListener('contextmenu', preventContextmenu);
    });
    onUnmounted(() => {
      document.removeEventListener('contextmenu', preventContextmenu);
    });

    function handleClickMention(event: { id: string, name: string }) {
      knowledgeDrawer.isShow = true;
      knowledgeDrawer.entityId = event.id;
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
      knowledgeDrawer,
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
