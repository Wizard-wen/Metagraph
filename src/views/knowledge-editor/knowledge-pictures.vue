<template>
  <div class="custom-field-box">
    <div class="header">
      <div class="title">概念图册</div>
      <div class="right"></div>
    </div>
    <div class="content">
      <qiniu-upload-image-list
        @remove="handleRemovePicture($event)"
        :modelValue="knowledgePictures"
        @update:modelValue="handlePicturesChange($event)"></qiniu-upload-image-list>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import QiniuUploadImageList from '@/components/upload/qiniu-upload-image-list.vue';
import type {
  KnowledgePicturesFrontendType
} from '@/views/knowledge-editor/model/knowledge.edit.type';
import { KnowledgeEdit, knowledgePictures, draftKnowledgeEntityIdInjectKey } from './model/knowledge.edit';

export default defineComponent({
  name: 'knowledge-pictures',
  components: {
    QiniuUploadImageList
  },
  setup() {
    const knowledgeEdit = new KnowledgeEdit();
    const knowledgeEntityId = inject(draftKnowledgeEntityIdInjectKey, ref(''));

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
        fileKey: item.fileKey
      });
      await knowledgeEdit.getKnowledge(knowledgeEntityId.value);
    }

    return {
      knowledgePictures,
      handlePicturesChange,
      handleRemovePicture
    };
  },
});
</script>

<style scoped lang="scss">
@import '../../style/common.scss';
@import "./style/knowledge.edit.scss";

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
