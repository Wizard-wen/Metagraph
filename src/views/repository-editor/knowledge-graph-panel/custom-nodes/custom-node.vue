<template>
  <div :class="['node', nodeData.status ]">
    <span class="label">{{ nodeData.label }}</span>
    <span class="status"></span>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, PropType } from 'vue';
import * as AntvX6 from '@antv/x6';

interface NodeStatus {
  id: string;
  status: 'default' | 'success' | 'failed' | 'running';
  label?: string;
}

const props = defineProps({
  node: {
    type: Object as PropType<AntvX6.Node>
  }
});

const nodeData = computed(() => props.node?.getData<NodeStatus>());
</script>

<style scoped lang="scss">
.node {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 1px solid #c2c8d5;
  border-left: 4px solid #5F95FF;
  border-radius: 4px;
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.06);
}

.node img {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-left: 8px;
}

.node .label {
  display: inline-block;
  flex-shrink: 0;
  width: 104px;
  margin-left: 8px;
  color: #666;
  font-size: 12px;
}

.node .status {
  flex-shrink: 0;
}

.node.success {
  border-left: 4px solid #52c41a;
}

.node.failed {
  border-left: 4px solid #ff4d4f;
}
</style>
