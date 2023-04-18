<template>
  <div class="section-article" :style="{
    height: 'calc(100vh - 56px)' }">
    <div class="editor-container-view">
      <editor-content
        v-if="editor && currentSectionNode.contentHtml" class="tip-tap-editor"
        :editor="editor"/>
      <empty-view v-else></empty-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, PropType } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import EmptyView from '@/components/empty-view/empty-view.vue';
import { currentSectionNode } from './model/section.tree';

defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  },
});

</script>

<style scoped lang="scss">

</style>
