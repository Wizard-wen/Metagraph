<template>
  <div class="title-content">
    <ant-popover placement="topLeft">
      <template #content>
        <div class="email">
          <email-icon></email-icon>
          {{ activityItem.user?.email || '' }}
        </div>
        <div class="email">
          <location-icon></location-icon>
          {{ activityItem.user?.location || '' }}
        </div>
        <div class="email">
          <link-icon></link-icon>
          {{ activityItem.user?.personalWebsite || '' }}
        </div>
        <div class="email">
          <wechat-icon></wechat-icon>
          {{ activityItem.user?.wechat || '' }}
        </div>
      </template>
      <template #title>
        <div class="title-content-slot">
          <ant-avatar
            v-if="activityItem.user.avatar"
            :src="activityItem.user.avatar"></ant-avatar>
          <div class="inner-title-name">{{ activityItem.user.name }}</div>
          <link-icon
            @click="goUserProfilePage(activityItem.user.id)"
            class="link-icon"></link-icon>
        </div>
      </template>
      <div class="user-name">{{ activityItem.user.name }}</div>
    </ant-popover>
    <div class="title" v-html="activityItem.content.content"></div>
  </div>
</template>

<script lang="ts" setup>
import type {
  ActivityModelType,
  EntityCompletelyListItemType,
  UserModelType
} from '@metagraph/constant';
import { defineProps, PropType } from 'vue';
import { useRouter } from 'vue-router';
import { Avatar as AntAvatar, Popover as AntPopover } from 'ant-design-vue';
import { EmailIcon, LinkIcon, LocationIcon, WechatIcon } from '@/components/icons';

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

const router = useRouter();

function goUserProfilePage(id: string) {
  router.push({
    path: '/profile',
    query: {
      id
    }
  })
    .then();
}
</script>

<style scoped lang="scss">
.title-content {
  display: flex;
  align-items: center;

  .email {
    line-height: 24px;
    margin-bottom: 6px;
    text-align: left;
  }

  .user-name {
    font-weight: bolder;
    margin-right: 5px;
    cursor: pointer;
    line-height: 1.5;

    &:hover {
      color: #0969DA;
    }
  }
}

.title {
  //height: 32px;
  line-height: 1.5;
  text-align: left;
  cursor: pointer;
  width: max-content;
}

.title-content-slot {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .inner-title-name {
    margin-right: 5px;
    padding-left: 15px;
    line-height: 1.5;
    flex: 1;
  }

  .link-icon {
    font-size: 12px;

    &:hover {
      cursor: pointer;
      color: #0969DA;
    }
  }
}
</style>
