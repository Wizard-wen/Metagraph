<template>
  <ant-modal
    width="100%"
    :wrapClassName="'full-modal'"
    title="选择图片"
    :maskClosable="false"
    :footer="null"
    :centered="true"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="7999"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <will-select-file-list @select="handleSelectFile($event)"></will-select-file-list>
  </ant-modal>
</template>

<script lang="ts" setup>
// 选择图片弹窗，可以选择图片，没有合适的再上传
import { defineEmits, defineProps, ref } from 'vue';
import { Modal as AntModal } from 'ant-design-vue';
import WillSelectFileList from '@/views/file-panel/select-file-modal/will-select-file-list.vue';

defineProps({
  isModalVisible: {
    type: Boolean,
    required: true
  }
});
const emit = defineEmits(['close']);
const modalConfirmLoading = ref(false);

function handleSelectFile(params: {
  id: string
}) {
  emit('close', params);
}

const handleModalOk = () => {
  emit('close');
};
const handleModalCancel = () => {
  emit('close');
};
</script>
<style lang="scss">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }

  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }

  .ant-modal-body {
    flex: 1;
    padding: 0;
  }
}
</style>
<style scoped lang="scss">

</style>
