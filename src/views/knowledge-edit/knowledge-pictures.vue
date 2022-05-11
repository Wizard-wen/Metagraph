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
} from '@/views/knowledge-edit/model/knowledge.edit.type';
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

.custom-field-box {
  padding: 0 15px 15px 15px;
  background: #FFFFFF;
  max-width: 850px;
  margin: 0 auto;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .05);

  .header {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 1px solid $borderColor;

    .title {
      font-size: 18px;
    }

    .right {
      display: flex;
      gap: 10px;
    }
  }

  .content {
    padding-top: 15px;
    height: 300px;
  }
}

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
