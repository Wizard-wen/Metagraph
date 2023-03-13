<template>
  <div class="home-main">
    <div class="content">
      <template v-if="isLogin">
        <authed-main-list></authed-main-list>
      </template>
      <template v-else>
        <no-auth-main-list></no-auth-main-list>
      </template>
    </div>
    <div class="icp-message" style="height: 100px;line-height: 100px;">
      <a href="https://beian.miit.gov.cn/">京ICP备20020548号-3</a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from '@/store';
import NoAuthMainList from '@/views/home-page/no-auth-main-list.vue';
import AuthedMainList from '@/views/home-page/authed-main-list.vue';

const store = useStore();
const isLogin = computed(() => store.state.user.isLogin);
</script>

<style scoped lang="scss">
.home-main {
  padding: 0 32px;
  margin-top: 16px;
  margin-bottom: 50px;

  .content {
    width: 100%;
    max-width: 1400px;
    margin: 16px auto 0;

    .activity-title {
      text-align: left;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: #242930;
    }
  }

  .pagination {
    margin-top: 50px;
    width: 100%;
  }

  .icp-message {
    height: 100px;
    line-height: 100px;

    a {
      font-size: 12px;
      color: #a9a9a9;
    }
  }
}
</style>
