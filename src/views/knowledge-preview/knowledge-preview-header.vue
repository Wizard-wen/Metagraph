<template>
  <div class="knowledge-header">
    <div class="left">
      <!--      <m-button :is-icon="true" :has-border="false" @click="goBack">-->
      <!--        <template #icon>-->
      <!--          <LeftOutlined/>-->
      <!--        </template>-->
      <!--      </m-button>-->

      <div class="logo-container">
        <img
          @click="goHomePage"
          class="logo"
          src="@/assets/logo-header.png"
          height="32"
          alt="logo"/>
      </div>
      <LinkOutlined/>
      <div class="title">{{ knowledgeModel.content.name }}</div>
      <m-tag :title="knowledgeAuthStatus"></m-tag>
      <m-tag
        v-if="type === 'published'"
        :title="previewKnowledgePublishStatus">
      </m-tag>
      <m-tag
        v-if="type === 'draft'"
        :title="'版本xx'">
      </m-tag>
    </div>
    <div class="right" v-if="type === 'published'">
      <social-action-button
        :title="'引用'" :total="mentionList.length"></social-action-button>
      <mentioned-control-button
        v-if="publishedKnowledgeMentioned"
        :mentioned-knowledge="publishedKnowledgeMentioned"></mentioned-control-button>
      <star-control-button
        @update="handleStarStatusUpdate"
        :is-owner="true"
        :hasStar="knowledgeModel.hasStared"
        :count="knowledgeModel.star"
        :entity-id="knowledgeModel.entity.id"
        :entity-type="knowledgeModel.entity.entityType"></star-control-button>
      <comment-control-button
        :count="knowledgeModel.comment"
        :entity-id="knowledgeModel.entity.id"
        :entity-type="knowledgeModel.entity.entityType"></comment-control-button>
    </div>
    <div class="right" v-if="type === 'draft'">
      <social-action-button
        :title="'引用'" :total="0"></social-action-button>
      <social-action-button
        :title="'被引'" :total="0"></social-action-button>
      <social-action-button
        :title="'点赞'" :total="0"></social-action-button>
      <social-action-button
        :title="'评论'" :total="0"></social-action-button>
    </div>
  </div>
  <knowledge-drawer-content
    :knowledgeEntityId="knowledgeDrawerState.entityId"
    v-if="knowledgeDrawerState && knowledgeDrawerState.isShow"
    :isVisible="knowledgeDrawerState.isShow"
    :type="knowledgeDrawerState.type"
    @close="handleCloseDrawer"></knowledge-drawer-content>
</template>
<script lang="ts" setup>
import type { EntityCompletelyListItemType, KnowledgeResponseType } from '@metagraph/constant';
import { computed, defineProps, PropType } from 'vue';
import { LinkOutlined } from '@ant-design/icons-vue';
import MentionedControlButton
  from '@/views/knowledge-editor/knowledge-editor-header/mentioned-control-button.vue';
import SocialActionButton from '@/components/social-action-button/social-action-button.vue';
import {
  CommentControlButton,
  KnowledgeDrawerContent,
  knowledgeDrawerState,
  StarControlButton
} from '@/business';

import {
  KnowledgePreview,
  previewKnowledgePublishStatus,
  publishedKnowledgeMentioned
} from './knowledge.preview';
import { MTag } from '@/metagraph-ui';
import { RouterUtil } from '@/utils';

const props = defineProps({
  knowledgeModel: {
    type: Object as PropType<EntityCompletelyListItemType>,
    required: true
  },
  mentionList: {
    type: Array as PropType<EntityCompletelyListItemType[]>,
    required: true
  },
  type: {
    type: String as PropType<'draft' | 'published'>,
    required: true
  }
});

function goBack() {

}

async function goHomePage() {
  await RouterUtil.jumpTo('/');
}

const knowledgePreview = new KnowledgePreview();

const knowledgeAuthStatus = computed(
  () => ((props.knowledgeModel.content as KnowledgeResponseType)?.isCertificated ? '已认证' : '未认证')
);

async function handleStarStatusUpdate() {
  if(props.type === 'published') {
    await knowledgePreview.getPublishedKnowledgePreview(props.knowledgeModel.entity.id);
  }
}

function handleCloseDrawer() {
  knowledgePreview.handleCloseKnowledgeDrawer();
}

</script>
<style scoped lang="scss">
@import "../../style/common.scss";

.knowledge-header {
  height: 56px;
  border-bottom: 1px solid $borderColor;
  display: flex;
  justify-content: space-between;
  background: #FFFFFF;

  .left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    height: 56px;
    gap: 15px;

    .logo-container {
      display: flex;
      justify-content: flex-start;
      gap: 8px;
      cursor: pointer;
    }

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
