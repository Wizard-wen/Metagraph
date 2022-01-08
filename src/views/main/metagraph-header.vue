<template>
  <div class="edu-header">
    <div class="left">
      <img
        class="logo"
        src="/hogwarts-logo.webp"
        height="32" width="32"
        @click="goHomePage"/>
      <ant-input-search
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
      <div class="login-status">
        <div class="no-login" v-if="!isLogin">
          <ant-button ghost @click="goSignInPage">登 录</ant-button>
          <ant-button ghost @click="goSignUpPage">注 册</ant-button>
        </div>
        <div class="has-login" v-else>
          <ant-dropdown>
            <ant-avatar :src="user.avatar"></ant-avatar>
            <template #overlay>
              <ant-menu>
                <ant-menu-item @click="goRepositoryPage">
                  我的知识库
                </ant-menu-item>
                <ant-menu-item @click="goStarPage">
                  赞过的
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
  computed,
  defineComponent, onMounted, ref
} from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'metagraph-header',
  components: {
    PlusOutlined,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const isLogin = computed(() => store.state.user.isLogin);
    const userModel = computed(() => store.state.user.user);
    const token = computed(() => store.state.user.tokenState);
    const goSignInPage = async () => {
      await router.push('/login');
    };
    const goCreateRepoPage = async () => {
      await router.push('/repository/edit');
    };
    const goUserEditPage = async () => {
      if (userModel.value === undefined) return;
      await router.push({
        path: '/settings/profile',
        params: {
          userId: userModel.value.id
        }
      });
    };
    const goKnowledgeMap = async () => {
      await router.push('/knowledge/map');
    };
    const goStarPage = async () => {
      if (userModel.value === undefined) return;
      await router.push({
        path: '/profile',
        query: {
          id: userModel.value.id,
          tabKey: '3'
        }
      });
    };

    const goRepositoryPage = async () => {
      if (userModel.value === undefined) return;
      await router.push({
        path: '/profile',
        query: {
          id: userModel.value.id,
          tabKey: '2'
        }
      });
    };
    const goSignUpPage = async () => {
      await router.push('/signup');
    };
    const goHomePage = async () => {
      await router.push('/');
    };
    const handleSearch = async (event: any) => {
      await router.push({
        name: 'RepositoryList',
        params: {
          name: event
        }
      });
    };
    const signOut = async () => {
      await router.push({
        name: 'Login'
      });
      localStorage.clear();
    };
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
      user: userModel
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
  }

  .search {
    height: 30px;
    width: 272px;
  }
}
</style>
