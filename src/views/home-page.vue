<template>
  <div class="home">
    <div class="aside" v-if="isLogin">
      <home-aside></home-aside>
    </div>
    <div class="content">
      <home-main></home-main>
    </div>
    <div class="explore">
      <home-explore></home-explore>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from '@/store';
import HomeAside from './home-page/home.aside.vue';
import HomeMain from './home-page/home.main.vue';
import HomeExplore from './home-page/home.explore.vue';

export default defineComponent({
  name: 'HomePage',
  components: {
    HomeAside,
    HomeMain,
    HomeExplore
  },
  setup() {
    const store = useStore();
    const isLogin = computed(() => store.state.user.isLogin);
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
