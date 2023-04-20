<template>
  <div class="explore-box">
    <div class="explore-header">热门知识库</div>
    <div v-if="isLoading">
      <ant-skeleton v-for="item in 3" :key="item" active/>
    </div>
    <template v-else>
      <template v-if="hotRepositoryList.length">
        <div
          class="explore-item"
          :style="{'padding-top': index === 0 ? '4px' : '8px'}"
          :key="index"
          v-for="(item, index) in hotRepositoryList">
          <div class="title" @click="goRepositoryPage(item)">
            {{ item.author.name }} / {{ item.content.name }}
          </div>
          <div class="description-text">{{ item.content.description }}</div>
          <div class="tag-content" v-if="item.content.domain.length">
            <m-tag
              :key="tagIndex"
              v-for="(domainItem, tagIndex) in item.content.domain"
              :title="domainItem.domainName"></m-tag>
          </div>
          <div class="action">
            <div class="action-item">
              <StarOutlined class="action-star"/>
              {{ item.star }}
            </div>
          </div>
        </div>
      </template>
      <empty-view v-else></empty-view>

    </template>
  </div>
</template>

<script lang="ts" setup>
import type { EntityCompletelyListItemType } from '@metagraph/constant';
import { Skeleton as AntSkeleton } from 'ant-design-vue';
import { computed, onMounted, ref } from 'vue';
import { StarOutlined } from '@ant-design/icons-vue';
import { MTag } from '@/metagraph-ui';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { getHotList, hotRepositoryList } from './home-page-model';
import { EmptyView } from '@/components';

const router = useRouter();
const store = useStore();
const userModel = computed(() => store.state.user.user);
const isLoading = ref(false);

async function goRepositoryPage(item: EntityCompletelyListItemType) {
  router.push({
    name: 'RepositoryEditor',
    query: {
      repositoryEntityId: item.entity.id,
      type: item.author.id === userModel.value?.id ? 'edit' : 'view'
    }
  })
    .then();
}

onMounted(async () => {
  isLoading.value = true;
  await getHotList();
  isLoading.value = false;
});
</script>

<style scoped lang="scss">
.explore-box {
  width: 300px;
  padding-left: 24px;
  padding-right: 24px;
  margin-top: 16px;

  .explore-header {
    font-size: 14px;
    line-height: 1.5;
    text-align: left;
    color: #242930;
  }

  .explore-item {
    margin: 8px 0;
    padding: 8px 0;
    text-align: left;
    border-bottom: 1px solid #ccc;

    .title {
      font-weight: bold;
      cursor: pointer;
    }

    .description-text {
      font-size: 12px;
      margin-top: 4px;
      min-height: 20px;
      color: #57606A;
    }

    .action {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-top: 4px;

      .action-item {
        margin-right: 12px;
        line-height: 1.5;
        font-size: 14px;

        .action-icon {
          margin-right: 2px;
        }
      }
    }
  }
}
</style>
