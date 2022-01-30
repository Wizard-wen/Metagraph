<template>
  <template v-if="activityItem.content.type === 'CreateRepository'">
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

<script lang="ts">
import {
  ActivityModelType, EntityCompletelyListItemType, UserModelType
} from 'metagraph-constant';
import {
  defineComponent, PropType
} from 'vue';
import ActivityFollowUserItem from '@/views/home-page/home-page-main-list/activity-follow-user-item.vue';
import ActivityKnowledgeItem from '@/views/home-page/home-page-main-list/activity-knowledge-item.vue';
import ActivityRepositoryItem from '@/views/home-page/home-page-main-list/activity-repository-item.vue';

export default defineComponent({
  name: 'home-page-activity-list-item',
  components: {
    ActivityKnowledgeItem,
    ActivityRepositoryItem,
    ActivityFollowUserItem,
  },
  props: {
    activityItem: {
      type: Object as PropType<{
        user: UserModelType,
        entity?: EntityCompletelyListItemType,
        followedUser?: UserModelType,
        content: ActivityModelType
      }>,
      required: true
    }
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
