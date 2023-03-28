<template>
  <ant-spin :spinning="isLoading">
    <div class="knowledge-edit">
      <knowledge-edit-header v-if="editor" :editor="editor"></knowledge-edit-header>
      <network-status-alert></network-status-alert>
      <div class="knowledge-content">
        <knowledge-mentioned-list class="panel"></knowledge-mentioned-list>
        <div class="knowledge-editor">
          <knowledge-article-control-toolbar
            v-if="editor" :editor="editor"
            @fontSizeChange="changeArticleFontSize($event)"
            @save="saveKnowledgeArticle"></knowledge-article-control-toolbar>
          <div class="knowledge-editor-content">
            <knowledge-description
              v-if="editor"
              :editor="editor"
              :article-font-size="articleFontSize"
              :description-characters="descriptionCharacters"
            ></knowledge-description>
            <knowledge-custom-fields></knowledge-custom-fields>
            <knowledge-pictures></knowledge-pictures>
          </div>
        </div>
        <div class="knowledge-form">
          <knowledge-sidebar
            :element-list="sidebarElementList">
            <template v-slot:content="{item}">
              <knowledge-base-message-form
                v-if="item.index === 0"></knowledge-base-message-form>
              <knowledge-relation-edges-panel
                v-if="item.index === 1"></knowledge-relation-edges-panel>
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
import NetworkStatusAlert from '@/components/network-status-alert/network-status-alert.vue';
import { IndexdbService } from '@/service/indexdb.service';
import KnowledgeDescription from '@/views/knowledge-edit/knowledge-description.vue';
import SelectKnowledgeCoverModal from '@/views/knowledge-edit/select-knowledge-cover-modal.vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import {
  message, Modal, Spin
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
  KnowledgeRelationEdgesPanel,
  KnowledgeEditHeader,
  KnowledgeMentionedList,
  KnowledgeCustomFields,
  KnowledgeSidebar,
  KnowledgeBaseMessageForm
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
    NetworkStatusAlert,
    KnowledgeDescription,
    SelectKnowledgeCoverModal,
    KnowledgeDrawerContent,
    KnowledgePictures,
    KnowledgeSidebar,
    KnowledgeArticleControlToolbar,
    KnowledgeMentionedList,
    KnowledgeEditHeader,
    KnowledgeRelationEdgesPanel,
    KnowledgeBaseMessageForm,
    KnowledgeCustomFields,
    AntSpin: Spin
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
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
    // 知识点描述字数统计
    const descriptionCharacters = computed(
      () => editor.value?.storage.characterCount.characters()
    );

    async function saveKnowledgeArticle() {
      if (editor.value) {
        const result = await knowledgeEdit.handleSaveSectionArticle({
          content: editor.value?.getJSON(),
          contentHtml: editor.value?.getHTML(),
          knowledgeEntityId: draftKnowledgeEntityId.value
        });
        await IndexdbService.getInstance()
          .update(
            'knowledge',
            draftKnowledgeEntityId.value,
            {
              description: editor.value?.getHTML()
            }
          );
        if (result) {
          message.success('保存成功！');
        }
      }
    }

    function goBack() {
      router.go(-1);
    }

    function openSetKnowledgeCover() {
      isSelectKnowledgeCoverModalShow.value = true;
    }

    async function handleRouteLeaveConfirm(): Promise<boolean> {
      return true;
      // return new Promise((resolve) => {
      //   Modal.confirm({
      //     zIndex: 100000,
      //     title: '确定离开当前页面吗?',
      //     icon: createVNode(ExclamationCircleOutlined),
      //     content: '',
      //     okText: '确定',
      //     cancelText: '取消',
      //     onOk() {
      //       resolve(true);
      //     },
      //     onCancel() {
      //       resolve(false);
      //     }
      //   });
      // });
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
      window.onbeforeunload = (event: any) => '关闭前的提示';
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
      descriptionCharacters
    };
  }
});
</script>

<style scoped lang="scss">
@import "../style/common.scss";

.knowledge-edit {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #fafbfc;

  .knowledge-content {
    height: calc(100vh - 56px);
    width: 100%;
    display: flex;
    background: $backgroundColor;

    .panel {
      width: 220px;
    }

    .knowledge-editor {
      flex: 1;

      .knowledge-editor-content {
        padding-top: 15px;
        padding-bottom: 250px;
        height: calc(100vh - 102px);
        overflow-y: auto;
      }
    }

    .knowledge-form {
      width: 300px;
    }
  }
}

</style>
