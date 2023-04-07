<template>
  <div class="upload-content">
    <div
      v-if="!url"
      class="image-box"
      @click="openModal"
      @mouseenter="isShow = true"
      @mouseleave="isShow = false">
      <div :class="['public', isShow ? 'black' : 'normal']">
        <PlusOutlined :class="[isShow ? 'light-icon' : 'black-icon']"></PlusOutlined>
      </div>
    </div>
    <div
      class="image-box"
      v-else
      @mouseenter="isShow = true"
      @mouseleave="isShow = false">
      <img :src="url" alt="" :class="{'avatar-style': imageType === 'avatar'}">
      <div v-if="isShow" :class="['public', 'black']">
        <EditOutlined @click="openModal" style="margin-right: 120px" v-if="url" class="light-icon"/>
        <DeleteOutlined @click="handleRemove" v-if="url" class="light-icon"/>
      </div>
    </div>
  </div>
  <upload-cropper-modal
    v-if="isModalShow"
    :fixed="true"
    :fixed-number="[4,1]"
    :provider="provider"
    :is-modal-visible="isModalShow"
    :title="title"
    @close="handleModalClose($event)"></upload-cropper-modal>
</template>

<script lang="ts" setup>
import { FileProvider } from 'metagraph-constant';

import { defineEmits, defineProps, PropType, ref, watchEffect } from 'vue';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons-vue';
import UploadCropperModal from '@/components/upload/upload-cropper-modal.vue';

const isShow = ref(false);

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

function handleRemove() {
  url.value = '';
  emit('update:modelValue', '');
}

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
@import "../../style/common.scss";

.upload-content {

  .image-box {
    height: 220px;
    width: 880px;
    text-align: left;
    position: relative;

    .public {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      cursor: pointer;
    }

    .black {
      background: rgba(0, 0, 0, .7);
      border: 1px dashed $themeColor;
    }

    .normal {
      border: 1px dashed $themeColor;
    }

    .light-icon {
      color: #FFF;
      font-size: 24px;
    }

    .black-icon {
      color: $themeColor;
      font-size: 24px;
    }

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  .avatar-style {
    border-radius: 50%;
    display: inline-block;
    max-height: 120px;
    max-width: 120px;
  }
}

</style>
