<template>

</template>

<script lang="ts">
import { Graph, Addon } from "@antv/x6";
import { defineComponent, PropType, toRefs } from 'vue';

export default defineComponent({
  name: 'graph.drop',
  props: {
    graph: {
      type: Object as PropType<Graph>
    }
  },
  setup(prop) {
    const { graph } = toRefs<{
      graph?: Graph
    }>(prop);
  }
});
</script>

<style scoped>

</style>
