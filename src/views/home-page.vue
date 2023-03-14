<template>
  <div class="home-page">
    <div class="aside" v-if="isLogin" id="step1" data-homepage="1">
      <left-aside-list data-title="Welcome!" data-intro="Hello World! 👋"></left-aside-list>
    </div>
    <div class="right-side" id="step4" data-homepage="4">
      <div class="container">
        <div class="content authed-list-content">
          <div class="list-content">
            <authed-main-list  v-if="isLogin"></authed-main-list>
            <no-auth-main-list v-else></no-auth-main-list>
            <div class="icp-message">
              <a href="https://beian.miit.gov.cn/">京ICP备20020548号-3</a>
            </div>
          </div>
          <hot-list></hot-list>
        </div>
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
  getHotList,
  getOwnRepositoryList,
  getRepositoryList
} from '@/views/home-page/home.page';
import { useStore } from '@/store';
import NoAuthMainList from '@/views/home-page/no-auth-main-list.vue';
import AuthedMainList from '@/views/home-page/authed-main-list.vue';
import { LeftAsideList, HotList } from './home-page/index';

const store = useStore();
const isLogin = computed(() => store.state.user.isLogin);
onMounted(async () => {
  if (isLogin.value) {
    await Promise.all([
      getHotList(),
      getOwnRepositoryList(),
      getActivityList()
    ]);
    await nextTick(() => {
      guide({
        type: 'homepage'
      });
    });
  } else {
    await Promise.all([
      getHotList(),
      getRepositoryList()
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

    .container {
      width: 100%;

      .content {
        margin: 0 auto;
        width: max-content;
        display: flex;
        padding-top: 30px;
        .list-content {

        }
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
