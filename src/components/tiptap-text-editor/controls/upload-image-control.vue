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
    :provider="'RepositoryPictures'"
    :is-modal-visible="isUploadImageModalShow"
    :title="'添加图片'"
    @close="handleUploadImageModalClose($event)"></upload-cropper-modal>
</template>

<script lang="ts">
import { Editor } from '@tiptap/vue-3';
import {
  PropType, ref, defineComponent, toRef
} from 'vue';
import { ImageIcon } from '@/components/icons';
import UploadCropperModal from '@/components/upload/upload-cropper-modal.vue';

export default defineComponent({
  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true
    }
  },
  components: {
    UploadCropperModal,
    ImageIcon
  },
  setup(props) {
    const editor = toRef(props, 'editor');
    const isUploadImageModalShow = ref(false);
    const handleUploadImage = async () => {
      isUploadImageModalShow.value = true;
    };
    const handleUploadImageModalClose = (event?: { url: string }) => {
      isUploadImageModalShow.value = false;
      if (event) {
        editor.value?.chain()
          .focus()
          .setImage({ src: event.url })
          .run();
      }
    };

    return {
      isUploadImageModalShow,
      handleUploadImage,
      handleUploadImageModalClose
    };
  }
});

</script>
<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
