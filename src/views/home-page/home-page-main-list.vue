<template>
  <ant-spin :spinning="repositoryList.isLoading">
    <div class="home-main">
      <div class="content">
        <template v-if="isLogin">
          <div class="activity-title">全部动态</div>
          <home-page-activity-list-item
            :key="index"
            :activity-item="item"
            v-for="(item, index) in activityList.list"></home-page-activity-list-item>
        </template>
        <template v-else>
          <repository-list-item
            :key="index"
            :repository="item"
            v-for="(item, index) in repositoryList.list"></repository-list-item>
        </template>
      </div>
      <ant-pagination
        v-if="!isLogin"
        class="pagination"
        :pageSize="10"
        v-model:current="repositoryList.current"
        :total="repositoryList.total"
        @change="onRepositoryPaginationChange"/>
      <ant-pagination
        v-if="isLogin"
        class="pagination"
        :pageSize="10"
        v-model:current="activityList.current"
        :total="activityList.total"
        @change="onActivityPaginationChange"/>
      <div class="icp-message" style="height: 100px;line-height: 100px;">
        <a href="https://beian.miit.gov.cn/">京ICP备20020548号-3</a>
      </div>
    </div>
  </ant-spin>
</template>

<script lang="ts" setup>
import {
  computed
} from 'vue';
import { Spin as AntSpin, Pagination as AntPagination } from 'ant-design-vue';
import { RepositoryListItem } from '@/github.style.component';
import { useStore } from '@/store';
import HomePageActivityListItem from '@/views/home-page/home-page-main-list/home-page-activity-list-item.vue';
import { HomePage, repositoryList, activityList } from '@/views/home-page/home.page';

const store = useStore();
const homePage = new HomePage();
const isLogin = computed(() => store.state.user.isLogin);
const onRepositoryPaginationChange = async (page: number) => {
  await homePage.getRepositoryList(page);
};
const onActivityPaginationChange = async (page: number) => {
  await homePage.getActivityList(page);
};

</script>

<style scoped lang="scss">
.home-main {
  padding: 0 32px;
  margin-top: 16px;
  margin-bottom: 50px;

  .content {
    width: 100%;
    max-width: 1400px;
    margin: 16px auto 50px;
    .activity-title {
      text-align: left;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: #242930;
    }
  }

  .pagination {
    width: 100%;
  }
  .icp-message {
    height: 100px;
    line-height: 100px;
    a {
      font-size: 12px;
      color: #a9a9a9;
    }
  }
}
</style>
