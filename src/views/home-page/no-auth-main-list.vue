<template>
  <div class="no-auth-list">
    <repository-list-item
      :key="index"
      :repository="item"
      v-for="(item, index) in repositoryList.list"></repository-list-item>
    <div v-if="!repositoryList.list.length">
      <ant-skeleton v-for="item in 10" :key="item" active/>
    </div>
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
import { Pagination as AntPagination, Skeleton as AntSkeleton } from 'ant-design-vue';
import { RepositoryListItem } from '@/github.style.component';
import { useStore } from '@/store';

import { getRepositoryList, repositoryList } from '@/views/home-page/home.page';

const store = useStore();
const isLogin = computed(() => store.state.user.isLogin);

async function onRepositoryPaginationChange(page: number) {
  await getRepositoryList(page);
}
</script>

<style scoped lang="scss">
.no-auth-list {
  width: 1000px;
}

.pagination {
  margin-top: 50px;
  width: 100%;
}
</style>
