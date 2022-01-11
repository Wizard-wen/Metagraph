<template>
  <ant-modal
    :width="800"
    wrapClassName="cropper-modal"
    :title="title"
    :maskClosable="false"
    :footer="null"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="9999"
    @cancel="handleModalCancel">
    <vueCropper
      style="height: 400px"
      ref="cropperRef"
      :img="cropOption.img"
      :can-scale="cropOption.canScale"
      :outputSize="cropOption.outputSize"
      :outputType="cropOption.outputType"
      :info="true"
      :full="cropOption.full"
      :canMove="cropOption.canMove"
      :canMoveBox="cropOption.canMoveBox"
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
    <div class="control-box">
      <ant-button
        type="primary"
        class="select-image button-style">
        选择图片
        <input
          type="file" class="upload-input"
          accept="image/png, image/jpeg, image/gif, image/jpg"
          @change="handleUploadImg($event)" ref="inputRef">
      </ant-button>
      <ant-button
        class="button-style"
        type="primary"
        :loading="isLoading" @click="handleUpload">上传图片
      </ant-button>
      <ant-button class="button-style" @click="handleModalCancel">关闭</ant-button>
    </div>
  </ant-modal>
</template>

<script lang="ts">
import { QiniuUploadService } from '@/service/qiniu.upload.service';
import { message } from 'ant-design-vue';
import {
  defineComponent, reactive, ref, PropType
} from 'vue';
import 'vue-cropper/dist/index.css';
import { VueCropper } from 'vue-cropper';
import { FileEnum } from 'metagraph-constant';

export default defineComponent({
  name: 'upload-cropper-modal',
  components: {
    VueCropper
  },
  props: {
    isModalVisible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: '上传图片'
    },
    fixedNumber: {
      type: Array as PropType<number[]>,
      default: [1, 1]
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const modalConfirmLoading = ref(false);
    const isLoading = ref(false);
    const cropOption = reactive({
      // 裁剪图片的地址
      img: '',
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
      fixed: true,
      // 截图框的宽高比例
      fixedNumber: [1, 1],
      // 固定截图框大小
      fixedBox: false,
      limitMinSize: [100, 120]
    });

    const handleModalOk = () => {
      emit('close');
    };
    const handleModalCancel = () => {
      emit('close');
    };
    // 实时预览事件
    const handleRealTime = (data: { w: number, h: number }) => {
      // console.log(data);
    };
    // 图片加载的回调, 返回结果 success, error
    const handleImgLoad = (value: string) => {
      // console.log(value);
    };
    // 截图框移动回调函数
    const handleCropMoving = (params: {
      moving: boolean, // moving 是否在移动
      axis: {
        x1: number, // 左上角
        x2: number, // 右上角
        y1: number, // 左下角
        y2: number // 右下角
      }
    }) => {
      // console.log(params);
    };
    const inputRef = ref<HTMLInputElement>();
    const cropperRef = ref<any>();

    function handleUploadImg(e: Event) {
      const target = e.target as HTMLInputElement;
      // 上传图片
      if (!target.files) {
        return;
      }
      const file = target.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(target.value)) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        let data;
        if (typeof reader.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([reader.result!]));
        } else {
          data = reader.result;
        }
        cropOption.img = data;
        if (inputRef.value) {
          inputRef.value.value = '';
        }
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file);
    }

    async function handleUpload() {
      cropperRef.value.getCropData(async (data: string) => {
        const qiniuUploadService = new QiniuUploadService();
        isLoading.value = true;
        const result = await qiniuUploadService.customRequestUploadHandler({
          base64: data,
          type: FileEnum.Image,
          name: ''
        });
        if (result) {
          emit('close', {
            ...result
          });
        } else {
          message.error('上传失败');
        }
        isLoading.value = false;
      });
    }

    return {
      modalConfirmLoading,
      cropOption,
      handleModalOk,
      handleModalCancel,
      handleRealTime,
      handleImgLoad,
      handleCropMoving,
      inputRef,
      handleUploadImg,
      handleUpload,
      cropperRef,
      isLoading
    };
  }
});
</script>

<style scoped lang="scss">
.control-box {
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
