<template>
  <div class="operation-icon" @click="toggleCode">
    <div class="icon">
      <CodeIcon
        class="icon-svg"
        :class="{ 'is-active': editor.isActive('code') }"/>
    </div>
    <div class="name">
      代码段
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3';
import { defineEmits, defineProps, PropType } from 'vue';
import { CodeIcon } from '@/components/icons';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});

function toggleCode() {
  props.editor.chain().focus().toggleCode().run();
}
</script>
<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
