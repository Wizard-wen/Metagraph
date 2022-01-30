<template>
  <div class="repository-item">
    <ant-avatar  :size="32" class="icon"
                v-if="activityItem.user.avatar"
                :src="activityItem.user.avatar"></ant-avatar>
    <div class="content">
      <div class="title" v-html="activityItem.content.content"></div>
      <div class="box">
        <div class="name-content">
          <div class="name" @click="goRepositoryPage($event)">
            {{ activityItem.entity.content.name }}
          </div>
          <ant-tag color="#2b7489">知识点</ant-tag>
        </div>
        <div class="description-content">
          <div class="description" v-html="activityItem.entity.content.descriptionHTML"></div>
        </div>

        <div class="tag" v-if="activityItem.entity.content.domain.length">
          <ant-tag v-for="item in activityItem.entity.content.domain">
            {{ item.domainBaseTypeName }}-{{ item.domainName }}
          </ant-tag>
        </div>
        <div class="others">
          <div class="star">
            <StarOutlined style="margin-right: 8px"/>
            <div>{{ activityItem.entity.star }}</div>
          </div>
          <div class="star">
            <CommentIcon style="margin-right: 8px"/>
            <div>{{ activityItem.entity.comment }}</div>
          </div>
          <div class="updatedAt">更新于 {{ date }}</div>
        </div>
        <ant-button
          v-if="isLogin"
          class="star-btn"
          :loading="isStarButtonDisabled"
          @click="addStar($event, activityItem.entity.hasStared)"
          :type="activityItem.entity.hasStared ? 'primary': 'default'"
        >{{ activityItem.entity.hasStared ? '已点赞' : '点赞' }}
        </ant-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ActivityModelType, EntityCompletelyListItemType, StarResponseType, UserModelType
} from 'metagraph-constant';
import {
  defineComponent, toRef, PropType, computed, ref
} from 'vue';
import { useRouter } from 'vue-router';
import {
  message, Button, Avatar, Tag
} from 'ant-design-vue';
import { StarOutlined } from '@ant-design/icons-vue';
import { useStore } from '@/store';
import { CommonUtil } from '@/utils/common.util';
import { StarApiService } from '@/api.service/star.api.service';
import { CommentIcon } from '@/components/icons';
import { PublicApiResponseType } from '@/utils';

export default defineComponent({
  name: 'activity-knowledge-item',
  components: {
    StarOutlined,
    CommentIcon,
    AntButton: Button,
    AntAvatar: Avatar,
    AntTag: Tag
  },
  props: {
    activityItem: {
      type: Object as PropType<{
        user: UserModelType,
        entity: EntityCompletelyListItemType,
        followedUser?: UserModelType,
        content: ActivityModelType
      }>,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const activityItem = toRef(props, 'activityItem');
    const isLogin = computed(() => store.state.user.isLogin);
    const date = computed(() => CommonUtil.formatDate(
      new Date(activityItem.value.entity.content.updatedAt),
      'yyyy-MM-dd hh:mm:ss'
    ));
    const isStarButtonDisabled = ref(false);
    const userModel = computed(() => store.state.user.user);
    const goRepositoryPage = () => {
      router.push({
        name: 'RepositoryEditor',
        query: {
          repositoryEntityId: activityItem.value.entity.entity.id,
          type: activityItem.value.entity.author.id === userModel.value?.id ? 'edit' : 'view'
        }
      });
    };
    const addStar = async (event: MouseEvent, status: boolean) => {
      event.stopPropagation();
      isStarButtonDisabled.value = true;
      let result: PublicApiResponseType<void | StarResponseType>;
      if (status) {
        result = await StarApiService.cancel({
          entityId: activityItem.value.entity.entity.id,
          entityType: 'Repository'
        });
      } else {
        result = await StarApiService.create({
          entityId: activityItem.value.entity.entity.id,
          entityType: 'Repository'
        });
      }
      if (result.code === 0) {
        if (status) {
          activityItem.value.entity.hasStared = false;
          if (activityItem.value.entity.star > 0) {
            activityItem.value.entity.star -= 1;
          } else {
            activityItem.value.entity.star = 0;
          }
        } else {
          activityItem.value.entity.hasStared = true;
          activityItem.value.entity.star += 1;
        }
      } else {
        message.error(status ? '取消点赞失败' : '点赞失败');
      }
      isStarButtonDisabled.value = false;
    };
    const goUserProfilePage = () => {
      router.push({
        path: '/profile',
        query: {
          id: activityItem.value.entity.author.id
        }
      })
        .then();
    };
    return {
      goRepositoryPage,
      addStar,
      isLogin,
      date,
      goUserProfilePage,
      isStarButtonDisabled
    };
  }
});
</script>

<style scoped lang="scss">
@import '../../../style/tiptap.common.scss';

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
        color: #0969DA;
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

      .name-content {
        height: 30px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;

        .name {
          height: 30px;
          line-height: 30px;
          cursor: pointer;
          font-weight: 600;
          font-size: 16px;
        }
      }

      .description-content {
        padding: 10px;
        border-radius: 5px;
        background: #ffffff;
      }

      .description {
        @include tiptap-style;
        padding: 5px 10px;
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
