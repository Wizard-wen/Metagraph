<template>
  <div class="right-sidebar-container">
    <div class="control-button-content">
      <m-button :title="'解析文本'" class="full-button-style" @click="handleOpenParseTextModal">
        <template #icon>
          <UploadOutlined/>
        </template>
      </m-button>
      <input
        @change="handleFileChange"
        ref="inputElement"
        type="file"
        name="upload"
        id="upload"
        style="display: none;"/>
    </div>
    <div class="right-sidebar-content">
      <template v-if="alternative.target.length">
        <article-item
          v-for="(item, index) in alternative.target"
          :key="index"
          :expend-item-id="expendId"
          :article-item="item"
          @expend="handleExpend"
          @controlArticle="handleControlArticle"
          @controlKnowledge="handleControlKnowledge"
        ></article-item>
      </template>
      <empty-view v-else></empty-view>
    </div>
  </div>
  <upload-and-parse-text-modal
    :dom-file="currentFile"
    v-if="isParseWordModalShow"
    :is-upload-modal-shown="isParseWordModalShow"
    @close="handleCloseParseTextModal"></upload-and-parse-text-modal>
</template>

<script lang="ts" setup>
import EmptyView from '@/components/empty-view/empty-view.vue';
import { createVNode, defineEmits, inject, ref } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { AlternativeKnowledgeModelType, SectionModelType } from 'metagraph-constant';
import { repositoryEntityIdKey } from '@/views/repository-editor/model/provide.type';
import ArticleItem from '@/views/repository-editor/right-sidebar/alternative-knowledge-list/article-item.vue';
import { KnowledgeArticleModelType } from 'metagraph-constant/dist/type/knowledge.type';
import { MButton } from '@/metagraph-ui';
import { FileTypeUtil } from '@/utils';
import { alternative, RepositoryEditor } from '../model/repository.editor';
import UploadAndParseTextModal
  from '@/views/repository-editor/public-component/upload-and-parse-text-modal.vue';
import {
  UploadAndParseTextService
} from '@/views/repository-editor/model/upload.and.parse.text.service';
const uploadAndParseTextService = new UploadAndParseTextService();
const emit = defineEmits(['open', 'createOrBindEntity', 'refreshSection']);

const isParseWordModalShow = ref(false);
const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
const repositoryEditor = new RepositoryEditor();
const inputElement = ref();
const currentFile = ref<File>();
function handleOpenParseTextModal(event: MouseEvent) {
  if (inputElement.value) {
    inputElement.value.click();
    event.preventDefault();
  }
}

async function handleFileChange(event: InputEvent) {
  const target = event.target as HTMLInputElement;
  if (!target.files) {
    return;
  }
  [currentFile.value] = target.files;
  const result = await FileTypeUtil.checkFileType(currentFile.value);
  if (!result) return;
  if (result.mime !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    message.error('目前只支持.docx格式的文本解析');
    return;
  }
  isParseWordModalShow.value = true;
  inputElement.value.value = '';
}

async function handleCloseParseTextModal(params: {
  type: 'Section' | 'void' | 'Alternative'
  sectionModel?: SectionModelType
}) {
  if (params.type === 'Section' && params.sectionModel) {
    emit('refreshSection', {
      sectionId: params.sectionModel.id
    });
  }
  if (params.type === 'Alternative') {
    await repositoryEditor.getAlternativeKnowledgeList(repositoryEntityId.value);
  }
  uploadAndParseTextService.clearData();
  currentFile.value = undefined;
  isParseWordModalShow.value = false;
}

const expendId = ref();

function handleExpend(value: string) {
  if (expendId.value === value) {
    expendId.value = '';
  } else {
    expendId.value = value;
  }
}

async function deleteAlternativeKnowledge(childItem: AlternativeKnowledgeModelType) {
  Modal.confirm({
    title: '删除备选知识点',
    icon: createVNode(ExclamationCircleOutlined),
    content: `确定要删除备选知识点"${childItem.name}"吗?`,
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      await repositoryEditor.removeAlternativeKnowledge({
        repositoryEntityId: repositoryEntityId.value,
        id: childItem.id
      });
      await repositoryEditor
        .getAlternativeKnowledgeList(repositoryEntityId.value);
    },
    onCancel() {
      message.info('取消删除！');
    },
  });
}

async function handleControlArticle(params: {
  type: string,
  data: KnowledgeArticleModelType
}) {
  // todo
}

async function handleControlKnowledge(params: {
  type: string,
  data: AlternativeKnowledgeModelType
}) {
  if (params.type === 'CreateKnowledge') {
    emit('createOrBindEntity', {
      searchText: params.data.name
    });
  }
  if (params.type === 'DeleteKnowledge') {
    await deleteAlternativeKnowledge(params.data);
  }
}
</script>

<style scoped lang="scss">
@import '../../../style/common';

.control-button-content {
  padding: 10px 15px 10px 15px;
  border-bottom: 1px solid $borderColor;

  .full-button-style {
    width: 100%;
  }
}

.right-sidebar-content {
  height: calc(100vh - 135px);
  padding: 10px;
  overflow-y: auto;
}
</style>
