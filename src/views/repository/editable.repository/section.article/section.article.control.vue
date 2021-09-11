<template>
  <div v-if="editor" class="operator">
    <div class="operator-container">
      <div class="operation-icon" @click="saveSectionArticle">
        <div class="icon">
          <SaveIcon class="icon-svg"/>
        </div>
        <div class="name">
          保存
        </div>
      </div>
      <div class="operation-icon" @click="editor.chain().focus().undo().run()">
        <div class="icon">
          <UndoOutlined viewBox="0 0 1024 1024" class="icon-svg"/>
        </div>
        <div class="name">
          撤销
        </div>
      </div>
      <div class="operation-icon" @click="editor.chain().focus().redo().run()">
        <div class="icon">
          <RedoOutlined viewBox="0 0 1024 1024" class="icon-svg"/>
        </div>
        <div class="name">
          重做
        </div>
      </div>
      <div class="operation-icon" @click="editor.chain().focus().toggleBold().run()">
        <div class="icon">
          <BoldOutlined
            class="icon-svg"
            :class="{ 'is-active': editor.isActive('bold') }"/>
        </div>
        <div class="name">
          加粗
        </div>
      </div>
      <div class="operation-icon" @click="editor.chain().focus().toggleItalic().run()">
        <div class="icon">
          <ItalicOutlined
            class="icon-svg"
            :class="{ 'is-active': editor.isActive('italic') }"/>
        </div>
        <div class="name">
          倾斜
        </div>
      </div>
      <div class="operation-icon" @click="editor.chain().focus().toggleStrike().run()">
        <div class="icon">
          <StrikethroughOutlined
            class="icon-svg"
            :class="{ 'is-active': editor.isActive('strike') }"/>
        </div>
        <div class="name">
          划线
        </div>
      </div>
      <div class="operation-icon" @click="editor.chain().focus().toggleBulletList().run()">
        <div class="icon">
          <UnorderedListOutlined
            class="icon-svg"
            :class="{ 'is-active': editor.isActive('bulletList') }"/>
        </div>
        <div class="name">
          列表
        </div>
      </div>
      <div class="operation-icon" @click="editor.chain().focus().toggleOrderedList().run()">
        <div class="icon">
          <OrderedListOutlined
            class="icon-svg"
            :class="{ 'is-active': editor.isActive('orderedList') }"/>
        </div>
        <div class="name">
          列表
        </div>
      </div>
      <div class="operation-icon" @click="editor.chain().focus().toggleBlockquote().run()">
        <div class="icon">
          <quote
            class="icon-svg"
            :class="{ 'is-active': editor.isActive('blockquote') }"/>
        </div>
        <div class="name">
          块引用
        </div>
      </div>
      <div class="operation-icon"
           @click="editor.chain().focus().toggleHeading({ level: 1 }).run()">
        <div class="icon">
          <H1Icon
            class="icon-svg"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"/>
        </div>
        <div class="name">
          标题1
        </div>
      </div>
      <div class="operation-icon"
           @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
        <div class="icon">
          <H2Icon
            class="icon-svg"
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"/>
        </div>
        <div class="name">
          标题2
        </div>
      </div>
      <div class="operation-icon"
           @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">
        <div class="icon">
          <H3Icon
            class="icon-svg"
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"/>
        </div>
        <div class="name">
          标题3
        </div>
      </div>
      <div class="operation-icon" @click="editor.chain().focus().toggleCode().run()">
        <div class="icon">
          <CodeIcon
            class="icon-svg"
            :class="{ 'is-active': editor.isActive('code') }"/>
        </div>
        <div class="name">
          代码段
        </div>
      </div>
      <div class="operation-icon" @click="handleTestClick($event)">
        <div class="icon">
          <FindIcon
            class="icon-svg"
            :class="{ 'is-active': !editor?.state?.selection?.empty }"/>
        </div>
        <div class="name">
          查找
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store";
import { defineComponent, PropType, toRefs } from 'vue';
import Quote from '@/components/icons/quote.vue';
import H1Icon from '@/components/icons/h1.icon.vue';
import H2Icon from '@/components/icons/h2.icon.vue';
import H3Icon from '@/components/icons/h3.icon.vue';
import CodeIcon from '@/components/icons/code.icon.vue';
import SaveIcon from '@/components/icons/save.icon.vue';
import FindIcon from '@/components/icons/find.icon.vue';
import {
  BoldOutlined, ItalicOutlined, StrikethroughOutlined, UndoOutlined, RedoOutlined,
  OrderedListOutlined,
  UnorderedListOutlined
} from '@ant-design/icons-vue';
import { Editor } from '@tiptap/vue-3';

export default defineComponent({
  props: {
    editor: {
      type: Object as PropType<Editor>
    }
  },
  components: {
    BoldOutlined,
    ItalicOutlined,
    StrikethroughOutlined,
    UndoOutlined,
    OrderedListOutlined,
    UnorderedListOutlined,
    RedoOutlined,
    Quote,
    H1Icon,
    H2Icon,
    H3Icon,
    CodeIcon,
    SaveIcon,
    FindIcon
  },
  name: 'section.article.control',
  setup(props, context) {
    const store = useStore();
    const { editor } = toRefs(props);
    const saveSectionArticle = () => {
      context.emit('save');
    };
    const handleTestClick = (event: MouseEvent) => {
      const from = editor.value?.state.selection.from;
      const to = editor.value?.state.selection.to;
      const selectionContent = editor.value?.state.doc.textBetween(from!, to!, ' ');
      console.log(from, to, selectionContent);
      if (editor.value?.state?.selection?.ranges === undefined) {
        return;
      }
      editor.value?.chain()
        .focus().insertContentAt({ from, to } as any, [
          {
            type: 'mention',
            attrs: { id: 'test', name: selectionContent }
          // text: props.name
          },
          {
            type: 'text',
            text: ' ',
          },
        ])
        .run();
    };
    return {
      saveSectionArticle,
      handleTestClick
    };
  }
});
</script>

<style scoped lang="scss">
.operator {
  padding: 2px 0;
  height: 46px;
  width: 100%;

  .operator-container {
    display: flex;
    max-width: 900px;
    justify-content: space-between;
    margin: 0 auto;

    .operation-icon {
      padding: 0 8px;
      margin: 0 5px;
      height: 42px;
      cursor: pointer;

      .icon {
        width: 20px;
        height: 20px;
        margin: 4px auto 0;

        .is-active {
          color: #000;
        }

        .icon-svg {
          font-size: 20px;
        }

        color: #b5b5bb;
      }

      .name {
        font-size: 12px;
        //width: 24px;
        margin-top: 1px;
        line-height: 18px;
      }
    }
  }
}
</style>
