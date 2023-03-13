<template>
  <div class="no-auth-list">
    <repository-list-item
      :key="index"
      :repository="item"
      v-for="(item, index) in repositoryList.list"></repository-list-item>
    <ant-pagination
      v-if="!isLogin"
      class="pagination"
      :pageSize="10"
      v-model:current="repositoryList.current"
      :total="repositoryList.total"
      @change="onRepositoryPaginationChange"/>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { Pagination as AntPagination } from 'ant-design-vue';
import { RepositoryListItem } from '@/github.style.component';
import { useStore } from '@/store';

import { HomePage, repositoryList } from '@/views/home-page/home.page';

const store = useStore();
const homePage = new HomePage();
const isLogin = computed(() => store.state.user.isLogin);

async function onRepositoryPaginationChange(page: number) {
  await homePage.getRepositoryList(page);
}
</script>

<style scoped lang="scss">
.no-auth-list {
  width: 100%;
  min-width: 1000px;
  max-width: 1100px;
  margin: 16px auto 0;
}
.pagination {
  margin-top: 50px;
  width: 100%;
}
</style>
