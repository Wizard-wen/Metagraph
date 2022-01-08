<template>
  <div class="explore-box">
    <h2 class="explore-header">热门仓库</h2>
    <!--    <div class="explore-item">-->
    <!--      <div class="title">songxiwen / 会计科目</div>-->
    <!--      <div class="description">整理现行会计准则下的会计科目. </div>-->
    <!--      <div class="action">-->
    <!--        <div class="action-item">-->
    <!--          <StarOutlined style="margin-right: 8px"/>-->
    <!--          <span>2</span>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="explore-item" v-for="item in hotList">
      <div class="title">{{ item.author.name }} / {{ item.content.name }}</div>
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
import { defineComponent, onMounted, ref } from 'vue';
import { StarOutlined } from '@ant-design/icons-vue';
import { RepositoryNoAuthApiService } from '@/api.service';

const data = [
  {
    title: 'Ant Design Title 1',
  },
];
export default defineComponent({
  name: 'home.explore',
  components: {
    StarOutlined
  },
  setup() {
    const hotList = ref<EntityCompletelyListItemType[]>([]);

    async function getHotList() {
      const result = await RepositoryNoAuthApiService.getHotList();
      if (result.data) {
        hotList.value = result.data;
      }
    }

    onMounted(async () => {
      await getHotList();
    });

    return {
      data,
      hotList
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
