<template>
  <div class="operation-icon" @click="toggleItalic">
    <div class="icon">
      <ItalicOutlined
        class="icon-svg"
        :class="{ 'is-active': editor.isActive('italic') }"/>
    </div>
    <div class="name">
      倾斜
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3';
import { defineEmits, defineProps, PropType } from 'vue';
import { ItalicOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});
const emits = defineEmits(['save']);

function toggleItalic() {
  props.editor.chain().focus().toggleItalic().run();
}
</script>
<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
