<template>
  <editor-content
    :style="{fontSize: '14px'}"
    class="tip-tap-editor" :editor="editor"/>
</template>

<script setup lang="ts">
import {
  useEditor, Editor, EditorContent
} from '@tiptap/vue-3';
import { mergeAttributes } from '@tiptap/core';
// import Document from '@tiptap/extension-document';
// import Paragraph from '@tiptap/extension-paragraph';
// import Text from '@tiptap/extension-text';
import Mention from '@tiptap/extension-mention';
import StarterKit from '@tiptap/starter-kit';
import { Ref, defineProps } from 'vue';
import Image from '@tiptap/extension-image';
import { tiptapInitData } from '@/store/constant';

const props = defineProps({
  articleContent: {
    type: String,
    default: JSON.stringify(tiptapInitData)
  }
});

const CustomMention = Mention.extend({
  renderHTML({
    node,
    HTMLAttributes
  }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      `@${node.attrs.name}`
    ];
  },
  addAttributes() {
    return {
      name: {
        default: null,
        parseHTML: (element) => ({ name: element.getAttribute('data-mention-name') }),
        renderHTML: (attributes) => {
          if (!attributes.name) {
            return {};
          }
          return {
            'data-mention-name': attributes.name,
          };
        },
      },
      id: {
        default: null,
        parseHTML: (element) => ({
          id: element.getAttribute('data-mention-id'),
        }),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }
          return {
            'data-mention-id': attributes.id,
          };
        },
      },
    };
  },
});
const editor: Ref<Editor | undefined> = useEditor({
  editable: false,
  content: JSON.parse(props.articleContent),
  extensions: [
    // Document,
    // Paragraph,
    StarterKit,
    Image,
    // Text,
    CustomMention.configure({
      HTMLAttributes: {
        class: 'mention',
      },
    })
  ]
});
</script>

<style scoped lang="scss">
@import '../../../style/tiptap.common.scss';
</style>
