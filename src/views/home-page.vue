<template>
  <div class="home">
    <div class="aside" v-if="isLogin">
      <home-page-aside></home-page-aside>
    </div>
    <div class="content">
      <home-page-main-list></home-page-main-list>
    </div>
    <div class="explore">
      <home-page-hot-list></home-page-hot-list>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
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
    if (isLogin.value) {
      Promise.all([
        homePage.getHotList(),
        homePage.getOwnRepositoryList(),
        // homePage.getRepositoryList(),
        homePage.getActivityList()
      ]);
    } else {
      Promise.all([
        homePage.getHotList(),
        homePage.getRepositoryList()
      ]);
    }
    return {
      isLogin
    };
  }
});
</script>
<style scoped lang="scss">
.home {
  height: calc(100vh - 62px);
  width: 100%;
  background: #f6f8fa;
  display: flex;

  .aside {
    width: 300px;
  }

  .content {
    flex: 1;
    min-width: 500px;
    height: calc(100vh - 62px);
    overflow: scroll;
  }

  .explore {
    width: 300px;
  }
}
</style>
