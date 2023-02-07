<template>
  <div class="section-article" :style="{
    height: 'calc(100vh - 56px)' }">
    <div class="bottom-message">
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
    <div class="article-container" :style="{
    height: editable ? 'calc(100vh - 116px)' : 'calc(100vh - 60px)' }">
      <div class="editor-range" v-if="editable && sectionTree.selectedTreeNodes.length">
        <div class="editor-container"
             ref="editorContainer"
             :style="{
              width: editorWidth + 'px',
              margin: '0 auto',
              left: paddingValue[0] + 'px',
              right: (816 - paddingValue[1] + 'px')
            }"
             v-if="editable">
          <editor-content
            v-if="editable && editor"
            :style="{fontSize: articleFontSize + 'px'}"
            class="tip-tap-editor" :editor="editor"/>
<!--          <editor-content-->
<!--            v-if="editable && editor"-->
<!--            class="tip-tap-editor" :editor="editor"/>-->
        </div>
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
      <div class="editor-container-view" v-if="!editable">
        <editor-content
          v-if="editor && currentSectionNode.contentHtml" class="tip-tap-editor"
          :editor="editor"/>
        <empty-view v-else></empty-view>
      </div>
    </div>
<!--    <section-article-bubble-menu-->
<!--      v-if="editor" :editor="editor"></section-article-bubble-menu>-->
  </div>
</template>

<script lang="ts">
import EmptyView from '@/components/empty-view/empty-view.vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { Editor, EditorContent, } from '@tiptap/vue-3';
import { Button } from 'ant-design-vue';
import {
  computed, defineComponent, onMounted, onUnmounted, PropType, ref, toRef
} from 'vue';
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

.section-article {
  text-align: left;
  background: $contentBackgroundColor;
  width: 100%;
  position: relative;

  .bottom-message {
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

    .limit-container {
      width: 816px;
      height: 28px;
      display: flex;
      align-items: center;
    }
  }

  .article-control {
    padding-bottom: 15px;
  }

  .article-container {
    .editor-range {
      position: relative;
      width: 816px;
      min-height: calc(100% - 48px);
      margin: 0 auto;
      overflow-y: auto;

      .editor-container {
        position: absolute;
        min-height: 100%;
        width: 100%;
        background: $textBackgroundColor;
      }
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

</style>
