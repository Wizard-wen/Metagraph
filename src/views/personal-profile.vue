<template>
  <ant-tabs v-model:activeKey="activeKey" class="custom-ant-tab">
    <ant-tab-pane key="1">
      <template #tab>
        <span>
          <overview-icon class="tab-icon"></overview-icon>
          概览
        </span>
      </template>
      <div class="tab-content">
        <profile-sidebar></profile-sidebar>
        <div class="profile-content">
          <profile-overview></profile-overview>
        </div>
      </div>
    </ant-tab-pane>
    <ant-tab-pane key="2">
      <template #tab>
        <span>
          <repository-list-icon class="tab-icon"></repository-list-icon>
          知识库
          <ant-tag class="count-tag-style">{{ myRepositoryEntityList.target.length }}</ant-tag>
        </span>
      </template>
      <div class="tab-content">
        <profile-sidebar></profile-sidebar>
        <div class="profile-content">
          <profile-repository-list></profile-repository-list>
        </div>
      </div>
    </ant-tab-pane>
    <ant-tab-pane key="3">
      <template #tab>
        <span>
          <star-icon class="tab-icon"></star-icon>
          点赞
          <ant-tag class="count-tag-style">{{ myStaredEntityList.target.length }}</ant-tag>
        </span>
      </template>
      <div class="tab-content">
        <profile-sidebar></profile-sidebar>
        <div class="profile-content">
          <profile-star-entity-list></profile-star-entity-list>
        </div>
      </div>
    </ant-tab-pane>

    <ant-tab-pane key="4">
      <template #tab>
        <span>
          <star-icon class="tab-icon"></star-icon>
          已关注
          <ant-tag class="count-tag-style">{{ userFollow.followedCount }}</ant-tag>
        </span>
      </template>
      <div class="tab-content">
        <profile-sidebar></profile-sidebar>
        <div class="profile-content">
          <profile-followed-user-list></profile-followed-user-list>
        </div>
      </div>
    </ant-tab-pane>

    <ant-tab-pane key="5">
      <template #tab>
        <span>
          <star-icon class="tab-icon"></star-icon>
          粉丝
          <ant-tag class="count-tag-style">{{ userFollow.followerCount }}</ant-tag>
        </span>
      </template>
      <div class="tab-content">
        <profile-sidebar></profile-sidebar>
        <div class="profile-content">
          <profile-follower-user-list></profile-follower-user-list>
        </div>
      </div>
    </ant-tab-pane>
  </ant-tabs>
</template>

<script lang="ts">
import {
  defineComponent, ref, provide, onMounted
} from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import ProfileFollowerUserList from '@/views/personal-profile/profile-follower-user-list.vue';
import ProfileFollowedUserList from '@/views/personal-profile/profile-followed-user-list.vue';
import OverviewIcon from '@/components/icons/overview-icon.vue';
import ProfileStarEntityList from '@/views/personal-profile/profile-star-entity-list.vue';
import ProfileRepositoryList from '@/views/personal-profile/profile-repository-list.vue';
import ProfileOverview from '@/views/personal-profile/profile-overview.vue';
import { userIdKey, userProfileKey, userFollowKey } from '@/views/personal-profile/personal.profile.provide';
import ProfileSidebar from './personal-profile/profile-sidebar.vue';
import { RepositoryListIcon, StarIcon } from '@/components/icons';
import { myStaredEntityList, myRepositoryEntityList,
  PersonalProfile, userFollow, userProfile } from './personal-profile/personal.profile';

export default defineComponent({
  name: 'personal-profile',
  components: {
    ProfileFollowerUserList,
    ProfileFollowedUserList,
    OverviewIcon,
    ProfileStarEntityList,
    ProfileRepositoryList,
    ProfileOverview,
    ProfileSidebar,
    RepositoryListIcon,
    StarIcon
  },
  setup() {
    const route = useRoute();
    const userId = ref(route.query.id as string);
    const tabKey = ref(route.query.tabKey as string);
    const activeKey = ref(tabKey.value || '1');
    provide(userIdKey, userId);
    provide(userProfileKey, userProfile);
    provide(userFollowKey, userFollow);
    const personalProfile = new PersonalProfile();
    onMounted(async () => {
      await personalProfile.getUserModelById(userId.value);
      await Promise.all([
        personalProfile.getFollowCount(userId.value),
        personalProfile.getOwnRepositoryEntityList(userId.value),
        personalProfile.getOwnStaredEntityList(userId.value),
        personalProfile.getFollowerList(userId.value),
        personalProfile.getFollowedUserList(userId.value)
      ]);
    });
    onBeforeRouteUpdate(async (to, from) => {
      if (to.query.id !== from.query.id) {
        const newUserId = to.query.id as string;
        await personalProfile.getUserModelById(newUserId);
        await Promise.all([
          personalProfile.getFollowCount(newUserId),
          personalProfile.getOwnRepositoryEntityList(newUserId),
          personalProfile.getOwnStaredEntityList(newUserId),
          personalProfile.getFollowerList(newUserId),
          personalProfile.getFollowedUserList(newUserId)
        ]);
      }
      if (to.query.tabKey) {
        activeKey.value = to.query.tabKey as string;
      }
    });
    return {
      activeKey,
      myStaredEntityList,
      myRepositoryEntityList,
      userFollow
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

      img {
        border-radius: 50%;
      }
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

  .profile-content {
    flex: 1;
  }
}

.custom-ant-tab {
  &::v-deep(.ant-tabs-tab) {
    padding: 17px 16px;
  }

  .tab-icon {
    margin-right: 0;
  }

  .count-tag-style {
    border-radius: 10px;
    padding: 0 10px;
  }
}

.tab-content {
  padding-bottom: 150px;
  width: 1200px;
  margin: 0 auto;
  min-height: 600px;
  display: flex;
  gap: 50px;

  .profile-content {
    flex: 1;
  }
}
</style>
