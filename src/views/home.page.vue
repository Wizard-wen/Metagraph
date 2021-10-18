<template>
  <div class="home">
    <div class="aside" v-if="isToken">
      <home-aside></home-aside>
    </div>
    <div class="content">
      <home-main></home-main>
    </div>
    <div class="explore" v-hide>
      <home-explore></home-explore>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
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
    const isToken = ref(false);
    onMounted(() => {
      const user = localStorage.getItem('user');
      if (user) {
        isToken.value = true;
      }
    });

    return {
      isToken
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
    width: 350px;
  }

  .content {
    flex: 1;
    min-width: 500px;
    height: calc(100vh - 62px);
    overflow: scroll;
  }

  .explore {
    width: 350px;
  }
}
</style>
