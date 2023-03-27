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
          @click="goKnowledgeMap">知识地图
        </div>
        <div
          class="text-button"
          @click="goPLanListPage">学习计划
        </div>
        <div
          class="text-button" @click="goInspirationPage">灵感
        </div>
        <div
          class="text-button" @click="goFeedbackPage">反馈
        </div>
        <div
          class="text-button" @click="goHelpPage">帮助
        </div>
      </div>
    </div>
    <div class="right">
      <ant-dropdown v-if="isLogin" :placement="'bottomRight'" :trigger="['click']">
        <div class="create-btn">
          <PlusOutlined class="icon-size" style="margin-right: 3px;"/>
        </div>
        <template #overlay>
          <ant-menu style="width: 160px; padding: 8px;">
            <ant-menu-item @click="goCreateRepoPage" class="menu-item-style">
              <BookOutlined class="icon-size"/>
              新建知识库
            </ant-menu-item>
            <ant-menu-item class="menu-item-style">
              <ReadOutlined class="icon-size"/>
              新建知识点
            </ant-menu-item>
            <ant-menu-item class="menu-item-style">
              <FireOutlined class="icon-size"/>
              新建灵感
            </ant-menu-item>
          </ant-menu>
        </template>
      </ant-dropdown>
      <div class="notify" v-if="isLogin">
        <BellOutlined class="icon-size"/>
      </div>
      <div class="login-status">
        <div class="no-login" v-if="!isLogin">
          <m-button :title="'注 册'" @click="goSignUpPage"></m-button>
          <m-button :title="'登 录'" @click="goSignInPage"></m-button>
        </div>
        <div class="has-login" v-else>
          <ant-dropdown>
            <div class="avatar-dropdown">
              <ant-avatar :src="userModel.avatar"></ant-avatar>
              <DownOutlined style="margin-left: 4px;"/>
            </div>
            <template #overlay>
              <ant-menu style="width: 160px">
                <ant-menu-item class="menu-item-style" @click="goRepositoryPage">
                  <BookOutlined/>
                  我的知识库
                </ant-menu-item>
                <ant-menu-item class="menu-item-style" @click="goStarPage">
                  <StarOutlined/>
                  我赞过的
                </ant-menu-item>
                <ant-menu-item class="menu-item-style" @click="goFollowedPage">
                  <AimOutlined/>
                  我关注的人
                </ant-menu-item>
                <ant-menu-item class="menu-item-style" @click="goFollowerPage">
                  <UserOutlined/>
                  关注我的人
                </ant-menu-item>
                <ant-menu-item class="menu-item-style" @click="goPLanListPage">
                  <ScheduleOutlined/>
                  我的计划
                </ant-menu-item>
                <ant-menu-item class="menu-item-style" @click="goUserEditPage">
                  <SettingOutlined/>
                  设置
                </ant-menu-item>
                <ant-menu-item class="menu-item-style" @click="signOut">
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

<script lang="ts" setup>
import {
  computed
} from 'vue';
import { useRouter } from 'vue-router';
import {
  Avatar as AntAvatar,
  Dropdown as AntDropdown,
  Menu as AntMenu,
  Button as AntButton,
  Input as AntInput
} from 'ant-design-vue';
import { MButton } from '@/metagraph-ui';
import {
  FireOutlined, BookOutlined, ReadOutlined, DownOutlined, SettingOutlined,
  ScheduleOutlined, StarOutlined, BellOutlined, UserOutlined, AimOutlined, PoweroffOutlined,
  PlusOutlined
} from '@ant-design/icons-vue';
import { MutationEnum, useStore } from '@/store';
import { searchData } from './metegraph.header';
import { RouterUtil } from '@/utils/router.util';

const AntMenuItem = AntMenu.Item;
const AntInputSearch = AntInput.Search;
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
  await RouterUtil.jumpTo('/profile', {
    id: userModel.value.id,
    tabKey: '3'
  });
};

const goRepositoryPage = async () => {
  if (userModel.value === undefined) return;
  await RouterUtil.jumpTo('/profile', {
    id: userModel.value.id,
    tabKey: '2'
  });
};

const goFollowedPage = async () => {
  if (userModel.value === undefined) return;
  await RouterUtil.jumpTo('/profile', {
    id: userModel.value.id,
    tabKey: '4'
  });
};

const goFollowerPage = async () => {
  if (userModel.value === undefined) return;
  await RouterUtil.jumpTo('/profile', {
    id: userModel.value.id,
    tabKey: '5'
  });
};
const goSignUpPage = async () => {
  await RouterUtil.jumpTo('/signup');
};
const goHomePage = async () => {
  await RouterUtil.jumpTo('/');
  searchData.value.text = '';
  searchData.value.type = '';
  searchData.value.activeIndex = 0;
  searchData.value.pageSize = 10;
  searchData.value.pageIndex = 1;
};
const handleSearch = async (event: string) => {
  searchData.value.text = event;
  searchData.value.pageSize = 10;
  searchData.value.pageIndex = 1;
  await RouterUtil.replaceTo('/search/list', {
    name: event ?? '',
    type: searchData.value.type,
    pageSize: searchData.value.pageSize,
    pageIndex: searchData.value.pageIndex
  });
};
const signOut = async () => {
  store.commit(MutationEnum.CLEAR_USER_MODEL);
  await RouterUtil.jumpTo('/login');
};

async function goPLanListPage() {
  await RouterUtil.jumpTo('/plan/list');
}

async function goFeedbackPage() {
  await RouterUtil.jumpTo('/feedback');
}

async function goHelpPage() {
  await RouterUtil.jumpTo('/help');
}

</script>
<style lang="scss">
@import "../../style/common.scss";

.icon-size {
  font-size: 16px !important;
}

.menu-item-style {
  font-size: $iconFontSize;
  height: 36px;
  line-height: 36px;
  padding: 5px 10px !important;
  border-radius: 6px !important;
}

.ant-dropdown-menu-title-content {
  height: 100% !important;
  width: 100% !important;
  display: flex !important;
  align-items: center;
  font-size: 14px;
}
</style>

<style scoped lang="scss">
@import "../../style/common.scss";
@import url('https://fonts.googleapis.com/css2?family=Comforter&family=Noto+Sans+SC:wght@300;400&display=swap');

.metagraph-header {
  width: 100%;
  background: #FFF;
  border-bottom: 1px solid $borderColor;
  height: 56px;
  padding: 0 24px 0 12px;
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
      padding: 5px 10px;
      font-size: 14px;
      margin-right: 10px;
      line-height: 22px;
      cursor: pointer;
      display: flex;
      align-items: center;

      &:hover {
        border-radius: 4px;
        background: $hoverBackColor;
      }
    }

    .notify {
      padding: 5px 10px;
      margin-right: 15px;
      cursor: pointer;

      &:hover {
        border-radius: 4px;
        background: $hoverBackColor;
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
