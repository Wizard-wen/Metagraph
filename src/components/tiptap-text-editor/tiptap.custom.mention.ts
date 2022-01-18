/**
 * @author songxiwen
 * @date  2021/12/8 23:07
 */

import { mergeAttributes } from '@tiptap/core';
import Mention from '@tiptap/extension-mention';

export const CustomMention = Mention.extend({
  renderHTML({ node, HTMLAttributes }) {
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
          return {
            'data-mention-id': attributes.id,
          };
        },
      },
    };
  },
});
