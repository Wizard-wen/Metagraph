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

<script lang="ts">
import type { ActivityModelType, EntityCompletelyListItemType, UserModelType } from 'metagraph-constant';
import { defineComponent, PropType } from 'vue';
import { useRouter } from 'vue-router';
import { Popover, Avatar } from 'ant-design-vue';
import {
  EmailIcon,
  LocationIcon,
  LinkIcon,
  WechatIcon
} from '@/components/icons';

export default defineComponent({
  name: 'activity-item-title',
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
  components: {
    EmailIcon,
    LocationIcon,
    LinkIcon,
    WechatIcon,
    AntPopover: Popover,
    AntAvatar: Avatar
  },
  setup() {
    const router = useRouter();
    const goUserProfilePage = (id: string) => {
      router.push({
        path: '/profile',
        query: {
          id
        }
      })
        .then();
    };
    return {
      goUserProfilePage
    };
  }
});
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

    &:hover {
      color: #0969DA;
    }
  }
}

.title {
  font-weight: bold;
  height: 32px;
  line-height: 32px;
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
    flex: 1;
  }

  .link-icon {
    &:hover {
      cursor: pointer;
      color: #0969DA;
    }
  }
}
</style>
