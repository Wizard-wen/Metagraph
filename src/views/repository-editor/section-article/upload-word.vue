<template>
  <ant-modal
    title="文本解析"
    width="%"
    :wrapClassName="'full-modal'"
    :footer="null"
    :zIndex="7999"
    :centered="true"
    v-if="isUploadModalShown"
    :visible="isUploadModalShown"
    @cancel="handleCloseParseWordModal({
      type: 'void'
    })">
    <div class="modal-content">
      <m-button
        :title="'选择word文本'"
        v-if="!currentWordFile"
        class="upload-button"
        @click="clickCurrentUploadingValue($event)">
        <template #icon>
          <upload-outlined></upload-outlined>
        </template>
      </m-button>
      <input
        ref="inputElement"
        style="display: none"
        type="file"
        @change="handleFileChange($event)">
      <div v-show="currentWordFile">
        <div class="preview-container">
          <div id="container"></div>
        </div>
        <div class="operation">
          <div class="operation-list">
            <m-button @click="clearCurrentUploadingValue" :title="'重新选择'"></m-button>
            <m-button :title="'确认上传'"></m-button>
          </div>
        </div>
      </div>

    </div>
    <div v-if="status === 'uploading'">

    </div>
    <div v-if="status === 'done'">

    </div>
  </ant-modal>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref } from 'vue';
import { Modal as AntModal } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { SectionModelType } from '@metagraph/constant';
import { renderAsync } from 'docx-preview';
import { MButton } from '@/metagraph-ui';

defineProps({
  isUploadModalShown: {
    type: Boolean,
    required: true
  }
});
const emit = defineEmits(['close']);

const status = ref();
const inputElement = ref();

const currentWordFile = ref<File | undefined>();
const fileNameInput = ref<HTMLInputElement>();

// 清除 input file
const clickCurrentUploadingValue = (event: InputEvent) => {
  if (inputElement.value) {
    inputElement.value.click();
    event.preventDefault();
  }
};

// 响应选择word文本
const handleFileChange = async (event: InputEvent) => {
  const target = event.target as HTMLInputElement;
  if (target.files === null) {
    return;
  }
  // eslint-disable-next-line prefer-destructuring
  currentWordFile.value = target.files[0];
  // fileNameInput.value?.focus();

  const result = await renderAsync(currentWordFile.value, document.getElementById('container')!, undefined, {
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
  console.log(result);
};

function clearCurrentUploadingValue() {
  currentWordFile.value = undefined;
}

// 关闭modal
function handleCloseParseWordModal(params: {
  type: 'Section' | 'void' | 'Alternative'
  sectionModel?: SectionModelType
}) {
  emit('close', params);
}
</script>
<style lang="scss">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }

  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }

  .ant-modal-body {
    flex: 1;
    padding: 0;
  }
}
</style>
<style scoped lang="scss">
@import "../../../style/common.scss";

.modal-content {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  background: $contentBackgroundColor;
  position: relative;
}

.upload-button {
  width: 200px;
  position: absolute;
  left: calc(50% - 100px);
  top: calc(50% - 16px);
}

.preview-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 65px;
  overflow-y: auto;
  @include custom-scroll-style;
}

.operation {
  height: 65px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .operation-list {
    padding-right: 50px;
    display: flex;
    gap: 10px;
  }
}
</style>
