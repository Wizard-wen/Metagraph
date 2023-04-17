<template>
  <div v-if="editor" class="operator">
    <div class="operator-container">
      <save-control @save="saveSectionArticle"></save-control>
      <undo-control :editor="editor"></undo-control>
      <redo-control :editor="editor"></redo-control>
      <div class="line"></div>
      <text-level-select :editor="editor"></text-level-select>
      <font-size-select
        @fontSizeChange="handleFontSizeChange($event)"
        :editor="editor"></font-size-select>
      <toggle-bold-control :editor="editor"></toggle-bold-control>
      <toggle-italic-control :editor="editor"></toggle-italic-control>
      <toggle-strike-control :editor="editor"></toggle-strike-control>
      <div class="line"></div>
      <align-control :editor="editor"></align-control>
      <toggle-bullet-list-control :editor="editor"></toggle-bullet-list-control>
      <toggle-ordered-list-control :editor="editor"></toggle-ordered-list-control>
      <div class="line"></div>
      <back-color-control :editor="editor"></back-color-control>
      <toggle-blockquote-control :editor="editor"></toggle-blockquote-control>
      <toggle-code-control :editor="editor"></toggle-code-control>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Editor } from '@tiptap/vue-3';

import { defineEmits, defineProps, PropType } from 'vue';
import {
  AlignControl,
  BackColorControl,
  FontSizeSelect,
  RedoControl,
  SaveControl,
  TextLevelSelect,
  ToggleBlockquoteControl,
  ToggleBoldControl,
  ToggleBulletListControl,
  ToggleCodeControl,
  ToggleItalicControl,
  ToggleOrderedListControl,
  ToggleStrikeControl,
  UndoControl
} from '@/components/tiptap-text-editor/controls';

defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});
const emit = defineEmits(['save', 'fontSizeChange']);

// 保存文章
const saveSectionArticle = () => {
  emit('save');
};
// 改变文章字体大小
const handleFontSizeChange = (params: { value: string }) => {
  emit('fontSizeChange', params);
};
</script>

<style scoped lang="scss">
@import '../../../style/common.scss';

.operator {
  width: 100%;

  .operator-container {
    padding: 2px 0;
    display: flex;
    border-bottom: 1px solid $hoverBackColor;
    height: 50px;
    min-width: 70%;
    width: max-content;
    background: #FFF;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
  }
}

.line {
  margin-left: 8px;
  height: 24px;
  width: 1px;
  background: $hoverBackColor;
}
</style>
