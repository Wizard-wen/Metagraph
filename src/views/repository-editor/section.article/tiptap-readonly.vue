<template>
  <editor-content
    :style="{fontSize: '14px'}"
    class="tip-tap-editor" :editor="editor"/>
</template>

<script setup lang="ts">
import {
  useEditor, EditorContent, VueRenderer, Editor, VueNodeViewRenderer, JSONContent
} from '@tiptap/vue-3';
import { mergeAttributes } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
// import CharacterCount from '@tiptap/extension-character-count';
import Mention from '@tiptap/extension-mention';
import StarterKit from '@tiptap/starter-kit';
import { Ref, defineProps, PropType } from 'vue';
import Image from '@tiptap/extension-image';
import { tiptapInitData } from '@/store/constant';
// import tippy, { Instance } from 'tippy.js';
// import MentionList from '@/views/repository-editor/tiptap/mention.list';

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
  editorProps: {
    // handleClick: (view, pos, event) => {
    //   console.log(view, pos, event);
    //   context.emit('clickMention');
    //   return true;
    // },
    // handleKeyDown(view, event) {
    //   console.log(view, event);
    //   return true;
    // }
  },
  extensions: [
    Document,
    Paragraph,
    StarterKit,
    Image,
    Text,
    // CharacterCount.configure({
    //   limit: limit.value,
    // }),
    CustomMention.configure({
      HTMLAttributes: {
        class: 'mention',
      },
      // suggestion: {
      //   items: () => knowledgeList.value,
      //   render: () => {
      //     let component: VueRenderer;
      //     let popup: Instance[];
      //     return {
      //       // eslint-disable-next-line no-shadow
      //       onStart: (props) => {
      //         if (editor.value) {
      //           component = new VueRenderer(MentionList, {
      //             editor: editor.value,
      //             props,
      //           });
      //         }
      //         popup = tippy('body', {
      //           getReferenceClientRect: props.clientRect,
      //           appendTo: () => document.body,
      //           content: component.element,
      //           showOnCreate: true,
      //           interactive: true,
      //           trigger: 'manual',
      //           placement: 'bottom-start',
      //         });
      //       },
      //       // eslint-disable-next-line no-shadow
      //       onUpdate(props) {
      //         component.updateProps(props);
      //         popup[0].setProps({
      //           getReferenceClientRect: props.clientRect,
      //         });
      //       },
      //       // eslint-disable-next-line no-shadow
      //       onKeyDown(props) {
      //         return component.ref?.onKeyDown(props);
      //       },
      //       onExit() {
      //         popup[0].destroy();
      //         component.destroy();
      //       },
      //     };
      //   },
      //   // eslint-disable-next-line no-shadow
      //   command: ({ editor, range, props }) => {
      //     // console.log(editor.getJSON());
      //     context.emit('mention', {
      //       name: props.name,
      //       id: props.id,
      //       content: editor.getJSON(),
      //       contentHtml: editor.getHTML(),
      //       success() {
      //         console.log('success');
      //         editor
      //           .chain()
      //           .focus()
      //           .insertContentAt(range, [
      //             {
      //               type: 'mention',
      //               attrs: { name: props.name, id: props.id }
      //             },
      //             {
      //               type: 'text',
      //               text: ' ',
      //             },
      //           ])
      //           .run();
      //         return editor.getJSON();
      //       },
      //       fail() {
      //         editor
      //           .chain()
      //           .focus()
      //           .insertContentAt(range, [
      //             {
      //               type: 'text',
      //               text: props.name,
      //             },
      //           ])
      //           .run();
      //         return editor.getJSON();
      //       }
      //     });
      //   },
      // },
    })
  ]
});
</script>

<style scoped lang="scss">
.tip-tap-editor {
  & ::v-deep(.ProseMirror) {
    text-indent: 10px;
    outline: none;
    padding: 20px;

    > * + * {
      margin-top: 0.75em;
    }

    h1, h2, h3, h4, h5, h6 {
      line-height: 1.1;
    }

    .mention {
      color: #A975FF;
      cursor: pointer;
      background-color: rgba(#A975FF, 0.1);
      border-radius: 0.3rem;
      padding: 0.1rem 0.3rem;
    }
  }
}
</style>
