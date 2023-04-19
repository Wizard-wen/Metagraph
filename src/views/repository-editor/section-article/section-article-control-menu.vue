<template>
  <div v-if="editor" class="operator">
    <div class="operator-container">
      <save-control @save="saveSectionArticle"></save-control>
      <undo-control :editor="editor"></undo-control>
      <redo-control :editor="editor"></redo-control>
      <div class="line"></div>
      <text-level-select :editor="editor"></text-level-select>
      <font-size-select @fontSizeChange="handleFontSizeChange($event)"
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
      <find-control :editor="editor"></find-control>
      <parse-text-control></parse-text-control>
      <upload-image-control :editor="editor"></upload-image-control>
      <toggle-task-control style="margin-right: 10px;" :editor="editor"></toggle-task-control>
    </div>
  </div>
  <upload-and-parse-text-modal
    v-if="isParseWordModalShow"
    :is-upload-modal-shown="isParseWordModalShow"
    @close="handleCloseParseWordModal"></upload-and-parse-text-modal>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3';
import { SectionModelType } from 'metagraph-constant';
import { PropType, ref, defineProps, defineEmits } from 'vue';
import {
  AlignControl,
  FindControl,
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
  ToggleTaskControl,
  UndoControl,
  UploadImageControl,
  BackColorControl
} from '@/components/tiptap-text-editor/controls';
import UploadAndParseTextModal from '../public-component/upload-and-parse-text-modal.vue';
import ParseTextControl from './control-menus/parse-text-control.vue';
import { UploadAndParseTextService } from '../public-component/upload.and.parse.text.service';

const isParseWordModalShow = ref(false);
const uploadAndParseTextService = new UploadAndParseTextService();
defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});
const emit = defineEmits(['save', 'fontSizeChange', 'refreshSection']);

// 保存文章
function saveSectionArticle() {
  emit('save');
}

// 改变文章字体大小
function handleFontSizeChange(params: { value: string }) {
  emit('fontSizeChange', params);
}

async function handleCloseParseWordModal(params: {
  type: 'Section' | 'void' | 'Alternative'
  sectionModel?: SectionModelType
}) {
  if (params.type === 'Section' && params.sectionModel) {
    emit('refreshSection', {
      sectionId: params.sectionModel.id
    });
  }
  uploadAndParseTextService.clearData();
  isParseWordModalShow.value = false;
}

</script>

<style scoped lang="scss">
@import "../../../style/common.scss";

.operator {
  width: 100%;

  .operator-container {
    padding: 2px 0;
    display: flex;
    border-bottom: 1px solid $hoverBackColor;
    height: 50px;
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
