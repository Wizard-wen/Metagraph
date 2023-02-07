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
      <toggle-blockquote-control :editor="editor"></toggle-blockquote-control>
      <toggle-code-control :editor="editor"></toggle-code-control>
      <find-control :editor="editor"></find-control>
      <parse-text-control></parse-text-control>
      <upload-image-control :editor="editor"></upload-image-control>
      <toggle-task-control :editor="editor"></toggle-task-control>
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
import { defineComponent, PropType, ref } from 'vue';
import {
  FindControl,
  FontSizeControl,
  RedoControl,
  SaveControl,
  ToggleBlockquoteControl,
  ToggleBoldControl,
  ToggleBulletListControl,
  ToggleCodeControl,
  ToggleHeadingControl,
  ToggleItalicControl,
  ToggleOrderedListControl,
  ToggleStrikeControl,
  ToggleTaskControl,
  UndoControl,
  UploadImageControl
} from '@/components/tiptap-text-editor/controls';
import UploadAndParseTextModal from './upload-and-parse-text-modal.vue';
import ParseTextControl from './control-menus/parse-text-control.vue';
import { UploadAndParseTextService } from '../model/upload.and.parse.text.service';
import FontSizeSelect from '@/components/tiptap-text-editor/controls/font-size-select.vue';
import TextLevelSelect from '@/components/tiptap-text-editor/controls/text-level-select.vue';
import AlignControl from '@/components/tiptap-text-editor/controls/align-control.vue';
const isParseWordModalShow = ref(false);
const uploadAndParseTextService = new UploadAndParseTextService();
const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});
const emit = defineEmits(['save', 'fontSizeChange', 'refreshSection'])
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


// export default defineComponent({
//   name: 'section-article-control',
//   props: {
//     editor: {
//       type: Object as PropType<Editor>,
//       required: true
//     }
//   },
//   components: {
//     AlignControl,
//     TextLevelSelect,
//     FontSizeSelect,
//     ToggleTaskControl,
//     SaveControl,
//     FontSizeControl,
//     UploadImageControl,
//     ParseTextControl,
//     FindControl,
//     ToggleCodeControl,
//     ToggleHeadingControl,
//     ToggleBlockquoteControl,
//     ToggleOrderedListControl,
//     ToggleBulletListControl,
//     ToggleBoldControl,
//     ToggleItalicControl,
//     ToggleStrikeControl,
//     RedoControl,
//     UndoControl,
//     UploadAndParseTextModal
//   },
//   emits: ['save', 'fontSizeChange', 'refreshSection'],
//   setup(props, { emit }) {
//     const isParseWordModalShow = ref(false);
//     const uploadAndParseTextService = new UploadAndParseTextService();
//
//     // 保存文章
//     function saveSectionArticle() {
//       emit('save');
//     }
//
//     // 改变文章字体大小
//     function handleFontSizeChange(params: { value: string }) {
//       emit('fontSizeChange', params);
//     }
//
//     async function handleCloseParseWordModal(params: {
//       type: 'Section' | 'void' | 'Alternative'
//       sectionModel?: SectionModelType
//     }) {
//       if (params.type === 'Section' && params.sectionModel) {
//         emit('refreshSection', {
//           sectionId: params.sectionModel.id
//         });
//       }
//       uploadAndParseTextService.clearData();
//       isParseWordModalShow.value = false;
//     }
//
//     return {
//       saveSectionArticle,
//       handleFontSizeChange,
//       handleCloseParseWordModal,
//       isParseWordModalShow
//     };
//   }
// });
</script>

<style scoped lang="scss">
@import "../../../style/common.scss";
.operator {
  padding: 2px 0;
  height: 46px;
  width: 100%;

  .operator-container {
    display: flex;
    max-width: 840px;
    height: 100%;
    align-items: center;
    //justify-content: space-between;
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
