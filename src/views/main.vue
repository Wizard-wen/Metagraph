<template>
  <ant-spin :spinning="spinning">
    <div class="page-container">
      <metagraph-header></metagraph-header>
      <router-view></router-view>
    </div>
  </ant-spin>
</template>

<script lang="ts" setup>
import { Spin as AntSpin } from 'ant-design-vue';
import { computed } from 'vue';
import { useStore } from '@/store';
import MetagraphHeader from './main/metagraph-header.vue';
const store = useStore();
const spinning = computed(() => store.state.global.isSpinning);

</script>
<style lang="scss" scoped>
.page-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
