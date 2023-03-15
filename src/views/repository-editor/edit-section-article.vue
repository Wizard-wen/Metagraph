<template>
  <div class="section-article-container">
    <div class="section-article">
      <div class="bottom-control">
        <div class="limit-container">
          <tiptap-editor-article-limit
            v-if="editor && editable"
            :current="characterCount"
            :limit="limit"></tiptap-editor-article-limit>
        </div>
      </div>
      <div class="article-control"
           v-if="editable
         && editor
         && sectionTree.selectedTreeNodes.length">
        <section-article-control-menu
          :editor="editor"
          @refreshSection="handleCreateSectionByParseText"
          @fontSizeChange="changeArticleFontSize($event)"
          @save="saveSectionArticleByUser"></section-article-control-menu>
      </div>
      <div class="editor-container"
           ref="editorContainer"
           v-if="editable && sectionTree.selectedTreeNodes.length">
        <editor-content
          v-if="editable && editor"
          :style="{fontSize: articleFontSize + 'px'}"
          class="tip-tap-editor" :editor="editor"/>
      </div>
      <empty-view v-if="editable && !sectionTree.selectedTreeNodes.length">
        <template #content>
          <ant-button
            @click="createTopSection" type="primary">
            <template #icon>
              <PlusOutlined/>
            </template>
            创建顶级单元
          </ant-button>
        </template>
      </empty-view>
    </div>
  </div>

</template>

<script lang="ts">
import EmptyView from '@/components/empty-view/empty-view.vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { Editor, EditorContent, } from '@tiptap/vue-3';
import { Button } from 'ant-design-vue';
import { computed, defineComponent, onMounted, onUnmounted, PropType, ref, toRef } from 'vue';
import { currentSectionNode, sectionTree } from './model/section.tree';
import {
  SectionArticleBubbleMenu,
  SectionArticleControlMenu,
  TiptapEditorArticleLimit
} from './section-article-tip-tap/index';

export default defineComponent({
  name: 'section-article-tip-tap',
  components: {
    EmptyView,
    SectionArticleBubbleMenu,
    EditorContent,
    SectionArticleControlMenu,
    TiptapEditorArticleLimit,
    AntButton: Button,
    PlusOutlined
  },
  props: {
    editable: {
      required: true,
      type: Boolean
    },
    editor: {
      type: Object as PropType<Editor>,
      required: true
    },
    entityId: {
      required: true,
      type: String
    }
  },
  emits: ['clickMention', 'mention', 'save', 'createSection', 'refreshSection'],
  setup(props, context) {
    const editor = toRef(props, 'editor');
    const limit = ref(1000);
    const articleFontSize = ref('14');
    const changeArticleFontSize = (event: { value: string }) => {
      articleFontSize.value = event.value;
    };
    const paddingValue = ref<number[]>([0, 816]);
    const paddingFormatter = (value: number) => `${value}px`;
    const paddingMarks = ref<Record<number, any>>({
      0: {
        style: { left: '-20px' },
        label: '0px'
      },
      816: {
        style: { right: '0px' },
        label: '816px'
      }
    });
    const editorContainer = ref();

    const characterCount = computed(() => editor.value.storage.characterCount.characters());

    // 存储单元文章
    async function saveSectionArticleByUser() {
      if (editor?.value) {
        context.emit('save', {
          content: editor.value.getJSON(),
          contentHtml: editor.value.getHTML()
        });
      }
    }

    async function createTopSection() {
      context.emit('createSection', {
        isRoot: true,
        type: 'Section'
      });
    }

    function handleCreateSectionByParseText(params: {
      sectionId: string
    }) {
      context.emit('refreshSection', params);
    }

    const editorWidth = ref(0);

    function handleWindowResize() {
      const editorHeight = editorContainer.value.scrollHeight;
      editorWidth.value = Math.floor((editorHeight * 210) / 297);
    }

    function initEditorSize() {
      const windowHeight = window.innerHeight - 116;
      editorWidth.value = Math.floor((windowHeight * 210) / 297);
    }

    onMounted(() => {
      window.addEventListener('resize', handleWindowResize);
      initEditorSize();
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleWindowResize);
    });

    return {
      limit,
      saveSectionArticleByUser,
      changeArticleFontSize,
      articleFontSize,
      paddingValue,
      paddingFormatter,
      paddingMarks,
      currentSectionNode,
      handleCreateSectionByParseText,
      sectionTree,
      characterCount,
      createTopSection,
      editorContainer,
      editorWidth
    };
  }
});
</script>

<style lang="scss" scoped>
@import "../../style/common.scss";
@import "../../style/tiptap.common.scss";

.section-article-container {
  height: calc(100vh - 56px);
  background: $editorBackgroundColor;
  width: 100%;
  position: relative;

  .section-article {
    text-align: left;
    height: 100%;
    overflow-y: auto;

    .bottom-control {
      position: absolute;
      bottom: 0;
      z-index: 1000;
      height: 28px;
      width: 100%;
      background: $headerBackgroundColor;
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid $borderColor;

      .limit-container {
        width: 816px;
        height: 28px;
        display: flex;
        align-items: center;
      }
    }

    .article-control {
      width: 100%;
      z-index: 100;
      position: absolute;
      top: 0;
    }

    .editor-container {
      width: 750px;
      margin: 70px auto 28px;
      height: max-content;
      min-height: 100%;
      background: $textBackgroundColor;
    }

    .article-container {
      margin-top: 80px;
      height: 100%;
      width: 100%;

      .editor-range {
        position: relative;
        width: 100%;
        height: max-content;
        margin: 0 auto;
      }

      .editor-container {
        width: 750px;
        margin: 0 auto;
        position: absolute;
        min-height: 100%;
        background: $textBackgroundColor;
      }

      .editor-container-view {
        width: 816px;
        margin: 0 auto;
        min-height: 100%;
        padding-top: 50px;
      }

      .comment-content {
        width: 816px;
        margin: 0 auto;
        padding-top: 35px;
      }
    }
  }
}


</style>
