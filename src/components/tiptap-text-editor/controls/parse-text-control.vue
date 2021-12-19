<template>
  <div class="operation-icon" @click="handleParseWord">
    <div class="icon">
      <UploadIcon class="icon-svg"/>
    </div>
    <div class="name">
      解析
    </div>
  </div>
  <parse-word-modal
    v-if="isParseWordModalShow"
    :is-upload-modal-shown="isParseWordModalShow"
    @close="isParseWordModalShow = false"></parse-word-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UploadIcon } from '@/components/icons';
import ParseWordModal from '@/views/repository-editor/section.article/parse-word-modal.vue';

const isParseWordModalShow = ref(false);
const handleParseWord = () => {
  isParseWordModalShow.value = true;
};
</script>

<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
