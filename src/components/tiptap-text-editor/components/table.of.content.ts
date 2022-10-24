/**
 * @author songxiwen
 * @date  2022/5/21 21:09
 */

import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import TableOfContent from './table-of-content.vue';

export default Node.create({
  name: 'tableOfContents',

  group: 'block',

  atom: true,

  parseHTML() {
    return [
      {
        tag: 'toc',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['toc', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return VueNodeViewRenderer(TableOfContent);
  },

  addGlobalAttributes() {
    return [
      {
        types: [
          'heading',
        ],
        attributes: {
          id: {
            default: null,
          },
        },
      },
    ];
  },
});
