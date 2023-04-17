<template>
  <div class="custom-field-box knowledge-description-height
  position-relative">
    <div class="header">
      <div class="title">知识点描述</div>
      <div class="right"></div>
    </div>
    <div v-if="editor" class="limit-count">
      <knowledge-description-limit
        :limit="600"
        :current="descriptionCharacters"></knowledge-description-limit>
    </div>
    <editor-content
      :style="{fontSize: articleFontSize + 'px'}"
      class="tip-tap-editor custom-editor-style" :editor="editor"/>
  </div>
</template>

<script lang="ts" setup>
import { Editor, EditorContent } from '@tiptap/vue-3';
import { defineProps, PropType } from 'vue';
import KnowledgeDescriptionLimit
  from '@/views/knowledge-editor/knowledge-editor-middle/knowledge-description/knowledge-description-limit.vue';

defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  },
  articleFontSize: {
    type: String,
    required: true
  },
  descriptionCharacters: {
    type: Number,
    required: true
  }
});


</script>

<style scoped lang="scss">
@import '../../../style/common.scss';
@import "../../../style/tiptap.common.scss";
@import "../style/knowledge.edit.scss";

.knowledge-description-height {
  height: 470px;

}

.custom-editor-style {
  width: 620px;
  height: 390px;
  overflow-y: auto;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
}

.custom-editor-style::-webkit-scrollbar {
  width: 3px !important;
}


.limit-count {
  position: absolute;
  bottom: 10px;
  right: 20px;
}
</style>
