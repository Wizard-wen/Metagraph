<template>
  <ant-spin :spinning="isLoading">
    <div class="home-aside">
      <div class="user">
        <ant-avatar :src="userModel?.avatar || ''"></ant-avatar>
        <div class="name">{{ userModel?.name || '-' }}</div>
      </div>
      <div class=repo-content>
        <div class="repo-list">
          <div class="repo-header">
            仓库列表
            <ant-button class="new-btn" :size="'small'" @click="goCreateRepositoryPage">
              <template #icon>
                <PlusOutlined/>
              </template>
              创建
            </ant-button>
          </div>
          <div class="search">
            <ant-input
              v-model:value="searchText"
              type="text"
              placeholder="查找您的仓库..."
              class="search-input"></ant-input>
          </div>
          <div>
            <ant-list size="small" :data-source="filteredRepositoryList">
              <template #renderItem="{ item }">
                <ant-list-item>
                  <div class="repo-item" @click="goRepositoryEditorPage(item)">
                    <div class="icon">
                      <img :src="item.author.avatar" height="20" width="20" alt="">
                    </div>
                    <span class="user-name">{{ item.author.name }}</span>
                    &nbsp;/&nbsp;
                    <span class="repository-name">{{ item.content.name }}</span>
                  </div>
                </ant-list-item>
              </template>
            </ant-list>
          </div>
        </div>
      </div>
    </div>
  </ant-spin>
</template>

<script lang="ts">
import { message } from 'ant-design-vue';
import { RepositoryModelType } from 'edu-graph-constant';
import {
  computed,
  defineComponent, onMounted, ref, reactive,
} from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { EntityCompletelyListItemType } from 'edu-graph-constant';
import { useStore } from '@/store';
import { RepositoryApiService } from '@/api.service';

export default defineComponent({
  name: 'home-aside',
  components: {
    PlusOutlined
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const userModel = computed(() => store.state.user.user);
    const searchText = ref<string>('');
    const isLoading = ref(false);
    const ownRepositoryList = reactive<{ target: EntityCompletelyListItemType[] }>({ target: [] });
    const filteredRepositoryList = computed(() => ownRepositoryList.target?.filter(
      (item) => (item.content as RepositoryModelType).name.includes(searchText.value)
    ) || []);
    const getOwnRepositoryList = async () => {
      isLoading.value = true;
      const result = await RepositoryApiService.getOwnRepositoryList();
      if (result.data) {
        ownRepositoryList.target = result.data;
      } else {
        message.error('获取仓库数据时失败！');
      }
      isLoading.value = false;
    };
    const goCreateRepositoryPage = async () => {
      await router.push('/repository/edit');
    };
    onMounted(async () => {
      if (userModel.value) {
        await getOwnRepositoryList();
      }
    });
    const goRepositoryEditorPage = async (item: EntityCompletelyListItemType) => {
      await router.push({
        name: 'RepositoryEditor',
        query: {
          repositoryEntityId: item.entity.id
        }
      });
    };
    return {
      goCreateRepositoryPage,
      goRepositoryEditorPage,
      ownRepositoryList,
      filteredRepositoryList,
      userModel,
      searchText,
      isLoading
    };
  }
});
</script>

<style scoped lang="scss">
@import '../../style/common.scss';

.home-aside {
  height: calc(100vh - 55px);
  width: 300px;
  padding: 0 18px;
  background: #fff;

  .user {
    display: flex;
    padding: 16px 0;
    margin-bottom: 24px;
    border-bottom: 1px solid #eaecef;

    .name {
      height: 32px;
      font-size: 16px;
      line-height: 32px;
      text-align: left;
      margin-left: 15px;
      font-weight: 600;
    }
  }

  .repo-content {
    margin-bottom: 16px;

    .repo-list {
      .repo-header {
        height: 28px;
        display: flex;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 4px;
        align-items: center;
        justify-content: space-between;

        .new-btn {
          border-radius: 4px;
          height: 28px;
          line-height: 28px;
          //color: #fff;
          //padding: 3px 12px;
          //font-size: 12px;
          //line-height: 20px;
          //background: #2ea44f;
          //border-radius: 6px;
          //cursor: pointer;
          //border: 1px solid;
        }
      }

      .search {
        margin-bottom: 16px;
        margin-top: 8px;

        .search-input {
          margin-bottom: 16px;
          display: block;
          width: 100%;
          background: #fff;
          padding: 5px 12px;
          font-size: 14px;
          line-height: 20px;
          color: $fontColor;
          vertical-align: middle;
          border: 1px solid #e1e4e8;
          border-radius: 6px;
          outline: none;
        }
      }

      .repo-item {
        display: flex;
        align-items: center;
        font-weight: 600;
        width: 100%;
        font-size: 14px;
        line-height: 22px;
        cursor: pointer;

        .icon {
          margin-right: 8px;

          img {
            border-radius: 50%;
          }
        }

        .user-name {
          max-width: 125px
        }

        .repository-name {
          max-width: 260px
        }
      }

      .load-more {
        margin-top: 8px;
        width: 100%;
        text-align: left;
        cursor: pointer;
      }
    }
  }
}
</style>
