<template>
  <div v-if="editor" class="operator">
    <div class="operator-container">
      <save-control @save="saveSectionArticle"></save-control>
      <undo-control :editor="editor"></undo-control>
      <redo-control :editor="editor"></redo-control>
      <toggle-bold-control :editor="editor"></toggle-bold-control>
      <toggle-italic-control :editor="editor"></toggle-italic-control>
      <toggle-strike-control :editor="editor"></toggle-strike-control>
      <toggle-bullet-list-control :editor="editor"></toggle-bullet-list-control>
      <toggle-ordered-list-control :editor="editor"></toggle-ordered-list-control>
      <toggle-blockquote-control :editor="editor"></toggle-blockquote-control>
      <toggle-heading-control :editor="editor" :level="1"></toggle-heading-control>
      <toggle-heading-control :editor="editor" :level="2"></toggle-heading-control>
      <toggle-heading-control :editor="editor" :level="3"></toggle-heading-control>
      <toggle-code-control :editor="editor"></toggle-code-control>
      <find-control :editor="editor"></find-control>
      <parse-text-control></parse-text-control>
      <upload-image-control :editor="editor"></upload-image-control>
      <font-size-control @fontSizeChange="handleFontSizeChange($event)"></font-size-control>
    </div>
  </div>
</template>

<script lang="ts">
import { Editor } from '@tiptap/vue-3';
import {
  defineComponent, PropType
} from 'vue';
import {
  FindControl,
  FontSizeControl,
  ParseTextControl,
  RedoControl,
  UndoControl,
  SaveControl,
  ToggleBlockquoteControl,
  ToggleBoldControl,
  ToggleItalicControl,
  ToggleHeadingControl,
  ToggleBulletListControl,
  ToggleOrderedListControl,
  ToggleCodeControl,
  UploadImageControl,
  ToggleStrikeControl
} from '@/components/tiptap-text-editor/controls';

export default defineComponent({
  name: 'section.article.control',
  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true
    }
  },
  components: {
    SaveControl,
    FontSizeControl,
    UploadImageControl,
    ParseTextControl,
    FindControl,
    ToggleCodeControl,
    ToggleHeadingControl,
    ToggleBlockquoteControl,
    ToggleOrderedListControl,
    ToggleBulletListControl,
    ToggleBoldControl,
    ToggleItalicControl,
    ToggleStrikeControl,
    RedoControl,
    UndoControl
  },
  emits: ['save', 'fontSizeChange'],
  setup(props, { emit }) {
    // 保存文章
    const saveSectionArticle = () => {
      emit('save');
    };
    // 改变文章字体大小
    const handleFontSizeChange = (params: { value: string }) => {
      emit('fontSizeChange', params);
    };
    return {
      saveSectionArticle,
      handleFontSizeChange
    };
  }
});
</script>

<style scoped lang="scss">
.operator {
  padding: 2px 0;
  height: 46px;
  width: 100%;

  .operator-container {
    display: flex;
    max-width: 900px;
    justify-content: space-between;
    margin: 0 auto;
    align-items: center;
  }
}
</style>
