<template>
  <div class="action-button">
    <div class="action" @click="handleAction">
      <slot name="icon"></slot>
      <div class="title">{{ title }}</div>
    </div>
    <div class="total" @click="handleTotalClick">{{ computedTotal }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});
const emit = defineEmits(['action', 'total']);

const handleAction = () => {
  emit('action');
};
const handleTotalClick = () => {
  emit('total');
};

// todo 点赞量展示工具方法
function numConvert(num: number): string {
  let text = num.toString();
  if (num >= 10000) {
    text = `${Math.round(num / 1000) / 10}W`;
  } else if (num >= 1000) {
    text = `${Math.round(num / 100) / 10}K`;
  }
  return text;
}

const computedTotal = computed(() => numConvert(props.total));
</script>

<style scoped lang="scss">
@import "../../style/common.scss";

.action-button {
  cursor: pointer;
  height: 32px;
  width: max-content;
  display: flex;
  align-items: center;
  background: #fff;
  font-weight: 500;

  .action {
    height: 32px;
    box-sizing: border-box;
    line-height: 30px;
    padding: 0 6px;
    display: flex;
    gap: 3px;
    align-items: center;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    border: 1px solid $hoverDeepBackColor;

    &:hover {
      background: $hoverDeepBackColor;
    }

    .title {
      font-size: 12px;
    }
  }

  .total {
    height: 32px;
    padding: 0 8px;
    line-height: 30px;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    border: 1px solid $hoverDeepBackColor;
    border-left: none;
    font-size: 12px;
    &:hover {
      background: $hoverDeepBackColor;
    }
  }
}

</style>
