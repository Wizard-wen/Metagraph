<template>
  <ant-modal
    :width="1000"
    title="线上&草稿版本对比"
    okText="确定"
    cancelText="取消"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="9999"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <ant-spin :spinning="isLoading">
      <div style="display: block">
        <div style="display: flex; gap: 10px" v-if="compareData">
          <knowledge-compare-preview-content
            style="width: 50%"
            :type="'draft'"
            :edit="compareData?.edit"
            :compare="compareData?.add"
            :knowledge="compareData?.draft"></knowledge-compare-preview-content>
          <knowledge-compare-preview-content
            style="width: 50%"
            :type="'published'"
            :compare="compareData?.delete"
            :knowledge="compareData?.published"></knowledge-compare-preview-content>
        </div>
      </div>
    </ant-spin>
  </ant-modal>
</template>

<script lang="ts">
import {
  Modal, Spin
} from 'ant-design-vue';
import {
  defineComponent, onMounted, ref, toRef
} from 'vue';
import KnowledgeComparePreviewContent from '../../knowledge-preview/knowledge-compare-preview-content.vue';
import { KnowledgeEdit, compareData } from '../model/knowledge.edit';

export default defineComponent({
  name: 'knowledge-compare-modal',
  components: {
    KnowledgeComparePreviewContent,
    AntModal: Modal,
    AntSpin: Spin,
  },
  props: {
    isModalVisible: {
      type: Boolean,
      required: true
    },
    draftKnowledgeEntityId: {
      type: String,
      required: true
    },
    publishedKnowledgeEntityId: {
      type: String,
      required: true
    },
    repositoryEntityId: {
      type: String,
      required: true
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const draftKnowledgeEntityId = toRef(props, 'draftKnowledgeEntityId');
    const publishedKnowledgeEntityId = toRef(props, 'publishedKnowledgeEntityId');
    const repositoryEntityId = toRef(props, 'repositoryEntityId');
    const modalConfirmLoading = ref(false);
    const isLoading = ref(false);
    const knowledgeEdit = new KnowledgeEdit();

    function handleModalCancel() {
      emit('close');
    }

    function handleModalOk() {
      emit('close');
    }

    // const sizeObject: { [key: string]: object } = {};

    async function compareWithLatestVersion() {
      await knowledgeEdit.compareWithLatestVersion({
        draftKnowledgeEntityId: draftKnowledgeEntityId.value,
        publishedKnowledgeEntityId: publishedKnowledgeEntityId.value,
        repositoryEntityId: repositoryEntityId.value
      });
    }

    // 获取元素左上角相对于某一元素的的位置

    onMounted(async () => {
      isLoading.value = true;
      await compareWithLatestVersion();
      isLoading.value = false;
    });
    return {
      modalConfirmLoading,
      handleModalOk,
      handleModalCancel,
      compareData,
      isLoading
    };
  }
});
</script>

<style scoped>

</style>
