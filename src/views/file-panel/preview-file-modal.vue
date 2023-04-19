<template>
  <ant-modal
    title="文件预览"
    :wrapClassName="'full-modal'"
    :centered="true"
    :width="'80%'"
    :footer="null"
    :zIndex="7999"
    v-if="isPreviewModalShown"
    :visible="isPreviewModalShown"
    @cancel="handleCloseParseWordModal">
    <div class="modal-content">
      <div class="parse-container" v-if="type === 'word'">
        <div class="preview-container">
          <div id="first-preview-container"></div>
        </div>
      </div>
    </div>
  </ant-modal>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, PropType, watchEffect } from 'vue';
import { Modal as AntModal } from 'ant-design-vue';
import { renderAsync } from 'docx-preview';
import axios from 'axios';

const emit = defineEmits(['close']);
const props = defineProps({
  isPreviewModalShown: {
    type: Boolean,
    default: false
  },
  type: {
    type: String
  },
  url: {
    type: String
  },
  domFile: {
    type: Object as PropType<File>
  }
});

async function previewDoc(container: HTMLElement, file: File | ArrayBuffer): Promise<void> {
  await renderAsync(file, container, undefined, {
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

async function uploadFileByUrl(params: {
  url: string;
}): Promise<void> {
  axios.post('http://localhost:7250/public/file/upload/url', {
    url: params.url
  }, {
    responseType: 'arraybuffer'
  }).then(data => {
    console.log(data);
    const container = document.getElementById('first-preview-container');
    if (container && data) {
      previewDoc(container, data.data as any);
    }
  });
}

watchEffect(async () => {
  if (props.url) {
    await uploadFileByUrl({
      url: props.url
    });
  }
  // await nextTick(async () => {
  //   if (!props.url) return;
  //   const fileAsBuffer = await FileTypeUtil.downloadFileAsArrayBuffer(props.url);
  //   console.log(fileAsBuffer, '-----file as buffer');
  //   const container = document.getElementById('first-preview-container');
  //   if (container && fileAsBuffer) {
  //     await previewDoc(container, fileAsBuffer);
  //   }
  // });

});

function handleCloseParseWordModal() {
  emit('close');
}
</script>

<style scoped lang="scss">
@import "../../style/common.scss";

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
}
</style>
