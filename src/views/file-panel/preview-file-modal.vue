<template>
  <ant-modal
    title="文件预览"
    :wrapClassName="'full-modal'"
    :centered="true"
    :width="'80%'"
    :footer="null"
    :zIndex="7999"
    v-if="isPreviewModalShown"
    :visible="isPreviewModalShown"
    @cancel="handleCloseParseWordModal">
    <div class="modal-content">
      <div class="file-preview">
        <div class="preview-container">
          <preview-file-container
            :mime-type="fileModel.mimeType"
            :url="fileModel.url"
            :dom-file="domFile"></preview-file-container>
        </div>
        <div class="file-message">
          <file-preview-sidebar
            @delete="handleDeleteFile"
            @update="handleUpdateFile"
            :file-model="fileModel"></file-preview-sidebar>
        </div>
      </div>
    </div>
  </ant-modal>
</template>

<script lang="ts" setup>
import { createVNode, defineEmits, defineProps, PropType } from 'vue';
import { message, Modal, Modal as AntModal } from 'ant-design-vue';
import PreviewFileContainer from '@/views/file-panel/preview-file-container.vue';
import FilePreviewSidebar from '@/views/file-panel/file-panel-list/file-preview-sidebar.vue';
import { FileResponseType } from '@metagraph/constant';
import {
  removeFileById,
  updateFile
} from '@/views/file-panel/file-panel-list/file-panel-list-model';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

const emit = defineEmits(['close']);
defineProps({
  isPreviewModalShown: {
    type: Boolean,
    default: false
  },
  fileModel: {
    type: Object as PropType<FileResponseType>
  },
  domFile: {
    type: Object as PropType<File>
  }
});

async function handleUpdateFile(params: { id: string, name: string }) {
  await updateFile({
    ...params
  });
  emit('close');
}

async function handleDeleteFile(params: { id: string }) {
  Modal.confirm({
    title: '确定删除当前图片?',
    okText: '确定',
    cancelText: '取消',
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除关系操作不可恢复，请谨慎操作',
    async onOk() {
      await removeFileById(params.id);
      emit('close');
    },
    onCancel() {
      message.info('取消删除');
    }
  });
}

function handleCloseParseWordModal() {
  emit('close');
}
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
    height: calc(75vh);
  }

  .ant-modal-body {
    flex: 1;
    padding: 0;
  }
}
</style>
<style scoped lang="scss">
@import "../../style/common.scss";

.modal-content {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  background: $contentBackgroundColor;

  .file-preview {
    position: relative;
    height: 100%;
    width: 100%;

    .preview-container {
      position: absolute;
      left: 0;
      right: 400px;
      top: 0;
      bottom: 0;
      overflow-y: auto;
      @include custom-scroll-style;
    }

    .file-message {
      width: 400px;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
    }
  }


}
</style>
