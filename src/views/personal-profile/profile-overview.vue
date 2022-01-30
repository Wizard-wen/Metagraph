<template>
  <div class="repository-list" v-if="myRepositoryEntityList.target.length">
    <template v-for="item in myRepositoryEntityList.target">
      <div class="repository-card">
        <div class="card-head">
          <div class="name">
            <repository-list-icon></repository-list-icon>
            {{ item.content.name }}
          </div>
          <ant-tag class="repository-type">
            {{ item.content.type === 'public' ? '公开' : '私有' }}
          </ant-tag>
        </div>
        <div class="description">
          {{ item.content.description }}
        </div>
        <div class="domain-tag-list">
          <ant-tag v-for="domainItem in item.content.domain">{{ domainItem.domainName }}</ant-tag>
        </div>
        <div class="bottom">
          <div>
            <star-icon></star-icon>
            {{ item.star }}
          </div>
          <div>
            <comment-icon></comment-icon>
            {{ item.comment }}
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { StarIcon, RepositoryListIcon, CommentIcon } from '@/components/icons';
import { myRepositoryEntityList } from './personal.profile';

export default defineComponent({
  name: 'profile-overview',
  components: {
    StarIcon,
    RepositoryListIcon,
    CommentIcon
  },
  setup() {
    return {
      myRepositoryEntityList
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
    padding: 10px 15px;

    .card-head {
      display: flex;
      justify-content: space-between;

      .name {
        font-weight: bold;
      }

      .repository-type {
        margin-right: 0;
        border-radius: 3px;
      }
    }
  }

  .description {
    text-align: left;
    font-size: 12px;
    height: auto;
    line-height: 25px;
    margin-bottom: 10px;
  }

  .domain-tag-list {
    height: 22px;
    text-align: left;
    margin-bottom: 10px;
  }

  .bottom {
    display: flex;
    justify-content: flex-start;
    gap: 15px;
  }
}
</style>
