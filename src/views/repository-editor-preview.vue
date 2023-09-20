<template>
  <ant-spin :spinning="isRepositoryEditorLoading" class="repository-page">
    <div style="overflow: hidden; height: 100vh">
      <repository-editor-preview-header
        @viewChange="handleChangeView"
        :view-status="viewStatus"
      ></repository-editor-preview-header>
      <div class="editable">
        <div class="section-view">
          <template v-if="viewStatus === 'section'">
            <left-sidebar-preview
              @selectSection="handleSelectSection"></left-sidebar-preview>
            <div class="text-content">
              <section-article-viewable
                v-if="repositoryEntityId && editor"
                :entityId="repositoryEntityId"
                :editor="editor"
                @clickMention="handleClickMention($event)">
              </section-article-viewable>
            </div>
          </template>
          <div class="right-sidebar">
            <right-sidebar-preview></right-sidebar-preview>
          </div>
        </div>
      </div>
    </div>
  </ant-spin>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import {
  LeftSidebarPreview,
  RepositoryEditorPreviewHeader,
  SectionArticleViewable,
  RightSidebarPreview
} from '@/views/repository-editor-preview/index';
import { Spin as AntSpin } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import {
  repositoryBindEntityList,
  RepositoryEditorPreview
} from '@/views/repository-editor-preview/model/repository-editor-preview';
import {
  currentSectionNode,
  SectionTreePreviewService
} from '@/views/repository-editor-preview/model/section-tree-preview';
import { EntityCompletelyListItemType } from '@metagraph/constant';
import {
  SectionArticleReadonlyTiptapTextEditor
} from '@/components/tiptap-text-editor/section.article.readonly.tiptap.text.editor';
import { KnowledgePreview } from '@/views/knowledge-preview/knowledge.preview';



const route = useRoute();
const router = useRouter();
const isRepositoryEditorLoading = ref(false);
// 当前知识库entityId
const repositoryEntityId = ref<string>(route.query.repositoryEntityId as string);

const knowledgePreview = new KnowledgePreview();

// 视图状态
const viewStatus = ref<'section' | 'graph'>('section');
const sectionArticleTiptapTextEditor = new SectionArticleReadonlyTiptapTextEditor(
  repositoryEntityId.value
);
sectionArticleTiptapTextEditor.initEditorInstance();
const { editor } = sectionArticleTiptapTextEditor;

// 切换视图状态
async function handleChangeView(view: 'section' | 'graph') {
  viewStatus.value = view;
  if(view === 'section') {
    await SectionTreePreviewService.getSectionTree(
      repositoryEntityId.value,
      route.query.sectionId as string
    );
  }
}

async function handleSelectSection(sectionId: string) {
  isRepositoryEditorLoading.value = true;
  router.replace({
    name: 'RepositoryEditorPreview',
    query: {
      repositoryEntityId: repositoryEntityId.value,
      sectionId
    },
    force: true
  })
    .then();
  // 切换tree node
  await SectionTreePreviewService.selectTreeNode({
    sectionId,
    repositoryEntityId: repositoryEntityId.value
  });
  // 更新富文本
  sectionArticleTiptapTextEditor?.setContent(currentSectionNode.content);
  isRepositoryEditorLoading.value = false;
}

// function preventContextmenu(event: MouseEvent) {
//   event.preventDefault();
// }

onMounted(async () => {
  isRepositoryEditorLoading.value = true;
  const sectionId = route.query.sectionId as string;
  // 无需权限的接口请求
  await Promise.all([
    RepositoryEditorPreview.getRepositoryByEntityId(repositoryEntityId.value),
    RepositoryEditorPreview.getRepositoryBindEntityList(repositoryEntityId.value),
    SectionTreePreviewService.getSectionTree(repositoryEntityId.value, sectionId ?? undefined)
  ]);
  // 初始化富文本内容
  if(currentSectionNode.sectionId) {
    await sectionArticleTiptapTextEditor?.initData({
      sectionId: currentSectionNode.sectionId,
      repositoryEntityList: repositoryBindEntityList.value.map(
        (item) => item as EntityCompletelyListItemType
      )
    });
    // 初始化富文本内容
    sectionArticleTiptapTextEditor?.setContent(currentSectionNode.content);
  }
  isRepositoryEditorLoading.value = false;
  // document.addEventListener('contextmenu', preventContextmenu);
});

onUnmounted(() => {
  // document.removeEventListener('contextmenu', preventContextmenu);
  sectionArticleTiptapTextEditor?.destroy();
});

function handleClickMention(event: { id: string, name: string }) {
  knowledgePreview.handleShowKnowledgeDrawer(event.id, 'published');
}
</script>

<style scoped lang="scss">
@import "../style/common.scss";

.repository-page {
  height: 100vh;
  overflow-y: hidden;
  font-family: -apple-system, system-ui, BlinkMacSystemFont,
  "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.editable {
  height: calc(100vh - 56px);

  .section-view {
    height: 100%;
    display: flex;

    .text-content {
      height: 100%;
      flex: 1;
    }

    .graph-content {
      width: calc(100% - 260px);
      height: calc(100vh - 56px);
    }

    .right-sidebar {
      width: 260px;
      height: 100%;
      background-color: #fff;
    }
  }
}
</style>
