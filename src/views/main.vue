<template>
  <ant-spin :spinning="spinning">
    <edu-header></edu-header>
    <router-view></router-view>
  </ant-spin>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { defineComponent, computed } from 'vue';
import EduHeader from './main/edu.header.vue';

export default defineComponent({
  name: 'Main',
  components: {
    EduHeader
  },
  setup() {
    const store = useStore();
    const spinning = computed(() => store.state.isSpinning);
    return {
      spinning
    };
  }
});
</script>
