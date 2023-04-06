<template>
  <div class="no-auth-list">
    <div class="activity-title">推荐知识库</div>
    <div v-if="isLoading">
      <ant-skeleton v-for="item in 10" :key="item" active/>
    </div>
    <template v-else>
      <template v-if="repositoryList.list.length">
        <repository-view-item
          :key="index"
          v-for="(item, index) in repositoryList.list"
          :activity-item="item"></repository-view-item>
      </template>
      <empty-view v-else></empty-view>
    </template>
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
import { computed, onMounted, ref } from 'vue';
import { Pagination as AntPagination, Skeleton as AntSkeleton } from 'ant-design-vue';
import { useStore } from '@/store';

import { getRepositoryList, repositoryList } from '@/views/home-page/home-page-model';
import RepositoryViewItem from '@/views/home-page/no-auth-main-list/repository-view-item.vue';
import { EmptyView } from '@/components';

const store = useStore();
const isLogin = computed(() => store.state.user.isLogin);
const isLoading = ref(false);

async function onRepositoryPaginationChange(page: number) {
  isLoading.value = true;
  await getRepositoryList(page);
  isLoading.value = false;
}

onMounted(async () => {
  isLoading.value = true;
  await getRepositoryList();
  isLoading.value = false;
});
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
