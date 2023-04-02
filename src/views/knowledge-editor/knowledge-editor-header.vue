<template>
  <div class="knowledge-header">
    <div class="left">
      <m-button :has-border="false" @click="goBack">
        <template #icon>
          <LeftOutlined/>
        </template>
      </m-button>
      <ant-dropdown
        :getPopupContainer="getPopupContainer"
        :trigger="['click']"
        :placement="'bottomLeft'">
        <m-button :has-border="false">
          <template #icon>
            <MenuOutlined/>
          </template>
        </m-button>
        <template #overlay>
          <ant-menu class="dropdown-menu-style">
            <ant-menu-item
              class="menu-item-style"
              @click="handleOpenKnowledgeDrawer">
              <EyeOutlined class="icon-size"/>
              侧边预览
            </ant-menu-item>
            <ant-menu-item
              class="menu-item-style"
              @click="goPreviewPage">
              <DesktopOutlined class="icon-size"/>
              页面预览
            </ant-menu-item>
            <ant-menu-item
              class="menu-item-style"
              @click="publishDraftKnowledge">
              <CloudUploadOutlined class="icon-size"/>
              发布
            </ant-menu-item>
            <ant-menu-item
              class="menu-item-style"
              v-if="publishedKnowledgeEntityId"
              @click="compareWithLatestVersion">
              <BranchesOutlined class="icon-size"/>
              对比
            </ant-menu-item>
          </ant-menu>
        </template>
      </ant-dropdown>
      <div class="title">{{ knowledgeName }}</div>
      <m-tag :title="knowledgeAuthStatus"></m-tag>
      <m-tag :title="knowledgePublishStatus"></m-tag>
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
      <!--      <m-button-->
      <!--        type="primary" class="pull-request-button"-->
      <!--        @click="handleOpenKnowledgeDrawer"-->
      <!--        :loading="drawerLoading">侧边预览-->
      <!--      </m-button>-->
      <!--      <ant-button-->
      <!--        type="primary" class="pull-request-button"-->
      <!--        @click="goPreviewPage">页面预览-->
      <!--      </ant-button>-->
      <!--      <ant-button-->
      <!--        type="primary" class="pull-request-button"-->
      <!--        @click="publishDraftKnowledge">发布-->
      <!--      </ant-button>-->
      <!--      <ant-button-->
      <!--        type="primary" class="pull-request-button"-->
      <!--        :loading="compareLoading"-->
      <!--        v-if="publishedKnowledgeEntityId"-->
      <!--        @click="compareWithLatestVersion">对比-->
      <!--      </ant-button>-->
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
<script lang="ts" setup>
import KnowledgeCompareModal from '@/views/knowledge-editor/knowledge-compare-modal.vue';
import {
  ExclamationCircleOutlined,
  LeftOutlined, MenuOutlined, DesktopOutlined,
  EyeOutlined, CloudUploadOutlined, BranchesOutlined
} from '@ant-design/icons-vue';
import { Editor } from '@tiptap/vue-3';
import {
  Modal, message, Dropdown as AntDropdown, Menu as AntMenu
} from 'ant-design-vue';
import { useRouter } from 'vue-router';
import {
  createVNode, defineProps, inject, PropType, ref
} from 'vue';
import { MButton, MTag } from '@/metagraph-ui';
import MentionedControlButton
  from '@/views/knowledge-editor/knowledge-edit-header/mentioned-control-button.vue';
import SocialActionButton from '@/components/social-action-button/social-action-button.vue';
import {
  CommentControlButton,
  StarControlButton,
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
import { KnowledgePreview } from '../knowledge-preview/knowledge.preview';

const AntMenuItem = AntMenu.Item;

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});

function getPopupContainer(triggerNode: any) {
  return triggerNode.parentNode;
}

const router = useRouter();
const knowledgeEdit = new KnowledgeEdit();
const knowledgePreview = new KnowledgePreview();

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
      // 发布之前先存储
      await knowledgeEdit.handleSaveSectionArticle({
        content: props.editor.getJSON(),
        contentHtml: props.editor.getHTML(),
        knowledgeEntityId: draftKnowledgeEntityId.value
      });
      const result = await knowledgeEdit.publishDraftKnowledge({
        knowledgeEntityId: draftKnowledgeEntityId.value,
        repositoryEntityId: repositoryEntityId.value
      });
      if (result) {
        await knowledgeEdit.setLatestVersionStatus({
          publishedKnowledgeEntityId: result.publishedKnowledgeEntityId
        });
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
  await knowledgeEdit.handleSaveSectionArticle({
    content: props.editor.getJSON(),
    contentHtml: props.editor.getHTML(),
    knowledgeEntityId: draftKnowledgeEntityId.value
  });
  drawerLoading.value = false;
  if (knowledge.value?.entity.id) {
    knowledgePreview.handleShowKnowledgeDrawer(knowledge.value.entity.id, 'draft');
  }
}

async function compareWithLatestVersion() {
  compareLoading.value = true;
  await knowledgeEdit.handleSaveSectionArticle({
    content: props.editor.getJSON(),
    contentHtml: props.editor.getHTML(),
    knowledgeEntityId: draftKnowledgeEntityId.value
  });
  compareLoading.value = false;
  isCompareModalShow.value = true;
}


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
