<template>
  <div class="knowledge-header">
    <div class="left">
      <go-back-icon class="back-icon" @click="goBack"></go-back-icon>
      <div class="title">{{ knowledgeName }}</div>
      <ant-tag class="status-tag">{{ knowledgeAuthStatus }}</ant-tag>
    </div>
    <div class="right">
      <social-action-button
        :title="'引用数量'" :total="mentionCount"></social-action-button>
      <social-action-button
        :title="'被引次数'" :total="mentionedCount"></social-action-button>
      <social-action-button
        :title="'点赞'" :total="knowledgeStarCount"></social-action-button>
      <social-action-button
        :title="'评论'" :total="knowledgeCommentCount"></social-action-button>
      <ant-button type="primary" class="pull-request-button">提交认证</ant-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import SocialActionButton from '@/components/social-action-button/social-action-button.vue';
import { GoBackIcon } from '@/components/icons';
import {
  knowledgeName,
  knowledgeAuthStatus,
  knowledgeStarCount,
  knowledgeCommentCount
} from './model/knowledge.edit';

const mentionCount = ref(23);
const mentionedCount = ref(23);
const router = useRouter();

async function goBack() {
  router.go(-1);
}
</script>
<style scoped lang="scss">
@import "../../style/common.scss";

.knowledge-header {
  background: #fafbfc;
  height: 56px;
  border-bottom: 1px solid $borderColor;
  display: flex;
  justify-content: space-between;

  .left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    height: 56px;
    gap: 15px;

    .back-icon {
      cursor: pointer;
      font-size: 18px;
    }

    .title {
      height: 32px;
      line-height: 32px;
      font-size: 18px;
    }

    .status-tag {
      height: 24px;
      line-height: 24px;
      border-radius: 4px;
    }
  }

  .right {
    padding-right: 30px;
    height: 56px;
    display: flex;
    align-items: center;
    gap: 15px;

    .pull-request-button {
      margin-left: 20px;
    }
  }
}
</style>
