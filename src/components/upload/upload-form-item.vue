<template>
  <div class="upload-content">
    <m-button :title="'选择文件'" class="upload-button" @click="openModal">
      <template #icon>
        <upload-outlined></upload-outlined>
      </template>
    </m-button>
    <div class="image-box" v-if="url">
      <img :src="url" alt="" :class="{'avatar-style': imageType === 'avatar'}">
    </div>
  </div>
  <upload-cropper-modal
    v-if="isModalShow"
    :fixed="false"
    :provider="provider"
    :is-modal-visible="isModalShow"
    :title="title"
    @close="handleModalClose($event)"></upload-cropper-modal>
</template>

<script lang="ts" setup>
import { FileProvider } from 'metagraph-constant';
import { MButton } from '@/metagraph-ui';

import { defineEmits, defineProps, PropType, ref, watchEffect } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import UploadCropperModal from '@/components/upload/upload-cropper-modal.vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  provider: {
    type: String as PropType<FileProvider>,
    required: true
  },
  imageType: {
    type: String as PropType<'avatar' | 'image' | 'cover' | 'thumb'>,
    default: 'image'
  },
  modelValue: {
    type: String,
    required: true
  },
  // 为了上层能够响应ant design form 需要在props中声明 value id
  value: String,
  id: String
});
const emit = defineEmits(['update:modelValue', 'blur', 'change']);
const isModalShow = ref(false);
const url = ref('');

watchEffect(() => {
  url.value = props.modelValue;
});
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

  .avatar-style {
    border-radius: 50%;
    display: inline-block;
    max-height: 150px;
    max-width: 150px;
  }
}

</style>
