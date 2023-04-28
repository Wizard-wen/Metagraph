<template>
  <div class="custom-field-box">
    <div class="header">
      <div class="title">概念图册</div>
      <div class="right">
        <m-button :title="'添加'" @click="handleSelectFile"></m-button>
      </div>
    </div>
    <div class="content">
      <!--      <qiniu-upload-image-list-->
      <!--        @remove="handleRemovePicture($event)"-->
      <!--        :modelValue="knowledgePictures"-->
      <!--        @update:modelValue="handlePicturesChange($event)"></qiniu-upload-image-list>-->
      <knowledge-picture-preview-list
        :knowledge-pictures="knowledgePictures"></knowledge-picture-preview-list>
    </div>
    <select-file-modal
      :type="fileType"
      @close="handleCloseSelectFileModal($event)"
      :is-modal-visible="isSelectFileModalVisible"></select-file-modal>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue';
import type {
  KnowledgePicturesFrontendType
} from '@/views/knowledge-editor/model/knowledge.edit.type';
import SelectFileModal from '@/views/file-panel/select-file-modal.vue';
import { MButton } from '@/metagraph-ui';
import { FileEnum, FileResponseType } from '@metagraph/constant';
import KnowledgePicturePreviewList
  from '@/views/knowledge-editor/knowledge-editor-middle/knowledge-pictures/knowledge-picture-preview-list.vue';
import {
  draftKnowledgeEntityIdInjectKey,
  KnowledgeEdit,
  knowledgePictures
} from '../model/knowledge.edit';

const knowledgeEdit = new KnowledgeEdit();
const knowledgeEntityId = inject(draftKnowledgeEntityIdInjectKey, ref(''));
const isSelectFileModalVisible = ref(false);
const fileType = ref(FileEnum.Image);
function handleSelectFile() {
  isSelectFileModalVisible.value = true;
}

async function handleCloseSelectFileModal(params?: FileResponseType) {
  console.log(params?.id);
  isSelectFileModalVisible.value = false;
  if (params) {
    knowledgePictures.value.push({
      fileId: params.id,
      url: params.name,
      name: params.url
    });
    await knowledgeEdit.updateDraftKnowledge(knowledgeEntityId.value, {
      pictures: knowledgePictures.value
    });
    await knowledgeEdit.getKnowledge(knowledgeEntityId.value);
  }
}

async function handlePicturesChange(events: KnowledgePicturesFrontendType[]) {
  knowledgePictures.value = events;
  await knowledgeEdit.updateDraftKnowledge(knowledgeEntityId.value, {
    pictures: events
  });
  await knowledgeEdit.getKnowledge(knowledgeEntityId.value);
}

async function handleRemovePicture(item: KnowledgePicturesFrontendType) {
  await knowledgeEdit.removeKnowledgePicture({
    knowledgeEntityId: knowledgeEntityId.value,
    fileId: item.fileId
  });
  await knowledgeEdit.getKnowledge(knowledgeEntityId.value);
}

</script>

<style scoped lang="scss">
@import '../../../style/common.scss';
@import "../style/knowledge.edit.scss";

/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.ant-upload-list-item-info {
  &:before {
    display: block;
  }
}

</style>
