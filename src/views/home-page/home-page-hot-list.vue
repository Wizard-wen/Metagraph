<template>
  <div class="explore-box">
    <h2 class="explore-header">热门知识库</h2>
    <div class="explore-item" v-for="item in hotRepositoryList">
      <div class="title" @click="goRepositoryPage(item)">
        {{ item.author.name }} / {{ item.content.name }}
      </div>
      <div class="description">{{ item.content.description }}</div>
      <div class="action">
        <div class="action-item">
          <StarOutlined
            style="margin-right: 8px"/>
          <span>{{ item.star }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { EntityCompletelyListItemType } from 'metagraph-constant';
import { computed, defineComponent } from 'vue';
import { StarOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { hotRepositoryList } from './home.page';

export default defineComponent({
  name: 'home-page-hot-list',
  components: {
    StarOutlined
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const userModel = computed(() => store.state.user.user);

    async function goRepositoryPage(item: EntityCompletelyListItemType) {
      router.push({
        name: 'RepositoryEditor',
        query: {
          repositoryEntityId: item.entity.id,
          type: item.author.id === userModel.value?.id ? 'edit' : 'view'
        }
      }).then();
    }

    return {
      hotRepositoryList,
      goRepositoryPage
    };
  }
});
</script>

<style scoped lang="scss">
.explore-box {
  width: 300px;
  padding-left: 24px;
  padding-right: 24px;
  margin-top: 32px;

  .explore-header {
    font-size: 14px;
    text-align: left;
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

    .description {
      margin-bottom: 8px;
      //padding-right: 30px;
    }

    .action {
      display: flex;
      justify-content: flex-start;

      .action-item {
        margin-right: 10px;
      }
    }
  }
}
</style>
