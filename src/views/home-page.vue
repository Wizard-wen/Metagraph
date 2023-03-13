<template>
  <div class="home-page">
    <div class="aside" v-if="isLogin" id="step1" data-homepage="1">
      <home-page-aside data-title="Welcome!" data-intro="Hello World! 👋"></home-page-aside>
    </div>
    <div class="right-side" id="step4" data-homepage="4">
      <div class="list-container">
        <div class="list-content authed-list-content" v-if="isLogin">
          <authed-main-list></authed-main-list>
          <home-page-hot-list></home-page-hot-list>
        </div>
        <div class="list-content no-auth-list-content" v-else>
          <no-auth-main-list></no-auth-main-list>
          <home-page-hot-list></home-page-hot-list>
        </div>
        <div class="icp-message" style="height: 100px;line-height: 100px;">
          <a href="https://beian.miit.gov.cn/">京ICP备20020548号-3</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'intro.js/introjs.css';
import { computed, nextTick, onMounted } from 'vue';
import { guide } from '@/utils/guide.util';
import { HomePage } from '@/views/home-page/home.page';
import { useStore } from '@/store';
import { HomePageAside, HomePageHotList } from './home-page/index';
import NoAuthMainList from '@/views/home-page/no-auth-main-list.vue';
import AuthedMainList from '@/views/home-page/authed-main-list.vue';

const store = useStore();
const homePage = new HomePage();
const isLogin = computed(() => store.state.user.isLogin);
onMounted(async () => {
  if (isLogin.value) {
    await Promise.all([
      homePage.getHotList(),
      homePage.getOwnRepositoryList(),
      homePage.getActivityList()
    ]);
    await nextTick(() => {
      guide({
        type: 'homepage'
      });
    });
  } else {
    await Promise.all([
      homePage.getHotList(),
      homePage.getRepositoryList()
    ]);
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

    .list-container {
      width: 100%;

      .list-content {
        display: flex;
      }

      .authed-list-content {

      }

      .no-auth-list-content {

      }
    }
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
