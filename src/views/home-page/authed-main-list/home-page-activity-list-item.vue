<template>
  <template v-if="activityItem.content.type === 'CreateRepository'">
    <activity-repository-item :activity-item="activityItem"></activity-repository-item>
  </template>
  <template v-if="activityItem.content.type === 'CloneRepository'">
    <activity-repository-item :activity-item="activityItem"></activity-repository-item>
  </template>
  <template v-if="activityItem.content.type === 'CreateKnowledge'">
    <activity-knowledge-item
      :activity-item="activityItem"></activity-knowledge-item>
  </template>
  <template v-if="activityItem.content.type === 'AddStar'">
    <activity-repository-item
      v-if="activityItem.content.entityType === 'Repository'"
      :activity-item="activityItem"></activity-repository-item>
    <activity-knowledge-item
      v-if="activityItem.content.entityType === 'Knowledge'"
      :activity-item="activityItem"></activity-knowledge-item>
  </template>
  <template v-if="activityItem.content.type === 'FollowUser'">
    <activity-follow-user-item :activity-item="activityItem"></activity-follow-user-item>
  </template>
</template>

<script lang="ts" setup>
import type {
  ActivityModelType,
  EntityCompletelyListItemType,
  UserModelType
} from 'metagraph-constant';
import { defineProps, PropType } from 'vue';
import ActivityFollowUserItem
  from '@/views/home-page/authed-main-list/activity-follow-user-item.vue';
import ActivityKnowledgeItem
  from '@/views/home-page/authed-main-list/activity-knowledge-item.vue';
import ActivityRepositoryItem
  from '@/views/home-page/authed-main-list/activity-repository-item.vue';

defineProps({
  activityItem: {
    type: Object as PropType<{
      user: UserModelType,
      entity?: EntityCompletelyListItemType,
      followedUser?: UserModelType,
      content: ActivityModelType
    }>,
    required: true
  }
});
</script>

<style scoped lang="scss">
.activity-title {
  height: 40px;
  text-align: left;
  line-height: 40px;
  padding-left: 20px;
}
</style>
