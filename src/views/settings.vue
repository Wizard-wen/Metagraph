<template>
  <div class="settings">
    <div class="headers">
      <div class="icons">
        <img
          v-if="user.target.avatar"
          :src="user.target.avatar"
          class="image-border-radius" height="48" width="48" alt="">
      </div>
      <div class="user">
        <div class="user-name">{{ user.target.name }}</div>
        <div class="user-type">您的个人帐户</div>
      </div>
    </div>
    <div class="profile">
      <div class="left">
        <router-menu-list
          :type="'router'"
          :title="'账户设置'"
          :nav-list="routerList"></router-menu-list>
      </div>
      <div class="right">
        <router-view/>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import {
  defineComponent, onMounted, reactive, computed
} from 'vue';
import { Settings } from '@/views/settings/settings';
import { useStore } from '@/store';
import RouterMenuList from '@/github.style.component/router-menu-list/router-menu-list.vue';

export default defineComponent({
  name: 'Settings',
  components: {
    RouterMenuList
  },
  setup() {
    const store = useStore();
    const user = reactive<{
      target: {
        id: string;
        name: string;
        avatar: string;
        token: string;
        userType: 'personal' | 'organization'
      }
    }>({
      target: {
        id: '',
        avatar: '',
        name: '',
        token: '',
        userType: 'personal'
      }
    });
    const routerList = reactive([
      {
        path: '/settings/profile',
        name: '用户信息'
      },
      {
        path: '/settings/bindEmail',
        name: '绑定邮箱'
      },
      {
        path: '/settings/security',
        name: '更改密码'
      }
    ]);
    const userModel = computed(() => store.state.user.user);
    const settings = new Settings();
    onMounted(async () => {
      if (userModel.value) {
        user.target = userModel.value;
      }
      await settings.getUserModel();
    });
    return {
      user,
      routerList
    };
  }
});
</script>

<style scoped lang="scss">
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

  .image-border-radius {
    border-radius: 50%;
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

  .left {
    width: 25%;
  }

  .right {
    flex: 1;
    padding-bottom: 50px;
  }
}
</style>
