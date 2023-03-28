<template>
  <ant-spin :spinning="isLoading">
    <ant-list>
      <template #loadMore>
        <div class="load-more-button" v-if="star.total < star.list.length">
          <ant-spin v-if="isLoadingMore"/>
          <ant-button v-else @click="handleLoadMore">加载更多</ant-button>
        </div>
      </template>
      <ant-list-item v-for="(item, index) in star.list" :key="index">
        <template #actions>
          <m-button :title="'查看'" @click="goProfilePage(item.id)"></m-button>
        </template>
        <ant-list-item-meta :description="item.email">
          <template #title>
            <div class="name" @click="goProfilePage(item.id)">{{ item.name }}</div>
          </template>
          <template #avatar>
            <ant-avatar v-if="item.avatar" :src="item.avatar"/>
            <div class="icon" v-else></div>
          </template>
        </ant-list-item-meta>
      </ant-list-item>
    </ant-list>
  </ant-spin>
</template>

<script lang="ts" setup>
import {
  Avatar as AntAvatar,
  Button as AntButton,
  List as AntList,
  message,
  Spin as AntSpin
} from 'ant-design-vue';
import type { PublicEntityType, UserModelType } from 'metagraph-constant';
import { defineProps, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { StarApiService } from '@/api-service';
import {MButton} from '@/metagraph-ui';

const AntListItem = AntList.Item;
const AntListItemMeta = AntList.Item.Meta;
const props = defineProps({
  entityId: {
    type: String,
    required: true
  },
  entityType: {
    type: String,
    required: true
  }
});

const router = useRouter();
const isLoading = ref(false);
const star = reactive<{
  list: UserModelType[],
  total: number;
  currentPage: number;
  pageSize: number;
}>({
  list: [],
  total: 0,
  currentPage: 0,
  pageSize: 5
});

const isLoadingMore = ref(false);

async function getStarDetailList() {
  isLoading.value = true;
  const result = await StarApiService.getEntityStarList({
    entityType: props.entityType as PublicEntityType,
    entityId: props.entityId,
    pageIndex: star.currentPage,
    pageSize: star.pageSize
  });
  if (result.data) {
    // 加载更多 concat到最后
    star.list = star.list.concat(result.data.user.list);
    star.total = result.data?.user.total;
  }
  if (result.code !== 0) {
    message.error(result.message || '获取点赞列表时出错！');
  }
  isLoading.value = false;
}

async function handleLoadMore() {
  star.currentPage += 1;
  isLoadingMore.value = true;
  await getStarDetailList();
  isLoadingMore.value = false;
}

async function goProfilePage(id: string) {
  router.push({
    path: '/profile',
    query: {
      id
    }
  })
    .then();
}

onMounted(async () => {
  await getStarDetailList();
});
</script>

<style scoped lang="scss">
.load-more-button {
  text-align: center;
  margin-top: 12px;
  height: 32px;
  line-height: 32px;
}

.name {
  cursor: pointer;
}

.icon {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background: #f5f5f5;
}
</style>
