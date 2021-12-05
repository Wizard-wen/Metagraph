<template>
  <ant-spin :spinning="isLoading">
    <div class="home-main">
      <div class="content">
        <repository-item
          :repository="item"
          v-for="item in repositoryList"></repository-item>
      </div>
      <ant-pagination
        class="pagination"
        v-model:current="current"
        :total="total"
        @change="onPaginationChange"/>
    </div>
  </ant-spin>
</template>

<script lang="ts">
import { message } from 'ant-design-vue';
import { EntityCompletelyListItemType } from 'edu-graph-constant';
import {
  defineComponent, onMounted, ref
} from 'vue';
import { RepositoryNoAuthApiService } from '@/api.service';
import RepositoryItem from './main/repository.item.vue';

export default defineComponent({
  name: 'home-main',
  components: {
    RepositoryItem,
  },
  setup() {
    const current = ref(1);
    const repositoryList = ref<EntityCompletelyListItemType[]>([]);
    const total = ref(0);
    const isLoading = ref(false);
    const onPaginationChange = async (page: number) => {
      isLoading.value = true;
      const result = await RepositoryNoAuthApiService.getList({
        pageIndex: page - 1,
        pageSize: 10
      });
      if (result.data) {
        repositoryList.value = result.data.list ?? [];
        total.value = result.data.total;
      } else {
        message.error('获取仓库数据时失败！');
      }
      isLoading.value = false;
    };
    onMounted(async () => {
      await onPaginationChange(current.value);
    });
    return {
      repositoryList,
      total,
      current,
      onPaginationChange,
      isLoading
    };
  }
});
</script>

<style scoped lang="scss">
.home-main {
  padding: 0 32px;
  margin-top: 16px;

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
