<template>
  <div class="edu-header">
    <div class="left">
      <img src="/hogwarts-logo.webp"
           height="32" width="32"
           style="margin-right: 10px; cursor: pointer"
           @click="goHomePage"/>
      <ant-input-search
        @search="handleSearch"
        style="width: 260px"></ant-input-search>
      <ant-button type="link" :ghost="true">Knowledge Map1</ant-button>
    </div>
    <div class="right">
      <div style="margin-right: 20px;" v-if="isLogin">
        <ant-dropdown>
          <PlusOutlined style="color: #fff; font-size: 18px;"/>
          <template #overlay>
            <ant-menu>
              <ant-menu-item @click="goCreateRepoPage">
                create repo
              </ant-menu-item>
            </ant-menu>
          </template>
        </ant-dropdown>
      </div>
      <div class="login-status">
        <div class="no-login" v-if="!isLogin">
          <ant-button ghost @click="goSignInPage">sign in</ant-button>
          <ant-button ghost @click="goSignUpPage">sign up</ant-button>
        </div>
        <div class="has-login" v-else>
          <ant-dropdown>
            <ant-avatar :src="user.avatar"></ant-avatar>
            <template #overlay>
              <ant-menu>
                <ant-menu-item>
                  your repositories
                </ant-menu-item>
                <ant-menu-item @click="goStarPage">
                  your stars
                </ant-menu-item>
                <ant-menu-item @click="goUserEditPage">
                  settings
                </ant-menu-item>
                <ant-menu-item @click="signOut">
                  sign out
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
  name: 'edu.header',
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
      await router.push('/repository/create');
    };
    const goUserEditPage = async () => {
      if (userModel.value === undefined) return;
      await router.push({
        name: 'UserEdit',
        params: {
          userId: userModel.value.id
        }
      });
    };
    const goStarPage = async () => {
      if (userModel.value === undefined) return;
      await router.push({
        name: 'UserStar',
        params: {
          userId: userModel.value.id
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
      console.log(event);
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
      signOut,
      token,
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
