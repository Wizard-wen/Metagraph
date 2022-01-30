<template>
  <div class="repository-list-item">
    <repository-list-icon class="repo-icon"></repository-list-icon>
    <div class="content">
      <div class="title">
        <span @click="goUserProfilePage">{{ repository.author.name }}</span>
        <span>/</span>
        <span @click="goRepositoryPage">{{ repository.content.name }}</span>
        <ant-tag class="type-tag">知识库</ant-tag>
      </div>
      <div class="description">
        {{ repository.content.description }}
      </div>
      <div class="tag-list">
        <div class="tag" v-for="item in repository.content.domain">
          {{ item.domainBaseTypeName }}-{{ item.domainName }}
        </div>
      </div>
      <div class="banner">
        <div class="banner-item">
          <star-icon class="icon"></star-icon>
          <div class="text">{{ repository.star }}</div>
        </div>
        <div class="banner-item">
          <comment-icon class="icon"></comment-icon>
          <div class="text">{{ repository.comment }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { EntityCompletelyListItemType } from 'metagraph-constant';
import {
  computed, defineComponent, PropType, toRef
} from 'vue';
import { useRouter } from 'vue-router';
import { StarIcon, CommentIcon, RepositoryListIcon } from '@/components/icons';
import { useStore } from '@/store';

export default defineComponent({
  name: 'repository-list-item',
  props: {
    repository: {
      type: Object as PropType<EntityCompletelyListItemType>,
      required: true
    }
  },
  components: {
    RepositoryListIcon,
    StarIcon,
    CommentIcon
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const repository = toRef(props, 'repository');
    const userModel = computed(() => store.state.user.user);
    const goRepositoryPage = async () => {
      await router.push({
        name: 'RepositoryEditor',
        query: {
          repositoryEntityId: repository.value.entity.id,
          type: repository.value.author.id === userModel.value?.id ? 'edit' : 'view'
        }
      });
    };
    const goUserProfilePage = async () => {
      await router.push({
        path: '/profile',
        query: {
          id: repository.value.author.id
        }
      });
    };
    return {
      goRepositoryPage,
      goUserProfilePage
    };
  }
});
</script>

<style scoped lang="scss">
.repository-list-item {
  width: 100%;
  padding: 24px 0;
  display: flex;
  border-bottom: 1px solid #d8dee4;

  .repo-icon {
    font-size: 18px;
    margin-right: 5px;
  }

  .content {
    text-align: left;
    flex: 1;

    .title {
      line-height: 25px;
      font-size: 18px;
      color: #0969DC;
      font-weight: 700;
      margin-bottom: 5px;
      display: flex;
      gap: 5px;
      cursor: pointer;
      align-items: center;

      .type-tag {
        display: inline-block;
        height: 22px;
        border-radius: 4px;
      }
    }

    .description {
      font-size: 14px;
      margin-bottom: 4px;
      line-height: 21px;
    }

    .tag-list {
      display: flex;

      .tag {
        line-height: 22px;
        padding: 0 8px;
        border: 1px solid transparent;
        border-radius: 12px;
        color: #0969DC;
        background: #ddf4ff;
        margin: 0 5px 5px 0;
      }
    }

    .banner {
      height: 25px;
      display: flex;
      justify-items: center;
      align-items: center;
      gap: 5px;

      .banner-item {
        font-size: 14px;
        display: flex;
        height: 25px;
        gap: 5px;
        align-items: center;

        .span-color {
          display: inline-block;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #2ea44f;
          margin-right: 5px;
        }

        .icon {
          font-size: 14px;
        }

        .text {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
