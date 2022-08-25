<template>
  <editor-content
    v-if="editor"
    :editor="editor"
    :style="{fontSize: '14px'}"
    class="tip-tap-editor-readonly"></editor-content>
</template>

<script lang="ts">
import CodeBlockContainer from '@/components/tiptap-text-editor/components/code-block-container.vue';
import { CustomMention } from '@/components/tiptap-text-editor/components/tiptap.custom.mention';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Image from '@tiptap/extension-image';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { lowlight } from 'lowlight';
import { defineComponent, toRef, watch } from 'vue';
import { EditorContent, useEditor, VueNodeViewRenderer } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';

export default defineComponent({
  name: 'tiptap-editor-readonly',
  props: {
    articleContent: {
      type: String,
      required: true
    }
  },
  components: {
    EditorContent
  },
  setup(props) {
    const content = toRef(props, 'articleContent');
    const editor = useEditor({
      editable: false,
      content: JSON.parse(content.value),
      extensions: [
        StarterKit,
        Image,
        TaskList,
        TaskItem.extend({
          nested: true,
        }),
        CodeBlockLowlight
          .extend({
            addNodeView() {
              return VueNodeViewRenderer(CodeBlockContainer);
            },
          })
          .configure({ lowlight }),
        CustomMention.configure({
          HTMLAttributes: {
            class: 'mention',
          }
        })
      ],
    });
    watch(() => props.articleContent, (newValue) => {
      console.log(newValue, '----- new value');
      if (newValue) {
        editor.value.commands.setContent(JSON.parse(newValue));
      }
    });
    return {
      editor
    };
  }
});
</script>

<style scoped lang="scss">
@import '../../style/tiptap.common.scss';
</style>
