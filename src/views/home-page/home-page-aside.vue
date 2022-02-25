<template>
  <ant-spin :spinning="ownRepositoryList.isLoading">
    <div class="home-aside">
      <div class="user">
        <ant-avatar :src="userModel?.avatar || ''"></ant-avatar>
        <div class="name">{{ userModel?.name || '-' }}</div>
      </div>
      <div class=repo-content>
        <div class="repo-list">
          <div class="repo-header">
            知识库列表
            <ant-button
              type="primary"
              class="new-btn"
              :size="'small'" @click="goCreateRepositoryPage">
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
              placeholder="查找您的知识库..."
              class="search-input"></ant-input>
          </div>
          <div class="repository-list-container">
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
                    <clone-icon
                      style="margin-left: 5px;"
                      v-if="item.content.cloneFromRepositoryEntityId"></clone-icon>
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
import { RepositoryModelType } from 'metagraph-constant';
import {
  computed,
  defineComponent, ref
} from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined } from '@ant-design/icons-vue';
import {
  Spin, List, Input, Button, Avatar
} from 'ant-design-vue';
import type { EntityCompletelyListItemType } from 'metagraph-constant';
import { CloneIcon } from '@/components/icons';
import { useStore } from '@/store';
import { ownRepositoryList } from './home.page';

export default defineComponent({
  name: 'home-page-aside',
  components: {
    CloneIcon,
    PlusOutlined,
    AntSpin: Spin,
    AntList: List,
    AntListItem: List.Item,
    AntInput: Input,
    AntAvatar: Avatar,
    AntButton: Button
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const userModel = computed(() => store.state.user.user);
    const searchText = ref<string>('');
    const filteredRepositoryList = computed(() => ownRepositoryList.list?.filter(
      (item) => (item.content as RepositoryModelType).name.includes(searchText.value)
    ) || []);
    const goCreateRepositoryPage = async () => {
      await router.push('/repository/edit');
    };
    const goRepositoryEditorPage = async (item: EntityCompletelyListItemType) => {
      await router.push({
        name: 'RepositoryEditor',
        query: {
          repositoryEntityId: item.entity.id,
          type: 'edit'
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
      // isLoading
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
  overflow-y: auto;

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
          //background: #41B884;
          //color: #FFF;
        }

        //::v-deep(.ant-btn) {
        //  .anticon + span {
        //    margin-left: 3px;
        //  }
        //}
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

      .repository-list-container {
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
