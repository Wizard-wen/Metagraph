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
    <div v-if="isMySelf" class="control" @click="goSettingPage">
      修改个人信息
    </div>
    <div v-if="!isMySelf && !isFollowed" class="control" @click="handleFollow">
      关注
    </div>
    <div v-if="!isMySelf && isFollowed" class="control" @click="handleUnFollow">
      停止关注
    </div>
    <div class="basic-message">
      <follower-icon></follower-icon>
      <div class="follow">
        <span class="follow-count">6</span> 被关注
      </div>
      <span>·</span>
      <div class="follow">
        <span class="follow-count">6</span> 关注
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
import { message } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import {
  computed, onMounted, ref, defineComponent, inject
} from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { UserModelType } from 'metagraph-constant';
import { userProfileKey } from '@/views/personal-profile/personal.profile.provide';
import {
  EmailIcon, FollowerIcon, LocationIcon, LinkIcon, WechatIcon
} from '@/components/icons';
import { useStore } from '@/store';
import { FollowApiService } from '@/api.service/follow.api.service';

export default defineComponent({
  name: 'profile-sidebar',
  components: {
    FollowerIcon,
    UserOutlined,
    EmailIcon,
    LocationIcon,
    LinkIcon,
    WechatIcon
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const userModel = computed(() => store.state.user.user);
    const userProfile = inject(userProfileKey, ref<UserModelType>());
    const userId = computed(() => route.query.id as string);
    const isMySelf = computed(() => userId.value === userModel.value?.id);
    const isFollowed = ref<boolean>(false);
    const followUser = async () => {
      const result = await FollowApiService.follow({
        toFollowUser: userId.value
      });
      if (result.code === 0) {
        message.success('关注成功！');
      }
    };
    const handleUnFollow = async () => {
      const result = await FollowApiService.unFollow({
        followedUser: userId.value
      });
      if (result.code === 0) {
        message.success('取消关注成功！');
      }
    };
    const checkIfFollowed = async () => {
      const result = await FollowApiService.checkIfFollowed({
        followedUser: userId.value
      });
      if (result.data) {
        isFollowed.value = result.data.status;
      }
    };
    onMounted(async () => {
      if (userModel.value) {
        await checkIfFollowed();
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
        await router.push('/login');
      } else {
        await followUser();
      }
    };
    return {
      isMySelf,
      userModel,
      userProfile,
      isFollowed,
      goSettingPage,
      handleFollow,
      handleUnFollow
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
    background: #0969DC;
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
