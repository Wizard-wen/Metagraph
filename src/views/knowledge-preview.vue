<template>
  <ant-spin :spinning="isLoading">
    <knowledge-preview-header
      v-if="draftKnowledgePreviewModel"
      :type="'draft'"
      :mention-list="draftKnowledgePreviewModel.mentionList"
      :knowledge-model="draftKnowledgePreviewModel.entity"></knowledge-preview-header>
    <knowledge-preview-header
      v-if="publishedKnowledgePreviewModel"
      :type="'published'"
      :mention-list="publishedKnowledgePreviewModel.mentionList"
      :knowledge-model="publishedKnowledgePreviewModel.entity"></knowledge-preview-header>
    <div v-if="draftKnowledgePreviewModel" class="preview-content">
      <knowledge-preview-component
        :provider="'page'"
        :preview-model="draftKnowledgePreviewModel"></knowledge-preview-component>
    </div>
    <div v-if="publishedKnowledgePreviewModel" class="preview-content">
      <knowledge-preview-component
        :provider="'page'"
        :preview-model="publishedKnowledgePreviewModel"></knowledge-preview-component>
    </div>
  </ant-spin>

</template>

<script lang="ts">
import {
  KnowledgePreview,
  draftKnowledgePreviewModel,
  publishedKnowledgePreviewModel
} from '@/views/knowledge-preview/knowledge.preview';
import KnowledgePreviewComponent from '@/views/knowledge-preview/knowledge-preview-component.vue';
import KnowledgePreviewHeader from '@/views/knowledge-preview/knowledge-preview-header.vue';
import {
  defineComponent, onMounted, ref
} from 'vue';
import { LocationQueryValue, useRoute } from 'vue-router';
import { Spin } from 'ant-design-vue';

export default defineComponent({
  name: 'knowledge-publish-preview',
  components: {
    KnowledgePreviewComponent,
    KnowledgePreviewHeader,
    AntSpin: Spin
  },
  setup() {
    const route = useRoute();
    const isLoading = ref(false);
    const draftKnowledgeEntityId = ref(route.query.draftKnowledgeEntityId as LocationQueryValue);
    const publishedKnowledgeEntityId = ref(route.query.publishedKnowledgeEntityId as LocationQueryValue);
    const knowledgePreview = new KnowledgePreview();
    onMounted(async () => {
      isLoading.value = true;
      if (draftKnowledgeEntityId.value) {
        await knowledgePreview.initDraftKnowledge(draftKnowledgeEntityId.value);
      }
      if (publishedKnowledgeEntityId.value) {
        await knowledgePreview.initPublishedKnowledge(publishedKnowledgeEntityId.value);
      }
      isLoading.value = false;
    });
    return {
      draftKnowledgePreviewModel,
      publishedKnowledgePreviewModel,
      isLoading
    };
  }
});
</script>

<style scoped lang="scss">

.preview-content {
  text-align: left;
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #e5e5e5;
  background: #fafbfc;

}

.h1-level-title-style {
  height: 50px;
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: bolder;
  border-bottom: rgba(0, 0, 0, 0.06);
}

.h2-level-title-style {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.85);
  height: 65px;
  line-height: 65px;
  display: block;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.image-style {
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.custom-tiptap-readonly {
  &::v-deep(.ProseMirror) {
    padding: 0px;
  }
}
</style>
