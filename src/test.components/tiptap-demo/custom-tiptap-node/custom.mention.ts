/**
 * @author songxiwen
 * @date  2021/12/15 15:12
 */

import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { PluginKey } from '@tiptap/pm/state';
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

export const TestMentionPluginKey = new PluginKey('testMention');

export const CustomTestMention = Node.create<CustomMentionOptions>({
  name: 'testMention',

  addOptions() {
    return {
      HTMLAttributes: {},
      renderLabel(params: any) {
        const {
          options,
          node
        } = params;
        return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;
      },
      suggestion: {
        startOfLine: false,
        // 触发自动完成弹出窗口的字符。
        char: '@',
        // A ProseMirror PluginKey.
        pluginKey: TestMentionPluginKey,
        command: (params: any) => {
          const {
            editor,
            range,
            props
          } = params;
          console.log('from command ', params);
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
          const {
            editor,
            range
          } = params;
          console.log('from allow ', params);
          const $from = editor.state.doc.resolve(range.from);
          const type = editor.schema.nodes[this.name!];
          const allow = !!$from.parent.type.contentMatch.matchType(type);

          return allow;
        },
      },
    };
  },
  /**
   * 将此节点添加到一组扩展中，可以在模式的内容属性中引用。
   * // add to 'block' group
   * group: 'block',
   * // add to 'inline' group
   * group: 'inline',
   * // add to 'block' and 'list' group
   * group: 'block list',
   */
  group: 'inline',
  /**
   * content 属性准确定义了节点可以拥有的内容类型。
   * ProseMirror 对此非常严格。
   * 这意味着，不符合架构的内容将被丢弃。
   * 它需要一个名称或组作为字符串。 这里有一些例子：
   * // must have one or more blocks
   * content: 'block+',
   * // must have zero or more blocks
   *  content: 'block*',
   * // allows all kinds of 'inline' content (text or hard breaks)
   * content: 'inline*',
   * // must not have anything else than 'text'
   * content: 'text*',
   * // can have one or more paragraphs, or lists (if lists are used)
   * content: '(paragraph|list?)+',
   * // must have exact one heading at the top, and one or more blocks below
   * content: 'heading block+'
   */
  content: 'inline*',

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
      name: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-name'),
        renderHTML: (attributes) => {
          if (!attributes.name) {
            return {};
          }

          return {
            'data-name': attributes.name,
          };
        },
      },

      count: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-count'),
        renderHTML: (attributes) => {
          if (!attributes.count) {
            return {};
          }

          return {
            'data-count': attributes.count,
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
  parseHTML() {
    return [
      {
        tag: `vue-component[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['vue-component',
      mergeAttributes({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes)
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(Component);
  },
  addKeyboardShortcuts() {
    return {
      Backspace: () => this.editor.commands.command(({
        tr,
        state
      }) => {
        console.log('key board short cuts ---------', tr, state);
        let isMention = false;
        const { selection } = state;
        const {
          empty,
          anchor
        } = selection;

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
