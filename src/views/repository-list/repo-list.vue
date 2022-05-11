<template>
  <div class="repo-list">
<!--    <ant-list-->
<!--      item-layout="vertical"-->
<!--      size="large"-->
<!--      style="width: 100%; border-bottom: 1px solid #ccc"-->
<!--      :data-source="repositoryList">-->
<!--      <template #renderItem="{ item }">-->
<!--        <ant-list-item key="item.title" style="text-align: left">-->
<!--          <template #actions>-->
<!--            <span>-->
<!--              <StarOutlined style="margin-right: 8px"/>-->
<!--              {{ item.star }}-->
<!--            </span>-->
<!--            <span>-->
<!--              <LikeOutlined style="margin-right: 8px"/>-->
<!--              34-->
<!--            </span>-->
<!--            <span>-->
<!--              <MessageOutlined style="margin-right: 8px"/>-->
<!--              15-->
<!--            </span>-->
<!--          </template>-->
<!--          <template #extra>-->
<!--            <img-->
<!--              width="272"-->
<!--              alt="logo"-->
<!--              src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"/>-->
<!--          </template>-->
<!--          <ant-list-item-meta :description="item.content.description">-->
<!--            <template #title>-->
<!--              <a :href="item.href">{{ item.content.name }}</a>-->
<!--            </template>-->
<!--            <template #avatar>-->
<!--              <ant-avatar :src="item.author.avatar"/>-->
<!--            </template>-->
<!--          </ant-list-item-meta>-->
<!--          <div style="height: 39px;">-->
<!--            <ant-tag>qqq</ant-tag>-->
<!--            <ant-tag>qqq</ant-tag>-->
<!--            <ant-tag>qqq</ant-tag>-->
<!--            <ant-tag>qqq</ant-tag>-->
<!--          </div>-->
<!--        </ant-list-item>-->
<!--      </template>-->
<!--    </ant-list>-->
    <repository-list-item
      :key="index"
      :repository="item"
      v-for="(item, index) in repositoryList"></repository-list-item>
    <ant-pagination
      style="margin-top: 50px;"
      v-model:current="current"
      :total="total"
      @change="onPaginationChange"/>
  </div>
</template>
<script lang="ts">
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue';
import {
  Tag, Pagination, Avatar, List
} from 'ant-design-vue';
import {
  defineComponent, onMounted, ref, watch
} from 'vue';
import { useRoute } from 'vue-router';
import { RepositoryNoAuthApiService } from '@/api.service';
import RepositoryListItem from '@/github.style.component/repository-list-item/repository-list-item.vue';

export default defineComponent({
  name: 'repo-list',
  components: {
    RepositoryListItem,
    StarOutlined,
    LikeOutlined,
    MessageOutlined,
    AntAvatar: Avatar,
    AntTag: Tag,
    AntPagination: Pagination,
    AntListItemMeta: List.Item.Meta,
    AntListItem: List.Item,
    AntList: List,
  },
  setup() {
    const route = useRoute();
    const current = ref(0);
    const total = ref(0);
    const repositoryList = ref();
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
    watch(() => route.params, async (value) => {
      const result = await RepositoryNoAuthApiService.getList({
        pageIndex: 0,
        pageSize: 10,
        name: value.name as string
      });
      repositoryList.value = result.data?.list ?? [];
      total.value = result.data?.total || 0;
      console.log(repositoryList);
    });
    onMounted(async () => {
      const result = await RepositoryNoAuthApiService.getList({
        pageIndex: 0,
        pageSize: 10,
        name: route.params.name as string
      });
      repositoryList.value = result.data?.list ?? [];
      total.value = result.data?.total || 0;
    });
    const onPaginationChange = async (page: number, pageSize: number) => {
      const result = await RepositoryNoAuthApiService.getList({
        pageIndex: page - 1,
        pageSize: 10,
        name: route.params.name as string
      });
      repositoryList.value = result.data?.list ?? [];
      total.value = result.data?.total || 0;
    };
    return {
      repositoryList,
      actions,
      current,
      total,
      onPaginationChange
    };
  },
});
</script>
<style lang="scss" scoped>
.repo-list {
  width: 1000px;
  margin: 0 auto;
}
</style>
