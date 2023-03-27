<template>
  <div class="search-page">
    <div class="repository-list">
      <div class="side-content">
        <router-menu-list
          :active="searchData.activeIndex"
          @onClickItem="handleClickMenu($event)"
          :title="'搜索实体类型'" :type="'normal'" :navList="navList"></router-menu-list>
      </div>
      <div class="list-container">
        <div class="search-result">
          <div class="count">{{ total }}个结果</div>
        </div>
        <template
          :key="index"
          v-for="(item, index) in repositoryList">
          <repository-view-item
            v-if="item.entity.entityType === 'Repository'"
            :activity-item="item"></repository-view-item>
          <knowledge-view-item
            v-if="item.entity.entityType === 'Knowledge'"
            :activity-item="item"></knowledge-view-item>
        </template>
        <div v-if="isLoading">
          <ant-skeleton v-for="item in 3" :key="item" active></ant-skeleton>
        </div>
        <ant-pagination
          style="margin-top: 50px;"
          v-model:current="searchData.pageIndex"
          :pageSize="searchData.pageSize"
          :total="total"
          @change="onPaginationChange">
        </ant-pagination>
      </div>
    </div>
  </div>

</template>
<script lang="ts" setup>
import { searchData } from '@/views/main/metegraph.header';
import { Pagination as AntPagination, Skeleton as AntSkeleton } from 'ant-design-vue';
import type { EntityCompletelyListItemType } from 'metagraph-constant';
import { onMounted, ref } from 'vue';
import {
  NavigationGuardNext,
  onBeforeRouteUpdate,
  RouteLocationNormalized,
  useRoute
} from 'vue-router';
import { EntityNoAuthApiService } from '@/api-service';
import { RouterMenuList } from '@/github.style.component';
import { RouterUtil } from '@/utils/router.util';
import RepositoryViewItem from '@/views/home-page/no-auth-main-list/repository-view-item.vue';
import KnowledgeViewItem from '@/views/home-page/no-auth-main-list/knowledge-view-item.vue';

const isLoading = ref(false);
const route = useRoute();
const queryName = ref(route.query.name as string);
const queryType = ref(route.query.type as string);
const total = ref(0);
const repositoryList = ref<EntityCompletelyListItemType[]>();
const navList = ref([
  {
    path: '',
    value: '',
    name: '全部'
  },
  {
    path: '',
    value: 'Repository',
    name: '知识库'
  },
  {
    path: '',
    value: 'Knowledge',
    name: '知识点'
  }
]);
const actions: Record<string, string>[] = [
  {
    type: 'StarOutlined',
    text: '156'
  },
  {
    type: 'LikeOutlined',
    text: '156'
  },
  {
    type: 'MessageOutlined',
    text: '2'
  },
];

async function setSearchList(params: {
  pageIndex: number;
  pageSize: number;
  searchText: string;
  entityType: any;
}) {
  isLoading.value = true;
  const result = await EntityNoAuthApiService.getSearchList({
    pageIndex: params.pageIndex,
    pageSize: params.pageSize,
    searchText: params.searchText,
    entityType: params.entityType
  });
  repositoryList.value = result.data?.list ?? [];
  total.value = result.data?.total || 0;
  isLoading.value = false;
}

onBeforeRouteUpdate(async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  await setSearchList({
    pageIndex: searchData.value.pageIndex - 1,
    pageSize: searchData.value.pageSize,
    searchText: to.query.name as string,
    entityType: to.query.type as unknown as any
  });
  next();
});
onMounted(async () => {
  searchData.value.activeIndex = navList.value.findIndex(
    (item) => item.value === queryType.value
  );
  if (searchData.value.activeIndex === -1) {
    searchData.value.activeIndex = 0;
  }
  searchData.value.type = navList.value[searchData.value.activeIndex].value;
  searchData.value.text = queryName.value ?? '';
  const pageSizeFromQuery = Number((route.query.pageSize as string | null) ?? 10);
  searchData.value.pageIndex = Number((route.query.pageIndex as string | null) ?? 1);
  searchData.value.pageSize = pageSizeFromQuery;
  await setSearchList({
    pageIndex: searchData.value.pageIndex - 1,
    pageSize: searchData.value.pageSize,
    searchText: queryName.value,
    entityType: queryType.value as unknown as any
  });
});
const onPaginationChange = async (page: number) => {
  searchData.value.pageIndex = page;
  searchData.value.pageSize = 10;
  await RouterUtil.replaceTo('/search/list', {
    name: searchData.value.text,
    type: searchData.value.type,
    pageSize: searchData.value.pageSize,
    pageIndex: searchData.value.pageIndex
  });
};

async function handleClickMenu(event: {
  path: string;
  name: string;
  value?: string;
  index: number
}) {
  searchData.value.activeIndex = event.index;
  searchData.value.type = navList.value[searchData.value.activeIndex].value;
  searchData.value.pageIndex = 1;
  searchData.value.pageSize = 10;
  await RouterUtil.replaceTo('/search/list', {
    name: searchData.value.text,
    type: searchData.value.type,
    pageSize: searchData.value.pageSize,
    pageIndex: searchData.value.pageIndex
  });
}
</script>
<style lang="scss" scoped>
.search-page {
  height: calc(100vh - 55px);
  width: 100%;
  overflow-y: scroll;
}

.repository-list {
  min-width: 1000px;
  max-width: 1200px;
  display: flex;
  margin: 0 auto;
  padding-top: 50px;
  padding-bottom: 120px;

  .side-content {
    width: 240px;
  }

  .list-container {
    flex: 1;

    .search-result {
      display: flex;
      justify-content: space-between;
      height: 55px;
      border-bottom: 1px solid #d8dee4;;

      .count {
        font-size: 18px;
        line-height: 35px;
        font-weight: bold;
      }
    }
  }
}
</style>
