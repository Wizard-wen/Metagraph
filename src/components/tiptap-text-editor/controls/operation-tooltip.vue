<template>
  <a-tooltip :trigger="['hover']" :title="desc" :getPopupContainer="getPopupContainer"
             :overlayClassName="'custom-tool-tip'" placement="bottom">
    <slot></slot>
  </a-tooltip>
</template>

<script lang="ts" setup>
import { Tooltip as ATooltip } from 'ant-design-vue';

defineProps({
  desc: {
    type: String
  }
});

function getPopupContainer(triggerNode: any) {
  return triggerNode.parentNode;
}
</script>

<style scoped lang="scss">
.custom-tool-tip {
  border-radius: 6px;

  .ant-tooltip-arrow {
    display: none !important;
  }

  .ant-tooltip-inner {
    border-radius: 6px !important;
  }

  &::v-deep(.ant-tooltip-arrow) {
    display: none !important;
  }

  &::v-deep(.ant-tooltip-inner) {
    border-radius: 6px !important;
  }
}
</style>
