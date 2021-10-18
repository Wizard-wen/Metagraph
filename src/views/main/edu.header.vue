<template>
  <div class="edu-header">
    <div class="left">
      <div class="logo">

        <ant-avatar :src="'./hogwarts-logo.webp'"
                    style="margin-right: 10px; cursor: pointer" @click="goHomePage"></ant-avatar>
      </div>
      <div class="search">
        <ant-input-search @search="handleSearch"></ant-input-search>
      </div>
      <div>
        <ant-button type="link" :ghost="true">Knowledge Map</ant-button>
      </div>
    </div>
    <div class="right">
      <div style="margin-right: 20px;line-height: 35px" v-if="isLogin">
        <ant-dropdown>
          <PlusOutlined style="color: #fff; line-height: 35px;font-size: 18px;"/>
          <template #overlay>
            <ant-menu>
              <ant-menu-item @click="goCreateRepoPage">
                create repo
              </ant-menu-item>
            </ant-menu>
          </template>
        </ant-dropdown>
      </div>
      <test-icon style="color: red;line-height: 35px;font-size: 18px;"></test-icon>
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
  defineComponent, onMounted, reactive, ref
} from 'vue';
import { useRouter } from 'vue-router';
import { UserOutlined, PlusOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'edu.header',
  components: {
    UserOutlined,
    PlusOutlined,
  },
  data() {
    return {
      // hogwartsLogo: HogwartsLogo
    };
  },
  setup() {
    const isLogin = ref(false);
    const user = ref({});
    const router = useRouter();
    const getData = (key: string) => localStorage.getItem(key);
    const setData = (key: string, content: string) => localStorage.setItem(key, content);
    onMounted(() => {
      isLogin.value = !!getData('isLogin');
      if (isLogin.value) {
        user.value = JSON.parse(getData('user')!);
      }
    });
    const goSignInPage = async () => {
      await router.push('/login');
    };
    const goCreateRepoPage = async () => {
      await router.push('/repository/create');
    };
    const goUserEditPage = async () => {
      const user = getData('user');
      console.log(JSON.parse(user!).id);
      await router.push({
        name: 'UserEdit',
        params: {
          userId: JSON.parse(user!).id
        }
      });
    };
    const goStarPage = async () => {
      const user = getData('user');
      console.log(JSON.parse(user!).id);
      await router.push({
        name: 'UserStar',
        params: {
          userId: JSON.parse(user!).id
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
      user
    };
  }
});
</script>

<style scoped lang="scss">
.edu-header {
  width: 100%;
  background: #24292e;
  padding: 16px;
  display: flex;
  justify-content: space-between;

  .left {
    padding-left: 15px;
    display: flex;
  }

  .right {
    display: flex;
  }

  .search {
    height: 30px;
    width: 272px;
  }
}
</style>
