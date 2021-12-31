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
          <div class="knowledge-editor-content">
            <div class="text-content">
              <div v-if="editor" class="limit-count">
                {{ editor.storage.characterCount.characters() }}/ 600 个字
              </div>
              <div class="upload-image">
                <div class="icon">
                  <FileImageOutlined style="color: #dedede; font-size: 40px"/>
                </div>
                <div class="message">
                  图片格式png/jpg
                  <br/>
                  高宽像素不低于320px*320px
                </div>
                <button class="add-button">添加概念图册</button>
              </div>
              <editor-content
                #tiptap
                :style="{fontSize: articleFontSize + 'px'}"
                class="tip-tap-editor custom-editor-style" :editor="editor"/>
            </div>
            <knowledge-custom-message></knowledge-custom-message>
            <knowledge-pictures></knowledge-pictures>
          </div>
        </div>
        <div class="knowledge-form">
          <knowledge-sidebar
            :element-list="sidebarElementList">
            <template v-slot:content="{item}">
              <KnowledgeEditForm
                v-if="item.index === 0"
                :knowledge="knowledgeForm"></KnowledgeEditForm>
              <knowledge-bind-panel v-if="item.index === 1"></knowledge-bind-panel>
            </template>
          </knowledge-sidebar>
        </div>
      </div>
    </div>
  </ant-spin>
</template>

<script lang="ts">
import GoBackIcon from '@/components/icons/go-back-icon.vue';
import KnowledgePictures from '@/views/knowledge-edit/knowledge-pictures.vue';
import { FileImageOutlined } from '@ant-design/icons-vue';
import { KnowledgeTiptapTextEditor } from '@/components/tiptap-text-editor/knowledge.tiptap.text.editor';
import TiptapEditorContainer from '@/components/tiptap-text-editor/tiptap-editor-container.vue';
import { useStore } from '@/store';
import KnowledgeArticleControl from '@/views/knowledge-edit/knowledge-article-control.vue';
import KnowledgeBindPanel from '@/views/knowledge-edit/knowledge-bind-panel.vue';
import KnowledgeEditHeader from '@/views/knowledge-edit/knowledge-edit-header.vue';
import KnowledgeMentionedList from '@/views/knowledge-edit/knowledge-mentioned-list.vue';
import KnowledgeCustomMessage from '@/views/knowledge-edit/knowledge-custom-message.vue';
import KnowledgeSidebar from '@/views/knowledge-edit/knowledge-sidebar.vue';
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
import Comment from '../business/entity-comment/entity-comment.vue';
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
    KnowledgePictures,
    FileImageOutlined,
    KnowledgeSidebar,
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
    const articleFontSize = ref('14');
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

    const sidebarElementList = [{
      label: '知识点',
      value: 'knowledge'
    }, {
      label: '知识关联',
      value: 'edge'
    }];

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
      await knowledgeEdit.getMentionedList(knowledgeEntityId.value);
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
      articleFontSize,
      sidebarElementList
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

      .knowledge-editor-content {
        padding-top: 15px;
        height: calc(100vh - 112px);
        overflow-y: auto;

        .text-content {
          position: relative;
          width: 850px;
          height: 420px;
          background: #FFFFFF;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .05);
          margin: 0 auto 15px;

          .upload-image {
            position: absolute;
            right: 30px;
            top: 75px;
            height: 270px;
            width: 200px;
            background: #fbfbfb;

            .icon {
              height: 100px;
              padding-top: 60px;
            }

            .message {
              margin-top: 26px;
              font-size: 12px;
              line-height: 24px;
              color: #999;
            }

            .add-button {
              margin-top: 40px;
              padding: 0 12px;
              height: 30px;
              background-color: #fff;
              color: #333;
              font-size: 14px;
              line-height: 28px;
              border: 1px solid #d5d5d5;
              border-radius: 2px;
            }
          }

          .limit-count {
            position: absolute;
            bottom: 10px;
            right: 20px;
          }
        }
      }
    }

    .knowledge-form {
      width: 300px;
    }
  }
}

.custom-editor-style {
  width: 620px;
}

</style>
