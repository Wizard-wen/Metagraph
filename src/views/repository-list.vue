<template>
  <div class="repository-list">
    <div class="side-content">
      <router-menu-list
        :active="searchData.activeIndex"
        @onClickItem="handleClickMenu($event)"
        :title="'搜索实体类型'" :type="'normal'" :navList="navList"></router-menu-list>
    </div>
    <div class="list-container">
      <div class="search-result">
        <div class="count">{{total}}个结果</div>
      </div>
      <template
        :key="index"
        v-for="(item, index) in repositoryList">
        <repository-list-item
          v-if="item.entity.entityType === 'Repository'"
          :repository="item"></repository-list-item>
        <knowledge-list-item
          v-if="item.entity.entityType === 'Knowledge'"
          :repository="item"></knowledge-list-item>
      </template>
      <ant-pagination
        style="margin-top: 50px;"
        v-model:current="current"
        :total="total"
        @change="onPaginationChange"/>
    </div>

  </div>
</template>
<script lang="ts">
import RouterMenuList from '@/github.style.component/router-menu-list/router-menu-list.vue';
import { searchData } from '@/views/main/metegraph.header';
import { Pagination } from 'ant-design-vue';
import type { EntityCompletelyListItemType } from 'metagraph-constant';
import {
  defineComponent, onMounted, ref
} from 'vue';
import {
  NavigationGuardNext, onBeforeRouteUpdate, RouteLocationNormalized, useRoute, useRouter
} from 'vue-router';
import { EntityNoAuthApiService } from '@/api.service';
import RepositoryListItem from '@/github.style.component/repository-list-item/repository-list-item.vue';
import KnowledgeListItem from '@/github.style.component/knowledge-list-item/knowledge-list-item.vue';

export default defineComponent({
  name: 'repository-list',
  components: {
    RouterMenuList,
    RepositoryListItem,
    KnowledgeListItem,
    AntPagination: Pagination,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const queryName = ref(route.query.name as string);
    const queryType = ref(route.query.type as string);
    const current = ref(0);
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
    onBeforeRouteUpdate(async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const result = await EntityNoAuthApiService.getSearchList({
        pageIndex: 0,
        pageSize: 10,
        searchText: to.query.name as string,
        entityType: to.query.type as unknown as any
      });
      repositoryList.value = result.data?.list ?? [];
      total.value = result.data?.total || 0;
      console.log(repositoryList);
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
      const result = await EntityNoAuthApiService.getSearchList({
        pageIndex: 0,
        pageSize: 10,
        searchText: queryName.value,
        entityType: queryType.value as unknown as any
      });
      repositoryList.value = result.data?.list ?? [];
      total.value = result.data?.total || 0;
    });
    const onPaginationChange = async (page: number, pageSize: number) => {
      const result = await EntityNoAuthApiService.getSearchList({
        pageIndex: page - 1,
        pageSize: 10,
        searchText: queryName.value,
        entityType: queryType.value as unknown as any
      });
      repositoryList.value = result.data?.list ?? [];
      total.value = result.data?.total || 0;
    };

    function handleClickMenu(event: { path: string; name: string; value?: string; index: number }) {
      console.log(event);
      searchData.value.activeIndex = event.index;
      searchData.value.type = navList.value[searchData.value.activeIndex].value;
      router.push({
        path: '/repository/list',
        query: {
          name: searchData.value.text,
          type: searchData.value.type
        },
        replace: true
      });
    }

    return {
      repositoryList,
      actions,
      current,
      total,
      navList,
      searchData,
      onPaginationChange,
      handleClickMenu
    };
  },
});
</script>
<style lang="scss" scoped>
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
