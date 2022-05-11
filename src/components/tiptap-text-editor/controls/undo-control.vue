<template>
  <div class="operation-icon" @click="undo">
    <div class="icon">
      <UndoOutlined viewBox="0 0 1024 1024" class="icon-svg"/>
    </div>
    <div class="name">
      撤销
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3';
import { defineEmits, defineProps, PropType } from 'vue';
import { UndoOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});
const emits = defineEmits(['save']);

function undo() {
  props.editor.chain().focus().undo().run();
}
</script>

<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
