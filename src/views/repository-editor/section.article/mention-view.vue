<template>
  <node-view-wrapper>
    Vue Component
  </node-view-wrapper>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NodeViewWrapper } from '@tiptap/vue-3';

export default defineComponent({
  name: 'mention-view',
  components: {
    NodeViewWrapper
  }
});
</script>

<style scoped>

</style>
