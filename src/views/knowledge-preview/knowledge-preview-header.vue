<template>
  <div class="knowledge-header">
    <div class="left">
      <LinkOutlined/>
      <div class="title">{{ knowledgeModel.content.name }}</div>
      <ant-tag class="status-tag">{{ knowledgeAuthStatus }}</ant-tag>
      <ant-tag
        v-if="type === 'published'"
        class="status-tag">{{ previewKnowledgePublishStatus }}
      </ant-tag>
      <ant-tag
        v-if="type === 'draft'"
        class="status-tag">版本xx
      </ant-tag>
    </div>
    <div class="right" v-if="type === 'published'">
      <social-action-button
        :title="'引用'" :total="mentionList.length"></social-action-button>
      <mentioned-control-button
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
    v-if="knowledgeDrawerState.isShow"
    :isVisible="knowledgeDrawerState.isShow"
    :type="knowledgeDrawerState.type"
    @close="handleCloseDrawer"></knowledge-drawer-content>
</template>
<script lang="ts">
import { Tag } from 'ant-design-vue';
import type { EntityCompletelyListItemType, KnowledgeResponseType } from 'metagraph-constant';
import {
  computed, defineComponent, PropType, toRef
} from 'vue';
import { LinkOutlined } from '@ant-design/icons-vue';
import MentionedControlButton from '@/views/knowledge-editor/knowledge-edit-header/mentioned-control-button.vue';
import SocialActionButton from '@/components/social-action-button/social-action-button.vue';
import {
  KnowledgeDrawerContent,
  CommentControlButton,
  StarControlButton,
  knowledgeDrawerState
} from '@/business';

import {
  previewKnowledgePublishStatus,
  publishedKnowledgeMentioned,
  KnowledgePreview
} from './knowledge.preview';

export default defineComponent({
  name: 'knowledge-preview-header',
  props: {
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
  },
  components: {
    CommentControlButton,
    StarControlButton,
    MentionedControlButton,
    KnowledgeDrawerContent,
    SocialActionButton,
    AntTag: Tag,
    LinkOutlined
  },
  setup(props) {
    const knowledgeModel = toRef(props, 'knowledgeModel');
    const type = toRef(props, 'type');
    const knowledgePreview = new KnowledgePreview();

    const knowledgeAuthStatus = computed(
      () => ((knowledgeModel.value.content as KnowledgeResponseType)?.isCertificated ? '已认证' : '未认证')
    );

    async function handleStarStatusUpdate() {
      if (type.value === 'published') {
        await knowledgePreview.getPublishedKnowledgePreview(knowledgeModel.value.entity.id);
      }
    }

    function handleCloseDrawer() {
      knowledgePreview.handleCloseKnowledgeDrawer();
    }

    return {
      handleStarStatusUpdate,
      previewKnowledgePublishStatus,
      knowledgeAuthStatus,
      publishedKnowledgeMentioned,
      knowledgeDrawerState,
      handleCloseDrawer
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
      margin-right: 0;
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
