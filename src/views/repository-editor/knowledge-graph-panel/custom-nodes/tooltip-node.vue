<template>
  <ant-tooltip
    class="box-item"
    :trigger="['hover']"
    :title="props.content"
    :getPopupContainer="getPopupContainer"
    placement="top">
    <div></div>
  </ant-tooltip>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue';
import { Tooltip as AntTooltip } from 'ant-design-vue';
import { EyeOutlined } from '@ant-design/icons-vue';

const props = defineProps<{
  content?: string
  visible?: boolean
}>();

function getPopupContainer(triggerNode: any) {
  return triggerNode.parentNode;
}
</script>
