<template>
  <div class="metagraph-header">
    <div class="left">
      <div class="logo-container">
        <img
          @click="goHomePage"
          class="logo"
          src="@/assets/logo-header.png"
          height="32"
          alt="logo"/>
      </div>
      <ant-input
        class="input-search-style"
        :allowClear="true"
        v-model:value="searchData.text"
        placeholder="请输入搜索内容..."
        @pressEnter="handleSearch">
        <template #suffix>
          <search-outlined @click="handleSearch"/>
        </template>
      </ant-input>
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
      <ant-dropdown v-if="isLogin" :placement="'bottomRight'">
        <m-button :is-icon="true" :size="'large'" :has-border="false">
          <template #icon>
            <PlusOutlined/>
          </template>
        </m-button>
        <template #overlay>
          <ant-menu class="dropdown-menu-style">
            <ant-menu-item class="menu-item-style" @click="goCreateRepoPage">
              <BookOutlined class="icon-size"/>
              新建知识库
            </ant-menu-item>
            <ant-menu-item class="menu-item-style" @click="goCreateSectionPage">
              <ReadOutlined class="icon-size"/>
              新建文档
            </ant-menu-item>
            <ant-menu-item class="menu-item-style" @click="goCreateKnowledgePage">
              <ReadOutlined class="icon-size"/>
              新建知识点
            </ant-menu-item>
            <ant-menu-item class="menu-item-style" @click="goCreateInspirationPage">
              <FireOutlined class="icon-size"/>
              新建灵感
            </ant-menu-item>
          </ant-menu>
        </template>
      </ant-dropdown>
      <create-section-modal
        v-if="isCreateSectionModalShow"
        @close="isCreateSectionModalShow = false"
        :is-modal-visible="isCreateSectionModalShow"></create-section-modal>
      <create-knowledge-modal
        v-if="isCreateKnowledgeModalShow"
        @close="isCreateKnowledgeModalShow = false"
        :is-modal-visible="isCreateKnowledgeModalShow"></create-knowledge-modal>
      <div class="notify" v-if="isLogin">
        <m-button :is-icon="true" :size="'large'" :has-border="false">
          <template #icon>
            <BellOutlined/>
          </template>
        </m-button>
      </div>
      <div class="login-status">
        <div class="no-login" v-if="!isLogin">
          <m-button :title="'注 册'" @click="goSignUpPage"></m-button>
          <m-button :title="'登 录'" @click="goSignInPage"></m-button>
        </div>
        <div class="has-login" v-else>
          <ant-dropdown :placement="'bottomRight'">
            <div class="avatar-dropdown">
              <ant-avatar v-if="userModel.avatar" :src="userModel.avatar"></ant-avatar>
              <ant-avatar v-else>{{ textAvatar }}</ant-avatar>
              <DownOutlined style="margin-left: 4px;"/>
            </div>
            <template #overlay>
              <ant-menu class="dropdown-menu-style">
                <ant-menu-item class="menu-item-style" @click="goRepositoryPage">
                  <BookOutlined class="icon-size"/>
                  我的知识库
                </ant-menu-item>
                <ant-menu-item class="menu-item-style" @click="goStarPage">
                  <StarOutlined class="icon-size"/>
                  我赞过的
                </ant-menu-item>
                <ant-menu-item class="menu-item-style" @click="goFollowedPage">
                  <AimOutlined class="icon-size"/>
                  我关注的人
                </ant-menu-item>
                <ant-menu-item class="menu-item-style" @click="goFollowerPage">
                  <UserOutlined class="icon-size"/>
                  关注我的人
                </ant-menu-item>
                <ant-menu-item class="menu-item-style" @click="goPLanListPage">
                  <ScheduleOutlined class="icon-size"/>
                  我的计划
                </ant-menu-item>
                <ant-menu-item class="menu-item-style" @click="goFilePanelPage">
                  <FileOutlined class="icon-size"/>
                  文件面板
                </ant-menu-item>
                <ant-menu-item class="menu-item-style" @click="goUserEditPage">
                  <SettingOutlined class="icon-size"/>
                  设置
                </ant-menu-item>
                <ant-menu-item class="menu-item-style" @click="signOut">
                  <PoweroffOutlined class="icon-size"/>
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
import { computed, ref } from 'vue';
import {
  Avatar as AntAvatar,
  Dropdown as AntDropdown,
  Input as AntInput,
  Menu as AntMenu,
  message
} from 'ant-design-vue';
import { MButton } from '@/metagraph-ui';
import {
  AimOutlined,
  BellOutlined,
  BookOutlined,
  DownOutlined,
  FileOutlined,
  FireOutlined,
  PlusOutlined,
  PoweroffOutlined,
  ReadOutlined,
  ScheduleOutlined,
  SearchOutlined,
  SettingOutlined,
  StarOutlined,
  UserOutlined
} from '@ant-design/icons-vue';
import { MutationEnum, useStore } from '@/store';
import { RouterUtil } from '@/utils/router.util';
import CreateSectionModal from '@/views/main/metagraph-header/create-section-modal.vue';
import { searchData } from './metegraph.header';
import CreateKnowledgeModal from '@/views/main/metagraph-header/create-knowledge-modal.vue';

const AntMenuItem = AntMenu.Item;
const AntInputSearch = AntInput.Search;
const store = useStore();
const isLogin = computed(() => store.state.user.isLogin);
const userModel = computed(() => store.state.user.user);

const textAvatar = computed(() => userModel.value?.name.charAt(0) ?? 'M');
const isCreateSectionModalShow = ref(false);
const isCreateKnowledgeModalShow = ref(false);

async function goSignInPage() {
  await RouterUtil.jumpTo('/login');
}

async function goInspirationPage() {
  await RouterUtil.jumpTo('/inspiration');
}

async function goCreateRepoPage() {
  await RouterUtil.jumpTo('/repository/edit');
}

async function goUserEditPage() {
  if (userModel.value === undefined) return;
  await RouterUtil.jumpTo('/settings/profile', {
    userId: userModel.value.id
  });
}

async function goFilePanelPage() {
  await RouterUtil.jumpTo('/file/panel');
}

async function goKnowledgeMap() {
  await RouterUtil.jumpTo('/knowledge/map');
}

function goCreateInspirationPage() {
  message.info('该功能尚未开放，敬请期待！');
}

function goCreateSectionPage() {
  isCreateSectionModalShow.value = true;
}

function goCreateKnowledgePage() {
  isCreateKnowledgeModalShow.value = true;
  message.info('该功能尚未开放，敬请期待！');
}

async function goStarPage() {
  if (userModel.value === undefined) return;
  await RouterUtil.jumpTo('/profile', {
    id: userModel.value.id,
    tabKey: '3'
  });
}

async function goRepositoryPage() {
  if (userModel.value === undefined) return;
  await RouterUtil.jumpTo('/profile', {
    id: userModel.value.id,
    tabKey: '2'
  });
}

async function goFollowedPage() {
  if (userModel.value === undefined) return;
  await RouterUtil.jumpTo('/profile', {
    id: userModel.value.id,
    tabKey: '4'
  });
}

async function goFollowerPage() {
  if (userModel.value === undefined) return;
  await RouterUtil.jumpTo('/profile', {
    id: userModel.value.id,
    tabKey: '5'
  });
}

async function goSignUpPage() {
  await RouterUtil.jumpTo('/signup');
}

async function goHomePage() {
  await RouterUtil.jumpTo('/');
  searchData.value.text = '';
  searchData.value.type = '';
  searchData.value.pageSize = 10;
  searchData.value.pageIndex = 1;
}

async function handleSearch() {
  searchData.value.type = '';
  searchData.value.pageSize = 10;
  searchData.value.pageIndex = 1;
  await RouterUtil.replaceTo('/search/list', {
    name: searchData.value.text,
    type: searchData.value.type,
    pageSize: searchData.value.pageSize,
    pageIndex: searchData.value.pageIndex
  });
}

async function signOut() {
  store.commit(MutationEnum.CLEAR_USER_MODEL);
  await RouterUtil.jumpTo('/login');
}

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
  margin-right: 8px;
}

.dropdown-menu-style {
  width: 160px;
  padding: 8px !important;
}

.menu-item-style {
  font-size: $iconFontSize;
  height: 36px;
  line-height: 36px;
  padding: 5px 10px !important;
  border-radius: 6px !important;

  &:hover {
    background: $hoverBackColor !important;
  }
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

    .logo-container {
      display: flex;
      justify-content: flex-start;
      gap: 8px;
      width: 300px;
    }


    &::v-deep(.ant-input-affix-wrapper-focused) {
      box-shadow: none;
    }

    .logo {
      cursor: pointer;
    }

    .input-search-style {
      width: 260px;
      margin-right: 20px;
      height: 36px;
      border-radius: 6px;
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
