<template>
  <div class="home">
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
    console.log(process.env.VUE_APP_TITLE);
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

.home {
  height: calc(100vh - 55px);
  width: 100%;
  background: #f6f8fa;
  display: flex;

  .aside {
    width: 330px;
  }

  .content {
    flex: 1;
    min-width: 500px;
    height: calc(100vh - 55px);
    overflow: scroll;
  }

  .explore {
    width: 300px;
  }
}
</style>
