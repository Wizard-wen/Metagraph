<template>
  <ant-spin :spinning="spinning">
    <metagraph-header></metagraph-header>
    <router-view></router-view>
  </ant-spin>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';
import MetagraphHeader from './main/metagraph-header.vue';

export default defineComponent({
  name: 'Main',
  components: {
    MetagraphHeader
  },
  setup() {
    const store = useStore();
    const spinning = computed(() => store.state.global.isSpinning);
    return {
      spinning
    };
  }
});
</script>
