<template>
  <div class="repository-item">
    <ant-avatar
      class="icon"
      :size="32"
      v-if="activityItem.user.avatar"
      :src="activityItem.user.avatar"></ant-avatar>
    <div class="content">
      <div class="title" v-html="activityItem.content.content"></div>
      <div class="box">
        <ant-list-item>
          <template #actions>
            <ant-button>查看</ant-button>
          </template>
          <ant-list-item-meta
            v-if="activityItem.followedUser"
            :description="activityItem.followedUser.email"
            style="text-align: left">
            <template #title>
              <div class="name">{{ activityItem.followedUser.name }}</div>
            </template>
            <template #avatar>
              <ant-avatar
                :size="40"
                v-if="activityItem.followedUser.avatar"
                :src="activityItem.followedUser.avatar"/>
              <ant-avatar :size="40" v-else></ant-avatar>
            </template>
          </ant-list-item-meta>
        </ant-list-item>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { ActivityModelType, EntityCompletelyListItemType, UserModelType } from 'metagraph-constant';
import {
  computed, defineComponent, PropType, toRef
} from 'vue';
import { CommonUtil } from '@/utils';

export default defineComponent({
  name: 'activity-follow-user-item',
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
  },
  setup(props) {
    const activity = toRef(props, 'activityItem');
    const createdAt = computed(
      () => CommonUtil.formatDate(
        new Date(activity.value.content.createdAt),
        'yyyy-MM-dd hh:mm:ss'
      )
    );
    return {
      createdAt
    };
  }
});
</script>

<style scoped lang="scss">
.repository-item {
  padding: 16px 0;
  border-bottom: 1px solid #eaecef;
  display: flex;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;

  .icon {
    margin-right: 15px;
  }

  .content {
    width: 100%;

    .title {
      font-weight: bold;
      height: 32px;
      line-height: 32px;
      text-align: left;
      cursor: pointer;
      width: max-content;

      &:hover {
        color: #0969DA;
      }
    }

    .box {
      position: relative;
      text-align: left;
      margin-top: 8px;
      border-radius: 6px;
      border: 1px solid #e1e4e8;
      background: #fff;
      padding: 16px;
    }
  }
}
</style>
