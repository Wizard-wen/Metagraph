<template>
  <div class="settings-page">
    <div class="settings">
      <div class="headers">
        <div class="icons">
          <ant-avatar
            class="image-right" :size="48" v-if="userModel.avatar"
            :src="userModel.avatar"></ant-avatar>
          <ant-avatar
            class="image-right" :size="48" v-else>{{ textAvatar }}
          </ant-avatar>
        </div>
        <div class="user">
          <div class="user-name">{{ userModel.name }}</div>
          <div class="user-type">您的个人帐户</div>
        </div>
      </div>
      <div class="profile">
        <div class="left-side">
          <router-menu-list
            :type="'router'"
            :title="'账户设置'"
            :nav-list="routerList"></router-menu-list>
        </div>
        <div class="right-side">
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from 'vue';
import { Settings } from '@/views/settings/settings';
import { useStore } from '@/store';
import RouterMenuList from '@/github.style.component/router-menu-list/router-menu-list.vue';
import { Avatar as AntAvatar } from 'ant-design-vue';

const store = useStore();
const userModel = computed(() => store.state.user.user);
const textAvatar = computed(() => userModel.value?.name.charAt(0) ?? 'M');

const routerList = reactive([
  {
    value: '/settings/profile',
    name: '用户信息'
  },
  {
    value: '/settings/bindEmail',
    name: '绑定邮箱'
  },
  {
    value: '/settings/security',
    name: '更改密码'
  }
]);

const settings = new Settings();
onMounted(async () => {
  await settings.getUserModel();
});

</script>

<style scoped lang="scss">
@import "../style/common.scss";

.settings-page {
  height: calc(100vh - 55px);
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  @include custom-scroll-style;
}

.settings {
  padding-top: 24px;
  padding-left: 16px;
  padding-right: 16px;
}

.headers {
  width: 980px;
  margin: 4px auto 24px;
  height: 48px;
  text-align: left;
  display: flex;

  .image-right {
    margin-right: 16px;
  }

  .user {
    .user-name {
      line-height: 25px;
      font-size: 20px;
      font-weight: 600;
    }

    .user-type {
      line-height: 21px;
    }
  }
}

.profile {
  margin: 0 auto;
  width: 980px;
  display: flex;

  .left-side {
    width: 245px;
  }

  .right-side {
    flex: 1;
  }
}
</style>
