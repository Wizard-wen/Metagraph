/**
 * @author songxiwen
 * @date  2021/9/14 21:15
 */

import { Node, nodeInputRule } from '@tiptap/core';
import { Text } from '@tiptap/extension-text';
import { uploadImagePlugin, UploadFn } from './upload_image';

/**
 * Tiptap Extension to upload images
 * @see  https://gist.github.com/slava-vishnyakov/16076dff1a77ddaca93c4bccd4ec4521#gistcomment-3744392
 * @since 7th July 2021
 *
 * Matches following attributes in Markdown-typed image: [, alt, src, title]
 *
 * Example:
 * ![Lorem](image.jpg) -> [, "Lorem", "image.jpg"]
 * ![](image.jpg "Ipsum") -> [, "", "image.jpg", "Ipsum"]
 * ![Lorem](image.jpg "Ipsum") -> [, "Lorem", "image.jpg", "Ipsum"]
 */

interface ImageOptions {
  inline: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      /**
       * Add an image
       */
      setImage: (options: { src: string; alt?: string; title?: string; class?: string; height: string; width: string }) => ReturnType;
    };
  }
}

const IMAGE_INPUT_REGEX = /!\[(.+|:?)\]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

// eslint-disable-next-line import/prefer-default-export
export const TipTapCustomImage = (uploadFn: UploadFn) => Node.create<ImageOptions>({
  name: 'image',

  defaultOptions: {
    inline: false,
    HTMLAttributes: {},
  },
  inline() {
    return this.options.inline;
  },
  group() {
    return this.options.inline ? 'inline' : 'block';
  },
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      class: {
        default: null,
      },
      height: {
        default: null,
      },
      width: {
        default: null,
      },
    };
  },
  parseHTML: () => [
    {
      tag: 'img[src]',
      getAttrs: (dom) => {
        if (typeof dom === 'string') return {};
        const element = dom as HTMLImageElement;

        const obj = {
          src: element.getAttribute('src'),
          title: element.getAttribute('title'),
          alt: element.getAttribute('alt'),
          class: element.getAttribute('class'),
        };
        return obj;
      },
    },
  ],
  renderHTML: ({ HTMLAttributes }) => ['img', HTMLAttributes],

  addCommands() {
    return {
      setImage:
        (attrs) => ({ state, dispatch }) => {
          const { selection } = state;
          const position = selection.$head ? selection.$head.pos : selection.$to.pos;
          console.log('before', selection, this);
          const node = this.type.create(attrs);
          const transaction = state.tr.insert(position, node);
          console.log('after', selection, transaction.selection);
          return dispatch?.(transaction);
        },
    };
  },
  addInputRules() {
    return [
      nodeInputRule({
        find: IMAGE_INPUT_REGEX,
        type: this.type,
        getAttributes: (match) => {
          const [, alt, src, title] = match;
          return {
            src,
            alt,
            title,
          };
        }
      }),
    ];
  },
  addProseMirrorPlugins() {
    return [uploadImagePlugin(uploadFn)];
  },
});
