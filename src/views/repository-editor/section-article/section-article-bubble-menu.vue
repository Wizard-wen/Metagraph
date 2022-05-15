<template>
  <bubble-menu
    v-if="editor"
    class="bubble-menu"
    :tippy-options="{ duration: 100 }"
    :editor="editor">
    <save-control :editor="editor"></save-control>
    <find-control :editor="editor"></find-control>
    <toggle-bold-control :editor="editor"></toggle-bold-control>
    <toggle-italic-control :editor="editor"></toggle-italic-control>
    <toggle-strike-control :editor="editor"></toggle-strike-control>
  </bubble-menu>
</template>

<script lang="ts">
import { Editor, BubbleMenu } from '@tiptap/vue-3';
import { defineComponent, PropType, toRef } from 'vue';
import {
  FindControl, SaveControl, ToggleBoldControl,
  ToggleItalicControl, ToggleStrikeControl
} from '@/components/tiptap-text-editor/controls';

export default defineComponent({
  name: 'section-article-bubble-menu',
  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true
    }
  },
  components: {
    FindControl,
    SaveControl,
    ToggleBoldControl,
    ToggleItalicControl,
    ToggleStrikeControl,
    BubbleMenu
  }
});
</script>

<style scoped lang="scss">
.bubble-menu {
  display: flex;
  //background-color: #0D0D0D;
  border: 1px solid #2c3e50;
  background: #fafbfc;
  padding: 0 4px;
  border-radius: 4px;
}
</style>
