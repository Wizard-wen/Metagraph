<template>
  <editor-content class="tip-tap-editor" :editor="editor"/>
</template>

<script setup lang="ts">
import {
  defineProps, defineEmits, onMounted, onUnmounted, Ref, ref, PropType, watch
} from 'vue';
import {
  Editor, useEditor, VueRenderer, JSONContent, EditorContent
} from '@tiptap/vue-3';
import type { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion';
import { mergeAttributes, Range, Editor as CoreEditor } from '@tiptap/core';
import CharacterCount from '@tiptap/extension-character-count';
import Document from '@tiptap/extension-document';
import Image from '@tiptap/extension-image';
import Mention from '@tiptap/extension-mention';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import StarterKit from '@tiptap/starter-kit';
import tippy, { Instance } from 'tippy.js';
import type { EntityCompletelyListItemType } from 'edu-graph-constant';
import MentionList from '../tiptap/mention.list.vue';

const emit = defineEmits(['saveArticle', 'clickMentionElement', 'mention']);
console.log('tiptap setuo');
const props = defineProps({
  articleContent: {
    type: Object as PropType<JSONContent>
  },
  limit: {
    type: Number,
    default: 30000
  },
  knowledgeList: {
    type: Array as PropType<EntityCompletelyListItemType[]>
  }
});

// 定时器
const timer = ref(0);

const CustomMention = Mention.extend({
  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      `@${ node.attrs.name }`
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
  editable: true,
  content: props.articleContent,
  editorProps: {
    handleClick: (view, pos, event) => {
      console.log(view, pos, event);
      emit('clickMentionElement');
      return true;
    }
  },
  extensions: [
    Document,
    Paragraph,
    StarterKit,
    Image,
    Text,
    CharacterCount.configure({
      limit: props.limit,
    }),
    CustomMention.configure({
      HTMLAttributes: {
        class: 'mention',
      },
      suggestion: {
        items: (query: string) => {
          console.log(query);
          return props.knowledgeList || [];
        },
        render: () => {
          let component: VueRenderer;
          let popup: Instance[];
          return {
            onStart: (suggestionProps: SuggestionProps) => {
              if (editor.value) {
                component = new VueRenderer(MentionList, {
                  editor: editor.value,
                  props: suggestionProps,
                });
              }
              popup = tippy('body', {
                getReferenceClientRect: suggestionProps.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              });
            },
            onUpdate(suggestionProps: SuggestionProps) {
              component.updateProps(suggestionProps);
              popup[0].setProps({
                getReferenceClientRect: suggestionProps.clientRect,
              });
            },
            onKeyDown(suggestionProps: SuggestionKeyDownProps) {
              return component.ref?.onKeyDown(suggestionProps) as boolean;
            },
            onExit() {
              popup[0].destroy();
              component.destroy();
            },
          };
        },
        command: (commandProps: {
          props: { id: string, name: string },
          range: Range,
          editor: CoreEditor,
        }) => {
          const { range } = commandProps;
          const customCommandProps = commandProps.props;
          const coreEditor = commandProps.editor;
          emit('mention', {
            name: customCommandProps.name,
            id: customCommandProps.id,
            content: coreEditor.getJSON(),
            contentHtml: coreEditor.getHTML(),
            success() {
              coreEditor
                .chain()
                .focus()
                .insertContentAt(range, [
                  {
                    type: 'mention',
                    attrs: { name: customCommandProps.name, id: customCommandProps.id }
                  },
                  {
                    type: 'text',
                    text: ' ',
                  },
                ])
                .run();
              return coreEditor.getJSON();
            },
            fail() {
              coreEditor
                .chain()
                .focus()
                .insertContentAt(range, [
                  {
                    type: 'text',
                    text: customCommandProps.name,
                  },
                ])
                .run();
              return coreEditor.getJSON();
            }
          });
        },
      },
    })
  ]
});
console.log(props.articleContent, 'articleContent');

watch(() => props.articleContent, (newValue, oldValue) => {
  console.log('article Content value change', newValue, oldValue);
  if (newValue) {
    editor.value?.commands.setContent(newValue);
  }
});
onMounted(() => {
  console.log('tiptap mount');
  // editor.value?.commands.setContent({content: props.articleContent!});
  // 定时存储文章
  timer.value = window.setInterval(() => {
    if (editor.value?.getJSON()) {
      emit('saveArticle', {
        content: editor.value?.getJSON(),
        contentHtml: editor.value?.getHTML()
      });
    }
  }, 10000);
});

onUnmounted(() => {
  // 清除定时器
  if (timer.value) {
    window.clearInterval(timer.value);
  }
  emit('saveArticle', {
    content: editor.value?.getJSON(),
    contentHtml: editor.value?.getHTML()
  });
  editor.value?.destroy();

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
