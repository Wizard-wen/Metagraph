<template>
  <ant-spin :spinning="isLoading">
    <div class="knowledge-edit">
      <knowledge-edit-header :editor="editor"></knowledge-edit-header>
      <network-status-alert></network-status-alert>
      <div class="knowledge-content">
        <knowledge-editor-left-sidebar></knowledge-editor-left-sidebar>
        <knowledge-editor-middle :editor="editor"></knowledge-editor-middle>
        <knowledge-editor-right-sidebar></knowledge-editor-right-sidebar>
      </div>
    </div>
  </ant-spin>
  <knowledge-drawer-content
    v-if="knowledgeDrawerState.isShow"
    :is-visible="knowledgeDrawerState.isShow"
    :type="type"
    :knowledge-entity-id="knowledgeDrawerState?.entityId"
    @close="knowledgeDrawerState.isShow = false"></knowledge-drawer-content>
  <select-knowledge-cover-modal
    :knowledge-entity-id="draftKnowledgeEntityId"
    @close="isSelectKnowledgeCoverModalShow = false"
    v-if="isSelectKnowledgeCoverModalShow"
    :is-modal-visible="isSelectKnowledgeCoverModalShow"></select-knowledge-cover-modal>
</template>

<script lang="ts" setup>
import NetworkStatusAlert from '@/components/network-status-alert/network-status-alert.vue';
import { IndexdbService } from '@/service/indexdb.service';
import SelectKnowledgeCoverModal from '@/views/knowledge-editor/select-knowledge-cover-modal.vue';
import { Spin as AntSpin } from 'ant-design-vue';
import { computed, onMounted, onUnmounted, provide, ref } from 'vue';
import {
  LocationQueryValue,
  NavigationGuardNext,
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  RouteLocationNormalized,
  useRoute
} from 'vue-router';
import {
  KnowledgeTiptapTextEditor
} from '@/components/tiptap-text-editor/knowledge.tiptap.text.editor';
import {
  KnowledgeEditHeader,
  KnowledgeEditorLeftSidebar,
  KnowledgeEditorMiddle,
  KnowledgeEditorRightSidebar
} from '@/views/knowledge-editor/index';

import { KnowledgeDrawerContent, knowledgeDrawerState } from '@/business';
import {
  draftKnowledgeEntityIdInjectKey,
  knowledgeDescription,
  KnowledgeEdit,
  publishedKnowledgeEntityIdInjectKey,
  repositoryEntityIdInjectKey,
  repositoryEntityList
} from './knowledge-editor/model/knowledge.edit';

const route = useRoute();
const publishedKnowledgeEntityId = ref(
  route.query.publishedKnowledgeEntityId as LocationQueryValue
);
const draftKnowledgeEntityId = ref(route.query.draftKnowledgeEntityId as string);
const repositoryEntityId = ref(route.query.repositoryEntityId as string);
provide(draftKnowledgeEntityIdInjectKey, draftKnowledgeEntityId);
provide(publishedKnowledgeEntityIdInjectKey, publishedKnowledgeEntityId);
provide(repositoryEntityIdInjectKey, repositoryEntityId);

const type = computed(
  () => (draftKnowledgeEntityId.value ? 'draft' : 'published')
);
const isLoading = ref(false);

const isSelectKnowledgeCoverModalShow = ref(false);

/**
 * 初始化knowledge tiptap editor
 */
const knowledgeEdit = new KnowledgeEdit();
const knowledgeTiptapTextEditor = new KnowledgeTiptapTextEditor({
  repositoryEntityId: repositoryEntityId.value,
  knowledgeEntityId: draftKnowledgeEntityId.value,
  hasPublished: !!publishedKnowledgeEntityId.value
}, knowledgeEdit);
knowledgeTiptapTextEditor.initEditorInstance();
const { editor } = knowledgeTiptapTextEditor;

async function handleRouteLeaveConfirm(): Promise<boolean> {
  return true;
}

onBeforeRouteLeave(async () => {
  // 取消导航并停留在同一页面上
  const result = await handleRouteLeaveConfirm();
  if (result) {
    const description = editor.value?.getHTML();
    const descriptionInIndexDB = await IndexdbService.getInstance()
      .get('knowledge', draftKnowledgeEntityId.value);
    if (descriptionInIndexDB !== description) {
      console.log('indexdb与当前富文本数据不一致', descriptionInIndexDB, description);
    }
    if (editor.value) {
      await knowledgeEdit.handleSaveSectionArticle({
        content: editor.value?.getJSON(),
        contentHtml: editor.value?.getHTML(),
        knowledgeEntityId: draftKnowledgeEntityId.value
      });
    }
    return result;
  }
  return false;
});

onBeforeRouteUpdate(async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (
    JSON.stringify(to.query) !== JSON.stringify(from.query)
  ) {
    /**
     * knowledge Editor页面的query路由发生了变化
     * 可能是因为draft知识点发布
     */
    const draftEntityId = to.query.draftKnowledgeEntityId;
    const publishedEntityId = to.query.publishedKnowledgeEntityId;
    if (draftEntityId && publishedEntityId) {
      await Promise.all([
        knowledgeEdit.getKnowledge(draftEntityId as string),
        knowledgeEdit.getRepositoryBindList(repositoryEntityId.value),
        knowledgeEdit.getMentionedList(draftEntityId as string),
        knowledgeEdit.getDomainList(),
        knowledgeEdit.getOwnRepositoryList(),
        knowledgeEdit.setLatestVersionStatus({
          publishedKnowledgeEntityId: publishedEntityId as string,
        }),
        knowledgeEdit.findEdgesByKnowledgeEntityId({
          knowledgeEntityId: publishedEntityId as string,
          repositoryEntityId: repositoryEntityId.value
        })
      ]);
    }
  }
  next();
});

onMounted(async () => {
  isLoading.value = true;
  console.time('start request');
  await Promise.all([
    knowledgeEdit.getKnowledge(draftKnowledgeEntityId.value),
    knowledgeEdit.getRepositoryBindList(repositoryEntityId.value),
    knowledgeEdit.getMentionedList(draftKnowledgeEntityId.value),
    knowledgeEdit.getDomainList(),
    knowledgeEdit.getOwnRepositoryList(),
    await knowledgeEdit.setLatestVersionStatus({
      publishedKnowledgeEntityId: publishedKnowledgeEntityId.value ?? undefined,
    })
  ]);
  if (publishedKnowledgeEntityId.value) {
    await knowledgeEdit.findEdgesByKnowledgeEntityId({
      knowledgeEntityId: publishedKnowledgeEntityId.value,
      repositoryEntityId: repositoryEntityId.value
    });
  }
  console.timeEnd('start request');
  await knowledgeTiptapTextEditor.initData({
    repositoryEntityList: repositoryEntityList.value ?? []
  });
  knowledgeTiptapTextEditor.setContent(knowledgeDescription.value);
  isLoading.value = false;
});

onUnmounted(() => {
  knowledgeTiptapTextEditor.destroy();
});

</script>

<style scoped lang="scss">
@import "../style/common.scss";

.knowledge-edit {
  height: 100vh;
  width: 100%;
  overflow: hidden;

  .knowledge-content {
    height: calc(100vh - 56px);
    width: 100%;
    display: flex;
  }
}

</style>
