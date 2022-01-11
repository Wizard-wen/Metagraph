<template>
  <div class="repository-item">
    <ant-avatar class="icon" :src="repository.author.avatar"></ant-avatar>
    <div class="content">
      <div class="title" @click="goUserProfilePage">
        {{ repository.author.name }}
      </div>
      <div class="box">
        <div class="name" @click="goRepositoryPage($event)">
          {{ repository.content.name }}
        </div>
        <div class="des">{{ repository.content.description }}</div>
        <div class="tag" v-if="repository.content.domain.length">
          <ant-tag v-for="item in repository.content.domain">
            {{ item.domainBaseTypeName }}-{{ item.domainName }}
          </ant-tag>
        </div>
        <div class="others">
          <div class="star">
            <StarOutlined style="margin-right: 8px"/>
            <div>{{ repository.star }}</div>
          </div>
          <div class="star">
            <CommentIcon style="margin-right: 8px"/>
            <div>{{ repository.comment }}</div>
          </div>
          <div class="updatedAt">更新于 {{ date }}</div>
        </div>
        <ant-button
          v-if="isLogin"
          class="star-btn"
          @click="addStar($event, repository.hasStared)"
          :type="repository.hasStared ? 'primary': 'default'"
        >{{ repository.hasStared ? 'Stared' : 'Star' }}
        </ant-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { EntityCompletelyListItemType } from 'metagraph-constant';
import {
  defineComponent, toRef, PropType, computed
} from 'vue';
import { useRouter } from 'vue-router';
import { StarOutlined } from '@ant-design/icons-vue';
import { useStore } from '@/store';
import { CommonUtil } from '@/utils/common.util';
import { StarApiService } from '@/api.service/star.api.service';
import { CommentIcon } from '@/components/icons';

export default defineComponent({
  name: 'repository-item',
  components: {
    StarOutlined,
    CommentIcon
  },
  props: {
    repository: {
      type: Object as PropType<EntityCompletelyListItemType>,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const repository = toRef(props, 'repository');
    const isLogin = computed(() => store.state.user.isLogin);
    const date = computed(() => CommonUtil.formatDate(
      new Date(repository.value.content.updatedAt),
      'yyyy-MM-dd hh:mm:ss'
    ));
    const userModel = computed(() => store.state.user.user);
    const goRepositoryPage = () => {
      router.push({
        name: 'RepositoryEditor',
        query: {
          repositoryEntityId: repository.value.entity.id,
          type: repository.value.author.id === userModel.value?.id ? 'edit' : 'view'
        }
      });
    };
    const addStar = async (event: MouseEvent, status: boolean) => {
      event.stopPropagation();
      if (status) {
        await StarApiService.cancel({
          entityId: repository.value.entity.id,
          entityType: 'Repository'
        });
      } else {
        await StarApiService.create({
          entityId: repository.value.entity.id,
          entityType: 'Repository'
        });
      }
    };
    const goUserProfilePage = () => {
      router.push({
        path: '/profile',
        query: {
          id: repository.value.author.id
        }
      })
        .then();
    };
    return {
      goRepositoryPage,
      addStar,
      isLogin,
      date,
      goUserProfilePage
    };
  }
});
</script>

<style scoped lang="scss">
.repository-item {
  padding: 16px 0;
  border-bottom: 1px solid #eaecef;
  display: flex;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;

  .icon {
    margin-right: 15px;
  }

  .content {
    width: 100%;

    .title {
      font-weight: bold;
      height: 32px;
      line-height: 32px;
      text-align: left;
      cursor: pointer;
      width: max-content;

      &:hover {
        color: #1790ff;
      }
    }

    .box {
      position: relative;
      text-align: left;
      margin-top: 8px;
      border-radius: 6px;
      border: 1px solid #e1e4e8;
      background: #fff;
      padding: 16px;

      .name {
        cursor: pointer;
        font-weight: 600;
        font-size: 16px;
      }

      .des {
        margin-top: 4px;
        min-height: 20px;
      }

      .tag {
        line-height: 22px;
        padding: 5px 0;
      }

      .others {
        margin-top: 8px;
        display: flex;
        align-items: center;

        .star {
          margin-right: 16px;
          display: flex;
          align-items: center;
          line-height: 22px;
        }

        .updatedAt {
          margin-right: 16px;
          line-height: 22px;
        }
      }

      .star-btn {
        position: absolute;
        padding: 2px 12px;
        font-size: 12px;
        line-height: 18px;
        top: 16px;
        right: 16px;
        border: 1px solid #1b1f2326;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;

        &::v-deep(.ant-btn) {
          height: 28px;
        }
      }
    }
  }
}
</style>
