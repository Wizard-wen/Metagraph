<template>
  <div class="upload-content">
    <ant-button class="upload-button" @click="openModal">
      <upload-outlined></upload-outlined>
      选择文件
    </ant-button>
    <div class="image-box" v-if="url">
      <img :src="url" alt="">
    </div>
  </div>
  <upload-cropper-modal
    v-if="isModalShow"
    :is-modal-visible="isModalShow"
    :title="'上传仓库封面'"
    @close="handleModalClose($event)"></upload-cropper-modal>

</template>

<script lang="ts">
import { defineComponent, ref, toRef } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import UploadCropperModal from '@/components/upload/upload-cropper-modal.vue';

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  preview?: string;
  originFileObj?: any;
  file: string | Blob;
}

export default defineComponent({
  name: 'upload-form-item',
  components: {
    UploadOutlined,
    UploadCropperModal
  },
  props: {
    modelValue: {
      type: String,
      required: true
    },
    // 为了上层能够响应ant design form 需要在props中声明 value id
    value: String,
    id: String
  },
  // 为了上层能够响应ant design form 的表单验证 blur change，需要在emit中声明
  emits: ['update:modelValue', 'blur', 'change'],
  setup(props, { emit }) {
    const isModalShow = ref(false);
    const url = toRef(props, 'modelValue');
    const handleModalClose = (event?: { url: string }) => {
      isModalShow.value = false;
      if (event?.url) {
        url.value = event.url;
        emit('update:modelValue', event.url);
      }
    };
    const openModal = () => {
      isModalShow.value = true;
    };

    return {
      handleModalClose,
      openModal,
      isModalShow,
      url
    };
  },
});
</script>

<style scoped lang="scss">
.upload-content {
  .upload-button {
    display: block;
  }

  .image-box {
    width: 100%;
    padding-top: 20px;
    text-align: left;

    img {
      display: inline-block;
      max-height: 300px;
    }
  }
}

</style>