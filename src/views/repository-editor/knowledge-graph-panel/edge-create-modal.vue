<template>
  <ant-modal
    title="创建知识点关联"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    cancelText="取消"
    okText="创建关联"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <ant-form
      :rules="knowledgeEdgeFormRules"
      ref="knowledgeEdgeFormRef"
      :model="knowledgeEdgeFormState">
      <ant-form-item label="关联所属知识点" name="knowledgeEntityId">
        <ant-select
          v-model:value="knowledgeEdgeFormState.knowledgeEntityId"
          placeholder="请选择所属知识点">
          <ant-select-option v-for="d in knowledgeInEdgeList" :key="d.entity.id">
            {{ d.content.name }}
          </ant-select-option>
        </ant-select>
      </ant-form-item>
      <ant-form-item label="源知识点" name="originKnowledgeEntityId">
        <ant-select
          v-model:value="knowledgeEdgeFormState.originKnowledgeEntityId"
          :disabled="true"
          placeholder="请选择源知识点">
          <ant-select-option v-for="d in knowledgeInEdgeList" :key="d.entity.id">
            {{ d.content.name }}
          </ant-select-option>
        </ant-select>
      </ant-form-item>
      <ant-form-item label="目标知识点" name="targetKnowledgeEntityId">
        <ant-select
          v-model:value="knowledgeEdgeFormState.targetKnowledgeEntityId"
          :disabled="true"
          placeholder="请选择目标知识点">
          <ant-select-option v-for="d in knowledgeInEdgeList" :key="d.entity.id">
            {{ d.content.name }}
          </ant-select-option>
        </ant-select>
      </ant-form-item>
      <ant-form-item label="关联描述" name="description">
        <ant-text-area
          v-model:value="knowledgeEdgeFormState.description"
          placeholder="请填写关联理由">
        </ant-text-area>
      </ant-form-item>
    </ant-form>
  </ant-modal>
</template>

<script lang="ts">
import { message } from 'ant-design-vue';
import { defineComponent, ref, inject } from 'vue';
import {
  graph,
  knowledgeInEdgeList
} from '@/views/repository-editor/knowledge-graph-panel/knowledge.graph.data';
import { repositoryEntityIdKey } from '../provide.type';
import {
  knowledgeEdgeFormRules,
  knowledgeEdgeFormRef,
  knowledgeEdgeFormState, KnowledgeGraphPanel,
} from './knowledge.graph.panel';

export default defineComponent({
  name: 'edge-create-modal',
  emits: ['close'],
  props: {
    isModalVisible: {
      type: Boolean,
      required: true
    }
  },
  setup(props, { emit }) {
    const modalConfirmLoading = ref<boolean>(false);
    const knowledgeGraphPanel = new KnowledgeGraphPanel();
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    const handleModalCancel = () => {
      if (knowledgeEdgeFormState.temporaryEdgeId) {
        graph.value?.removeEdge(knowledgeEdgeFormState.temporaryEdgeId);
      }
      message.info('取消创建关联');
      emit('close');
    };

    const handleModalOk = async () => {
      const errorMessage = await knowledgeGraphPanel.validateEdge();
      if (errorMessage) {
        return;
      }
      modalConfirmLoading.value = true;
      await knowledgeGraphPanel.createEdge(repositoryEntityId.value);
      modalConfirmLoading.value = false;
      emit('close');
    };
    return {
      knowledgeEdgeFormRules,
      knowledgeEdgeFormRef,
      knowledgeEdgeFormState,
      modalConfirmLoading,
      knowledgeInEdgeList,
      handleModalCancel,
      handleModalOk
    };
  }
});
</script>

<style scoped>

</style>
