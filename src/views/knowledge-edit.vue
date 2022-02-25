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
              <div class="header">
                <div class="title">知识点描述</div>
                <div class="right"></div>
              </div>
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
                <button class="add-button">选择概念图册封面</button>
              </div>
              <editor-content
                #tiptap
                :style="{fontSize: articleFontSize + 'px'}"
                class="tip-tap-editor custom-editor-style" :editor="editor"/>
            </div>
            <knowledge-custom-fields></knowledge-custom-fields>
            <knowledge-pictures></knowledge-pictures>
            <div style="height: 250px;width: 100%;"></div>
          </div>
        </div>
        <div class="knowledge-form">
          <knowledge-sidebar
            :element-list="sidebarElementList">
            <template v-slot:content="{item}">
              <KnowledgeEditForm
                v-if="item.index === 0"></KnowledgeEditForm>
              <knowledge-bind-panel v-if="item.index === 1"></knowledge-bind-panel>
            </template>
          </knowledge-sidebar>
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
import { FileImageOutlined } from '@ant-design/icons-vue';
import {
  EditorContent
} from '@tiptap/vue-3';
import { Spin, Tag } from 'ant-design-vue';
import {
  provide, defineComponent, onMounted, onUnmounted, ref
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { KnowledgeTiptapTextEditor } from '@/components/tiptap-text-editor/knowledge.tiptap.text.editor';
import {
  KnowledgeArticleControl,
  KnowledgePictures,
  KnowledgeBindPanel,
  KnowledgeEditHeader,
  KnowledgeMentionedList,
  KnowledgeCustomFields,
  KnowledgeSidebar,
  KnowledgeEditForm
} from '@/views/knowledge-edit/index';

import { KnowledgeDrawerContent } from '@/business';
import {
  KnowledgeEdit,
  knowledge,
  knowledgeDescription,
  knowledgeDrawer,
  repositoryEntityList,
  edges,
  knowledgeEntityIdInjectKey, repositoryEntityIdInjectKey
} from './knowledge-edit/model/knowledge.edit';

export default defineComponent({
  name: 'knowledge.edit',
  components: {
    KnowledgeDrawerContent,
    KnowledgePictures,
    FileImageOutlined,
    KnowledgeSidebar,
    KnowledgeArticleControl,
    KnowledgeMentionedList,
    KnowledgeEditHeader,
    EditorContent,
    KnowledgeBindPanel,
    KnowledgeEditForm,
    KnowledgeCustomFields,
    AntSpin: Spin,
    AntTag: Tag
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const isLoading = ref(false);
    const knowledgeEntityId = ref(route.query.knowledgeEntityId as string);
    const repositoryEntityId = ref(route.query.repositoryEntityId as string);
    provide(knowledgeEntityIdInjectKey, knowledgeEntityId);
    provide(repositoryEntityIdInjectKey, repositoryEntityId);
    const articleFontSize = ref('14');
    const changeArticleFontSize = (event: { value: string }) => {
      articleFontSize.value = event.value;
    };
    const knowledgeTiptapTextEditor = new KnowledgeTiptapTextEditor(
      repositoryEntityId.value,
      knowledgeEntityId.value
    );
    knowledgeTiptapTextEditor.initEditor();
    const { editor } = knowledgeTiptapTextEditor;
    const knowledgeEdit = new KnowledgeEdit();
    const saveKnowledgeArticle = async () => {
      if (editor.value) {
        await knowledgeEdit.handleSaveSectionArticle({
          content: editor.value?.getJSON(),
          contentHtml: editor.value?.getHTML(),
          knowledgeEntityId: knowledgeEntityId.value
        });
      }
    };
    const sidebarElementList = [{
      label: '知识点',
      value: 'knowledge'
    }, {
      label: '知识关联',
      value: 'edge'
    }];
    const activeKey = ref('1');
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
      console.log(knowledgeDescription.value);
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
    return {
      editor,
      knowledge,
      knowledgeDescription,
      knowledgeDrawer,
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
          height: 470px;
          background: #FFFFFF;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .05);
          margin: 0 auto 15px;

          .header {
            height: 50px;
            line-height: 50px;
            padding: 0 20px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            border-bottom: 1px solid $borderColor;

            .title {
              font-size: 20px;
            }

            .right {
              display: flex;
              gap: 10px;
            }
          }

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
