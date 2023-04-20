<template>
  <div class="custom-field-box">
    <div class="header">
      <div class="title">信息栏</div>
      <div class="right">
        <ant-button @click="handleOpenAddFieldModal">
          <PlusOutlined/>
          添加字段
        </ant-button>
        <ant-button type="primary" @click="handleSaveCustomField">
          保存
        </ant-button>
      </div>
    </div>
    <div class="content">
      <ant-form
        v-if="knowledgeCustomFields.length"
        :model="customFieldsModelRef"
        ref="formRef">
        <ant-row>
          <ant-col
            :span="item.grid * 12"
            v-for="item in knowledgeCustomFields"
            :key="item.key">
            <ant-form-item
              v-bind="customFieldsValidateInfo[item.key]"
              class="custom-field-item"
              :label="item.label"
              :name="item.key"
              :rules="customFieldsRulesRef[item.key]"
              required>
              <ant-date-picker
                v-model:value="customFieldsModelRef[item.key]"
                class="form-item-gap"
                style="width: 80%;"
                v-if="item.type === 'Date'"/>
              <ant-input
                v-if="item.type === 'Input'"
                v-model:value="customFieldsModelRef[item.key]"
                :placeholder="`请输入${item.label}`"
                class="form-item-gap"
                style="width: 80%;"/>
              <ant-text-area
                v-if="item.type === 'Textarea'"
                v-model:value="customFieldsModelRef[item.key]"
                :placeholder="`请输入${item.label}`"
                class="form-item-gap"
                style="max-width: calc(100% - 60px);"></ant-text-area>
              <DeleteOutlined
                class="dynamic-operate-button dynamic-operate-button-gap"
                @click="removeField(item)"/>
              <EditOutlined
                class="dynamic-operate-button"/>
            </ant-form-item>
          </ant-col>
        </ant-row>
      </ant-form>
      <empty-view v-else></empty-view>
    </div>
  </div>
  <add-field-modal
    v-if="isFieldModalVisible"
    @close="handleAddFieldModalClose"
    :isModalVisible="isFieldModalVisible"></add-field-modal>
</template>
<script lang="ts" setup>
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons-vue';
import {
  Button as AntButton,
  Col as AntCol,
  DatePicker as AntDatePicker,
  Form,
  Input as AntInput,
  message,
  Modal,
  Row as AntRow
} from 'ant-design-vue';
import type { KnowledgeCustomFieldType } from '@metagraph/constant';
import { createVNode, inject, ref } from 'vue';
import { KnowledgeApiService } from '@/api-service';
import AddFieldModal from '@/views/knowledge-editor/knowledge-editor-middle/knowledge-custom-fields/add-field-modal.vue';
import EmptyView from '@/components/empty-view/empty-view.vue';
import {
  customFieldsModelRef,
  customFieldsRulesRef,
  customFieldsValidateInfo,
  draftKnowledgeEntityIdInjectKey,
  knowledgeCustomFields,
  KnowledgeEdit,
} from '../model/knowledge.edit';

const AntForm = Form;
const AntTextArea = AntInput.TextArea;
const AntFormItem = AntForm.Item;
const knowledgeEdit = new KnowledgeEdit();
const draftKnowledgeEntityId = inject(draftKnowledgeEntityIdInjectKey);
const formRef = ref();

async function removeField(item: KnowledgeCustomFieldType) {
  Modal.confirm({
    title: '确定删除自定义字段吗?',
    okText: '确定',
    cancelText: '取消',
    zIndex: 9001,
    icon: createVNode(ExclamationCircleOutlined),
    content: `该操作不可逆，确定删除自定义字段${item.label}吗？`,
    async onOk() {
      const result = await KnowledgeApiService.removeField({
        knowledgeEntityId: draftKnowledgeEntityId?.value || '',
        customFieldKey: item.key
      });
      if (result.code === 0) {
        await knowledgeEdit.getKnowledge(draftKnowledgeEntityId?.value || '');
        message.success('删除成功！');
      }
    },
    async onCancel() {
      message.info('取消删除');
    },
  });
}

const isFieldModalVisible = ref(false);

function handleOpenAddFieldModal() {
  isFieldModalVisible.value = true;
}

async function handleAddFieldModalClose() {
  isFieldModalVisible.value = false;
  await knowledgeEdit.getKnowledge(draftKnowledgeEntityId?.value || '');
}

async function handleSaveCustomField() {
  const { validate } = Form.useForm(customFieldsModelRef.value, customFieldsRulesRef.value);
  validate()
    .then(async (value: any) => {
      console.log(value, knowledgeCustomFields.value, customFieldsModelRef.value);
      Object.keys(customFieldsModelRef.value)
        .forEach((item) => {
          const customFieldItem = knowledgeCustomFields.value.find(
            (customFieldItem) => customFieldItem.key === item
          );
          console.log(customFieldItem);
          if (customFieldItem) {
            customFieldItem.value = customFieldsModelRef.value[item];
          }
        });
      const result = await KnowledgeApiService.saveFields({
        knowledgeEntityId: draftKnowledgeEntityId?.value || '',
        customFields: knowledgeCustomFields.value
      });
      if (result.code === 0) {
        message.success('保存成功！');
      }
    })
    .catch((err: any) => {
      console.log('error', err);
    });
}
</script>
<style lang="scss" scoped>
@import '../../../style/common.scss';
@import "../style/knowledge.edit.scss";

.custom-field-item {
  &::v-deep(.ant-form-item-label) {
    width: 100px;
  }
}

.form-item-gap {
  margin-right: 6px;
}

.dynamic-operate-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  color: #999;
  transition: all 0.3s;
  font-size: 16px;
}

.dynamic-operate-button-gap {
  margin-right: 3px;
}

.dynamic-operate-button:hover {
  color: #777;
}

.dynamic-operate-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
