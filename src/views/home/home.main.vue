<template>
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
</template>

<script lang="ts">
import { RepositoryNoAuthApiService } from '@/api.service';
import { useStore } from '@/store';
import { EntityCompletelyListItemType } from 'edu-graph-constant';
import {
  defineComponent, onMounted, ref
} from 'vue';
import RepositoryItem from './main/repository.item.vue';

export default defineComponent({
  name: 'home-main',
  components: {
    RepositoryItem,
  },
  setup() {
    const store = useStore();
    const current = ref(1);
    const repositoryList = ref<EntityCompletelyListItemType[]>([]);
    const total = ref();
    const onPaginationChange = async (page: number) => {
      console.log(page);
      const result = await RepositoryNoAuthApiService.getList({
        pageIndex: page - 1,
        pageSize: 10
      });
      repositoryList.value = result.data?.list ?? [];
      total.value = result.data?.total || 0;
    };
    onMounted(async () => {
      await onPaginationChange(current.value);
    });
    return {
      repositoryList,
      total,
      current,
      onPaginationChange
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
