<template>
  <ant-spin :spinning="spinning" class="repository-page">
    <repository-editor-header
      @viewChange="viewStatus = !viewStatus"
      v-if="repositoryModel.target"
      :repository-model="repositoryModel.target"
    ></repository-editor-header>
    <div class="editable">
      <div class="section-view" v-if="!viewStatus">
        <section-tree></section-tree>
        <div class="text-content">
          <section-article-tip-tap
            v-if="repositoryEntityId && sectionEntityId"
            :entityId="repositoryEntityId"
            :editable="isEditable"
            @mention="handleMention($event)"
            @saveSectionArticle="saveSectionArticle($event)">
          </section-article-tip-tap>
          <ant-empty v-else :image="simpleImage"/>
        </div>
        <div class="style-panel">
          <toolbar></toolbar>
        </div>
      </div>
      <div v-else class="section-view">
        <knowledge-graph class="graph-content"></knowledge-graph>
        <div class="style-panel">
          <toolbar></toolbar>
        </div>
      </div>
    </div>
  </ant-spin>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, onBeforeMount, onUnmounted, provide
} from 'vue';
import { useRoute } from 'vue-router';
import { Empty } from 'ant-design-vue';
import {
  RepositoryEditor,
  isEditable,
  repositoryModel,
  sectionEntityId,
  isPublicRepository
} from '@/views/repository-editor/repository-editor';
import { ActionEnum, MutationEnum, useStore } from '@/store';
import Toolbar from './repository-editor/toolbar.vue';
import SectionTree from './repository-editor/section-tree.vue';
import SectionArticleTipTap from './repository-editor/section-article.vue';
import KnowledgeGraph from './repository-editor/knowledge-graph-panel.vue';
import { repositoryEntityIdKey } from './repository-editor/provide.type';
import RepositoryEditorHeader from './repository-editor/repository-editor-header/repository-editor-header.vue';

export default defineComponent({
  name: 'editable.repository',
  components: {
    Toolbar,
    SectionTree,
    SectionArticleTipTap,
    KnowledgeGraph,
    RepositoryEditorHeader
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const spinning = computed(() => store.state.global.isSpinning);
    const repositoryEntityId = ref<string>(route.query.repositoryEntityId as string);
    provide(repositoryEntityIdKey, repositoryEntityId);
    const viewStatus = ref(false);
    const repositoryEditorService = new RepositoryEditor();
    const {
      getRepositoryByEntityId
    } = repositoryEditorService;
    const preventContextmenu = (event: MouseEvent) => {
      event.preventDefault();
    };
    onBeforeMount(async () => {
      store.commit(MutationEnum.SET_REPOSITORY_EDITABLE, {
        status: undefined
      });
      await getRepositoryByEntityId(repositoryEntityId.value);
      document.addEventListener('contextmenu', preventContextmenu);
    });
    onUnmounted(() => {
      document.removeEventListener('contextmenu', preventContextmenu);
    });
    const saveSectionArticle = async (params: {
      content: Record<string, any>,
      contentHtml: string
    }) => {
      await store.dispatch(ActionEnum.SAVE_SECTION_CONTENT, {
        content: params.content,
        contentHtml: params.contentHtml
      });
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
