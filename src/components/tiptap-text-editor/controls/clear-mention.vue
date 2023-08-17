<script setup lang="ts">
import { JSONContent, Editor } from '@tiptap/vue-3';
import { defineEmits, defineProps, PropType } from 'vue';
import OperationTooltip from '@/components/tiptap-text-editor/controls/operation-tooltip.vue';
import { EraserIcon } from '@/components/icons';

const emits = defineEmits(['save']);

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});
function find(json: JSONContent) {
  if (json.content?.length) {
    json.content = json.content.map((item: JSONContent) => {
      const obj = item;
      if (obj.content && obj.content?.length) {
        return find(item);
      }
      if (item.type === 'mention') {
        return {
          type: 'text',
          text: item.attrs?.name ?? ''
        };
      }
      return item;
    });
  }
  return json;
}

function clearMention() {
  const newContent = find(props.editor?.getJSON());
  props.editor.commands.setContent(newContent);
}
</script>

<template>
  <div class="operation-icon" @click="clearMention">
    <operation-tooltip :desc="'清理格式'">
      <div class="icon">
        <EraserIcon class="icon-svg"/>
      </div>
    </operation-tooltip>
  </div>
</template>

<style scoped lang="scss">

</style>
