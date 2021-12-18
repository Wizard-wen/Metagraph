<template>
  <div class="knowledge-header">
    <div class="left">
      <go-back-icon class="back-icon" @click="goBack"></go-back-icon>
      <div class="title">知识点名称</div>
      <ant-tag class="status-tag">未认证</ant-tag>
    </div>
    <div class="right">
      <ant-tag>引用 23</ant-tag>
      <ant-tag>被引 23</ant-tag>
      <ant-tag>点赞 23</ant-tag>
      <ant-tag>评论 23</ant-tag>
      <ant-button type="primary" class="pull-request-button">提交认证</ant-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

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

    .pull-request-button {
      margin-left: 20px;
    }
  }
}
</style>
