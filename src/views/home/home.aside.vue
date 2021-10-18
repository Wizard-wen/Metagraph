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
          <ant-button :size="'small'" @click="goCreateRepositoryPage">
            <template #icon>
              <PlusOutlined/>
            </template>
            New
          </ant-button>
        </div>
        <div class="search">
          <ant-input
            v-model:value="searchText"
            type="text"
            @change="handleFilterRepositoryList($event)"
            placeholder="Find a repository..."
            class="search-input"></ant-input>
        </div>
        <div>
          <ant-list size="small" :data-source="filteredRepositoryList">
            <template #renderItem="{ item }">
              <ant-list-item>
                <div class="repo-item" @click="goRepoPage(item)">
                  <div class="icon">
                    <repository-list-icon style="font-size: 16px;"></repository-list-icon>
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
import { RepositoryModelType } from 'edu-graph-constant';
import {
  defineComponent, onMounted, reactive, ref
} from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { EntityCompletelyListItemType } from 'edu-graph-constant';
import { useStore } from '@/store';
import { RepositoryApiService } from '@/api.service';
import RepositoryListIcon from '@/components/icons/repository.list.icon.vue';

export default defineComponent({
  name: 'home-aside',
  components: {
    PlusOutlined,
    RepositoryListIcon
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const searchText = ref<string>('');
    const ownRepositoryList = ref<EntityCompletelyListItemType[]>();
    const filteredRepositoryList = ref<EntityCompletelyListItemType[]>();
    const user = reactive<{ content?: any }>({
      content: undefined
    });
    const getOwnRepositoryList = async () => {
      const result = await RepositoryApiService.getOwnRepositoryList();
      if (result.data) {
        ownRepositoryList.value = result.data;
      }
    };
    const goCreateRepositoryPage = async () => {
      await router.push('/repository/create');
    };
    onMounted(async () => {
      if (localStorage.getItem('user') !== null) {
        console.log(localStorage.getItem('user'));
        user.content = JSON.parse(localStorage.getItem('user')!);
        await getOwnRepositoryList();
        filteredRepositoryList.value = ownRepositoryList.value;
      }
    });
    const goRepoPage = async (item: EntityCompletelyListItemType) => {
      await router.push({
        name: 'EditableRepository',
        query: {
          repositoryEntityId: item.entity.id
        }
      });
    };
    const handleFilterRepositoryList = () => {
      console.log(searchText.value);
      if (searchText.value === '') {
        filteredRepositoryList.value = ownRepositoryList.value;
      }
      filteredRepositoryList.value = ownRepositoryList
        .value?.filter(
          (item: EntityCompletelyListItemType) => (item.content as RepositoryModelType).name.includes(searchText.value)
        );
    };
    return {
      goCreateRepositoryPage,
      ownRepositoryList,
      goRepoPage,
      handleFilterRepositoryList,
      filteredRepositoryList,
      user,
      searchText
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
    padding: 16px 0;
    margin-bottom: 24px;
    //margin-top: 16px;
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
