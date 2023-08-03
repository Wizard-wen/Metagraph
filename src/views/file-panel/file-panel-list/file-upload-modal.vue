<template>
  <ant-modal
    :width="800"
    wrapClassName="cropper-modal"
    :title="title"
    :maskClosable="false"
    :footer="null"
    :visible="isModalVisible"
    :zIndex="9999"
    @cancel="handleModalCancel">
    <vueCropper
      v-if="uploadComponentType === 'image'"
      style="height: 400px"
      ref="cropperRef"
      :img="cropUrl"
      :can-scale="cropOption.canScale"
      :outputSize="cropOption.outputSize"
      :outputType="cropOption.outputType"
      :info="true"
      :full="cropOption.full"
      :canMove="cropOption.canMove"
      :canMoveBox="cropOption.canMoveBox"
      :fixed-number="cropOption.fixedNumber"
      :fixedBox="cropOption.fixedBox"
      :fixed="cropOption.fixed"
      :original="cropOption.original"
      :autoCrop="cropOption.autoCrop"
      :autoCropWidth="cropOption.autoCropWidth"
      :autoCropHeight="cropOption.autoCropHeight"
      :centerBox="cropOption.centerBox"
      :high="cropOption.high"
      :infoTrue="cropOption.infoTrue"
      :maxImgSize="cropOption.maxImgSize"
      @realTime="handleRealTime"
      @imgLoad="handleImgLoad"
      @cropMoving="handleCropMoving"
      :enlarge="cropOption.enlarge"
      :mode="cropOption.mode"
      :limitMinSize="cropOption.limitMinSize"
    ></vueCropper>
    <img v-if="uploadComponentType === 'gif'" :src="gifBase64" alt="">
    <template v-if="uploadComponentType === 'word'">
      <div id="doc-container"></div>
    </template>
    <div class="control-box">
      <ant-button
        class="button-style"
        type="primary"
        :loading="isLoading" @click="handleUpload">上传
      </ant-button>
    </div>
  </ant-modal>
</template>

<script lang="ts" setup>
import { QiniuUploadService } from '@/service/qiniu.upload.service';
import { Button as AntButton, message, Modal as AntModal } from 'ant-design-vue';
import { computed, defineEmits, defineProps, nextTick, PropType, ref, watchEffect } from 'vue';
import 'vue-cropper/dist/index.css';
import { VueCropper } from 'vue-cropper';
import { FileEnum, FileProvider } from '@metagraph/constant';
import { renderAsync } from 'docx-preview';

const props = defineProps({
  isModalVisible: {
    type: Boolean,
    required: true
  },
  domFile: {
    type: Object as PropType<File>
  },
  title: {
    type: String,
    default: '上传图片'
  },
  provider: {
    type: String as PropType<FileProvider>,
    required: true
  },
  fixedNumber: {
    type: Array as PropType<number[]>,
    default: () => [1, 1]
  },
  fixedBox: {
    type: Boolean,
    default: false
  },
  fixed: {
    require: true,
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['close']);
const isLoading = ref(false);
// gif型图片
const isGif = ref(false);
const gifBase64 = ref<string>();
// 上传组件大分类
const uploadComponentType = ref<'image' | 'gif' | 'word'>();
// 裁切图片组件
const cropperRef = ref<any>();
// 裁剪图片的地址
const cropUrl = ref('');
// 裁切组件配置
const cropOption = computed(() => {
  let fixedNumber = [1, 1];
  if (props.fixed) {
    fixedNumber = props.fixedNumber ?? [1, 1];
  }
  return {
    canScale: false,
    outputSize: 1,
    // 是否输出原图比例的截图
    full: false,
    // 裁剪生成图片的格式
    outputType: 'png',
    // 上传图片是否可以移动
    canMove: true,
    // 截图框能否拖动
    canMoveBox: true,
    // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
    infoTrue: true,
    // 上传图片按照原始比例渲染
    original: false,
    // 是否默认生成截图框
    autoCrop: true,
    // 只有自动截图开启 宽度高度才生效
    // 默认生成截图框宽度
    autoCropWidth: 200,
    // 默认生成截图框高度
    autoCropHeight: 200,
    // 截图框是否被限制在图片里面
    centerBox: false,
    // 是否按照设备的dpr 输出等比例图片
    high: false,
    cropData: {},
    // 图片根据截图框输出比例倍数
    enlarge: 1,
    // 图片默认渲染方式
    mode: 'contain',
    // 限制图片最大宽度和高度
    maxImgSize: 3000,
    // 是否开启截图框宽高固定比例
    fixed: props.fixed,
    // 截图框的宽高比例
    fixedNumber,
    // 固定截图框大小
    fixedBox: props.fixedBox,
    limitMinSize: [100, 120]
  };
});

function changeFileToBlob(file: File) {
  const reader = new FileReader();
  reader.onload = () => {
    let data;
    if (typeof reader.result === 'object') {
      console.log(reader.result);
      // 把Array Buffer转化为blob 如果是base64不需要
      data = window.URL.createObjectURL(new Blob([reader.result!]));
    } else {
      data = reader.result;
    }
    console.log(data);
    if (uploadComponentType.value !== 'gif') {
      cropUrl.value = data;
    } else {
      gifBase64.value = data;
    }
  };
  // 转化为blob
  reader.readAsArrayBuffer(file);
}

function changeFileToBase64(file: File): Promise<string | undefined> {
  const reader = new FileReader();
  // 转化为base64
  reader.readAsDataURL(file);
  return new Promise((resolve) => {
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        resolve(undefined)
      }
    };
  });
}

watchEffect(async () => {
  if (!props.domFile) return;
  const { type } = props.domFile;
  // 图片类型
  if (type.startsWith('image')) {
    uploadComponentType.value = FileEnum.Image;
    // 判断图片是否属于可接受图片
    if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(props.domFile?.name)) {
      return;
    }
    // 如果是gif则不可以裁切，直接上传
    if (/\.(gif|GIF)$/.test(props.domFile?.name) && type.split('/')[1] === 'git') {
      isGif.value = true;
      uploadComponentType.value = 'gif';
    }
    // 转换文件
    changeFileToBlob(props.domFile);
  }
  // 文件类型
  if (type.startsWith('application')) {
    uploadComponentType.value = 'word';
    await nextTick(async () => {
      const docContainer = document.getElementById('doc-container');
      if (docContainer) {
        const result = await renderAsync(props.domFile, docContainer, undefined, {
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
    });
  }
});

function handleModalCancel() {
  emit('close');
}

// 实时预览事件
function handleRealTime(data: { w: number, h: number }) {
  // console.log(data);
}

// 图片加载的回调, 返回结果 success, error
function handleImgLoad(value: string) {
  // console.log(value);
}

// 截图框移动回调函数
function handleCropMoving(params: {
  moving: boolean, // moving 是否在移动
  axis: {
    x1: number, // 左上角
    x2: number, // 右上角
    y1: number, // 左下角
    y2: number // 右下角
  }
}) {
  // console.log(params);
}

/**
 * 针对裁切的图片，裁切后会生成base64
 * @param data
 */
async function uploadBase64ToQiniu(data: string) {
  isLoading.value = true;
  const qiniuUploadService = new QiniuUploadService();
  const result = await qiniuUploadService.customRequestUploadHandler({
    base64: data,
    type: FileEnum.Image,
    name: props.domFile?.name || '',
    provider: props.provider
  });
  if (result) {
    emit('close', {
      ...result
    });
  } else {
    message.error('上传失败');
  }
  isLoading.value = false;
}

/**
 * 直接上传dom File类型文件
 */
async function uploadFileToQiniu() {
  isLoading.value = true;
  const qiniuUploadService = new QiniuUploadService();
  const result = await qiniuUploadService.customRequestUploadHandler({
    file: props.domFile,
    type: FileEnum.Image,
    name: props.domFile?.name || '',
    provider: props.provider
  });
  if (result) {
    emit('close', {
      ...result
    });
  } else {
    message.error('上传失败');
  }
  isLoading.value = false;
}

async function handleUpload() {
  if (isGif.value && gifBase64.value) {
    await uploadFileToQiniu();
  } else {
    cropperRef.value.getCropData(async (data: string) => {
      await uploadBase64ToQiniu(data);
    });
  }
}

</script>

<style scoped lang="scss">
.control-box {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}

.button-style {
  margin-right: 10px;
}

.select-image {
  position: relative;

  .upload-input {
    opacity: 0;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
