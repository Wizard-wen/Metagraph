<template>
  <div class="section-article-container">
    <div class="section-article" :style="{
    height: 'calc(100vh - 56px)' }">
      <div class="editor-container-view">
        <div class="title">{{ currentSectionNode.title }}</div>
        <editor-content
          v-if="editor && currentSectionNode.contentHtml" class="tip-tap-editor"
          :editor="editor"/>
        <empty-view v-else></empty-view>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { defineProps, PropType } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import EmptyView from '@/components/empty-view/empty-view.vue';
import { currentSectionNode } from './model/section-tree-preview';

defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});

</script>

<style scoped lang="scss">
@import "../../style/common.scss";
@import "../../style/tiptap.common.scss";

.section-article-container {
  height: calc(100vh - 56px);
  background: $editorBackgroundColor;
  width: 100%;
  position: relative;

  .section-article {
    text-align: left;
    height: 100%;
    overflow-y: auto;
    @include custom-scroll-style;

    .editor-container-view {
      width: 750px;
      margin: 30px auto 28px;
      height: max-content;
      background: $textBackgroundColor;

      .title {
        font-size: 36px;
        font-weight: 600;
        margin-bottom: 30px;
      }
    }
  }
}
</style>
