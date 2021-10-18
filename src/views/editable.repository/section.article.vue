<template>
  <div class="section-article">
    <section-article-control
      v-if="editable && editor"
      :editor="editor"
      @save="saveSectionArticle"></section-article-control>
    <ant-button @click="upload">text</ant-button>
    <div class="article-container">
      <div class="limit-container">
        <article-limit
          v-if="editor"
          :current="editor.getCharacterCount()"
          :limit="limit"></article-limit>
      </div>
      <div class="editor-container" v-if="editable">
        <editor-content class="tip-tap-editor" :editor="editor"/>
      </div>
      <div class="editor-container-view" v-else>
        <editor-content class="tip-tap-editor" :editor="editor"/>
      </div>
      <div class="comment-content">
        <slot name="comment" :entityId="entityId"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import tippy, { Instance } from 'tippy.js';
import {
  defineComponent, ref, computed, onUnmounted, Ref, onMounted, watch, PropType, toRefs
} from 'vue';
import {
  useEditor, EditorContent, VueRenderer, Editor, JSONContent
} from '@tiptap/vue-3';
import { mergeAttributes } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import CharacterCount from '@tiptap/extension-character-count';
import Mention from '@tiptap/extension-mention';
import StarterKit from '@tiptap/starter-kit';
import { useRoute } from 'vue-router';
import { TipTapCustomImage } from '@/views/editable.repository/tiptap/image.plugin';
import { ActionEnum, useStore } from '@/store';
import ArticleLimit from './section.article/article.limit.vue';
import MentionList from './tiptap/mention.list.vue';
import SectionArticleControl from './section.article/section.article.control.vue';

export default defineComponent({
  name: 'section.article',
  components: {
    EditorContent,
    ArticleLimit,
    SectionArticleControl,
  },
  props: {
    articleContent: {
      required: true,
      type: Object as PropType<JSONContent>
    },
    editable: {
      required: true,
      type: Boolean
    },
    entityId: {
      required: true,
      type: String
    }
  },
  setup(props, context) {
    const route = useRoute();
    const store = useStore();
    const { articleContent, editable } = toRefs(props);
    const knowledgeList = computed(() => store.state.repositoryEditor.repositoryEntityList);
    const limit = ref(280);
    const timer = ref(0);
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
    const editor: Ref<Editor | undefined> = useEditor({
      editable: editable.value,
      content: articleContent.value,
      extensions: [
        Document,
        Paragraph,
        StarterKit,
        Text,
        CharacterCount.configure({
          limit: limit.value,
        }),
        CustomMention.configure({
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
                  if (editor.value) {
                    component = new VueRenderer(MentionList, {
                      editor: editor.value,
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
              context.emit('mention', {
                name: props.name,
                id: props.id,
                content: editor.getJSON(),
                contentHtml: editor.getHTML(),
                success() {
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
                }
              });
            },
          },
        }),
        TipTapCustomImage(async (file: File) => {
          console.log(file);
          return '';
        })
      ],
      editorProps: {
        handleClick: (view, pos, event) => {
          console.log(view, pos, event);
          context.emit('clickMention');
          return true;
        }
      },
    });
    onMounted(async () => {
      await store.dispatch(ActionEnum.GET_REPOSITORY_BIND_ENTITY_LIST, {
        repositoryEntityId: route.query.repositoryEntityId
      });
      // 定时存储文章
      // timer.value = window.setInterval(() => {
      //   context.emit('saveSectionArticle', {
      //     content: editor.value?.getJSON(),
      //     contentHtml: editor.value?.getHTML()
      //   });
      //   editor.value?.commands.focus();
      // }, 10000);
    });
    onUnmounted(() => {
      // 清除定时器
      if (timer.value) {
        window.clearInterval(timer.value);
      }
      editor.value?.destroy();
    });
    // 更新article
    watch(articleContent, (newValue) => {
      editor.value?.commands.setContent(newValue);
    });
    // 是否可编辑
    watch(editable, (newValue) => {
      editor.value?.setEditable(newValue);
    });
    // 存储单元文章
    const saveSectionArticle = () => {
      context.emit('saveSectionArticle', {
        content: editor.value?.getJSON(),
        contentHtml: editor.value?.getHTML()
      });
    };
    const upload = async () => {
      // editor.value?.commands.focus();
      const result = editor.value?.commands.setImage({
        src: 'http://file.songxiwen.com.cn/icon1.jpeg',
        class: 'custom-tip-tap-image',
        height: '300',
        width: '400'
      });
      console.log(result, ' ------result');
      // editor.value?.commands.focus();
      // editor.value?.commands.enter();
    };
    return {
      editor, limit, saveSectionArticle, upload
    };
  }
});
</script>

<style lang="scss" scoped>
@import "../../style/common";
/* Basic editor styles */

.mention {
  color: #A975FF;
  background-color: rgba(#A975FF, 0.1);
  border-radius: 0.3rem;
  padding: 0.1rem 0.3rem;
}

.section-article {
  text-align: left;
  background: $backgroundColor;
  width: 100%;
  height: 100%;

  .article-container {
    height: 100%;
    //overflow: scroll;
    padding-top: 15px;

    .limit-container {
      width: 816px;
      height: 30px;
      margin: 0 auto;
    }

    .editor-container {
      width: 816px;
      //height: 100%;
      height: calc(100vh - 147px);
      //min-height: 600px;
      overflow: scroll;
      margin: 0 auto;
      background: #fff;

      .tip-tap-editor {
        & ::v-deep(.ProseMirror) {
          text-indent: 10px;
          outline: none;
          padding: 20px;
          min-height: 1000px;

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
    }

    .editor-container-view {
      width: 816px;
      margin: 0 auto;
      background: #fff;

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
    }

    .comment-content {
      width: 816px;
      margin: 0 auto;
      padding-top: 35px;
    }
  }
}

</style>
