<template>
  <ant-modal
    title="文本解析"
    :wrapClassName="'full-modal'"
    :centered="true"
    :width="'80%'"
    :footer="null"
    :zIndex="7999"
    v-if="isUploadModalShown"
    :visible="isUploadModalShown"
    @cancel="handleCloseParseWordModal({
      type: 'void'
    })">
    <div class="modal-content">
      <div class="parse-container" v-if="currentStatus === 'preview'">
        <div class="preview-container">
          <div id="first-preview-container"></div>
        </div>
        <div class="control">
          <m-button @click="prepareToUpload" :title="'上传'"></m-button>
        </div>
      </div>
      <div class="parse-container" v-if="currentStatus === 'confirmName'">
        <div class="input-container">
          <div class="file-name">
            <ant-input
              class="filename-input-style"
              ref="fileNameInput"
              v-model:value="textFileForm.filename"
              :suffix="'上传前可修改默认文件名'"></ant-input>
            <div v-if="fileNameErrorMessage" class="error-message">{{ fileNameErrorMessage }}</div>
          </div>
        </div>
        <div class="control">
          <m-button @click="uploadToServer" :is-loading="isUploading" :title="'确认上传'"></m-button>
        </div>
      </div>
      <div class="parse-container" v-if="currentStatus === 'uploadSuccess'">
        <div class="uploaded-file">
          {{ fileUrl }}
        </div>
        <div class="control">
          <m-button @click="parseFileInServer" :is-loading="isParsing" :title="'确认解析'"></m-button>
        </div>
      </div>
      <div class="parse-container" v-if="currentStatus === 'parseSuccess'">
        <div class="parsed-file">
          <metagraph-tab-bar
            :is-editable="true"
            :current-key="currentBar"
            @selectedChange="handleBarChange"
            :element-tabs="elementTabs"></metagraph-tab-bar>
          <div class="parsed-result">
            <div v-show="currentBar === 'preview'">
              <div id="last-preview-container"></div>
            </div>
            <div class="parsed-content" v-if="currentBar === 'plainText'">
              <div class="doc-text" v-if="parsedResultData.articleText">
                <p>{{ parsedResultData.articleText }}</p>
              </div>
            </div>
            <div class="parsed-content" v-if="currentBar === 'keyword'">
              <parsed-keyword-list
                :list-data="parsedResultData.keywords"
                @control="removeKeyword($event)"></parsed-keyword-list>
            </div>
          </div>
        </div>
        <div class="control">
          <ant-button
            style="margin-right: 20px;"
            type="primary"
            @click="createAlternativeKnowledgeList">保存关键字为备用实体
          </ant-button>
          <ant-button
            type="primary"
            @click="confirmSectionName">将文本创建为文档
          </ant-button>
        </div>
      </div>
      <div class="parse-container" v-if="currentStatus === 'confirmSectionName'">
        <div class="input-container">
          <div class="file-name">
            <ant-input
              class="filename-input-style"
              ref="sectionNameInput"
              v-model:value="textFileForm.sectionName"
              :suffix="'保存前可修改文档名'"></ant-input>
            <div
              v-if="sectionNameErrorMessage"
              class="error-message">{{ sectionNameErrorMessage }}
            </div>
          </div>
        </div>
        <div class="control">
          <m-button @click="createWordTextSection" :title="'保存文档'"></m-button>
        </div>
      </div>
    </div>
  </ant-modal>
</template>

<script lang="ts" setup>
import { MButton } from '@/metagraph-ui';
import MetagraphTabBar from '@/components/metagraph-tab-bar.vue';
import { Button as AntButton, Input as AntInput, Modal as AntModal } from 'ant-design-vue';
import { FileEnum, SectionModelType } from '@metagraph/constant';
import { defineEmits, defineProps, inject, nextTick, PropType, ref, watchEffect } from 'vue';
import ParsedKeywordList from '@/views/repository-editor/public-component/parsed-keyword-list.vue';
import { renderAsync } from 'docx-preview';
import { repositoryEntityIdKey } from '../model/provide.type';
import {
  changeCurrentStatus,
  currentStatus,
  fileNameErrorMessage,
  fileUrl,
  isParsing,
  isUploading,
  parsedResultData,
  sectionNameErrorMessage,
  textFileForm,
  UploadAndParseTextService,
} from './upload.and.parse.text.service';

const uploadAndParseTextService = new UploadAndParseTextService();

const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
const currentBar = ref<string>('plainText');
const fileNameInput = ref<HTMLInputElement>();
const sectionNameInput = ref<HTMLInputElement>();

const elementTabs = ref<{ value: string; label: string; isAuth: boolean }[]>([
  {
    label: '预览',
    value: 'preview',
    isAuth: false
  },
  {
    label: '文本',
    value: 'plainText',
    isAuth: true
  },
  {
    label: '关键词',
    value: 'keyword',
    isAuth: true
  },
]);

const props = defineProps({
  isUploadModalShown: {
    type: Boolean,
    required: true
  },
  domFile: {
    type: Object as PropType<File>,
    required: true
  }
});
const emit = defineEmits(['close']);

async function previewDoc(container: HTMLElement): Promise<void> {
  await renderAsync(props.domFile, container, undefined, {
    className: 'docx', // 默认和文档样式类的类名/前缀
    inWrapper: true, // 启用围绕文档内容渲染包装器
    ignoreWidth: false, // 禁止页面渲染宽度
    ignoreHeight: false, // 禁止页面渲染高度
    ignoreFonts: false, // 禁止字体渲染
    breakPages: true, // 在分页符上启用分页
    ignoreLastRenderedPageBreak: true, // 禁用lastRenderedPageBreak元素的分页
    experimental: false, // 启用实验性功能（制表符停止计算）
    trimXmlDeclaration: true, // 如果为真，xml声明将在解析之前从xml文档中删除
    debug: false, // 启用额外的日志记录
  });
}

async function handleBarChange(value: string) {
  currentBar.value = value;
  if (currentBar.value === 'preview') {
    await nextTick(async () => {
      const container = document.getElementById('last-preview-container');
      if (container) {
        await previewDoc(container);
      }
    });
  }
}

watchEffect(async () => {
  await nextTick(async () => {
    const container = document.getElementById('first-preview-container');
    if (container) {
      await previewDoc(container);
    }
  });
});

function prepareToUpload() {
  changeCurrentStatus('confirmName');
  textFileForm.value.filename = props.domFile.name;
  nextTick(() => {
    fileNameInput.value?.focus();
  });
}

async function uploadToServer(): Promise<void> {
  if (!textFileForm.value.filename) {
    fileNameErrorMessage.value = '请输入文件名';
    return;
  }
  if (textFileForm.value.filename.length > 100) {
    fileNameErrorMessage.value = '请输入少于请100个字符';
    return;
  }
  await uploadAndParseTextService.customRequestUploadHandler({
    repositoryEntityId: repositoryEntityId.value,
    file: props.domFile,
    name: textFileForm.value.filename,
    type: FileEnum.Text
  });
}

async function parseFileInServer(): Promise<void> {
  if (!fileUrl.value) return;
  await uploadAndParseTextService.parseUploadedFileText({
    fileUrl: fileUrl.value,
    repositoryEntityId: repositoryEntityId.value
  });
  await nextTick(async () => {
    const container = document.getElementById('last-preview-container');
    if (container) {
      await previewDoc(container);
    }
  });
}

// 关闭modal
function handleCloseParseWordModal(params: {
  type: 'Section' | 'void' | 'Alternative'
  sectionModel?: SectionModelType
}) {
  uploadAndParseTextService.clearData();
  emit('close', params);
}

async function confirmSectionName() {
  textFileForm.value.sectionName = textFileForm.value.filename;
  changeCurrentStatus('confirmSectionName');
}

// 创建新文档
async function createWordTextSection() {
  if (!textFileForm.value.sectionName) {
    sectionNameErrorMessage.value = '请输入文档名';
    return;
  }
  if (textFileForm.value.sectionName.length > 100) {
    sectionNameErrorMessage.value = '请输入少于请100个字符';
    return;
  }
  const result = await uploadAndParseTextService.createWordTextSection(repositoryEntityId.value);
  handleCloseParseWordModal({
    type: 'Section',
    sectionModel: result
  });
}

// 创建备选知识点
const createAlternativeKnowledgeList = async () => {
  await uploadAndParseTextService.createAlternativeKnowledgeList(repositoryEntityId.value);
  handleCloseParseWordModal({
    type: 'Alternative'
  });
};

// 删除关键词
function removeKeyword(params: { index: number }) {
  parsedResultData.value.keywords.splice(params.index, 1);
}
</script>

<style scoped lang="scss">
@import "../../../style/common.scss";

.modal-content {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  background: $contentBackgroundColor;
  position: relative;

  .preview-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 60px;
    overflow-y: auto;
    @include custom-scroll-style;
  }

  .input-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -60px;
    @include custom-input-style-mixin;

    .file-name {
      width: 80%;
      height: 80px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .filename-input-style {
      width: 100%;
      height: 42px;
      border-radius: 6px;

      &:focus {
        box-shadow: none;
      }
    }

    .error-message {
      height: 32px;
      line-height: 32px;
      width: 100%;
      color: red;
    }
  }

  .uploaded-file {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 60px;
  }

  .parsed-file {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 60px;

    .parsed-result {
      box-sizing: border-box;
      height: calc(100% - 40px);
      overflow-y: auto;
      @include custom-scroll-style;

      .parsed-content {
        padding: 20px;
      }
    }
  }

  .control {
    height: 60px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
    position: absolute;
    bottom: 0;
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
  overflow-y: auto;
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
