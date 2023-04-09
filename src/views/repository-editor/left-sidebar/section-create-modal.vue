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
        当前父级目录是<span class="section-name">{{
          sectionModalData.parentSectionName || ''
        }}</span>
      </div>
      <div v-if="sectionModalData.entityType === 'ChangeSection'">
        当前目录名称是<span class="section-name">{{
          sectionModalData.parentSectionName || ''
        }}</span>
      </div>
    </div>
    <ant-form
      ref="sectionModalFormRef"
      :model="sectionModalForm"
      layout="vertical"
      :rules="sectionModalFormRules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      class="section-form">
      <ant-form-item
        label="目录名称"
        name="sectionName"
        v-if="sectionModalData.entityType === 'Section'
      || sectionModalData.entityType === 'ChangeSection'">
        <ant-input
          ref="sectionNameRef"
          autocomplete="off"
          placeholder="请输入目录名称"
          class="custom-input-style"
          v-model:value="sectionModalForm.sectionName"></ant-input>
      </ant-form-item>
      <ant-form-item v-else label="绑定实体" name="selectedEntityId">
        <ant-select
          v-model:value="sectionModalForm.selectedEntityId"
          optionLabelProp="label"
          style="width: 100%"
          placeholder="请选择知识点"
          :options="sectionModalData.entityOptionList"/>
      </ant-form-item>
    </ant-form>
  </ant-modal>
</template>

<script lang="ts" setup>
import { inject, ref, defineEmits, defineProps, onMounted } from 'vue';
import {
  Form as AntForm,
  Input as AntInput,
  Modal as AntModal,
  Select as AntSelect
} from 'ant-design-vue';
import { repositoryEntityIdKey } from '@/views/repository-editor/model/provide.type';
import {
  sectionModalData,
  sectionModalForm,
  sectionModalFormRules,
  SectionTreeService
} from '../model/section.tree';

const AntFormItem = AntForm.Item;

const sectionNameRef = ref();

const labelCol = ref({ span: 8 });
const wrapperCol = ref({ offset: 0 });

const sectionTreeService = new SectionTreeService();
const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
const sectionModalFormRef = ref();

const emit = defineEmits(['close']);
defineProps({
  isModalVisible: {
    type: Boolean,
    default: false
  }
});

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

onMounted(() => {
  if (sectionNameRef.value) {
    sectionNameRef.value.focus();
  }
});
</script>

<style scoped lang="scss">
@import "../../../style/common.scss";

.section-name-container {
  line-height: 50px;

  .section-name {
    font-weight: bolder;
  }
}

.section-form {
  @include custom-input-style-mixin;
}
</style>
