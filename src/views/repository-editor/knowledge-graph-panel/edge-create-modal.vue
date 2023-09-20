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
      :model="knowledgeEdgeFormState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      class="relation-form">
      <ant-form-item label="关联所属知识点" name="knowledgeEntityId">
        <ant-select
          v-model:value="knowledgeEdgeFormState.knowledgeEntityId"
          placeholder="请选择所属知识点">
          <ant-select-option v-for="edgeItem in knowledgeInEdgeList" :key="edgeItem.entity.id">
            {{ edgeItem.content.name }}
          </ant-select-option>
        </ant-select>
      </ant-form-item>
      <ant-form-item label="源知识点" name="originKnowledgeEntityId">
        <ant-select
          v-model:value="knowledgeEdgeFormState.originKnowledgeEntityId"
          :disabled="true"
          placeholder="请选择源知识点">
          <ant-select-option v-for="edgeItem in knowledgeInEdgeList" :key="edgeItem.entity.id">
            {{ edgeItem.content.name }}
          </ant-select-option>
        </ant-select>
      </ant-form-item>
      <ant-form-item label="目标知识点" name="targetKnowledgeEntityId">
        <ant-select
          v-model:value="knowledgeEdgeFormState.targetKnowledgeEntityId"
          :disabled="true"
          placeholder="请选择目标知识点">
          <ant-select-option v-for="edgeItem in knowledgeInEdgeList" :key="edgeItem.entity.id">
            {{ edgeItem.content.name }}
          </ant-select-option>
        </ant-select>
      </ant-form-item>
      <ant-form-item label="关联描述" name="description">
        <ant-text-area
          class="custom-input-style"
          v-model:value="knowledgeEdgeFormState.description"
          placeholder="请填写关联理由">
        </ant-text-area>
      </ant-form-item>
    </ant-form>
  </ant-modal>
</template>

<script lang="ts" setup>
import {
  Form as AntForm,
  Input as AntInput,
  message,
  Modal as AntModal,
  Select as AntSelect
} from 'ant-design-vue';
import { defineEmits, defineProps, inject, ref } from 'vue';
import {
  graph,
  KnowledgeGraphData,
  knowledgeInEdgeList
} from '@/views/repository-editor/knowledge-graph-panel/knowledge.graph.data';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { repositoryEntityIdKey } from '../model/provide.type';
import {
  KnowledgeEdgeFormState,
  knowledgeEdgeFormState,
  KnowledgeGraphPanel,
} from './knowledge.graph.panel';

const knowledgeEdgeFormRef = ref();
const emit = defineEmits(['close']);

const labelCol = ref({ span: 6 });
const wrapperCol = ref({ offset: 0 });
defineProps({
  isModalVisible: {
    type: Boolean,
    required: true
  }
});

const knowledgeEdgeFormRules = {
  knowledgeEntityId: [
    {
      required: true,
      message: '请选择所属实体',
      trigger: 'change'
    }
  ],
  targetKnowledgeEntityId: [
    {
      required: true,
      message: '请选择目标实体',
      trigger: 'change'
    }
  ],
  originKnowledgeEntityId: [
    {
      required: true,
      message: '请选择源实体',
      trigger: 'change'
    }
  ],
  description: [
    {
      required: true,
      message: '请输入关联描述',
      trigger: 'blur'
    }
  ],
};

const AntFormItem = AntForm.Item;
const AntTextArea = AntInput.TextArea;
const AntSelectOption = AntSelect.Option;

const modalConfirmLoading = ref<boolean>(false);
const knowledgeGraphPanel = new KnowledgeGraphPanel();
const knowledgeGraphData = new KnowledgeGraphData();
const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
const handleModalCancel = () => {
  if(knowledgeEdgeFormState.temporaryEdgeId) {
    graph.value?.removeEdge(knowledgeEdgeFormState.temporaryEdgeId);
  }
  message.info('取消创建关联');
  emit('close');
};

async function validateEdge(): Promise<undefined | ValidateErrorEntity<KnowledgeEdgeFormState>> {
  return new Promise((resolve) => {
    knowledgeEdgeFormRef.value.validate()
      .then(() => {
        resolve(undefined);
      })
      .catch((error: ValidateErrorEntity<KnowledgeEdgeFormState>) => {
        resolve(error);
      });
  });
}

const handleModalOk = async () => {
  const errorMessage = await validateEdge();
  if(errorMessage) {
    return;
  }
  modalConfirmLoading.value = true;
  const edgeData = await knowledgeGraphPanel.createEdgeInServer(repositoryEntityId.value);
  if(edgeData) {
    knowledgeGraphData.createNewEdge(edgeData);
    message.success('关联创建成功');
  } else {
    message.error('关联创建失败');
  }

  modalConfirmLoading.value = false;
  emit('close');
};
</script>

<style scoped lang="scss">
@import "../../../style/common.scss";

.relation-form {
  @include custom-input-style-mixin;
}
</style>
