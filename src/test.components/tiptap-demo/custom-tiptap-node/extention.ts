/**
 * @author songxiwen
 * @date  2021/12/15 14:52
 */
import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import Component from './Component.vue';
// RangeError: Content hole not allowed in a leaf node spec
export default Node.create({
  name: 'vueComponent',

  group: 'inline',

  inline: true,

  atom: true,

  addAttributes() {
    return {
      count: {
        default: 0,
      },
      id: {
        default: '',
      },
      name: {
        default: '',
      },
      label: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'vue-component',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['vue-component', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return VueNodeViewRenderer(Component);
  },
});
