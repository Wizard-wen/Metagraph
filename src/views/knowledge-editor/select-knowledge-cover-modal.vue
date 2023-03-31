<template>
  <ant-modal
    :width="800"
    title="选择封面图片"
    okText="确定"
    cancelText="取消"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="9999"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <div class="selected-container">
      <div class="normal-image">
        <img
          v-if="selectedUrl"
          class="image-style"
          alt="暂无封面"
          :src="selectedUrl"/>
        <div v-else class="no-image">暂无封面</div>
        <div style="text-align: center">当前封面</div>
      </div>
      <ant-button type="primary" @click="clearCover">清除</ant-button>
    </div>

    <div class="image-container">
      <div
        @click="handleSelect(item)"
        class="normal-image"
        :class="{'selected-image': item.fileKey === selectedImageKey}"
        v-for="item in knowledgePictures"
        :key="item.fileKey">
        <img class="image-style" :src="item.url" alt="">
      </div>
    </div>
  </ant-modal>
</template>

<script lang="ts">
import { Modal, Button } from 'ant-design-vue';
import {
  defineComponent, toRef, ref, computed
} from 'vue';
import { KnowledgeEdit, knowledgePictures } from './model/knowledge.edit';

export default defineComponent({
  name: 'select-knowledge-cover-modal',
  props: {
    isModalVisible: {
      type: Boolean,
      required: true
    },
    knowledgeEntityId: {
      type: String,
      required: true
    },
  },
  components: {
    AntModal: Modal,
    AntButton: Button
  },
  emits: ['close'],
  setup(props, { emit }) {
    const knowledgeEntityId = toRef(props, 'knowledgeEntityId');
    const selectedImageKey = ref();
    const modalConfirmLoading = ref();
    selectedImageKey.value = knowledgePictures.value.find((item) => item.isCover)?.fileKey;
    const selectedUrl = computed(() => knowledgePictures.value.find((item) => item.fileKey === selectedImageKey.value)?.url);

    function handleModalCancel() {
      emit('close');
    }

    const knowledgeEdit = new KnowledgeEdit();

    async function handleModalOk() {
      modalConfirmLoading.value = true;
      knowledgePictures.value.forEach((item) => {
        item.isCover = item.fileKey === selectedImageKey.value;
      });
      await knowledgeEdit.updateDraftKnowledge(knowledgeEntityId.value, {
        pictures: knowledgePictures.value
      });
      await knowledgeEdit.getKnowledge(knowledgeEntityId.value);
      modalConfirmLoading.value = false;
      emit('close', {
        coverKey: selectedImageKey.value
      });
    }

    function handleSelect(item: {
      isCover?: boolean;
      fileKey: string;
      url: string;
      name?: string;
      size?: number;
    }) {
      selectedImageKey.value = item.fileKey;
    }

    function clearCover() {
      selectedImageKey.value = undefined;
    }

    return {
      handleModalCancel,
      handleModalOk,
      modalConfirmLoading,
      selectedImageKey,
      handleSelect,
      selectedUrl,
      clearCover,
      knowledgePictures
    };
  }
});
</script>

<style scoped lang="scss">
.selected-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.image-container {
  width: 100%;
  height: 500px;
  overflow-y: auto;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.normal-image {
  padding: 5px;
  width: max-content;
  height: max-content;
  min-height: 120px;
  min-width: 120px;
  box-sizing: border-box;
  border: 1px dashed transparent;
  cursor: pointer;
}

.selected-image {
  border: 1px dashed #1890ff;
  border-radius: 4px;
}

.no-image {
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
  border: 1px dashed #ececec;
  border-radius: 4px;
  background: #fafafa;
}

.image-style {
  width: 120px;
  height: 120px;
  object-fit: cover;
}
</style>
