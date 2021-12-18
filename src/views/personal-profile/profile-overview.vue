<template>
  <div class="repository-list" v-if="ownRepositoryList.target.length">
    <template v-for="item in ownRepositoryList.target">
      <div class="repository-card">
        <div class="card-head">
          <div class="name">{{ item.content.name }}</div>
          <ant-tag>{{ item.content.type }}</ant-tag>
        </div>
        <div class="description">
          {{ item.content.description }}
        </div>
        <div class="bottom">
          <ant-tag>domain</ant-tag>
          <div>
            <star-icon></star-icon>
            {{ item.star }}
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, reactive, ref, inject
} from 'vue';
import { EntityCompletelyListItemType } from 'edu-graph-constant';
import { userIdKey } from '@/views/personal-profile/personal.profile.provide';
import { RepositoryNoAuthApiService } from '@/api.service';
import { StarIcon } from '@/components/icons';

export default defineComponent({
  name: 'profile-overview',
  components: {
    StarIcon
  },
  setup() {
    const ownRepositoryList = reactive<{ target: EntityCompletelyListItemType[] }>({ target: [] });
    const userId = inject(userIdKey, ref(''));
    const getOwnRepositoryList = async () => {
      const result = await RepositoryNoAuthApiService.getList({
        pageIndex: 0,
        pageSize: 8,
        userId: userId.value
      });
      if (result.data) {
        ownRepositoryList.target = result.data.list;
      }
    };
    onMounted(async () => {
      await getOwnRepositoryList();
    });
    return {
      ownRepositoryList
    };
  }
});
</script>

<style scoped lang="scss">
.repository-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: flex-start;
  gap: 15px;

  .repository-card {
    border-radius: 6px;
    border: 1px solid #CCC;
    min-height: 75px;
    padding: 15px;

    .card-head {
      display: flex;
      justify-content: space-between;

      .name {
        font-weight: bold;
      }
    }
  }

  .description {
    text-align: left;
    font-size: 12px;
    height: 60px;
  }

  .bottom {
    display: flex;
    justify-content: flex-start;
    gap: 15px;
  }
}
</style>
