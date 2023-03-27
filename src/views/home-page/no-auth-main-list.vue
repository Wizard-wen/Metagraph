<template>
  <div class="no-auth-list">
    <div class="activity-title">推荐知识库</div>
    <repository-view-item
      :key="index"
      v-for="(item, index) in repositoryList.list"
      :activity-item="item"></repository-view-item>
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
import { useStore } from '@/store';

import { getRepositoryList, repositoryList } from '@/views/home-page/home-page-model';
import RepositoryViewItem from '@/views/home-page/no-auth-main-list/repository-view-item.vue';

const store = useStore();
const isLogin = computed(() => store.state.user.isLogin);

async function onRepositoryPaginationChange(page: number) {
  await getRepositoryList(page);
}
</script>

<style scoped lang="scss">
.no-auth-list {
  margin-top: 16px;
  width: 1000px;
}

.activity-title {
  text-align: left;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #242930;
}

.pagination {
  margin-top: 50px;
  width: 100%;
}
</style>
