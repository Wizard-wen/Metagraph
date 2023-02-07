<template>
  <div class="operation-icon" @click="toggleCode">
    <operation-tooltip :desc="'代码段'">
      <div class="icon">
        <code-icon
          class="icon-svg"
          :class="{ 'is-active': editor.isActive('codeBlock') }"/>
      </div>
    </operation-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { Editor } from '@tiptap/vue-3';
import { defineProps, PropType } from 'vue';
import { CodeIcon } from '@/components/icons';
import OperationTooltip from '@/components/tiptap-text-editor/controls/operation-tooltip.vue';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});

function toggleCode() {
  props.editor.chain()
    .focus()
    .toggleCodeBlock()
    .run();
}

</script>
<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
