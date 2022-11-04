<template>
  <div class="home-page">
    <div class="aside" v-if="isLogin" id="step1" data-homepage="1">
      <home-page-aside data-title="Welcome!" data-intro="Hello World! 👋"></home-page-aside>
    </div>
    <div class="content" id="step4" data-homepage="4">
      <home-page-main-list></home-page-main-list>
    </div>
    <div class="explore">
      <home-page-hot-list></home-page-hot-list>
    </div>
  </div>
</template>

<script lang="ts">
import 'intro.js/introjs.css';
import {
  computed, defineComponent, onMounted, nextTick
} from 'vue';
import { guide } from '@/utils/guide.util';
import { HomePage } from '@/views/home-page/home.page';
import { useStore } from '@/store';
import { HomePageMainList, HomePageHotList, HomePageAside } from './home-page/index';

export default defineComponent({
  name: 'HomePage',
  components: {
    HomePageMainList,
    HomePageHotList,
    HomePageAside
  },
  setup() {
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
    return {
      isLogin
    };
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

  .content {
    flex: 1;
    min-width: 500px;
    height: calc(100vh - 56px);
    overflow-y: scroll;
  }

  .explore {
    width: 300px;
  }
}
</style>
