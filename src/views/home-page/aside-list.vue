<template>
    <div class="home-aside">
<!--      <div class="user">-->
<!--        <ant-avatar :size="28" :src="userModel?.avatar || ''"></ant-avatar>-->
<!--        <div class="name">{{ userModel?.name || '-' }}</div>-->
<!--      </div>-->
      <div class=repository-content>
        <div class="repository-header" id="step2" data-homepage="2">
          知识库列表
          <m-button
            @click="goCreateRepositoryPage">
            <template #icon>
              <PlusOutlined style="font-size: 14px;"/>
            </template>
          </m-button>
        </div>
        <div class="search-container" id="step3" data-homepage="3">
          <ant-input
            v-model:value="searchText"
            type="text"
            placeholder="查找您的知识库..."
            class="search-input">
            <template #prefix>
              <search-outlined />
            </template>
          </ant-input>
        </div>
        <home-aside-list
          :filtered-repository-list="filteredRepositoryList"></home-aside-list>
        <div v-if="ownRepositoryList.isLoading">
          <ant-skeleton v-for="item in 3" :key="item" active />
        </div>
      </div>
    </div>
</template>

<script lang="ts" setup>
import HomeAsideList from '@/views/home-page/aside-list/home-aside-list.vue';
import { RepositoryModelType } from 'metagraph-constant';
import { MButton } from '@/metagraph-ui';
import {
  computed, ref
} from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons-vue';
import {
  Input as AntInput, Avatar as AntAvatar, Skeleton as AntSkeleton
} from 'ant-design-vue';
import { useStore } from '@/store';
import { ownRepositoryList } from './home-page-model';

const router = useRouter();
const store = useStore();
const userModel = computed(() => store.state.user.user);
const searchText = ref<string>('');
const filteredRepositoryList = computed(() => ownRepositoryList.list?.filter(
  (item) => (item.content as RepositoryModelType).name.includes(searchText.value)
) || []);

async function goCreateRepositoryPage() {
  router.push('/repository/edit')
    .then();
}

</script>

<style scoped lang="scss">
@import '../../style/common.scss';

.home-aside {
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  height: calc(100vh - 55px);
  width: 100%;
  padding: 0 12px;
  background: #FFF;
  overflow-y: auto;

  .user {
    display: flex;
    align-items: center;
    padding: 12px 0;
    margin-bottom: 24px;
    border-bottom: 1px solid #eaecef;

    .name {
      height: 22px;
      font-size: 14px;
      line-height: 22px;
      text-align: left;
      margin-left: 10px;
      font-weight: 600;
    }
  }

  .repository-content {
    margin-bottom: 16px;
    padding: 12px 0;

    .repository-header {
      height: 32px;
      display: flex;
      font-size: 14px;
      font-weight: 600;
      align-items: center;
      justify-content: space-between;
    }

    .search-container {
      margin-bottom: 8px;
      margin-top: 8px;

      .search-input {
        margin-bottom: 8px;
        width: 100%;
        background: #fff;
        padding: 5px 12px;
        font-size: 14px;
        line-height: 20px;
        color: $fontColor;
        border: 1px solid #e1e4e8;
        border-radius: 6px;
        outline: none;

        &::placeholder {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
