<template>
  <div class="preview-tool">
    <div class="parse-container">
      <div
        v-if="mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'"
        id="first-preview-container"></div>
      <div class="image-container" v-if="mimeType.startsWith('image')">
        <img v-if="url" class="preview-image" :src="url" alt="">
        <img class="preview-image" v-if="domFile" :src="base64Image" alt="">
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, PropType, watchEffect, ref } from 'vue';
import { renderAsync } from 'docx-preview';
import axios from 'axios';
import { FileTypeUtil } from '@/utils';

const emit = defineEmits(['close']);
const props = defineProps({
  mimeType: {
    type: String
  },
  url: {
    type: String
  },
  domFile: {
    type: Object as PropType<File>
  }
});

const base64Image = ref();

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

async function generateBase64(file: File) {
  base64Image.value = await FileTypeUtil.changeFileToBase64(file);
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
  if (props.url && props.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    await uploadFileByUrl({
      url: props.url
    });
  }
  if (props.domFile && props.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const container = document.getElementById('first-preview-container');
    if (container) {
      await previewDoc(container, props.domFile);
    }
  }
  if (props.domFile && props.mimeType === 'image') {
    await generateBase64(props.domFile);
  }
});

function handleCloseParseWordModal() {
  emit('close');
}
</script>

<style scoped lang="scss">
@import "../../style/common.scss";

.preview-tool {
  height: 100%;
  width: 100%;
  position: relative;

  .parse-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow-y: auto;
    @include custom-scroll-style;
  }
  #first-preview-container {
  }
  .word-preview-container {
    width: 100%;
    height: 100%;

  }

  .image-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    background-image: linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0, #eee),
    linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0, #eee);
    background-size: 19px 19px;
    background-position: 0 0, 9px 9px;

    .preview-image {
      max-height: 100%;
      max-width: 100%;
    }
  }
}
</style>
