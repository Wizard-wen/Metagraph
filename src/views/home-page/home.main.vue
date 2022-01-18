<template>
  <ant-spin :spinning="repositoryList.isLoading">
    <div class="home-main">
      <div class="content">
        <repository-item
          :repository="item"
          v-for="item in repositoryList.list"></repository-item>
      </div>
      <ant-pagination
        class="pagination"
        v-model:current="repositoryList.current"
        :total="repositoryList.total"
        @change="onPaginationChange"/>
    </div>
  </ant-spin>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue';
import { HomePage, repositoryList } from '@/views/home-page/home.page';

import RepositoryItem from './main/repository.item.vue';

export default defineComponent({
  name: 'home-main',
  components: {
    RepositoryItem,
  },
  setup() {
    const homePage = new HomePage();
    const onPaginationChange = async (page: number) => {
      await homePage.getRepositoryList(page);
    };
    return {
      repositoryList,
      onPaginationChange,
    };
  }
});
</script>

<style scoped lang="scss">
.home-main {
  padding: 0 32px;
  margin-top: 16px;
  margin-bottom: 150px;

  .content {
    width: 100%;
    max-width: 1400px;
    margin: 50px auto 50px;
  }

  .pagination {
    width: 100%;
  }
}
</style>
