<template>
  <div class="metagraph-header">
    <div class="left">
      <div class="logo-container">
        <img
          class="logo"
          src="/hogwarts-logo.webp"
          height="32" width="32"
          alt="logo"/>
        <div class="logo-name" @click="goHomePage">metagraph</div>
      </div>
      <ant-input-search
        class="input-search-style"
        :allowClear="true"
        v-model:value="searchData.text"
        placeholder="请输入搜索内容..."
        @search="handleSearch($event)"></ant-input-search>
      <div class="banner-list">
        <div
          class="text-button"
          @click="goKnowledgeMap">知识地图</div>
        <div
          class="text-button"
          @click="goPLanListPage">学习计划</div>
        <div
          class="text-button" @click="goInspirationPage">灵感</div>
        <div
          class="text-button">反馈</div>
        <div
          class="text-button">帮助</div>
      </div>
    </div>
    <div class="right">
      <ant-dropdown v-if="isLogin">
        <div class="create-btn">
          <PlusCircleOutlined style="font-size: 16px;margin-right: 3px;"/>
          <span>新建</span>
        </div>
        <template #overlay>
          <ant-menu>
            <ant-menu-item @click="goCreateRepoPage" class="menu-item-style">
              <BookOutlined/>
              新建知识库
            </ant-menu-item>
            <ant-menu-item style="font-size: 12px">
              <ReadOutlined/>
              新建知识点
            </ant-menu-item>
            <ant-menu-item style="font-size: 12px">
              <FireOutlined/>
              新建灵感
            </ant-menu-item>
          </ant-menu>
        </template>
      </ant-dropdown>
      <div class="notify" v-if="isLogin">
        <BellOutlined style="font-size: 16px;"/>
      </div>
      <div class="login-status">
        <div class="no-login" v-if="!isLogin">
          <ant-button size="small" @click="goSignInPage">登 录</ant-button>
          <ant-button size="small" @click="goSignUpPage">注 册</ant-button>
        </div>
        <div class="has-login" v-else>
          <ant-dropdown>
            <div class="avatar-dropdown">
              <ant-avatar :src="user.avatar"></ant-avatar>
              <DownOutlined style="margin-left: 4px;"/>
            </div>
            <template #overlay>
              <ant-menu>
                <ant-menu-item
                  class="menu-item-style"
                  @click="goRepositoryPage">
                  <BookOutlined/>
                  我的知识库
                </ant-menu-item>
                <ant-menu-item style="font-size: 12px;" @click="goStarPage">
                  <StarOutlined/>
                  我赞过的
                </ant-menu-item>
                <ant-menu-item style="font-size: 12px;" @click="goFollowedPage">
                  <AimOutlined/>
                  我关注的人
                </ant-menu-item>
                <ant-menu-item style="font-size: 12px;" @click="goFollowerPage">
                  <UserOutlined/>
                  关注我的人
                </ant-menu-item>
                <ant-menu-item style="font-size: 12px;" @click="goPLanListPage">
                  <ScheduleOutlined/>
                  我的计划
                </ant-menu-item>
                <ant-menu-item style="font-size: 12px;" @click="goUserEditPage">
                  <SettingOutlined/>
                  设置
                </ant-menu-item>
                <ant-menu-item style="font-size: 12px;" @click="signOut">
                  <PoweroffOutlined/>
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
  computed, defineComponent
} from 'vue';
import { useRouter } from 'vue-router';
import {
  Avatar, Dropdown, Menu, Button, Input
} from 'ant-design-vue';
import {
  FireOutlined, BookOutlined, ReadOutlined, DownOutlined, SettingOutlined,
  ScheduleOutlined, StarOutlined, BellOutlined, UserOutlined, AimOutlined, PoweroffOutlined,
  PlusCircleOutlined
} from '@ant-design/icons-vue';
import { MutationEnum, useStore } from '@/store';
import { searchData } from './metegraph.header';

export default defineComponent({
  name: 'metagraph-header',
  components: {
    BellOutlined,
    UserOutlined,
    AimOutlined,
    PlusCircleOutlined,
    SettingOutlined,
    ScheduleOutlined,
    PoweroffOutlined,
    StarOutlined,
    AntDropdown: Dropdown,
    AntAvatar: Avatar,
    AntMenu: Menu,
    AntMenuItem: Menu.Item,
    AntButton: Button,
    AntInputSearch: Input.Search,
    FireOutlined,
    BookOutlined,
    ReadOutlined,
    DownOutlined
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const isLogin = computed(() => store.state.user.isLogin);
    const userModel = computed(() => store.state.user.user);
    const token = computed(() => store.state.user.token);
    const goSignInPage = async () => {
      router.push('/login')
        .then();
    };
    const goInspirationPage = async () => {
      router.push('/inspiration')
        .then();
    };
    const goCreateRepoPage = async () => {
      router.push('/repository/edit')
        .then();
    };
    const goUserEditPage = async () => {
      if (userModel.value === undefined) return;
      router.push({
        path: '/settings/profile',
        params: {
          userId: userModel.value.id
        }
      })
        .then();
    };
    const goKnowledgeMap = async () => {
      router.push('/knowledge/map')
        .then();
    };
    const goStarPage = async () => {
      if (userModel.value === undefined) return;
      router.push({
        path: '/profile',
        query: {
          id: userModel.value.id,
          tabKey: '3'
        }
      })
        .then();
    };

    const goRepositoryPage = async () => {
      if (userModel.value === undefined) return;
      router.push({
        path: '/profile',
        query: {
          id: userModel.value.id,
          tabKey: '2'
        }
      })
        .then();
    };

    const goFollowedPage = async () => {
      if (userModel.value === undefined) return;
      router.push({
        path: '/profile',
        query: {
          id: userModel.value.id,
          tabKey: '4'
        }
      })
        .then();
    };

    const goFollowerPage = async () => {
      if (userModel.value === undefined) return;
      router.push({
        path: '/profile',
        query: {
          id: userModel.value.id,
          tabKey: '5'
        }
      })
        .then();
    };
    const goSignUpPage = async () => {
      router.push('/signup')
        .then();
    };
    const goHomePage = async () => {
      router.push('/')
        .then();
      searchData.value.text = '';
      searchData.value.type = '';
      searchData.value.activeIndex = 0;
    };
    const handleSearch = async (event: string) => {
      searchData.value.text = event;
      router.push({
        path: '/repository/list',
        query: {
          name: event ?? '',
          type: searchData.value.type
        },
        replace: true
      })
        .then();
    };
    const signOut = async () => {
      store.commit(MutationEnum.CLEAR_USER_MODEL);
      router.push({
        name: 'Login'
      })
        .then();
    };

    const goPLanListPage = async () => {
      router.push({
        path: '/planList',
      })
        .then();
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
      goInspirationPage,
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
@import "../../style/common.scss";
@import url('https://fonts.googleapis.com/css2?family=Comforter&family=Noto+Sans+SC:wght@300;400&display=swap');

.menu-item-style {
  font-size: $iconFontSize;
}

.metagraph-header {
  width: 100%;
  //background: #24292e;
  //background: $headerBackgroundColor;
  background: #FFF;
  border-bottom: 1px solid $borderColor;
  height: 56px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;

  .left {
    display: flex;
    align-items: center;

    @media screen and (max-width: 1920px) {
      .logo-container {
        display: flex;
        justify-content: flex-start;
        gap: 8px;
        width: calc(265px - 24px);
      }
    }
    @media screen and (min-width: 1920px) {
      .logo-container {
        display: flex;
        justify-content: flex-start;
        gap: 8px;
        width: calc(285px - 24px);
      }
    }

    .logo {
      cursor: pointer;
    }

    .logo-name {
      font-family: 'Comforter', cursive;
      font-size: 20px;
      cursor: pointer
    }

    .input-search-style {
      width: 260px;
      margin-left: 60px;
      margin-right: 20px;
    }

    .banner-list {
      padding: 0 12px;
      display: flex;
      gap: 5px;

      .text-button {
        font-weight: 600;
        padding: 5px 10px;
        cursor: pointer;
        border-radius: 4px;

        &:hover {
          background: $hoverBackColor;
        }
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

    .create-btn {
      padding: 5px;
      font-size: 14px;
      margin-right: 10px;
      line-height: 22px;
      cursor: pointer;
      display: flex;
      align-items: center;

      &:hover {
        border-radius: 4px;
        //background: $contentBackgroundColor;
        background: #eff0f0;;
      }
    }

    .notify {
      padding: 5px;
      margin-right: 15px;
      cursor: pointer;

      &:hover {
        border-radius: 4px;
        //background: $contentBackgroundColor;
        background: #eff0f0;
      }
    }

    .avatar-dropdown {
      line-height: 32px;
      font-size: 16px;
      cursor: pointer;
    }
  }

  .search {
    height: 30px;
    width: 272px;
  }
}
</style>
