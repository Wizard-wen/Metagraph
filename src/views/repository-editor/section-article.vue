<template>
  <div class="section-article" :style="{
    height: 'calc(100vh - 56px)' }">
    <div class="bottom-message">
      <div class="limit-container">
        <article-limit
          v-if="editor"
          :current="editor.storage.characterCount.characters()"
          :limit="limit"></article-limit>
      </div>
    </div>
    <div class="article-control" v-if="editable && editor">
      <section-article-control
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
    <div class="article-container" :style="{
    height: editable ? 'calc(100vh - 116px)' : 'calc(100vh - 60px)' }">
      <div class="editor-range" v-if="editable">
        <div class="editor-container"
             ref="contentRef"
             :style="{
              width: (paddingValue[1] - paddingValue[0]) + 'px',
              left: paddingValue[0] + 'px',
              right: (816 - paddingValue[1] + 'px')
            }"
             v-if="editable">
          <editor-content
            v-if="editable && editor"
            :style="{fontSize: articleFontSize + 'px'}"
            class="tip-tap-editor" :editor="editor"/>
        </div>
      </div>
      <div class="editor-container-view" v-if="!editable" ref="contentRef">
        <editor-content
          v-if="editor && sectionArticle.contentHtml" class="tip-tap-editor"
          :editor="editor"/>
        <ant-empty v-else :image="simpleImage"/>
      </div>
    </div>

<!--    <bubble-menu-->
<!--      v-if="editor"-->
<!--      class="bubble-menu"-->
<!--      :tippy-options="{ duration: 100 }"-->
<!--      :editor="editor"-->
<!--    >-->
<!--      <button @click="getFocusContent">get</button>-->
<!--      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">-->
<!--        Bold-->
<!--      </button>-->
<!--      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">-->
<!--        Italic-->
<!--      </button>-->
<!--      <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">-->
<!--        Strike-->
<!--      </button>-->
<!--    </bubble-menu>-->
  </div>
</template>

<script lang="ts">

import {
  defineComponent, ref, onUnmounted, onMounted, toRef, reactive, inject
} from 'vue';
import {
  EditorContent,
  // BubbleMenu,
} from '@tiptap/vue-3';
import { Empty, message } from 'ant-design-vue';
import { repositoryEntityIdKey } from '@/views/repository-editor/provide.type';
import SectionArticleControl from './section-article/section-article-control.vue';
import ArticleLimit from './section-article/article-limit.vue';
import {
  sectionArticle,
  sectionArticleTiptapTextEditor,
  SectionTreeService,
} from './section-tree/section.tree';

export default defineComponent({
  name: 'section-article',
  components: {
    EditorContent,
    // BubbleMenu,
    SectionArticleControl,
    ArticleLimit,
    AntEmpty: Empty
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
  emits: ['clickMention', 'mention'],
  setup(props, context) {
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    const editable = toRef(props, 'editable');
    const limit = ref(30000);
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
    const contentRef = ref<Element>();
    const mentionKnowledge = reactive<{
      id: string;
      name: string;
    }>({
      id: '',
      name: ''
    });
    SectionTreeService.initEditor(repositoryEntityId.value, editable.value);
    const editor = sectionArticleTiptapTextEditor?.editor;

    function getFocusContent() {
      console.log(editor?.value?.chain()
        .focus());
      const node = editor?.value?.state;
      console.log(node);
    }

    async function handleClickMentionItem(event: Event) {
      console.log('click')
      const target = event?.target as HTMLSpanElement;
      if (target?.dataset?.mentionId && target?.dataset?.mentionName) {
        mentionKnowledge.id = target.dataset.mentionId;
        mentionKnowledge.name = target.dataset.mentionName;
        context.emit('clickMention', {
          id: target.dataset.mentionId,
          name: target.dataset.mentionName
        });
      }
    }

    // 存储单元文章
    const saveSectionArticle = async () => {
      if (editor?.value) {
        const result = await sectionArticleTiptapTextEditor?.saveContent({
          content: editor.value.getJSON(),
          contentHtml: editor.value.getHTML()
        });
        if (result) {
          message.success('保存成功！');
        }
      }
    };

    onMounted(async () => {
      if (contentRef.value) {
        console.log('bind');
        contentRef.value?.addEventListener('click', handleClickMentionItem);
      }
    });
    onUnmounted(() => {
      if (contentRef.value) {
        contentRef.value?.removeEventListener('click', handleClickMentionItem);
      }
      sectionArticleTiptapTextEditor?.destroy();
    });

    return {
      editor,
      sectionArticleTiptapTextEditor,
      limit,
      saveSectionArticle,
      changeArticleFontSize,
      articleFontSize,
      paddingValue,
      paddingFormatter,
      paddingMarks,
      sectionArticle,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      contentRef,
      getFocusContent
    };
  }
});
</script>

<style lang="scss" scoped>
@import "../../style/common.scss";
@import "../../style/tiptap.common.scss";

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
    padding-bottom: 15px;
  }

  .article-container {
    overflow-y: auto;

    .editor-range {
      position: relative;
      width: 816px;
      min-height: 100%;
      margin: 0 auto;

      .editor-container {
        position: absolute;
        min-height: 500px;
        width: 100%;
        background: #fff;
      }
    }

    .editor-container-view {
      width: 816px;
      margin: 0 auto;
      min-height: 100%;
      padding-top: 50px;
      //background: #fff;
    }

    .comment-content {
      width: 816px;
      margin: 0 auto;
      padding-top: 35px;
    }
  }
}

</style>
