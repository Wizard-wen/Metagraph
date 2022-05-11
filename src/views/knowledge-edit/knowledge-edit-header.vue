<template>
  <div class="knowledge-header">
    <div class="left">
      <go-back-icon class="back-icon" @click="goBack"></go-back-icon>
      <div class="title">{{ knowledgeName }}</div>
      <ant-tag class="status-tag">{{ knowledgeAuthStatus }}</ant-tag>
      <ant-tag class="status-tag">{{ knowledgePublishStatus }}</ant-tag>
    </div>
    <div class="right" v-if="knowledge">
      <social-action-button
        v-if="publishedKnowledgeEntityId"
        :title="'引用'" :total="mentionedKnowledge.count"></social-action-button>
      <mentioned-control-button
        :mentioned-knowledge="mentionedKnowledge"
        v-if="publishedKnowledgeEntityId"></mentioned-control-button>
      <star-control-button
        v-if="publishedKnowledgeEntityId"
        @update="handleStarStatusUpdate"
        :is-owner="true"
        :hasStar="knowledge.hasStared"
        :count="knowledge.star"
        :entity-id="knowledge.entity.id"
        :entity-type="knowledge.entity.entityType"></star-control-button>
      <comment-control-button
        v-if="publishedKnowledgeEntityId"
        :count="knowledge.comment"
        :entity-id="knowledge.entity.id"
        :entity-type="knowledge.entity.entityType"></comment-control-button>
      <ant-button
        type="primary" class="pull-request-button"
        @click="handleOpenKnowledgeDrawer"
        :loading="drawerLoading">侧边预览
      </ant-button>
      <ant-button
        type="primary" class="pull-request-button"
        @click="goPreviewPage">页面预览
      </ant-button>
      <ant-button
        type="primary" class="pull-request-button"
        @click="publishDraftKnowledge">发布
      </ant-button>
      <ant-button
        type="primary" class="pull-request-button"
        :loading="compareLoading"
        v-if="publishedKnowledgeEntityId"
        @click="compareWithLatestVersion">对比
      </ant-button>
    </div>
  </div>
  <knowledge-compare-modal
    v-if="isCompareModalShow"
    :is-modal-visible="isCompareModalShow"
    @close="isCompareModalShow = false"
    :draft-knowledge-entity-id="draftKnowledgeEntityId"
    :published-knowledge-entity-id="publishedKnowledgeEntityId"
    :repository-entity-id="repositoryEntityId"></knowledge-compare-modal>
</template>
<script lang="ts">
import KnowledgeCompareModal from '@/views/knowledge-edit/knowledge-compare-modal.vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Editor } from '@tiptap/vue-3';
import {
  Button, Modal, Tag, message
} from 'ant-design-vue';
import { KnowledgeResponseType } from 'metagraph-constant';
import { useRouter } from 'vue-router';
import {
  createVNode, defineComponent, inject, PropType, ref, toRef
} from 'vue';
import MentionedControlButton from '@/views/knowledge-edit/knowledge-edit-header/mentioned-control-button.vue';
import SocialActionButton from '@/components/social-action-button/social-action-button.vue';
import { GoBackIcon } from '@/components/icons';
import {
  CommentControlButton,
  StarControlButton,
  knowledgeDrawerState
} from '@/business';
import {
  knowledgeName,
  knowledgeAuthStatus,
  knowledge,
  mentionedKnowledge,
  knowledgePublishStatus,
  KnowledgeEdit,
  repositoryEntityIdInjectKey,
  draftKnowledgeEntityIdInjectKey,
  publishedKnowledgeEntityIdInjectKey,
  isCompareModalShow
} from './model/knowledge.edit';

export default defineComponent({
  name: 'knowledge-editor-header',
  components: {
    KnowledgeCompareModal,
    CommentControlButton,
    StarControlButton,
    MentionedControlButton,
    GoBackIcon,
    SocialActionButton,
    AntButton: Button,
    AntTag: Tag
  },
  emits: ['save'],
  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true
    }
  },
  setup(props, { emit }) {
    const router = useRouter();
    const editor = toRef(props, 'editor');
    const knowledgeEdit = new KnowledgeEdit();

    const compareLoading = ref(false);
    const drawerLoading = ref(false);

    async function goBack() {
      router.go(-1);
    }

    const repositoryEntityId = inject(repositoryEntityIdInjectKey, ref(''));
    const draftKnowledgeEntityId = inject(draftKnowledgeEntityIdInjectKey, ref(''));
    const publishedKnowledgeEntityId = inject(publishedKnowledgeEntityIdInjectKey, ref(''));

    async function handleStarStatusUpdate() {
      if (knowledge.value?.entity.id) {
        await knowledgeEdit.getKnowledge(knowledge.value.entity.id);
      }
    }

    function goPreviewPage() {
      const { href } = router.resolve({
        path: '/knowledge/preview',
        query: {
          draftKnowledgeEntityId: draftKnowledgeEntityId.value
        }
      });
      window.open(href, '_blank');
    }

    async function publishDraftKnowledge() {
      Modal.confirm({
        zIndex: 100000,
        title: '确定要发布当前知识点?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '',
        okText: '确定',
        cancelText: '取消',
        async onOk() {
          console.log(editor.value.getJSON());
          // 发布之前先存储
          await knowledgeEdit.handleSaveSectionArticle({
            content: editor.value.getJSON(),
            contentHtml: editor.value.getHTML(),
            knowledgeEntityId: draftKnowledgeEntityId.value
          });
          const result = await knowledgeEdit.publishDraftKnowledge({
            knowledgeEntityId: draftKnowledgeEntityId.value,
            repositoryEntityId: repositoryEntityId.value
          });
          if (result) {
            router.push({
              name: 'KnowledgeEdit',
              query: {
                publishedKnowledgeEntityId: result.publishedKnowledgeEntityId,
                draftKnowledgeEntityId: result.draftKnowledgeEntityId,
                repositoryEntityId: repositoryEntityId.value
              },
              replace: true
            })
              .then();
          }
        },
        async onCancel() {
          message.info('取消发布！');
        }
      });
    }

    async function handleOpenKnowledgeDrawer() {
      drawerLoading.value = true;
      console.log(editor.value.getJSON());
      await knowledgeEdit.handleSaveSectionArticle({
        content: editor.value.getJSON(),
        contentHtml: editor.value.getHTML(),
        knowledgeEntityId: draftKnowledgeEntityId.value
      });
      drawerLoading.value = false;
      if (knowledge.value?.entity.id) {
        knowledgeDrawerState.entityId = knowledge.value.entity.id;
        knowledgeDrawerState.isShow = true;
      }
    }

    async function compareWithLatestVersion() {
      compareLoading.value = true;
      console.log(editor.value.getJSON());
      await knowledgeEdit.handleSaveSectionArticle({
        content: editor.value.getJSON(),
        contentHtml: editor.value.getHTML(),
        knowledgeEntityId: draftKnowledgeEntityId.value
      });
      compareLoading.value = false;
      isCompareModalShow.value = true;
    }

    return {
      knowledge,
      knowledgeName,
      knowledgeAuthStatus,
      mentionedKnowledge,
      knowledgePublishStatus,
      isCompareModalShow,
      drawerLoading,
      compareLoading,
      repositoryEntityId,
      publishedKnowledgeEntityId,
      draftKnowledgeEntityId,
      handleStarStatusUpdate,
      goBack,
      goPreviewPage,
      publishDraftKnowledge,
      handleOpenKnowledgeDrawer,
      compareWithLatestVersion
    };
  }
});

</script>
<style scoped lang="scss">
@import "../../style/common.scss";

.knowledge-header {
  background: #fafbfc;
  height: 56px;
  border-bottom: 1px solid $borderColor;
  display: flex;
  justify-content: space-between;

  .left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    height: 56px;
    gap: 15px;

    .back-icon {
      cursor: pointer;
      font-size: 18px;
    }

    .title {
      height: 32px;
      line-height: 32px;
      font-size: 18px;
    }

    .status-tag {
      height: 24px;
      line-height: 24px;
      border-radius: 4px;
    }
  }

  .right {
    padding-right: 30px;
    height: 56px;
    display: flex;
    align-items: center;
    gap: 15px;

    .pull-request-button {
      //margin-left: 20px;
    }
  }
}
</style>
