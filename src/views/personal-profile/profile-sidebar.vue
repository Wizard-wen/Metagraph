<template>
  <div class="sidebar">
    <div class="avatar">
      <img
        v-if="userProfile?.avatar" :src="userProfile.avatar"
        height="296"
        width="296"
        alt="">
      <ant-avatar :size="296" v-else>
        <template #icon>
          <UserOutlined/>
        </template>
      </ant-avatar>
    </div>
    <div class="nickname">
      {{ userProfile?.name || '' }}
    </div>
    <div v-if="isLogin && isMySelf" class="control" @click="goSettingPage">
      修改个人信息
    </div>
    <div
      v-if="isLogin && !isMySelf && !isCurrentUserFollowed"
      class="control" @click="handleFollow">
      关注
    </div>
    <div
      v-if="isLogin && !isMySelf && isCurrentUserFollowed"
      class="control" @click="handleUnFollow">
      不再关注
    </div>
    <div class="basic-message">
      <follower-icon></follower-icon>
      <div class="follow">
        <span class="follow-count">{{ userFollow.followedCount }}</span> 已关注
      </div>
      <span>·</span>
      <div class="follow">
        <span class="follow-count">{{ userFollow.followerCount }}</span> 粉丝
      </div>
    </div>
    <div class="email">
      <email-icon></email-icon>
      {{ userProfile?.email || '' }}
    </div>

    <div class="email">
      <location-icon></location-icon>
      {{ userProfile?.location || '' }}
    </div>
    <div class="email">
      <link-icon></link-icon>
      {{ userProfile?.personalWebsite || '' }}
    </div>
    <div class="email">
      <wechat-icon></wechat-icon>
      {{ userProfile?.wechat || '' }}
    </div>
    <div class="line-1px-border"></div>
  </div>
</template>

<script lang="ts">
import { Avatar, message } from 'ant-design-vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import {
  computed, onMounted, ref, defineComponent, inject
} from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { UserModelType } from '@metagraph/constant';
import { PersonalProfile } from './personal.profile';
import { userProfileKey, userFollowKey } from '@/views/personal-profile/personal.profile.provide';
import {
  EmailIcon, FollowerIcon, LocationIcon, LinkIcon, WechatIcon
} from '@/components/icons';
import { useStore } from '@/store';
import { FollowApiService } from '@/api-service/follow.api.service';

export default defineComponent({
  name: 'profile-sidebar',
  components: {
    FollowerIcon,
    UserOutlined,
    EmailIcon,
    LocationIcon,
    LinkIcon,
    WechatIcon,
    AntAvatar: Avatar
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const userModel = computed(() => store.state.user.user);
    const isLogin = computed(() => store.state.user.isLogin);
    const userProfile = inject(userProfileKey, ref<UserModelType>());
    const userFollow = inject(userFollowKey, ref<{
      followerCount: number;
      followedCount: number;
    }>());
    const userId = computed(() => route.query.id as string);
    const isMySelf = computed(() => userId.value === userModel.value?.id);
    const isCurrentUserFollowed = ref<boolean>(false);
    const personalProfile = new PersonalProfile();
    const followUser = async () => {
      const result = await FollowApiService.follow({
        toFollowUser: userId.value
      });
      if (result.code === 0) {
        message.success('关注成功！');
      }
      isCurrentUserFollowed.value = await personalProfile.checkIfFollowed(userId.value);
      await personalProfile.getFollowCount(userId.value);
    };
    const handleUnFollow = async () => {
      const result = await FollowApiService.unFollow({
        followedUser: userId.value
      });
      if (result.code === 0) {
        message.success('取消关注成功！');
        isCurrentUserFollowed.value = await personalProfile.checkIfFollowed(userId.value);
        await personalProfile.getFollowCount(userId.value);
      }
    };
    onMounted(async () => {
      if (userModel.value) {
        isCurrentUserFollowed.value = await personalProfile.checkIfFollowed(userId.value);
      }
    });

    onBeforeRouteUpdate(async (to, from) => {
      if (to.query.id !== from.query.id) {
        isCurrentUserFollowed.value = await personalProfile
          .checkIfFollowed(to.query.id as string);
      }
    });

    const goSettingPage = () => {
      router.push({
        path: '/settings/profile',
        query: {
          userId: userModel.value?.id
        }
      });
    };
    const handleFollow = async () => {
      if (userModel.value === undefined) {
        router.push('/login').then();
      } else {
        await followUser();
      }
    };
    return {
      isMySelf,
      userModel,
      userProfile,
      isCurrentUserFollowed,
      goSettingPage,
      handleFollow,
      handleUnFollow,
      userFollow,
      isLogin
    };
  }
});
</script>

<style scoped lang="scss">
.sidebar {
  width: 296px;
  color: #24292f;

  .avatar {
    height: 296px;
    width: 296px;
    background: #f5f5f5;
    border-radius: 50%;

    img {
      border-radius: 50%;
    }
  }

  .nickname {
    padding: 16px 0;
    line-height: 24px;
    font-size: 20px;
    text-align: left;
    color: #24292f;
    font-weight: bold;
  }

  .control {
    padding: 5px 16px;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    border: 1px solid #1b1f2426;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 16px;
  }

  .basic-message {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 16px;

    .follow {
      .follow-count {
        color: #24292f;
      }
    }
  }

  .email {
    line-height: 24px;
    margin-bottom: 6px;
    text-align: left;
  }

  .line-1px-border {
    height: 1px;
    width: 100%;
    background: #d8dee4;
  }
}
</style>
