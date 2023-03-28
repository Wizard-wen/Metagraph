<template>
  <div class="activity-list-item">
    <ant-avatar
      :size="28" class="user-avatar"
      v-if="activityItem.user.avatar"
      :src="activityItem.user.avatar"></ant-avatar>
    <div class="activity-content">
      <activity-item-title :activity-item="activityItem"></activity-item-title>
      <div class="activity-box">
        <div class="name-content">
          <div class="name" @click="goProfilePage">
            {{ activityItem.entity.content.name }}
          </div>
        </div>
        <div class="description-content">
          <tiptap-editor-readonly
            class="custom-tiptap-readonly"
            :article-content="activityItem.entity.content.description"></tiptap-editor-readonly>
        </div>
        <div class="tag-content" v-if="activityItem.entity.content.domain.length">
          <m-tag
            :key="index"
            v-for="(item, index) in activityItem.entity.content.domain"
            :title="item.domainName"></m-tag>
        </div>
        <div class="others">
          <div class="star">
            <StarOutlined class="star-icon"/>
            {{ activityItem.entity.star }}
          </div>
          <div class="star">
            <CommentOutlined class="star-icon"/>
            {{ activityItem.entity.comment }}
          </div>
          <div class="updatedAt">{{ date }}</div>
        </div>
        <div class="control-btn">
          <add-to-plan-button
            :custom-class="['control-btn', 'plan-btn']"
            :entity-id="activityItem.entity.entity.id"
            :entity-type="activityItem.entity.entity.entityType"></add-to-plan-button>
          <m-button
            v-if="isLogin"
            @click="addStar($event, activityItem.entity.hasStared)"
            :title="'点赞'"
            :is-loading="isStarButtonDisabled">
            <template #icon>
              <star-filled v-if="activityItem.entity.hasStared"/>
              <star-outlined v-else/>
            </template>
          </m-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AddToPlanButton from '@/business/add-to-plan-button/add-to-plan-button.vue';
import type {
  ActivityModelType,
  EntityCompletelyListItemType,
  StarResponseType,
  UserModelType
} from 'metagraph-constant';
import { computed, defineProps, PropType, ref, toRef } from 'vue';
import { Avatar as AntAvatar, message } from 'ant-design-vue';
import { MButton, MTag } from '@/metagraph-ui';
import { CommentOutlined, StarFilled, StarOutlined } from '@ant-design/icons-vue';
import ActivityItemTitle from '@/views/home-page/authed-main-list/activity-item-title.vue';
import { useStore } from '@/store';
import { CommonUtil } from '@/utils/common.util';
import { StarApiService } from '@/api-service/star.api.service';
import { PublicApiResponseType } from '@/utils';
import TiptapEditorReadonly from '@/components/tiptap-text-editor/tiptap-editor-readonly.vue';
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
const activityItem = toRef(props, 'activityItem');
const isLogin = computed(() => store.state.user.isLogin);
const date = computed(() => CommonUtil.timeAgo(
  new Date(activityItem.value.entity.content.updatedAt).getTime()
));
const isStarButtonDisabled = ref(false);

function goProfilePage() {
  RouterUtil.jumpToBlankPage('/knowledge/preview', {
    publishedKnowledgeEntityId: activityItem.value.entity.entity.id
  });
}

async function addStar(event: MouseEvent, status: boolean) {
  event.stopPropagation();
  isStarButtonDisabled.value = true;
  let result: PublicApiResponseType<void | StarResponseType>;
  if (status) {
    result = await StarApiService.cancel({
      entityId: activityItem.value.entity.entity.id,
      entityType: 'Knowledge'
    });
  } else {
    result = await StarApiService.create({
      entityId: activityItem.value.entity.entity.id,
      entityType: 'Knowledge'
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
}

</script>

<style scoped lang="scss">
@import '../../../style/tiptap.common.scss';
@import "activity.scss";
@import "../../../style/common.scss";
</style>
