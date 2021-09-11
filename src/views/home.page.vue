<template>
  <div class="home">
    <div class="aside">
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
import { ActionEnum, useStore } from '@/store';
import { defineComponent, onMounted } from 'vue';
import HomeAside from './home/home.aside.vue';
import HomeMain from './home/home.main.vue';
import HomeExplore from './home/home.explore.vue';

export default defineComponent({
  name: 'HomePage',
  components: {
    HomeAside,
    HomeMain,
    HomeExplore
  },
  setup() {
    const store = useStore();
    onMounted(() => {
      store.dispatch(ActionEnum.GET_REPOSITORY_LIST);
      store.dispatch(ActionEnum.GET_OWN_REPOSITORY_LIST);
    });
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
    width: 350px;
  }

  .content {
    width: calc(100% - 700px);
  }

  .explore {
    width: 350px;
  }
}
</style>
