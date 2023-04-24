<template>
  <template v-if="currentPath">
    <div class="step-length">链路步长 {{ currentPath.length }}</div>
    <div v-for="(item, index) in currentPath.segments" :key="index" class="step-card">
      <div>第{{ index + 1 }}步</div>
      <div>From {{ item.start.properties.name }}</div>
      <arrow-down-icon></arrow-down-icon>
      <div>To {{ item.end.properties.name }}</div>
    </div>
  </template>
  <empty-view v-else></empty-view>
</template>

<script lang="ts" setup>
import { ArrowDownIcon, EmptyView } from '@/components';
import { currentPath } from '../knowledge.map';
</script>

<style scoped lang="scss">
.step-length {
  height: 50px;
  line-height: 50px;
  margin-bottom: 15px;
}

.step-card {
  margin-bottom: 15px;
}
</style>
