<template>
  <div class="custom-field-box">
    <div class="header">
      <div class="title">概念图册</div>
      <div class="right"></div>
    </div>
    <div class="content">
      <qiniu-upload-image-list
        :modelValue="knowledgePictures.target"
        @update:modelValue="handlePicturesChange($event)"></qiniu-upload-image-list>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import QiniuUploadImageList from '@/components/upload/qiniu-upload-image-list.vue';
import { KnowledgeEdit, knowledgePictures, knowledgeEntityIdInjectKey } from './model/knowledge.edit';

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  percent?: number;
  url?: string;
  preview?: string;
  originFileObj?: any;
}

export default defineComponent({
  name: 'knowledge-pictures',
  components: {
    QiniuUploadImageList
  },
  setup() {
    const knowledgeEdit = new KnowledgeEdit();
    const knowledgeEntityId = inject(knowledgeEntityIdInjectKey, ref(''));

    async function handlePicturesChange(events: any[]) {
      knowledgePictures.target = events;
      await knowledgeEdit.updateKnowledge(knowledgeEntityId.value, {
        pictures: events
      });
    }

    return {
      knowledgePictures,
      handlePicturesChange
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
      font-size: 20px;
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
