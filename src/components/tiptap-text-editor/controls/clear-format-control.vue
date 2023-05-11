<template>
  <div class="operation-icon" @click="saveSectionArticle">
    <operation-tooltip :desc="'清理格式'">
      <div class="icon">
        <EraserIcon class="icon-svg"/>
      </div>
    </operation-tooltip>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, PropType } from 'vue';
import OperationTooltip from '@/components/tiptap-text-editor/controls/operation-tooltip.vue';
import { EraserIcon } from '@/components/icons';
import { Editor } from '@tiptap/vue-3';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});

const emits = defineEmits(['save']);

function saveSectionArticle() {
  props.editor.chain().unsetAllMarks().clearNodes().focus().run();
}
</script>

<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
