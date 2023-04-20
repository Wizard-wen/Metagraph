<template>
  <div class="activity-list-item">
    <ant-avatar
      :size="28" class="user-avatar"
      v-if="activityItem.author.avatar"
      :src="activityItem.author.avatar"></ant-avatar>
    <div class="activity-content">
      <div class="user-name">{{ activityItem.author.name }}</div>
      <div class="activity-box">
        <div class="name-content">
          <div class="name" @click="goProfilePage">
            {{ activityItem.entity.name }}
          </div>
        </div>
        <div class="description-content">
          <tiptap-editor-readonly
            class="custom-tiptap-readonly"
            :article-content="activityItem.content.description"></tiptap-editor-readonly>
        </div>
        <div class="tag-content" v-if="activityItem.content.domain.length">
          <m-tag
            :key="index"
            v-for="(item, index) in activityItem.content.domain"
            :title="item.domainName"></m-tag>
        </div>
        <div class="others">
          <div class="star">
            <StarOutlined class="star-icon"/>
            {{ activityItem.star }}
          </div>
          <div class="star">
            <CommentOutlined class="star-icon"/>
            {{ activityItem.comment }}
          </div>
          <div class="updatedAt">{{ date }}</div>
        </div>
        <div class="control-btn star-btn">
          <slot name="control"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { EntityCompletelyListItemType, } from '@metagraph/constant';
import { computed, defineProps, PropType } from 'vue';
import { Avatar as AntAvatar } from 'ant-design-vue';
import { MTag } from '@/metagraph-ui';
import { CommentOutlined, StarOutlined } from '@ant-design/icons-vue';
import { CommonUtil } from '@/utils/common.util';
import TiptapEditorReadonly from '@/components/tiptap-text-editor/tiptap-editor-readonly.vue';
import { RouterUtil } from '@/utils/router.util';

const props = defineProps({
  activityItem: {
    type: Object as PropType<EntityCompletelyListItemType>,
    required: true
  }
});

const date = computed(() => CommonUtil.timeAgo(
  new Date(props.activityItem.content.updatedAt).getTime()
));

function goProfilePage() {
  RouterUtil.jumpToBlankPage('/knowledge/preview', {
    publishedKnowledgeEntityId: props.activityItem.entity.id
  });
}

</script>

<style scoped lang="scss">
@import '../../../style/tiptap.common.scss';
@import "../authed-main-list/activity.scss";
@import "../../../style/common.scss";

.user-name {
  display: flex;
  justify-content: flex-start;
  font-weight: bold;
}
</style>
