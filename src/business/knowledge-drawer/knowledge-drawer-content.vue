<template>
  <ant-drawer
    width="640"
    placement="right"
    :closable="false"
    :visible="isVisible"
    @close="handleClose">
    <ant-spin :spinning="isLoading">
      <div v-if="draftKnowledgePreviewModel" class="preview-content">
        <knowledge-preview-component
          :preview-model="draftKnowledgePreviewModel"></knowledge-preview-component>
      </div>
      <div v-if="publishedKnowledgePreviewModel" class="preview-content">
        <knowledge-preview-component
          :preview-model="publishedKnowledgePreviewModel"></knowledge-preview-component>
      </div>
    </ant-spin>
  </ant-drawer>
</template>

<script lang="ts">
import KnowledgePreviewComponent from '@/views/knowledge-preview/knowledge-preview-component.vue';
import {
  KnowledgePreview,
  draftKnowledgePreviewModel,
  publishedKnowledgePreviewModel
} from '@/views/knowledge-preview/knowledge.preview';
import { EntityCompletelyListItemType } from 'metagraph-constant';
import {
  defineComponent, onMounted, toRef, ref, PropType
} from 'vue';
import { Drawer, Spin } from 'ant-design-vue';

export default defineComponent({
  name: 'knowledge-drawer-content',
  emits: ['close'],
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    knowledgeEntityId: {
      type: String,
      required: true
    },
    type: {
      type: String as PropType<'draft' | 'published'>,
      required: true
    }
  },
  components: {
    AntSpin: Spin,
    AntDrawer: Drawer,
    KnowledgePreviewComponent
  },
  setup(props, { emit }) {
    const type = toRef(props, 'type');
    const knowledgeEntityId = toRef(props, 'knowledgeEntityId');
    const knowledgeModel = ref<EntityCompletelyListItemType>();

    const isLoading = ref(false);
    const handleClose = () => {
      emit('close');
    };
    const knowledgePreview = new KnowledgePreview();
    onMounted(async () => {
      isLoading.value = true;
      if (type.value === 'draft') {
        await knowledgePreview.initDraftKnowledge(knowledgeEntityId.value);
      }
      if (type.value === 'published') {
        await knowledgePreview.initPublishedKnowledge(knowledgeEntityId.value);
      }
      isLoading.value = false;
    });
    return {
      handleClose,
      knowledgeModel,
      isLoading,
      draftKnowledgePreviewModel,
      publishedKnowledgePreviewModel
    };
  },
});
</script>

<style scoped lang="scss">
.h1-level-title-style {
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: bolder;
}

.h2-level-title-style {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
  display: block;
  margin-bottom: 16px;
}
</style>
