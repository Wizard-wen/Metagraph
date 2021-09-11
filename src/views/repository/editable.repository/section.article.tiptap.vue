<template>
  <div class="section-article">
    <section-article-control
      v-if="editable" :editor="editor" @save="saveSectionArticle"></section-article-control>
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
import { ActionEnum, useStore } from '@/store';
import tippy from 'tippy.js';
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
import ArticleLimit from './section.article/article.limit.vue';
import MentionList from './tiptap/mention.list.vue';
import SectionArticleControl from './section.article/section.article.control.vue';
// import Comment from './comment.vue';

export default defineComponent({
  name: 'section.article.tiptap',
  components: {
    EditorContent,
    ArticleLimit,
    SectionArticleControl,
    // Comment
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
    const { repositoryEntityId } = route.params;
    const { articleContent, editable } = toRefs(props);
    const knowledgeList = computed(() => store.state.repositoryEdit.repositoryEntityList);
    const limit = ref(280);
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
            parseHTML: (element) => ({
              name: element.getAttribute('data-mention-name'),
            }),
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
    onMounted(async () => {
      await store.dispatch(ActionEnum.GET_REPOSITORY_BIND_ENTITY_LIST, { repositoryEntityId });
    });
    const editor: Ref<Editor | undefined> = useEditor({
      editable: editable.value,
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
            items: (query) => knowledgeList.value,
            render: () => {
              let component: any;
              let popup: any;
              return {
                // eslint-disable-next-line no-shadow
                onStart: (props) => {
                  console.log(props);
                  component = new VueRenderer(MentionList, {
                    editor: editor.value!,
                    props,
                  });
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
                onUpdate(props) {
                  console.log('update ---> ', props);
                  component.updateProps(props);
                  popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                  });
                },
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
              console.log('command --- >', editor, range, props);
              // editor
              //   .chain()
              //   .focus()
              //   .insertContentAt(range, [
              //     {
              //       type: 'mention',
              //       attrs: { name: props.name, id: props.id }
              //     },
              //     {
              //       type: 'text',
              //       text: ' ',
              //     },
              //   ])
              //   .run();
              context.emit('mention', {
                name: props.name,
                id: props.id,
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
        })
      ],
      content: articleContent.value,
      editorProps: {
        handleClick: (view, pos, event) => {
          console.log(view, pos, event);
          console.log(editor.value?.state?.selection?.empty);
          return true;
        }
      },
    });
    // 更新article
    watch(articleContent, (newValue) => {
      console.log('change ', newValue);
      editor.value?.commands.setContent(newValue);
    });

    watch(editable, (newValue) => {
      console.log('change ', newValue);
      editor.value?.setEditable(newValue);
    });
    onUnmounted(() => {
      editor.value?.destroy();
    });
    const saveSectionArticle = () => {
      console.log('save');
      context.emit('saveSectionArticle', {
        content: editor.value?.getJSON(),
        contentHtml: editor.value?.getHTML()
      });
    };

    return {
      editor, limit, saveSectionArticle,
    };
  }
});
</script>

<style lang="scss" scoped>
@import "../../../style/common.scss";
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
