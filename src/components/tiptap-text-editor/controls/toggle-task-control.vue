<template>
  <div class="operation-icon" @click="toggleTask">
    <div class="icon">
      <CodeIcon
        class="icon-svg"
        :class="{ 'is-active': editor.isActive('taskList') }"/>
    </div>
    <div class="name">
      task
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

function toggleTask() {
  props.editor.chain().focus().toggleTaskList().run();
}
</script>
<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
