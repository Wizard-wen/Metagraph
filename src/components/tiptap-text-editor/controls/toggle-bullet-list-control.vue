<template>
  <div class="operation-icon" @click="toggleBulletList">
    <div class="icon">
      <UnorderedListOutlined
        class="icon-svg"
        :class="{ 'is-active': editor.isActive('bulletList') }"/>
    </div>
    <div class="name">
      列表
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3';
import { defineEmits, defineProps, PropType } from 'vue';
import { UnorderedListOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});
const emits = defineEmits(['save']);

function toggleBulletList() {
  props.editor.chain().focus().toggleBulletList().run();
}
</script>
<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
