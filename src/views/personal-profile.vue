<template>
  <ant-tabs v-model:activeKey="activeKey" class="custom-ant-tab">
    <ant-tab-pane key="1">
      <template #tab>
        <span>
          overview
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
          <repository-list-icon></repository-list-icon>
          仓库
        </span>
      </template>
      <div class="tab-content">
        <profile-sidebar></profile-sidebar>
        <div class="profile-content"></div>
      </div>
    </ant-tab-pane>
    <ant-tab-pane key="3">
      <template #tab>
        <span>
          <star-icon></star-icon>
          点赞
        </span>
      </template>
      <div class="tab-content">
        <profile-sidebar></profile-sidebar>
        <div class="profile-content"></div>
      </div>
    </ant-tab-pane>
  </ant-tabs>
</template>

<script lang="ts">
import {
  defineComponent, ref, provide, onMounted
} from 'vue';
import { useRoute } from 'vue-router';
import { UserModelType } from 'edu-graph-constant';
import ProfileOverview from '@/views/personal-profile/profile-overview.vue';
import { userIdKey, userProfileKey } from '@/views/personal-profile/personal.profile.provide';
import { UserApiService } from '@/api.service';
import ProfileSidebar from './personal-profile/profile-sidebar.vue';
import { RepositoryListIcon, StarIcon } from '@/components/icons';

export default defineComponent({
  name: 'personal-profile',
  components: {
    ProfileOverview, ProfileSidebar, RepositoryListIcon, StarIcon
  },
  setup() {
    const route = useRoute();
    const userId = ref(route.query.id as string);
    const activeKey = ref('1');
    const userProfile = ref<UserModelType>();
    provide(userIdKey, userId);
    provide(userProfileKey, userProfile);

    async function getUserModelById() {
      const result = await UserApiService.getPublicUserById({ userId: userId.value });
      if (result.data) {
        userProfile.value = result.data;
      }
    }

    onMounted(async () => {
      await getUserModelById();
    });

    return {
      activeKey
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
}

.tab-content {
  width: 1200px;
  margin: 0 auto;
  height: 600px;
  display: flex;
  gap: 20px;

  .profile-content {
    flex: 1;
  }
}
</style>
