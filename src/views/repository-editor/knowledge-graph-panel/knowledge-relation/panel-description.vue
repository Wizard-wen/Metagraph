<template>
  <div class="panel-item">
    <div class="title">{{ title }}</div>
    <div
      class="item view-item"
      v-for="(item, index) in description"
      :key="index">
      <div class="left">{{ item.title }}</div>
      <div class="right">{{ item.content }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, PropType } from 'vue';

defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: Array as PropType<{
      title: string;
      content: string
    }[]>
  }
});
</script>

<style scoped lang="scss">
@import "../../../../style/common.scss";

.panel-item {
  padding: 4px 0 8px;
  border-bottom: 1px solid $borderColor;
  width: 100%;

  .title {
    height: 36px;
    line-height: 36px;
    font-size: 12px;
    width: 100%;
    padding: 0 16px;
    font-weight: bold;
    text-align: left;
  }

  .view-item {
    &:hover {
      background: $hoverBackColor;
    }
  }

  .item {
    display: flex;
    margin: 0 16px 0 8px;
    padding: 4px 0 4px 8px;
    line-height: 20px;
    border-radius: 6px;
    font-size: 12px;
    text-align: left;
    align-items: center;

    .left {
      flex: 0 0 64px;
      color: $lightFontColor;
    }

    .right {
      flex: 1 1 auto;
      word-wrap: break-word;
      white-space: normal;
      word-break: break-all;
    }
  }
}
</style>
