<template>
  <ant-spin :spinning="isLoading">
    <div class="knowledge-edit">
      <knowledge-edit-header></knowledge-edit-header>
      <div class="knowledge-content">
        <knowledge-mentioned-list class="panel"></knowledge-mentioned-list>
        <div class="knowledge-editor">
          <knowledge-article-control
            @fontSizeChange="changeArticleFontSize($event)"
            @save="saveKnowledgeArticle"
            v-if="editor" :editor="editor"></knowledge-article-control>
          <div class="text-content">
            <editor-content
              #tiptap
              :style="{fontSize: articleFontSize + 'px'}"
              class="tip-tap-editor" :editor="editor"/>
          </div>

          <knowledge-custom-message></knowledge-custom-message>
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
            <ant-tab-pane key="3">
              <template #tab>
                <span>
                  知识关联
                </span>
              </template>
              <knowledge-bind-panel></knowledge-bind-panel>
            </ant-tab-pane>
          </ant-tabs>
        </div>
      </div>
    </div>
  </ant-spin>
</template>

<script lang="ts">
import GoBackIcon from '@/components/icons/go-back-icon.vue';
import { KnowledgeTiptapTextEditor } from '@/components/tiptap-text-editor/knowledge.tiptap.text.editor';
import TiptapEditorContainer from '@/components/tiptap-text-editor/tiptap-editor-container.vue';
import { useStore } from '@/store';
import KnowledgeArticleControl from '@/views/knowledge-edit/knowledge-article-control.vue';
import KnowledgeBindPanel from '@/views/knowledge-edit/knowledge-bind-panel.vue';
import KnowledgeEditHeader from '@/views/knowledge-edit/knowledge-edit-header.vue';
import KnowledgeMentionedList from '@/views/knowledge-edit/knowledge-mentioned-list.vue';
import KnowledgeCustomMessage from '@/views/knowledge-edit/knowledge-custom-message.vue';
import TiptapEditable from '@/views/repository-editor/section.article/tiptap-editable.vue';
import {
  EditorContent
} from '@tiptap/vue-3';
import {
  computed, createVNode, provide,
  defineComponent, onMounted, onUnmounted, ref
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import KnowledgeEditForm from '@/views/knowledge-edit/knowledge.edit.form.vue';
import { KnowledgeModelType } from 'metagraph-constant';
import SectionArticleTipTap from './repository-editor/section-article.vue';
import Comment from './repository-editor/comment.vue';
import {
  KnowledgeEdit,
  knowledge,
  knowledgeDescription,
  repositoryEntityList,
  edges,
  knowledgeEntityIdInjectKey, repositoryEntityIdInjectKey
} from './knowledge-edit/model/knowledge.edit';

export default defineComponent({
  name: 'knowledge.edit',
  components: {
    KnowledgeArticleControl,
    KnowledgeMentionedList,
    KnowledgeEditHeader,
    TiptapEditorContainer,
    EditorContent,
    TiptapEditable,
    GoBackIcon,
    KnowledgeBindPanel,
    KnowledgeEditForm,
    SectionArticleTipTap,
    Comment,
    KnowledgeCustomMessage
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const isLoading = ref(false);
    const knowledgeEntityId = ref(route.query.knowledgeEntityId as string);
    const repositoryEntityId = ref(route.query.repositoryEntityId as string);
    provide(knowledgeEntityIdInjectKey, knowledgeEntityId);
    provide(repositoryEntityIdInjectKey, repositoryEntityId);
    const articleFontSize = ref('12');
    const changeArticleFontSize = (event: { value: string }) => {
      articleFontSize.value = event.value;
    };

    const saveKnowledgeArticle = async () => {
      await knowledgeEdit.handleSaveSectionArticle({
        content: editor.value?.getJSON()!,
        contentHtml: editor.value?.getHTML()!,
        knowledgeEntityId: knowledgeEntityId.value
      });
    };

    const activeKey = ref('1');
    const knowledgeEdit = new KnowledgeEdit();
    const knowledgeForm = computed(() => ({
      repositoryEntityId: repositoryEntityId.value,
      name: (<KnowledgeModelType>knowledge.target?.content).name,
      knowledgeBaseTypeId: (<KnowledgeModelType>knowledge.target?.content).knowledgeBaseTypeId,
      domainId: (<KnowledgeModelType>knowledge.target?.content).domainId,
    }));
    const knowledgeTiptapTextEditor = new KnowledgeTiptapTextEditor(
      repositoryEntityId.value,
      knowledgeEntityId.value
    );
    knowledgeTiptapTextEditor.initEditor();
    const editor = knowledgeTiptapTextEditor.editor;
    console.log(editor);
    onMounted(async () => {
      isLoading.value = true;
      await knowledgeEdit.getKnowledge(knowledgeEntityId.value);
      console.log('get knowledge');
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
    });
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
      goBack,
      changeArticleFontSize,
      saveKnowledgeArticle,
      articleFontSize
    };
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
  background: #fafbfc;

  .knowledge-content {
    height: calc(100vh - 56px);
    width: 100%;
    display: flex;

    .panel {
      width: 220px;
    }

    .knowledge-editor {
      flex: 1;

      .text-content {
        width: 900px;
        height: 500px;
        background: #FFFFFF;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .05);
        margin: 0 auto 15px;
      }
    }

    .knowledge-form {
      width: 300px;
    }
  }
}

</style>
