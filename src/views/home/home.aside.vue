<template>
  <div class="home-aside">
    <div class="user">
      <ant-avatar :src="user?.content?.avatar || ''"></ant-avatar>
      <div class="name">{{ user?.content?.name || '-' }}</div>
    </div>
    <div class=repo-content>
      <div class="repo-list">
        <div class="repo-header">
          Repositories
          <ant-button type="primary" :size="'small'" @click="goCreateRepositoryPage">
            <template #icon>
              <BookOutlined/>
            </template>
            New
          </ant-button>
        </div>
        <div class="search">
          <input type="text" placeholder="Find a repository..." class="search-input">
        </div>
        <div>
          <ant-list size="small" :data-source="ownRepositoryList">
            <template #renderItem="{ item }">
              <ant-list-item>
                <div class="repo-item" @click="goRepoPage(item)">
                  <div class="icon">
                    <img src="@/assets/home-aside/knowledge.svg" height="16" width="16" alt="">
                  </div>
                  <span class="text" style="max-width: 125px">{{ item.author.name }}</span>
                  /
                  <span class="" style="max-width: 260px">{{ item.entity.name }}</span>
                </div>
              </ant-list-item>
            </template>
          </ant-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store';
import {
  computed, defineComponent, onMounted, reactive, ref
} from 'vue';
import { useRouter } from 'vue-router';
import { BookOutlined } from '@ant-design/icons-vue';
import type { EntityCompletelyListItemType } from '../../../../edu-graph-constant';

export default defineComponent({
  name: 'home-aside',
  components: {
    BookOutlined
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const ownRepositoryList = computed(() => store.state.repositoryList.ownRepositoryList);
    const user = reactive<{content?: any}>({
      content: undefined
    });

    const goCreateRepositoryPage = async () => {
      await router.push('/repository/create');
    };
    onMounted(() => {
      if (localStorage.getItem('user') !== null) {
        console.log(localStorage.getItem('user'));
        user.content = JSON.parse(localStorage.getItem('user')!);
      }
    });
    const goRepoPage = async (item: EntityCompletelyListItemType) => {
      await router.push({
        name: 'EditableRepository',
        params: {
          repositoryEntityId: item.entity.id
        }
      });
    };
    return {
      goCreateRepositoryPage,
      ownRepositoryList,
      goRepoPage,
      user
    };
  }
});
</script>

<style scoped lang="scss">
@import '../../style/common.scss';

.home-aside {
  height: 100%;
  width: 350px;
  padding: 0 32px;
  background: #fff;

  .user {
    display: flex;
    //justify-content: space-between;
    padding: 16px 0;
    margin-bottom: 24px;
    margin-top: 16px;
    border-bottom: 1px solid #eaecef;

    .name {
      height: 32px;
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
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 4px;
        align-items: center;
        justify-content: space-between;

        .new-btn {
          color: #fff;
          padding: 3px 12px;
          font-size: 12px;
          line-height: 20px;
          background: #2ea44f;
          border-radius: 6px;
          cursor: pointer;
          border: 1px solid;
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
        font-weight: 600;
        width: 100%;
        font-size: 14px;
        line-height: 22px;
        cursor: pointer;

        .icon {
          margin-right: 8px;
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
