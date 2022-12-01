<template>
  <div class="activity-list-item">
    <ant-avatar
      :size="32"
      class="user-avatar"
      v-if="activityItem.user.avatar"
      :src="activityItem.user.avatar"></ant-avatar>
    <div class="activity-content">
      <activity-item-title :activity-item="activityItem"></activity-item-title>
      <div class="activity-box">
        <div class="name-content">
          <!--          <ant-tooltip placement="left" title="知识库" arrow-point-at-center>-->
          <!--            <div class="name-icon">-->
          <!--              <BookOutlined/>-->
          <!--            </div>-->
          <!--          </ant-tooltip>-->
          <div class="name" @click="goRepositoryPage">
            {{ activityItem.entity.content.name }}
          </div>
          <!--          <metagraph-tag class="type-tag-gap" :title="'知识库'"></metagraph-tag>-->
        </div>
        <div class="description-text">
          {{ activityItem.entity.content.description }}
        </div>
        <!--        <div class="tag-content" v-if="activityItem.entity.content.domain.length">-->
        <!--          <metagraph-tag-->
        <!--            :key="index"-->
        <!--            v-for="(item, index) in activityItem.entity.content.domain"-->
        <!--            :title="item.domainName"></metagraph-tag>-->
        <!--        </div>-->
        <div class="others">
          <div class="star">
            <StarOutlined class="star-icon"/>
            {{ activityItem.entity.star }}
          </div>
          <div class="star">
            <CommentOutlined class="star-icon"/>
            {{ activityItem.entity.comment }}
          </div>
          <div class="updatedAt">更新于 {{ date }}</div>
        </div>
        <metagraph-button
          v-if="isLogin"
          class="control-btn star-btn"
          :title="'点赞'"
          :isLoading="isStarButtonDisabled"
          @click="addStar($event, activityItem.entity.hasStared)">
          <template #icon>
            <star-filled class="icon-gap-5" v-if="activityItem.entity.hasStared"/>
            <star-outlined class="icon-gap-5" v-else/>
          </template>
        </metagraph-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {
  ActivityModelType,
  EntityCompletelyListItemType,
  StarResponseType,
  UserModelType
} from 'metagraph-constant';
import { MetagraphButton } from 'metagraph-ui';
import { computed, defineProps, PropType, ref, toRef } from 'vue';
import { useRouter } from 'vue-router';
import { Avatar as AntAvatar, message } from 'ant-design-vue';
import { CommentOutlined, StarFilled, StarOutlined } from '@ant-design/icons-vue';
import ActivityItemTitle from '@/views/home-page/home-page-main-list/activity-item-title.vue';
import { useStore } from '@/store';
import { CommonUtil } from '@/utils/common.util';
import { StarApiService } from '@/api.service/star.api.service';
import { PublicApiResponseType } from '@/utils';
import { RouterUtil } from '@/utils/router.util';

const props = defineProps({
  activityItem: {
    type: Object as PropType<{
      user: UserModelType,
      entity: EntityCompletelyListItemType,
      followedUser?: UserModelType,
      content: ActivityModelType
    }>,
    required: true
  }
});

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
  RouterUtil.openNewPage('/repository/editor', {
    repositoryEntityId: activityItem.value.entity.entity.id,
    type: activityItem.value.entity.author.id === userModel.value?.id ? 'edit' : 'view'
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

</script>

<style scoped lang="scss">
@import "activity.scss";
</style>
