<template>
  <div class="section-article">
    <div class="bottom-message">
      <div class="limit-container">
        <article-limit
          v-if="editor"
          :current="editor.getCharacterCount()"
          :limit="limit"></article-limit>
      </div>
    </div>
    <div class="article-control">
      <section-article-control
        v-if="editable && editor"
        :editor="editor"
        @fontSizeChange="changeArticleFontSize($event)"
        @save="saveSectionArticle"></section-article-control>
    </div>
    <!--    <ant-slider-->
    <!--      style="width: 816px; margin: 0 auto"-->
    <!--      :min="0"-->
    <!--      :max="816"-->
    <!--      :tip-formatter="paddingFormatter"-->
    <!--      range-->
    <!--      :marks="paddingMarks"-->
    <!--      v-model:value="paddingValue"-->
    <!--      :disabled="false"/>-->
    <div class="article-container">
      <div class="editor-range">
        <div class="editor-container"
             :style="{
              width: (paddingValue[1] - paddingValue[0]) + 'px',
              left: paddingValue[0] + 'px',
              right: (816 - paddingValue[1] + 'px')
            }"
             v-if="editable">
          <editor-content
            :style="{fontSize: articleFontSize + 'px'}"
            class="tip-tap-editor" :editor="editor"/>
        </div>
      </div>
      <div class="editor-container-view" v-if="!editable">
        <editor-content class="tip-tap-editor" :editor="editor"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import tippy, { Instance } from 'tippy.js';
import {
  defineComponent, ref, computed, onUnmounted, Ref, onMounted, watch, toRef
} from 'vue';
import {
  useEditor, EditorContent, VueRenderer, Editor
} from '@tiptap/vue-3';
import { mergeAttributes } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import CharacterCount from '@tiptap/extension-character-count';
import Mention from '@tiptap/extension-mention';
import StarterKit from '@tiptap/starter-kit';
import { useRoute } from 'vue-router';
import Image from '@tiptap/extension-image';
import { ActionEnum, useStore } from '@/store';
import MentionList from './tiptap/mention.list.vue';
import SectionArticleControl from './section.article/section-article-control.vue';
import ArticleLimit from './section.article/article.limit.vue';

export default defineComponent({
  name: 'section-article',
  components: {
    EditorContent,
    SectionArticleControl,
    ArticleLimit
  },
  props: {
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
    const editable = toRef(props, 'editable');
    const knowledgeList = computed(() => store.state.repositoryEditor.repositoryEntityList);
    const limit = ref(30000);
    const timer = ref(0);
    const articleFontSize = ref('12');
    const changeArticleFontSize = (event: { value: string }) => {
      articleFontSize.value = event.value;
    };
    const paddingValue = ref<number[]>([0, 816]);
    const paddingFormatter = (value: number) => {
      console.log(value);
      return `${value}px`;
    };
    const paddingMarks = ref<Record<number, any>>({
      0: { style: { left: '-20px' }, label: '0px' },
      816: { style: { right: '0px' }, label: '816px' }
    });
    const articleContent = computed(() => store.state.repositoryEditor.sectionArticleContent);
    const CustomMention = Mention.extend({
      // addNodeView() {
      //   return VueNodeViewRenderer(MentionView);
      // },
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
      editorProps: {
        handleClick: (view, pos, event) => {
          console.log(view, pos, event);
          context.emit('clickMention');
          return true;
        },
        // handleKeyDown(view, event) {
        //   console.log(view, event);
        //   return true;
        // }
      },
      extensions: [
        Document,
        Paragraph,
        StarterKit,
        Image,
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
              // console.log(editor.getJSON());
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
        })
      ]
    });
    onMounted(async () => {
      await store.dispatch(ActionEnum.GET_REPOSITORY_BIND_ENTITY_LIST, {
        repositoryEntityId: route.query.repositoryEntityId
      });
      // 定时存储文章
      timer.value = window.setInterval(() => {
        context.emit('saveSectionArticle', {
          content: editor.value?.getJSON(),
          contentHtml: editor.value?.getHTML()
        });
        // editor.value?.commands.focus();
      }, 10000);
    });
    onUnmounted(() => {
      // 清除定时器
      if (timer.value) {
        window.clearInterval(timer.value);
      }
      context.emit('saveSectionArticle', {
        content: editor.value?.getJSON(),
        contentHtml: editor.value?.getHTML()
      });
      editor.value?.destroy();
    });
    // 更新article
    watch(articleContent, (newValue) => {
      console.log(newValue, 'article changed');
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

    return {
      editor,
      limit,
      saveSectionArticle,
      changeArticleFontSize,
      articleFontSize,
      paddingValue,
      paddingFormatter,
      paddingMarks
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
  position: relative;

  .bottom-message {
    position: absolute;
    bottom: 0;
    z-index: 1000;
    height: 28px;
    width: 100%;
    background: #eee;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .limit-container {
      width: 816px;
      height: 28px;
      display: flex;
      align-items: center;
    }
  }

  .article-control {
    //width: 100%;
    //height: 46px;
    //position: absolute;
    //top: 0;
    padding-bottom: 15px;
  }

  .article-container {
    height: calc(100vh - 116px);
    overflow-y: auto;
    //padding-top: 15px;

    .editor-range {
      position: relative;
      width: 816px;
      min-height: 100%;
      margin: 0 auto;
    }

    .editor-container {
      position: absolute;
      width: 100%;
      background: #fff;

      .tip-tap-editor {
        & ::v-deep(.ProseMirror) {
          text-indent: 10px;
          outline: none;
          padding: 20px;
          //min-height: 1000px;

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
