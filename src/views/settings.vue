<template>
  <div class="settings">
    <div class="headers">
      <div class="icons">
        <img
          v-if="user.avatar"
          :src="user.avatar"
          class="image-border-radius" height="48" width="48" alt="">
      </div>
      <div class="user">
        <div class="user-name">{{ user.name }}</div>
        <div class="user-type">Your personal account</div>
      </div>
    </div>
    <div class="profile">
      <div class="left">
        <router-menu-list
          :type="'router'"
          :title="'Account Settings'"
          :nav-list="routerList"></router-menu-list>
      </div>
      <div class="right">
        <router-view/>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import RouterMenuList from '@/github.style.component/router-menu-list/router-menu-list.vue';

export default defineComponent({
  name: 'Settings',
  components: {
    RouterMenuList
  },
  setup() {
    const user = ref({
      id: '',
      avatar: '',
      name: '',
      token: '',
      userType: ''
    });
    const routerList = ref([
      { path: '/settings/profile', name: 'Profile' },
      { path: '/settings/account', name: 'Account' },
      { path: '/settings/security', name: 'Account security' }
    ]);
    onMounted(() => {
      console.log(localStorage.getItem('user'));
      user.value = JSON.parse(localStorage.getItem('user')!);
      console.log(user);
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
  }
}
</style>
