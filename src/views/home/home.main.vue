<template>
  <div class="home-main">
    <div class="content">
      <repository-item :repository="item" v-for="item in repositoryList"></repository-item>
    </div>
  </div>
</template>

<script lang="ts">
import { ActionEnum, useStore } from '@/store';
import {
  defineComponent, onMounted, computed, ref
} from 'vue';
import RepositoryItem from '../../components/repository.item.vue';
import RepoList from '../repository/repository.list/repo.list.vue';

export default defineComponent({
  name: 'home-main',
  components: {
    RepositoryItem,
    RepoList
  },
  setup() {
    const store = useStore();
    const current = ref(3);
    const repositoryList = computed(() => store.state.repositoryList.repositoryList);
    const total = computed(() => store.state.repositoryList.repositoryListTotal);
    return {
      repositoryList,
      total,
      current
    };
  }
});
</script>

<style scoped lang="scss">
.home-main {
  padding: 0 32px;
  margin-top: 16px;

  .content {
    width: 100%;
    max-width: 1400px;
    //display: flex;
    margin: 0 auto;
  }
}
</style>
