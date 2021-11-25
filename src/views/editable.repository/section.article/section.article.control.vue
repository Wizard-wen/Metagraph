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
          解析
        </div>
      </div>
      <div class="operation-icon" @click="uploadImage">
        <div class="icon">
          <ImageIcon class="icon-svg"/>
        </div>
        <div class="name">
          图片
        </div>
      </div>
    </div>
  </div>
  <ant-modal
    title="文本解析"
    :width="1000"
    :height="700"
    v-if="isUploadModalShown"
    :visible="isUploadModalShown"
    @ok="handleCreateArticle"
    @cancel="isUploadModalShown = false">
    <div class="upload-banner">
      <div class="top">
        <ant-button class="upload-button">
          <upload-outlined></upload-outlined>
          选择word文本
          <input
            type="file"
            @click="clearCurrentUploadingValue($event)"
            @change="handleFileChange($event)">
        </ant-button>
        <ant-button
          v-if="currentFile"
          @click="confirmUploadWord"
          :isLoading="textParsingStatus.isDoing"
        >{{ uploadButtonText }}
        </ant-button>
      </div>
      <div class="file-name" v-if="wordTitle">
        <ant-input
          ref="fileNameInput"
          v-model:value="wordTitle" suffix="上传前可修改默认文件名"></ant-input>
      </div>
    </div>
    <ant-tab v-model:activeKey="activeTab">
      <ant-tab-pane key="1" tab="文本" class="tab-content">
        <div
          class="doc-text"
          v-if="articleText">
          <p>{{ articleText }}</p>
        </div>
      </ant-tab-pane>
      <ant-tab-pane key="2" tab="关键词" class="tab-content">
        <ant-list class="doc-keyword" size="small" bordered :data-source="keywords.target">
          <template #renderItem="{ item }">
            <ant-list-item class="custom-list-item">
              <div class="left">
                <span class="text">{{ item.word }}</span>
                <ant-tag class="weight-tag">{{ item.weight }}</ant-tag>
              </div>
              <CloseOutlined class="remove-icon" @click="removeKeyword(item.index)"/>
            </ant-list-item>
          </template>
        </ant-list>
      </ant-tab-pane>
    </ant-tab>
    <template #footer>
      <ant-button @click="isUploadModalShown = false">关闭</ant-button>
      <ant-button
        type="primary"
        v-if="isShowOperationButton"
        @click="createAlternativeKnowledgeList">保存关键字为备用实体
      </ant-button>
      <ant-button
        type="primary"
        v-if="isShowOperationButton"
        @click="createWordTextSection">将文本创建为新单元
      </ant-button>
    </template>
  </ant-modal>
  <CreateBindKnowledgeModal
    :searchText="searchingKeyword"
    v-if="isCreateBindKnowledgeModalVisible"
    @close="handleCreateBindKnowledgeModalClose"
    :is-modal-visible="isCreateBindKnowledgeModalVisible"></CreateBindKnowledgeModal>
</template>

<script lang="ts">
import {
  BoldOutlined,
  ItalicOutlined,
  OrderedListOutlined,
  RedoOutlined,
  StrikethroughOutlined,
  UndoOutlined,
  UnorderedListOutlined,
  UploadOutlined,
  CloseOutlined
} from '@ant-design/icons-vue';
import { Editor } from '@tiptap/vue-3';
import { FileEnum } from 'edu-graph-constant';
import {
  defineComponent, inject, PropType, ref, toRef
} from 'vue';
import {
  isShowOperationButton,
  SectionArticleControl,
  keywords,
  textParsingStatus,
  articleText,
  wordTitle,
  uploadButtonText
} from '@/views/editable.repository/section.article/section.article.control';
import { repositoryEntityIdKey } from '@/views/editable.repository/provide.type';
import CreateBindKnowledgeModal from '@/views/editable.repository/toolbar/create.bind.knowledge.modal.vue'
import {
  CodeIcon, FindIcon, H1Icon, H2Icon, H3Icon,
  Quote, SaveIcon, UploadIcon, ImageIcon
} from '@/components/icons';

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
    UploadOutlined,
    CloseOutlined,
    ImageIcon,
    UploadIcon,
    Quote,
    H1Icon,
    H2Icon,
    H3Icon,
    CodeIcon,
    SaveIcon,
    FindIcon,
    CreateBindKnowledgeModal
  },
  emits: ['save'],
  setup(props, { emit }) {
    const editor = toRef(props, 'editor');
    const fileNameInput = ref<HTMLInputElement>();
    const searchingKeyword = ref('');
    const sectionArticleControl = new SectionArticleControl();
    const isCreateBindKnowledgeModalVisible = ref<boolean>(false);
    const handleCreateBindKnowledgeModalClose = () => {
      isCreateBindKnowledgeModalVisible.value = false;
    };
    const handleCreateBindKnowledgeModalOpen = () => {
      isCreateBindKnowledgeModalVisible.value = true;
    };
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
      searchingKeyword.value = selectionContent;
      handleCreateBindKnowledgeModalOpen();
      // editor.value?.chain()
      //   .focus().insertContentAt({ from, to } as any, [
      //     {
      //       type: 'mention',
      //       attrs: { id: 'test', name: selectionContent }
      //     },
      //     {
      //       type: 'text',
      //       text: ' ',
      //     },
      //   ])
      //   .run();
    };
    const handleUpload = () => {
      isUploadModalShown.value = true;
    };
    const handleCreateArticle = () => {

    };
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    const activeTab = ref('1');
    const currentFile = ref<File | undefined>();
    const handleFileChange = (event: InputEvent) => {
      const target = event.target as HTMLInputElement;
      if (target.files === null) {
        return;
      }
      currentFile.value = target.files[0];
      wordTitle.value = target.files[0].name;
      fileNameInput.value?.focus();
    };
    const confirmUploadWord = async () => {
      if (!currentFile.value) {
        return;
      }
      await sectionArticleControl.customRequestUploadHandler({
        repositoryEntityId: repositoryEntityId.value,
        file: currentFile.value,
        name: currentFile.value.name,
        type: FileEnum.Text
      });
    };
    const clearCurrentUploadingValue = (event: InputEvent) => {
      const target = event.target as HTMLInputElement;
      target.value = '';
    };
    const uploadImage = async () => {
      editor.value?.chain().focus().setImage({ src: 'http://file.songxiwen.com.cn/icon1.jpeg' }).run();
    };
    const createWordTextSection = async () => {
      await sectionArticleControl.createWordTextSection(repositoryEntityId.value);
      isUploadModalShown.value = false;
    };
    const createAlternativeKnowledgeList = async () => {
      await sectionArticleControl.createAlternativeKnowledgeList(repositoryEntityId.value);
      isUploadModalShown.value = false;
    };
    const removeKeyword = (index: number) => {
      keywords.target.splice(index, 1);
    };
    return {
      saveSectionArticle,
      handleCreateMention,
      handleUpload,
      isUploadModalShown,
      handleCreateArticle,
      confirmUploadWord,
      uploadImage,
      articleText,
      keywords,
      activeTab,
      wordTitle,
      textParsingStatus,
      clearCurrentUploadingValue,
      handleFileChange,
      uploadButtonText,
      fileNameInput,
      createWordTextSection,
      createAlternativeKnowledgeList,
      isShowOperationButton,
      currentFile,
      removeKeyword,
      handleCreateBindKnowledgeModalClose,
      isCreateBindKnowledgeModalVisible,
      handleCreateBindKnowledgeModalOpen,
      searchingKeyword
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

.upload-banner {
  .top {
    height: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    //gap: 15px;
    justify-content: space-between;

    .upload-button {
      position: relative;

      input {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 140px;
      }
    }

    //.loading {
    //  height: 40px;
    //  display: flex;
    //  align-items: center;
    //
    //  .spin {
    //    margin-right: 5px;
    //  }
    //}
  }

  .file-name {
    &::v-deep(.ant-input-suffix) {
      color: #cccccc;
    }
  }
}

.tab-content {
  min-height: 400px;
  max-height: 500px;
  overflow: scroll;
  width: 100%;
}

.doc-text {
  padding: 20px;
  line-height: 24px;
  font-size: 16px;
}

.doc-keyword {
  min-height: 400px;

  .custom-list-item {
    &:hover {
      background: #f3f3f3;
    }

    justify-content: space-between;

    .left {
      display: flex;
      gap: 20px;

      .text {
        min-width: 120px;
      }
    }

    .remove-icon {
      width: 30px;
    }
  }
}
</style>
