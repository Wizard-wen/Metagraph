<template>
  <div class="activity-list-item">
    <ant-avatar
      :size="28"
      class="user-avatar"
      v-if="activityItem.author.avatar"
      :src="activityItem.author.avatar"></ant-avatar>
    <div class="activity-content">
      <div class="user-name">{{activityItem.author.name}}</div>
      <div class="activity-box">
        <div class="name-content">
          <div class="name" @click="goRepositoryPage">
            {{ activityContent.name }}
          </div>
        </div>
        <div class="description-text">
          {{ activityContent.description }}
        </div>
        <div class="others">
          <div class="star">
            <StarOutlined class="star-icon"/>
            <div class="star-desc">{{ activityItem.star }}</div>
          </div>
          <div class="star">
            <CommentOutlined class="star-icon"/>
            <div class="star-desc">{{ activityItem.comment }}</div>
          </div>
          <div class="updatedAt">{{ date }}</div>
        </div>
        <m-button
          v-if="isLogin"
          class="control-btn star-btn"
          :title="'点赞'"
          :isLoading="isStarButtonDisabled">
        </m-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {
  EntityCompletelyListItemType, RepositoryModelType
} from 'metagraph-constant';
import { MButton } from '@/metagraph-ui';
import { computed, defineProps, PropType, ref } from 'vue';
import { Avatar as AntAvatar } from 'ant-design-vue';
import { CommentOutlined, StarOutlined } from '@ant-design/icons-vue';
import { useStore } from '@/store';
import { CommonUtil } from '@/utils/common.util';
import { RouterUtil } from '@/utils/router.util';

const props = defineProps({
  activityItem: {
    type: Object as PropType<EntityCompletelyListItemType>,
    required: true
  }
});

const store = useStore();
const activityContent = computed(() => props.activityItem.content as RepositoryModelType);
const isLogin = computed(() => store.state.user.isLogin);
const date = computed(() => CommonUtil.timeAgo(
  new Date(activityContent.value.updatedAt).getTime()
));
const isStarButtonDisabled = ref(false);
const userModel = computed(() => store.state.user.user);
const goRepositoryPage = () => {
  RouterUtil.jumpToBlankPage('/repository/editor', {
    repositoryEntityId: props.activityItem.entity.id,
    type: props.activityItem.author.id === userModel.value?.id ? 'edit' : 'view'
  });
};

</script>

<style scoped lang="scss">
@import "../authed-main-list/activity.scss";
.user-name {
  display: flex;
  justify-content: flex-start;
  font-weight: bold;
}
</style>
