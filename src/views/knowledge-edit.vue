<template>
  <ant-spin :spinning="isLoading">
    <div class="knowledge-edit">
<!--      <div class="knowledge-header">
        <div class="left">
          <go-back-icon class="back-icon" @click="goBack"></go-back-icon>
          <div class="title">知识点名称</div>
          <ant-tag class="status-tag">未认证</ant-tag>
        </div>
        <div class="right">
          <ant-tag>引用 23</ant-tag>
          <ant-tag>被引 23</ant-tag>
          <ant-tag>点赞 23</ant-tag>
          <ant-tag>评论 23</ant-tag>
          <ant-button type="primary" class="pull-request-button">提交认证</ant-button>
        </div>
      </div>-->
      <knowledge-edit-header></knowledge-edit-header>
      <div class="knowledge-content">
        <knowledge-bind-panel class="panel" :edges="edges.target"></knowledge-bind-panel>
        <div class="knowledge-editor">
          <tiptap-editor-container>
            <editor-content #tiptap class="tip-tap-editor" :editor="editor"/>
          </tiptap-editor-container>
        </div>
        <div class="knowledge-form">
          <ant-tabs v-model:activeKey="activeKey" class="custom-ant-tab">
            <ant-tab-pane key="1">
              <template #tab>
                <span>
                  知识点
                </span>
              </template>
              <KnowledgeEditForm :knowledge="knowledgeForm"></KnowledgeEditForm>
            </ant-tab-pane>
            <ant-tab-pane key="2">
              <template #tab>
                <span>
                  评论
                </span>
              </template>
              <h3>评论</h3>
              <Comment :entityType="'Knowledge'" :entityId="knowledgeEntityId"></Comment>
            </ant-tab-pane>
            <ant-tab-pane key="3">
              <template #tab>
                <span>
                  知识关联
                </span>
              </template>
            </ant-tab-pane>
          </ant-tabs>
        </div>
      </div>
    </div>
  </ant-spin>
</template>

<script lang="ts">
import GoBackIcon from "@/components/icons/go-back-icon.vue";
import { KnowledgeTiptapTextEditor } from "@/components/tiptap-text-editor/knowledge.tiptap.text.editor";
import TiptapEditorContainer from "@/components/tiptap-text-editor/tiptap-editor-container.vue";
import { useStore } from "@/store";
import KnowledgeBindPanel from "@/views/knowledge-edit/knowledge-bind-panel.vue";
import KnowledgeEditHeader from "@/views/knowledge-edit/knowledge-edit-header.vue";
import TiptapEditable from "@/views/repository-editor/section.article/tiptap-editable.vue";
import {
  EditorContent
} from '@tiptap/vue-3';
import {
  computed, createVNode,
  defineComponent, onMounted, onUnmounted, ref
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import KnowledgeEditForm from '@/views/knowledge-edit/knowledge.edit.form.vue';
import { KnowledgeModelType } from "metagraph-constant";
import SectionArticleTipTap from './repository-editor/section-article.vue';
import Comment from './repository-editor/comment.vue';
import {
  KnowledgeEdit,
  knowledge,
  knowledgeDescription,
  repositoryEntityList,
  edges
} from './knowledge-edit/model/knowledge.edit';

export default defineComponent({
  name: 'knowledge.edit',
  components: {
    KnowledgeEditHeader,
    TiptapEditorContainer,
    EditorContent,
    TiptapEditable,
    GoBackIcon,
    KnowledgeBindPanel,
    KnowledgeEditForm,
    SectionArticleTipTap,
    Comment
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const isLoading = ref(false);
    const knowledgeEntityId = ref(route.query.knowledgeEntityId as string);
    const repositoryEntityId = ref(route.query.repositoryEntityId as string);
    const activeKey = ref('1');
    const knowledgeEdit = new KnowledgeEdit();
    const knowledgeForm = computed(() => ({
      repositoryEntityId: repositoryEntityId.value,
      name: (<KnowledgeModelType> knowledge.target?.content).name,
      knowledgeBaseTypeId: (<KnowledgeModelType> knowledge.target?.content).knowledgeBaseTypeId,
      domainId: (<KnowledgeModelType> knowledge.target?.content).domainId,
    }));
    const knowledgeTiptapTextEditor = new KnowledgeTiptapTextEditor(
      repositoryEntityId.value,
      knowledgeEntityId.value
    )
    knowledgeTiptapTextEditor.initEditor();
    const editor = knowledgeTiptapTextEditor.editor;
    console.log(editor);
    onMounted(async () => {
      isLoading.value = true;
      await knowledgeEdit.getKnowledge(knowledgeEntityId.value);
      console.log('get knowledge')
      await knowledgeEdit.getRepositoryBindList(repositoryEntityId.value);
      await knowledgeEdit.findEdgesByKnowledgeEntityId({
        knowledgeEntityId: knowledgeEntityId.value,
        repositoryEntityId: repositoryEntityId.value
      });
      knowledgeTiptapTextEditor.setContent(knowledgeDescription.value);
      await knowledgeTiptapTextEditor.initData();
      isLoading.value = false;
    });
    onUnmounted(() => {
      knowledgeTiptapTextEditor.destroy();
    })
    const goBack = () => {
      router.go(-1);
    };
    const a = ref();
    return {
      a,
      editor,
      knowledgeForm,
      knowledge,
      knowledgeDescription,
      isLoading,
      knowledgeEntityId,
      repositoryEntityId,
      activeKey,
      edges,
      repositoryEntityList,
      goBack
    }
  }
});
</script>

<style scoped lang="scss">
@import "../style/common.scss";
@import "../style/tiptap.common.scss";

.knowledge-edit {
  height: 100vh;
  width: 100%;
  overflow: hidden;

  .knowledge-content {
    height: calc(100vh - 56px);
    width: 100%;
    display: flex;

    .panel {
      width: 220px;
    }

    .knowledge-editor {
      flex: 1;
    }

    .knowledge-form {
      width: 300px;
    }
  }
}

</style>
