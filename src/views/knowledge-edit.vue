<template>
  <ant-spin :spinning="isLoading">
    <div class="knowledge-edit">
      <knowledge-edit-header v-if="editor" :editor="editor"></knowledge-edit-header>
      <div class="knowledge-content">
        <knowledge-mentioned-list class="panel"></knowledge-mentioned-list>
        <div class="knowledge-editor">
          <knowledge-article-control-toolbar
            @fontSizeChange="changeArticleFontSize($event)"
            @save="saveKnowledgeArticle"
            v-if="editor" :editor="editor"></knowledge-article-control-toolbar>
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
                <div class="cover" v-if="knowledgeCover">
                  <img :src="knowledgeCover.url" alt="">
                </div>
                <div v-else>
                  <div class="icon">
                    <FileImageOutlined style="color: #dedede; font-size: 40px"/>
                  </div>
                  <div class="message">
                    图片格式png/jpg
                    <br/>
                    高宽像素不低于320px*320px
                  </div>
                </div>

                <ant-button class="add-button" @click="openSetKnowledgeCover">选择概念图册封面</ant-button>
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
    v-if="knowledgeDrawerState.isShow"
    :is-visible="knowledgeDrawerState.isShow"
    :type="type"
    :knowledge-entity-id="knowledgeDrawerState.entityId"
    @close="knowledgeDrawerState.isShow = false"></knowledge-drawer-content>
  <select-knowledge-cover-modal
    :knowledge-entity-id="draftKnowledgeEntityId"
    @close="isSelectKnowledgeCoverModalShow = false"
    v-if="isSelectKnowledgeCoverModalShow"
    :is-modal-visible="isSelectKnowledgeCoverModalShow"></select-knowledge-cover-modal>
</template>

<script lang="ts">
import { mentionPointerList } from '@/components/tiptap-text-editor/abstract.tiptap.text.editor';
import SelectKnowledgeCoverModal from '@/views/knowledge-edit/select-knowledge-cover-modal.vue';
import { ExclamationCircleOutlined, FileImageOutlined } from '@ant-design/icons-vue';
import {
  EditorContent
} from '@tiptap/vue-3';
import {
  Button, message, Modal, Spin
} from 'ant-design-vue';
import {
  provide, defineComponent, onMounted, onUnmounted, ref, computed, createVNode
} from 'vue';
import {
  LocationQueryValue,
  useRoute,
  useRouter,
  onBeforeRouteUpdate,
  onBeforeRouteLeave,
  RouteLocationNormalized,
  NavigationGuardNext
} from 'vue-router';
import { KnowledgeTiptapTextEditor } from '@/components/tiptap-text-editor/knowledge.tiptap.text.editor';
import {
  KnowledgeArticleControlToolbar,
  KnowledgePictures,
  KnowledgeBindPanel,
  KnowledgeEditHeader,
  KnowledgeMentionedList,
  KnowledgeCustomFields,
  KnowledgeSidebar,
  KnowledgeEditForm
} from '@/views/knowledge-edit/index';

import { KnowledgeDrawerContent, knowledgeDrawerState } from '@/business';
import {
  KnowledgeEdit,
  knowledge,
  knowledgeCover,
  knowledgeDescription,
  draftKnowledgeEntityIdInjectKey,
  publishedKnowledgeEntityIdInjectKey,
  repositoryEntityIdInjectKey
} from './knowledge-edit/model/knowledge.edit';

export default defineComponent({
  name: 'knowledge-edit',
  components: {
    SelectKnowledgeCoverModal,
    KnowledgeDrawerContent,
    KnowledgePictures,
    FileImageOutlined,
    KnowledgeSidebar,
    KnowledgeArticleControlToolbar,
    KnowledgeMentionedList,
    KnowledgeEditHeader,
    EditorContent,
    KnowledgeBindPanel,
    KnowledgeEditForm,
    KnowledgeCustomFields,
    AntSpin: Spin,
    AntButton: Button
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const publishedKnowledgeEntityId = ref(route.query.publishedKnowledgeEntityId as LocationQueryValue);
    const draftKnowledgeEntityId = ref(route.query.draftKnowledgeEntityId as string);
    const repositoryEntityId = ref(route.query.repositoryEntityId as string);
    provide(draftKnowledgeEntityIdInjectKey, draftKnowledgeEntityId);
    provide(publishedKnowledgeEntityIdInjectKey, publishedKnowledgeEntityId);
    provide(repositoryEntityIdInjectKey, repositoryEntityId);

    const type = computed(
      () => (draftKnowledgeEntityId.value ? 'draft' : 'published')
    );
    const isLoading = ref(false);
    const articleFontSize = ref('14');
    const sidebarElementList = [{
      label: '知识点',
      value: 'knowledge'
    }, {
      label: '知识关联',
      value: 'edge'
    }];
    const activeKey = ref('1');
    const isSelectKnowledgeCoverModalShow = ref(false);

    function changeArticleFontSize(event: { value: string }) {
      articleFontSize.value = event.value;
    }

    mentionPointerList.value = [];
    const knowledgeTiptapTextEditor = new KnowledgeTiptapTextEditor({
      repositoryEntityId: repositoryEntityId.value,
      knowledgeEntityId: draftKnowledgeEntityId.value,
      hasPublished: !!publishedKnowledgeEntityId.value
    });
    knowledgeTiptapTextEditor.initEditor();
    const { editor } = knowledgeTiptapTextEditor;
    const knowledgeEdit = new KnowledgeEdit();

    async function saveKnowledgeArticle() {
      if (editor.value) {
        await knowledgeEdit.handleSaveSectionArticle({
          content: editor.value?.getJSON(),
          contentHtml: editor.value?.getHTML(),
          knowledgeEntityId: draftKnowledgeEntityId.value
        });
      }
    }

    const goBack = () => {
      router.go(-1);
    };

    function openSetKnowledgeCover() {
      isSelectKnowledgeCoverModalShow.value = true;
    }

    async function handleConfirm(): Promise<boolean> {
      return new Promise((resolve) => {
        Modal.confirm({
          zIndex: 100000,
          title: '确定离开当前页面吗?',
          icon: createVNode(ExclamationCircleOutlined),
          content: '',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            resolve(true);
          },
          onCancel() {
            resolve(false);
          }
        });
      });
    }

    onBeforeRouteLeave(async (to, from) => await handleConfirm()
      // 取消导航并停留在同一页面上
    );

    onBeforeRouteUpdate(async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      if (
        JSON.stringify(to.query) !== JSON.stringify(from.query)
      ) {
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
      knowledgeTiptapTextEditor.setContent(knowledgeDescription.value);
      await knowledgeTiptapTextEditor.initData();
      isLoading.value = false;
    });

    onUnmounted(() => {
      knowledgeTiptapTextEditor.destroy();
    });

    return {
      type,
      editor,
      knowledge,
      knowledgeDescription,
      knowledgeDrawerState,
      knowledgeCover,
      mentionPointerList,
      isLoading,
      repositoryEntityId,
      activeKey,
      isSelectKnowledgeCoverModalShow,
      goBack,
      changeArticleFontSize,
      saveKnowledgeArticle,
      openSetKnowledgeCover,
      articleFontSize,
      sidebarElementList,
      draftKnowledgeEntityId,
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
        height: calc(100vh - 102px);
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
              font-size: 18px;
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

            .cover {
              height: 194px;
              padding-top: 20px;

              img {
                object-fit: cover;
                height: 170px;
                width: 170px;
              }
            }

            .icon {
              height: 100px;
              padding-top: 60px;
            }

            .message {
              margin-top: 26px;
              font-size: 12px;
              line-height: 24px;
              color: #999;
              margin-bottom: 20px;
            }

            .add-button {
              margin-top: 20px;
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
