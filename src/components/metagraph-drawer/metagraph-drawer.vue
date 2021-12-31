<template>
  <ant-drawer
    :width="600"
    :title="title"
    placement="right"
    :closable="false"
    :visible="isDrawerVisible"
    @close="afterVisibleChange">
    <slot name="content"></slot>
  </ant-drawer>
</template>

<script lang="ts">
import {
  defineComponent,
} from 'vue';

export default defineComponent({
  name: 'metagraph-drawer',
  props: {
    isDrawerVisible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  emits: ['visibleChange'],
  setup(props, context) {
    const afterVisibleChange = (status: boolean) => {
      context.emit('visibleChange', status);
    };
    return {
      afterVisibleChange
    };
  },
});
</script>

<style scoped>

</style>
