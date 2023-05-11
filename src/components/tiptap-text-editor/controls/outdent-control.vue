<template>
  <div class="operation-icon" @click="toggleItalic">
    <operation-tooltip :desc="'减少缩进'">
      <div class="icon">
        <OutdentIcon
          class="icon-svg"/>
      </div>
    </operation-tooltip>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3';
import { defineEmits, defineProps, PropType } from 'vue';
import OperationTooltip from '@/components/tiptap-text-editor/controls/operation-tooltip.vue';
import { OutdentIcon } from '@/components/icons';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});
const emits = defineEmits(['save']);

function toggleItalic() {
  props.editor.commands.outdent();
}
</script>
<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
