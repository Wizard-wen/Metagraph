/**
 * @author songxiwen
 * @date  2021/12/8 23:07
 */

import { mentionPointerList } from '@/components/tiptap-text-editor/abstract.tiptap.text.editor';
import { mergeAttributes } from '@tiptap/core';
import { Editor } from '@tiptap/core/dist/packages/core/src/Editor';
import { ParentConfig } from '@tiptap/core/dist/packages/core/src/types';
import Mention from '@tiptap/extension-mention';
import { NodeType } from 'prosemirror-model';

export const CustomMention = Mention.extend({
  onDestroy() {
    console.log(this);
  },
  renderHTML({
    node,
    HTMLAttributes
  }) {
    if (!node.attrs.name) {
      return [
        'span',
        '@'
      ];
    }
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
          mentionPointerList.value.push(attributes.id)
          return {
            'data-mention-id': attributes.id,
          };
        },
      },
    };
  },
});
