/**
 * @author songxiwen
 * @date  2021/12/15 15:12
 */

import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { PluginKey } from 'prosemirror-state';
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion';
import Component from '@/test.components/tiptap-demo/custom-tiptap-node/Component.vue';

export type CustomMentionOptions = {
  HTMLAttributes: Record<string, any>,
  renderLabel: (props: {
    options: CustomMentionOptions,
    node: ProseMirrorNode,
  }) => string,
  suggestion: Omit<SuggestionOptions, 'editor'>,
}

export const TestPluginKey = new PluginKey('test');

export const CustomTestMention = Node.create<CustomMentionOptions>({
  name: 'testMention',

  addOptions() {
    return {
      HTMLAttributes: {},
      renderLabel(params: any) {
        const { options, node } = params;
        return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;
      },
      suggestion: {
        char: '#',
        pluginKey: TestPluginKey,
        command: (params: any) => {
          const { editor, range, props } = params;
          // increase range.to by one when the next node is of type "text"
          // and starts with a space character
          const { nodeAfter } = editor.view.state.selection.$to;
          const overrideSpace = nodeAfter?.text?.startsWith(' ');

          if (overrideSpace) {
            range.to += 1;
          }

          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: this.name,
                attrs: props,
              },
              {
                type: 'text',
                text: ' ',
              },
            ])
            .run();
        },
        allow: (params: any) => {
          const { editor, range } = params;
          const $from = editor.state.doc.resolve(range.from);
          const type = editor.schema.nodes[this.name!];
          const allow = !!$from.parent.type.contentMatch.matchType(type);

          return allow;
        },
      },
    };
  },

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-id'),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }

          return {
            'data-id': attributes.id,
          };
        },
      },

      label: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-label'),
        renderHTML: (attributes) => {
          if (!attributes.label) {
            return {};
          }

          return {
            'data-label': attributes.label,
          };
        },
      },
    };
  },

  // parseHTML() {
  //   return [
  //     {
  //       tag: `span[data-type="${this.name}"]`,
  //     },
  //   ];
  // },
  //
  // renderHTML({ node, HTMLAttributes }) {
  //   return [
  //     'span',
  //     mergeAttributes({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes),
  //     this.options.renderLabel({
  //       options: this.options,
  //       node,
  //     }),
  //   ];
  // },
  //
  // renderText({ node }) {
  //   return this.options.renderLabel({
  //     options: this.options,
  //     node,
  //   });
  // },
  parseHTML() {
    return [
      {
        tag: 'vue-component',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['vue-component', mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return VueNodeViewRenderer(Component);
  },
  addKeyboardShortcuts() {
    return {
      Backspace: () => this.editor.commands.command(({ tr, state }) => {
        let isMention = false;
        const { selection } = state;
        const { empty, anchor } = selection;

        if (!empty) {
          return false;
        }

        state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
          if (node.type.name === this.name) {
            isMention = true;
            tr.insertText(this.options.suggestion.char || '', pos, pos + node.nodeSize);

            return false;
          }
        });

        return isMention;
      }),
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
