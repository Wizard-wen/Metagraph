<template>
  <div id="container" style="height: 600px; width: 100%;"></div>
</template>

<script lang="ts">
import '@antv/x6-vue-shape';
import { defineComponent, onMounted, onUnmounted } from 'vue';
import {
  graph, stencil, initFlowchart, clearData
} from './index';

export default defineComponent({
  name: 'antv-flowchart',
  setup() {
    onMounted(() => {
      initFlowchart();
    });
    onUnmounted(() => {
      console.log(graph.value?.toJSON());
      clearData();
    });

    return {
      graph,
      stencil
    };
  }
});
</script>

<style scoped lang="scss">

</style>
