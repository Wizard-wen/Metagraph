<template>
  <div class="operation-icon" @click="toggleOrderedList">
    <operation-tooltip :desc="'有序列表'">
    <div class="icon">
      <OrderedListOutlined
        class="icon-svg"
        :class="{ 'is-active': editor.isActive('orderedList') }"/>
    </div>
    </operation-tooltip>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3';
import { defineEmits, defineProps, PropType } from 'vue';
import { OrderedListOutlined } from '@ant-design/icons-vue';
import OperationTooltip from '@/components/tiptap-text-editor/controls/operation-tooltip.vue';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});
const emits = defineEmits(['save']);

function toggleOrderedList() {
  props.editor.chain().focus().toggleOrderedList().run();
}
</script>
<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
