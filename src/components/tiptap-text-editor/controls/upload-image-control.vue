<template>
  <div class="operation-icon" @click="handleUploadImage">
    <operation-tooltip :desc="'上传图片'">
      <div class="icon">
        <ImageIcon class="icon-svg"/>
      </div>
    </operation-tooltip>
  </div>
  <input
    @change="handleFileChange"
    ref="inputElement"
    type="file"
    name="upload"
    id="upload"
    style="display: none;"/>
  <upload-cropper-modal
    v-if="isUploadImageModalShow"
    :provider="'RepositoryPictures'"
    :dom-file="currentFile"
    :is-modal-visible="isUploadImageModalShow"
    :title="'添加图片'"
    @close="handleUploadImageModalClose($event)"></upload-cropper-modal>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3';
import { defineProps, PropType, ref } from 'vue';
import { message } from 'ant-design-vue';
import { ImageIcon } from '@/components/icons';
import UploadCropperModal from '@/components/upload/upload-cropper-modal.vue';
import OperationTooltip from '@/components/tiptap-text-editor/controls/operation-tooltip.vue';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});
const currentFile = ref<File>();
const isUploadImageModalShow = ref(false);
const handleUploadImage = async () => {
  isUploadImageModalShow.value = true;
};

const handleFileChange = async (event: InputEvent) => {
  const target = event.target as HTMLInputElement;
  if (!target.files) {
    return;
  }
  currentFile.value = target.files[0];
  console.log(currentFile.value);
  if (currentFile.value?.type.split('/')[0] !== 'image') {
    message.error('请选择图片类型文件');
  }
  isUploadImageModalShow.value = true;
};

const handleUploadImageModalClose = (event?: { url: string }) => {
  isUploadImageModalShow.value = false;
  if (event) {
    props.editor.chain()
      .focus()
      .setImage({ src: event.url })
      .run();
  }
};


</script>
<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
