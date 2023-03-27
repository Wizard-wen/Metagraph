<template>
  <div class="authed-list">
    <div class="activity-title">全部动态</div>
    <home-page-activity-list-item
      :key="index"
      :activity-item="item"
      v-for="(item, index) in activityList.list"></home-page-activity-list-item>
    <div v-if="!activityList.list.length">
      <ant-skeleton v-for="item in 10" :key="item" active />
    </div>
    <ant-pagination
      v-if="isLogin"
      class="pagination"
      :pageSize="10"
      v-model:current="activityList.current"
      :total="activityList.total"
      @change="onActivityPaginationChange"/>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store';
import { computed } from 'vue';
import { Pagination as AntPagination, Skeleton as AntSkeleton } from 'ant-design-vue';
import HomePageActivityListItem
  from '@/views/home-page/authed-main-list/home-page-activity-list-item.vue';
import { activityList, getActivityList } from '@/views/home-page/home-page-model';

const store = useStore();
const isLogin = computed(() => store.state.user.isLogin);

async function onActivityPaginationChange(page: number) {
  await getActivityList(page);
}
</script>

<style scoped lang="scss">
.authed-list {
  width: 100%;
  .activity-title {
    text-align: left;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #242930;
  }
}
.pagination {
  margin-top: 50px;
  width: 100%;
}
</style>
