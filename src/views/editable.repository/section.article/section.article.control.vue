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
      <div class="operation-icon" @click="handleCreateMention">
        <div class="icon">
          <FindIcon
            class="icon-svg"
            :class="{ 'is-active': !editor?.state?.selection?.empty }"/>
        </div>
        <div class="name">
          查找
        </div>
      </div>
      <div class="operation-icon" @click="handleUpload">
        <div class="icon">
          <UploadIcon class="icon-svg"/>
        </div>
        <div class="name">
          上传
        </div>
      </div>
    </div>
  </div>
  <ant-modal
    title="上传"
    :width="1000"
    :visible="isUploadModalShown"
    @ok="handleCreateArticle"
    @cancel="isUploadModalShown = false">
    <input type="file" @change="uploadWord($event)">
    <div v-if="text" style="max-height: 500px;overflow: scroll;width: 100%; padding: 20px;line-height: 24px;">
      <p>{{ text }}</p>
    </div>
    <div v-if="words" style="max-height: 300px;overflow: scroll;width: 100%;">
      <ant-list size="small" bordered :data-source="words">
        <template #renderItem="{ item }">
          <ant-list-item>{{ item.word }} ---- {{ item.weight }}</ant-list-item>
        </template>
      </ant-list>
    </div>
  </ant-modal>
</template>

<script lang="ts">
import {
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  RedoOutlined,
  StrikethroughOutlined,
  UndoOutlined,
  UnorderedListOutlined
} from '@ant-design/icons-vue';
import { Editor } from '@tiptap/vue-3';
import { FileEnum } from 'edu-graph-constant';
import * as qiniu from 'qiniu-js';
import {
  defineComponent, PropType, ref, toRef
} from 'vue';
import { useRoute } from 'vue-router';
import { FileApiService } from '@/api.service';
import { NlpApiService } from '@/api.service/nlp.api.service';
import CodeIcon from '@/components/icons/code.icon.vue';
import FindIcon from '@/components/icons/find.icon.vue';
import H1Icon from '@/components/icons/h1.icon.vue';
import H2Icon from '@/components/icons/h2.icon.vue';
import H3Icon from '@/components/icons/h3.icon.vue';
import Quote from '@/components/icons/quote.vue';
import SaveIcon from '@/components/icons/save.icon.vue';
import UploadIcon from '@/components/icons/upload.icon.vue';

export default defineComponent({
  name: 'section.article.control',
  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true
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
    UploadIcon,
    Quote,
    H1Icon,
    H2Icon,
    H3Icon,
    CodeIcon,
    SaveIcon,
    FindIcon
  },
  emits: ['save'],
  setup(props, { emit }) {
    const editor = toRef(props, 'editor');
    const route = useRoute();
    // 保存文章
    const saveSectionArticle = () => {
      emit('save');
    };
    const isUploadModalShown = ref(false);
    // 增加section
    // todo 待优化
    const handleCreateMention = () => {
      const { from, to } = editor.value?.state.selection;
      if (!from || !to) {
        return;
      }
      const selectionContent = editor.value?.state.doc.textBetween(from, to, ' ');
      if (editor.value?.state?.selection?.ranges === undefined) {
        return;
      }
      editor.value?.chain()
        .focus().insertContentAt({ from, to } as any, [
          {
            type: 'mention',
            attrs: { id: 'test', name: selectionContent }
          },
          {
            type: 'text',
            text: ' ',
          },
        ])
        .run();
    };
    const handleUpload = () => {
      isUploadModalShown.value = true;
    };
    const handleCreateArticle = () => {

    };

    const fileUrl = ref<undefined | string>(undefined);
    const text = ref('');
    const words = ref<{ word: string; weight: number; }[]>([]);

    const customRequestUploadHandler = async (params: {
      file: File,
      name: string;
      type: FileEnum
    }) => {
      const result: {
        data?: {
          key: string;
          uploadToken: string;
        };
        message?: string;
      } = await FileApiService.getCredential({
        name: params.name,
        type: params.type
      });
      const tokenForUploading = result.data;
      console.log(tokenForUploading);
      if (tokenForUploading === undefined) {
        return;
      }
      const observer = {
        complete(response: { key: string; url: string; }) {
          console.log(response);
          fileUrl.value = response.url;
          NlpApiService.parseWord({
            url: fileUrl.value!,
            repositoryEntityId: route.query.repositoryEntityId as string
          }).then((data) => {
            if (data.data) {
              text.value = data.data.text;
              words.value = data.data.list;
            }
          });
        }
      };
      await qiniu
        .upload(
          params.file,
          tokenForUploading.key,
          tokenForUploading.uploadToken
        )
        .subscribe(observer);
    };
    const uploadWord = async (event: InputEvent) => {
      console.log(event);
      const target = event.target as HTMLInputElement;
      if (target.files === null) {
        return;
      }
      const file = target.files[0];
      await customRequestUploadHandler({
        file,
        name: file.name,
        type: FileEnum.Text
      });
    };
    return {
      saveSectionArticle,
      handleCreateMention,
      handleUpload,
      isUploadModalShown,
      handleCreateArticle,
      uploadWord,
      text,
      words
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
