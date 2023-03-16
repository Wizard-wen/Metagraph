<template>
  <ant-modal
    :title="sectionModalData.title"
    :visible="isModalVisible"
    okText="确定"
    cancelText="取消"
    :confirm-loading="sectionModalData.isConfirmLoading"
    @ok="handleCreateSection"
    @cancel="handleCloseModal({})">
    <div class="section-name-container" v-if="sectionModalData.parentSectionName">
      <div v-if="sectionModalData.entityType === 'Knowledge'">
        当前目录是<span class="section-name">{{ sectionModalData.parentSectionName || '' }}</span>
      </div>
      <div v-if="sectionModalData.entityType === 'Section'">
        当前父级目录是<span class="section-name">{{ sectionModalData.parentSectionName || '' }}</span>
      </div>
      <div v-if="sectionModalData.entityType === 'ChangeSection'">
        当前目录名称是<span class="section-name">{{ sectionModalData.parentSectionName || '' }}</span>
      </div>
    </div>
    <ant-form
      ref="sectionModalFormRef"
      :model="sectionModalForm"
      layout="vertical"
      :rules="sectionModalFormRules"
      :label-col="labelCol" :wrapper-col="wrapperCol">
      <ant-form-item
        label="目录名称"
        name="sectionName"
        v-if="sectionModalData.entityType === 'Section'
      || sectionModalData.entityType === 'ChangeSection'">
        <ant-input
          v-model:value="sectionModalForm.sectionName"></ant-input>
      </ant-form-item>
      <ant-form-item v-else label="绑定实体" name="selectedEntityId">
        <ant-select
          v-model:value="sectionModalForm.selectedEntityId"
          optionLabelProp="label"
          style="width: 100%"
          placeholder="Please select"
          :options="sectionModalData.entityOptionList"/>
      </ant-form-item>
    </ant-form>
  </ant-modal>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import {
  Input, Modal, Select, Form
} from 'ant-design-vue';
import { repositoryEntityIdKey } from '@/views/repository-editor/model/provide.type';
import {
  sectionModalData, SectionTreeService, sectionModalForm, sectionModalFormRules
} from '../model/section.tree';

export default defineComponent({
  name: 'section-create-modal',
  props: {
    isModalVisible: {
      type: Boolean,
      required: true
    }
  },
  components: {
    AntSelect: Select,
    AntModal: Modal,
    AntInput: Input,
    AntFormItem: Form.Item,
    AntForm: Form
  },
  emits: ['close'],
  setup(props, { emit }) {
    const sectionTreeService = new SectionTreeService();
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    const sectionModalFormRef = ref();

    function handleCloseModal(params: {
      sectionId?: string,
      entityId?: string
    }) {
      emit('close', params);
    }

    async function handleCreateSection() {
      sectionModalFormRef.value.validate()
        .then(async () => {
          sectionModalData.isConfirmLoading = true;
          const result = await sectionTreeService.createSection(repositoryEntityId.value);
          handleCloseModal(result);
        });
    }

    return {
      sectionModalData,
      sectionModalForm,
      sectionModalFormRules,
      labelCol: { span: 8 },
      wrapperCol: { offset: 0 },
      handleCreateSection,
      handleCloseModal,
      sectionModalFormRef
    };
  }
});
</script>

<style scoped lang="scss">
.section-name-container {
  line-height: 50px;

  .section-name {
    font-weight: bolder;
  }
}
</style>
