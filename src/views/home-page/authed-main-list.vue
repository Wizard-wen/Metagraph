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
  from '@/views/home-page/home-page-main-list/home-page-activity-list-item.vue';
import { activityList, HomePage } from '@/views/home-page/home.page';

const store = useStore();
const homePage = new HomePage();
const isLogin = computed(() => store.state.user.isLogin);

async function onActivityPaginationChange(page: number) {
  await homePage.getActivityList(page);
}
</script>

<style scoped lang="scss">
.authed-list {
  width: 100%;
  min-width: 1000px;
  max-width: 1100px;
  margin: 16px auto 0;
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
