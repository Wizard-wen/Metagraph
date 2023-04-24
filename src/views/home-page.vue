<template>
  <div class="home-page" v-if="isLogin">
    <div class="aside" id="step1" data-homepage="1">
      <aside-list data-title="Welcome!" data-intro="Hello World! 👋"></aside-list>
    </div>
    <div class="right-side" >
      <div class="container">
        <div class="content authed-list-content">
          <div class="list-content" id="step4" data-homepage="4">
            <authed-main-list></authed-main-list>
            <ipc-message></ipc-message>
          </div>
          <hot-list></hot-list>
        </div>
      </div>
    </div>
  </div>
  <div class="home-page" v-else>
    <div class="no-auth-side">
      <div class="container">
        <div class="list-content">
          <no-auth-main-list></no-auth-main-list>
          <ipc-message></ipc-message>
        </div>
        <hot-list></hot-list>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'intro.js/introjs.css';
import { computed, nextTick, onMounted } from 'vue';
import { guide } from '@/utils/guide.util';
import {
  getActivityList,
  getOwnRepositoryList
} from '@/views/home-page/home-page-model';
import { useStore } from '@/store';
import NoAuthMainList from '@/views/home-page/no-auth-main-list.vue';
import AuthedMainList from '@/views/home-page/authed-main-list.vue';
import IpcMessage from '@/views/home-page/ipc-message.vue';
import { AsideList, HotList } from './home-page/index';

const store = useStore();
const isLogin = computed(() => store.state.user.isLogin);
onMounted(async () => {
  if (isLogin.value) {
    await Promise.all([
      getOwnRepositoryList(),
      getActivityList()
    ]);
    await nextTick(() => {
      guide({
        type: 'homepage'
      });
    });
  }
});
</script>
<style scoped lang="scss">
@import "../style/intro.custom.css";
@import "../style/common.scss";

.home-page {
  height: calc(100vh - 56px);
  width: 100%;
  background: $contentBackgroundColor;
  display: flex;

  @media screen and (max-width: 1920px) {
    .aside {
      width: 265px;
      border-right: 1px solid $borderColor;
    }
  }
  @media screen and (min-width: 1920px) {
    .aside {
      width: 285px;
      border-right: 1px solid $borderColor;
    }
  }

  .right-side {
    flex: 1;
    height: calc(100vh - 56px);
    overflow-y: scroll;
    @include custom-scroll-style;
  }

  .no-auth-side {
    width: 100%;
    height: calc(100vh - 56px);
    overflow-y: scroll;

    .container {
      width: 1350px;
      margin: 0 auto;
      display: flex;
      .list-content {
        margin-right: 30px;
      }
    }
  }

  .container {
    width: 100%;

    .content {
      margin: 0 auto;
      width: 100%;
      display: flex;
      padding: 30px 20px 0 20px;

      .list-content {
        width: 100%;
      }
    }

    .authed-list-content {

    }

    .no-auth-list-content {
      width: 1440px;
      justify-content: space-around;
    }

  }

}
</style>
