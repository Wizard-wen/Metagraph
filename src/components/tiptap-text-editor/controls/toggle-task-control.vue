<template>
  <div class="operation-icon" @click="toggleTask">
    <operation-tooltip :desc="'任务'">
      <div class="icon">
        <ScheduleOutlined
          class="icon-svg"
          :class="{ 'is-active': editor.isActive('taskList') }"/>
      </div>
    </operation-tooltip>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3';
import { defineProps, PropType } from 'vue';
import { ScheduleOutlined } from '@ant-design/icons-vue';
import OperationTooltip from '@/components/tiptap-text-editor/controls/operation-tooltip.vue';

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
