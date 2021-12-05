<template>
  <div class="user-profile">
    <div class="sidebar">
      <div class="avatar">
        <img
          v-if="userProfile?.avatar" [src]="userProfile.avatar"
          height="296"
          width="296"
          alt="">
      </div>
      <div class="nickname">
        {{ userProfile?.name || '' }}
      </div>
      <div v-if="isMySelf" class="control" @click="goSettingPage">
        Edit Profile
      </div>
      <div v-if="!isMySelf && !isFollowed" class="control" @click="handleFollow">
        Follow
      </div>
      <div v-if="!isMySelf && isFollowed" class="control" @click="handleUnFollow">
        Unfollow
      </div>
      <div class="basic-message">
        <div class="followers">
          <follower-icon></follower-icon>
          6 followers ·
        </div>
        <div class="following">6 following · </div>
        <div class="star">
          <star-icon></star-icon>
          152
        </div>
      </div>
      <div class="email">
        <email-icon></email-icon>
        {{ userProfile?.email || '' }}
      </div>
      <div class="line-1px-border"></div>
    </div>
  </div>
</template>

<script lang="ts">
import type { UserModelType } from 'edu-graph-constant';
import {
  defineComponent, onMounted, computed, ref
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { FollowApiService } from '@/api.service/follow.api.service';
import { UserNoAuthApiService } from '@/api.service/no.auth/user.no.auth.api.service';
import { useStore } from '@/store';
import { StarIcon, FollowerIcon, EmailIcon } from '@/components/icons';

export default defineComponent({
  name: 'profile.vue',
  components: { FollowerIcon, StarIcon, EmailIcon },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const userModel = computed(() => store.state.user.user);
    const userProfile = ref<UserModelType>();
    const isMySelf = computed(() => route.query?.id === userModel.value?.id);
    const isFollowed = ref<boolean>(false);
    const getUserProfile = async () => {
      const result = await UserNoAuthApiService.getUserProfileById({ userId: route.query.id as string });
      if (result.data) {
        userProfile.value = result.data;
      }
    };
    const followUser = async () => {
      const result = await FollowApiService.follow({
        toFollowUser: route.query.id as string
      });
    };
    const handleUnFollow = async () => {
      const result = await FollowApiService.unFollow({
        followedUser: route.query.id as string
      });
    };
    const checkIfFollowed = async () => {
      const result = await FollowApiService.checkIfFollowed({
        followedUser: route.query.id as string
      });
      if (result.data) {
        isFollowed.value = result.data.status;
      }
    };
    onMounted(async () => {
      if (userModel.value) {
        await checkIfFollowed();
      }
      await getUserProfile();
    });

    const goSettingPage = () => {
      router.push('/setting/profile');
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
.user-profile {
  padding-top: 60px;
  width: 1200px;
  display: flex;
  gap: 20px;
  margin: 0 auto;

  .sidebar {
    width: 296px;

    .avatar {
      height: 296px;
      width: 296px;
      background: #0969DC;
      border-radius: 50%;
    }

    .nickname {
      padding: 16px 0;
      line-height: 24px;
      font-size: 20px;
      text-align: left;
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
    }

    .email {
      line-height: 24px;
      margin-bottom: 16px;
      text-align: left;
    }

    .line-1px-border {
      height: 1px;
      width: 100%;
      background: #d8dee4;
    }
  }

}
</style>
