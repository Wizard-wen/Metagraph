/**
 * @author songxiwen
 * @date  2021/11/8 15:32
 */

import { store } from '@/store';
import { mergeAttributes } from '@tiptap/core';
import Mention from '@tiptap/extension-mention';
import { Editor, VueRenderer } from '@tiptap/vue-3';
import tippy, { Instance } from 'tippy.js';
import { computed } from 'vue';
import MentionList from '@/views/repository-editor/tiptap/mention.list.vue';

const knowledgeList = computed(() => store.state.repositoryEditor.repositoryEntityList);
const CustomMention = Mention.extend({
  renderHTML({ node, HTMLAttributes }) {
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

export const initMention = (
  editor: Editor,
  context: any
) => CustomMention.configure({
  HTMLAttributes: {
    class: 'mention',
  },
  suggestion: {
    items: () => knowledgeList.value,
    render: () => {
      let component: VueRenderer;
      let popup: Instance[];
      return {
        // eslint-disable-next-line no-shadow
        onStart: (props) => {
          if (editor) {
            component = new VueRenderer(MentionList, {
              editor,
              props,
            });
          }
          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          });
        },
        // eslint-disable-next-line no-shadow
        onUpdate(props) {
          component.updateProps(props);
          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },
        // eslint-disable-next-line no-shadow
        onKeyDown(props) {
          return component.ref?.onKeyDown(props);
        },
        onExit() {
          popup[0].destroy();
          component.destroy();
        },
      };
    },
    // eslint-disable-next-line no-shadow
    command: ({ editor, range, props }) => {
      console.log(editor.getJSON());
      context.emit('mention', {
        name: props.name,
        id: props.id,
        content: editor.getJSON(),
        contentHtml: editor.getHTML(),
        success() {
          console.log('success');
          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: 'mention',
                attrs: { name: props.name, id: props.id }
              },
              {
                type: 'text',
                text: ' ',
              },
            ])
            .run();
          return editor.getJSON();
        },
        fail() {
          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: 'text',
                text: props.name,
              },
            ])
            .run();
          return editor.getJSON();
        }
      });
    },
  },
});
