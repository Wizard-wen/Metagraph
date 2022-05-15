<template>
  <div class="edu-header">
    <div class="left">
      <img
        class="logo"
        src="/hogwarts-logo.webp"
        height="32" width="32"
        @click="goHomePage" alt="logo"/>
      <ant-input-search
        :allowClear="true"
        v-model:value="searchData.text"
        @search="handleSearch"
        style="width: 260px"></ant-input-search>
      <div
        class="text-button"
        @click="goKnowledgeMap">知识地图</div>
    </div>
    <div class="right">
      <div style="margin-right: 20px;" v-if="isLogin">
        <ant-dropdown>
          <PlusOutlined style="color: #fff; font-size: 18px;"/>
          <template #overlay>
            <ant-menu>
              <ant-menu-item @click="goCreateRepoPage">
                创建知识库
              </ant-menu-item>
            </ant-menu>
          </template>
        </ant-dropdown>
      </div>
      `
      <div class="login-status">
        <div class="no-login" v-if="!isLogin">
          <ant-button ghost @click="goSignInPage">登 录</ant-button>
          <ant-button ghost @click="goSignUpPage">注 册</ant-button>
        </div>
        <div class="has-login" v-else>
          <ant-dropdown>
            <ant-avatar :src="user.avatar" style="cursor: pointer"></ant-avatar>
            <template #overlay>
              <ant-menu>
                <ant-menu-item @click="goRepositoryPage">
                  我的知识库
                </ant-menu-item>
                <ant-menu-item @click="goStarPage">
                  我赞过的
                </ant-menu-item>
                <ant-menu-item @click="goFollowedPage">
                  我关注的人
                </ant-menu-item>
                <ant-menu-item @click="goFollowerPage">
                  关注我的人
                </ant-menu-item>
                <ant-menu-item @click="goPLanListPage">
                  我的计划
                </ant-menu-item>
                <ant-menu-item @click="goUserEditPage">
                  设置
                </ant-menu-item>
                <ant-menu-item @click="signOut">
                  退出登录
                </ant-menu-item>
              </ant-menu>
            </template>
          </ant-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, onMounted, ref
} from 'vue';
import {
  NavigationGuardNext, onBeforeRouteUpdate, RouteLocationNormalized, useRoute, useRouter
} from 'vue-router';
import {
  Avatar, Dropdown, Menu, Button, Input
} from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { MutationEnum, useStore } from '@/store';
import { searchData } from './metegraph.header';

export default defineComponent({
  name: 'metagraph-header',
  components: {
    PlusOutlined,
    AntDropdown: Dropdown,
    AntAvatar: Avatar,
    AntMenu: Menu,
    AntMenuItem: Menu.Item,
    AntButton: Button,
    AntInputSearch: Input.Search
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const isLogin = computed(() => store.state.user.isLogin);
    const userModel = computed(() => store.state.user.user);

    const token = computed(() => store.state.user.token);
    const goSignInPage = async () => {
      router.push('/login').then();
    };
    const goCreateRepoPage = async () => {
      router.push('/repository/edit').then();
    };
    const goUserEditPage = async () => {
      if (userModel.value === undefined) return;
      router.push({
        path: '/settings/profile',
        params: {
          userId: userModel.value.id
        }
      }).then();
    };
    const goKnowledgeMap = async () => {
      router.push('/knowledge/map').then();
    };
    const goStarPage = async () => {
      if (userModel.value === undefined) return;
      router.push({
        path: '/profile',
        query: {
          id: userModel.value.id,
          tabKey: '3'
        }
      }).then();
    };

    const goRepositoryPage = async () => {
      if (userModel.value === undefined) return;
      router.push({
        path: '/profile',
        query: {
          id: userModel.value.id,
          tabKey: '2'
        }
      }).then();
    };

    const goFollowedPage = async () => {
      if (userModel.value === undefined) return;
      router.push({
        path: '/profile',
        query: {
          id: userModel.value.id,
          tabKey: '4'
        }
      }).then();
    };

    const goFollowerPage = async () => {
      if (userModel.value === undefined) return;
      router.push({
        path: '/profile',
        query: {
          id: userModel.value.id,
          tabKey: '5'
        }
      }).then();
    };
    const goSignUpPage = async () => {
      router.push('/signup').then();
    };
    const goHomePage = async () => {
      router.push('/').then();
      searchData.value.text = '';
      searchData.value.type = '';
      searchData.value.activeIndex = 0;
    };
    const handleSearch = async (event: any) => {
      searchData.value.text = event;
      router.push({
        path: '/repository/list',
        query: {
          name: event ?? '',
          type: searchData.value.type
        },
        replace: true
      }).then();
    };
    const signOut = async () => {
      store.commit(MutationEnum.CLEAR_USER_MODEL);
      router.push({
        name: 'Login'
      }).then();
    };

    const goPLanListPage = async () => {
      router.push({
        path: '/planList',
      }).then();
    };
    onBeforeRouteUpdate((
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      console.log(to, from, '----- header');
      next();
    });
    onMounted(() => {
      if (route.path === '/repository/list') {
        console.log(route);
      }
    });
    return {
      goSignInPage,
      goCreateRepoPage,
      goSignUpPage,
      isLogin,
      goStarPage,
      goUserEditPage,
      handleSearch,
      goHomePage,
      goRepositoryPage,
      signOut,
      token,
      goKnowledgeMap,
      user: userModel,
      goFollowedPage,
      goFollowerPage,
      goPLanListPage,
      searchData
    };
  }
});
</script>

<style scoped lang="scss">
.edu-header {
  width: 100%;
  background: #24292e;
  height: 55px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;

  .left {
    padding-left: 15px;
    display: flex;
    align-items: center;

    .logo {
      margin-right: 10px;
      cursor: pointer
    }

    .text-button {
      font-weight: 600;
      color: #fff;
      margin-left: 15px;
      cursor: pointer;

      &：hover {

      }
    }
  }

  .right {
    display: flex;
    align-items: center;

    .login-status {
      .no-login {
        display: flex;
        gap: 10px;
      }
    }
  }

  .search {
    height: 30px;
    width: 272px;
  }
}
</style>
