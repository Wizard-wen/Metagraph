<template>
  <ant-spin :spinning="spinning" class="repository-page">
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
  <Knowledge-drawer
    :isShow="knowledgeDrawer.isShow"
    :entityId="knowledgeDrawer.entityId"
    @showChange="knowledgeDrawer.isShow"></Knowledge-drawer>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, onBeforeMount, onUnmounted, provide
} from 'vue';
import { useRoute } from 'vue-router';
import { Empty } from 'ant-design-vue';
import {
  RepositoryEditor,
  repositoryModel,
  sectionEntityId,
  isPublicRepository,
  knowledgeDrawer
} from '@/views/repository-editor/repository-editor';
import { ActionEnum, useStore } from '@/store';
import Toolbar from './repository-editor/toolbar.vue';
import SectionTree from './repository-editor/section-tree.vue';
import SectionArticleTipTap from './repository-editor/section-article.vue';
import KnowledgeGraphPanel from './repository-editor/knowledge-graph-panel.vue';
import { isEditableKey, repositoryEntityIdKey } from './repository-editor/provide.type';
import RepositoryEditorHeader from './repository-editor/repository-editor-header/repository-editor-header.vue';
import { KnowledgeDrawer } from '@/business';

export default defineComponent({
  name: 'editable.repository',
  components: {
    Toolbar,
    SectionTree,
    SectionArticleTipTap,
    KnowledgeGraphPanel,
    RepositoryEditorHeader,
    KnowledgeDrawer
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const spinning = computed(() => store.state.global.isSpinning);
    // 当前知识库entityId
    const repositoryEntityId = ref<string>(route.query.repositoryEntityId as string);
    const isEditable = ref<boolean>((route.query.type as string) === 'edit');
    provide(repositoryEntityIdKey, repositoryEntityId);
    provide(isEditableKey, isEditable);
    // 视图状态
    const viewStatus = ref<'section' | 'graph'>('section');

    // 切换视图状态
    function handleChangeView(view: 'section' | 'graph') {
      viewStatus.value = view;
    }

    const repositoryEditorService = new RepositoryEditor();
    const preventContextmenu = (event: MouseEvent) => {
      event.preventDefault();
    };
    const isSaving = ref();
    onBeforeMount(async () => {
      await repositoryEditorService.getRepositoryByEntityId(repositoryEntityId.value);
      await repositoryEditorService.getRepositoryBindEntityList(repositoryEntityId.value);
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
      content: Record<string, any>,
      contentHtml: string
    }) => {
      isSaving.value = 'saving...';
      await store.dispatch(ActionEnum.SAVE_SECTION_CONTENT, {
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
      content: Record<string, any>,
      contentHtml: string
    }) => {
      repositoryEditorService.handleMention({
        ...params,
        repositoryEntityId: repositoryEntityId.value
      });
    };
    return {
      repositoryModel,
      viewStatus,
      saveSectionArticle,
      isEditable,
      sectionEntityId,
      repositoryEntityId,
      handleMention,
      spinning,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      isPublicRepository,
      handleChangeView,
      handleClickMention,
      isSaving,
      knowledgeDrawer
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
