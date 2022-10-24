<template>
  <div class="operation-icon" @click="toggleBlockquote">
    <div class="icon">
      <quote
        class="icon-svg"
        :class="{ 'is-active': editor.isActive('blockquote') }"/>
    </div>
    <div class="name">
      引用
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3';
import { defineEmits, defineProps, PropType } from 'vue';
import { Quote } from '@/components/icons';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});
const emits = defineEmits(['save']);

function toggleBlockquote() {
  props.editor.chain().focus().toggleBlockquote().run();
}
</script>
<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
