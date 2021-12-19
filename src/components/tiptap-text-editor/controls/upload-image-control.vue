<template>
  <div class="operation-icon" @click="handleUploadImage">
    <div class="icon">
      <ImageIcon class="icon-svg"/>
    </div>
    <div class="name">
      图片
    </div>
  </div>
  <upload-cropper-modal
    v-if="isUploadImageModalShow"
    :is-modal-visible="isUploadImageModalShow"
    :title="'添加图片'"
    @close="handleUploadImageModalClose($event)"></upload-cropper-modal>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3';
import { defineProps, PropType, ref } from 'vue';
import { ImageIcon } from '@/components/icons';
import UploadCropperModal from '@/components/upload/upload-cropper-modal.vue';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});
const isUploadImageModalShow = ref(false);
const handleUploadImage = async () => {
  isUploadImageModalShow.value = true;
};
const handleUploadImageModalClose = (event?: { url: string }) => {
  isUploadImageModalShow.value = false;
  console.log(event.url);
  if (event?.url) {
    props.editor?.chain()
      .focus()
      .setImage({ src: event.url })
      .run();
  }
};
</script>
<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
