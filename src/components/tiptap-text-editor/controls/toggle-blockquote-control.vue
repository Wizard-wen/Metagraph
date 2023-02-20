<template>
  <div class="operation-icon" @click="toggleBlockquote">
    <operation-tooltip :desc="'引用'">
    <div class="icon" :class="{ 'is-active': editor.isActive('blockquote') }">
      <quote
        class="icon-svg"
        />
    </div>
    </operation-tooltip>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3';
import { defineEmits, defineProps, PropType } from 'vue';
import { Quote } from '@/components/icons';
import OperationTooltip from '@/components/tiptap-text-editor/controls/operation-tooltip.vue';

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
