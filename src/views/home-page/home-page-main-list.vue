<template>
  <ant-spin :spinning="repositoryList.isLoading">
    <div class="home-main">
      <div class="content">
        <template v-if="isLogin">
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
        v-model:current="repositoryList.current"
        :total="repositoryList.total"
        @change="onRepositoryPaginationChange"/>

      <ant-pagination
        v-if="isLogin"
        class="pagination"
        v-model:current="activityList.current"
        :total="activityList.total"
        @change="onActivityPaginationChange"/>
    </div>
  </ant-spin>
</template>

<script lang="ts">
import {
  computed,
  defineComponent
} from 'vue';
import { Spin, Pagination } from 'ant-design-vue';
import RepositoryListItem from '@/github.style.component/repository-list-item/repository-list-item.vue';
import { useStore } from '@/store';
import HomePageActivityListItem from '@/views/home-page/home-page-main-list/home-page-activity-list-item.vue';
import { HomePage, repositoryList, activityList } from '@/views/home-page/home.page';

export default defineComponent({
  name: 'home-page-main-list',
  components: {
    RepositoryListItem,
    HomePageActivityListItem,
    AntSpin: Spin,
    AntPagination: Pagination
  },
  setup() {
    const store = useStore();
    const homePage = new HomePage();
    const isLogin = computed(() => store.state.user.isLogin);
    const onRepositoryPaginationChange = async (page: number) => {
      await homePage.getRepositoryList(page);
    };
    const onActivityPaginationChange = async (page: number) => {
      await homePage.getActivityList(page);
    };
    return {
      isLogin,
      repositoryList,
      activityList,
      onRepositoryPaginationChange,
      onActivityPaginationChange
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
