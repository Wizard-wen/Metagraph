<template>
  <div class="operation-icon" @click="toggleBold">
    <div class="icon">
      <BoldOutlined
        class="icon-svg"
        :class="{ 'is-active': editor.isActive('bold') }"/>
    </div>
    <div class="name">
      加粗
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3';
import { defineEmits, defineProps, PropType } from 'vue';
import { BoldOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});
const emits = defineEmits(['save']);

function toggleBold() {
  props.editor.chain().focus().toggleBold().run();
}
</script>

<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
