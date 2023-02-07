<template>
  <div class="operation-icon" @click="toggleStrike()">
    <operation-tooltip :desc="'划线'">
    <div class="icon">
      <StrikethroughOutlined
        class="icon-svg"
        :class="{ 'is-active': editor.isActive('strike') }"/>
    </div>
    </operation-tooltip>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3';
import { defineEmits, defineProps, PropType } from 'vue';
import { StrikethroughOutlined } from '@ant-design/icons-vue';
import OperationTooltip from '@/components/tiptap-text-editor/controls/operation-tooltip.vue';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});
const emits = defineEmits(['save']);

function toggleStrike() {
  props.editor.chain().focus().toggleStrike().run();
}
</script>

<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
