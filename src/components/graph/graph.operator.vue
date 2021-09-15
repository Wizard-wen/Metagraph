<template>
  <a-button-group>
<!--    <a-button @click="zoomIn">放大</a-button>-->
<!--    <a-button @click="zoomOut">缩小</a-button>-->
<!--    <a-button @click="removeNode">删除</a-button>-->
<!--    <a-button @click="add">add</a-button>-->
<!--    <a-button @click="parseJSON">parse</a-button>-->
  </a-button-group>
</template>

<script lang="ts">
import { IGraphModel } from '@/components/graph/customer.node';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'graph.operator',
  data() {
    return {};
  },
  props: {
    // graphModel: {
    //   type: Object as PropType<IGraphModel>,
    //   required: true
    // }
  },
  methods: {
    // zoomIn() {
    //   this.graphModel.zoom(-1);
    // },
    // zoomOut() {
    //   this.graphModel.zoom(-1);
    // },
    // removeNode() {
    //   this.graphModel.remove();
    // },
    // add() {
    //   return 1;
    // },
    // parseJSON() {
    //   this.graphModel.parseJSON();
    // },
    // startDrag(e: any) {
    //   this.graphModel.startDrag(e);
    // }
  }
});
</script>

<style scoped>

</style>
