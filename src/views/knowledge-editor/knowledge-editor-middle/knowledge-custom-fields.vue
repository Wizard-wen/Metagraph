<template>
  <div class="custom-field-box">
    <div class="header">
      <div class="title">信息栏</div>
      <div class="right">
        <ant-button @click="handleOpenAddFieldModal">
          <PlusOutlined/>
          添加
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
        class="custom-field-form"
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
                style="width: 90%;"
                v-if="item.type === 'Date'"/>
              <ant-input
                @blur="handleValidateItem(item.key)"
                class="custom-input-style form-item-gap"
                v-if="item.type === 'Input'"
                autocomplete="off"
                :style="{width: item.grid === 1 ? '90%' : 'calc(100% - 60px)'}"
                v-model:value="customFieldsModelRef[item.key]"
                :placeholder="`请输入${item.label}`"
              />
              <ant-text-area
                :rows="3"
                autocomplete="off"
                @blur="handleValidateItem(item.key)"
                class="custom-input-style form-item-gap"
                v-if="item.type === 'Textarea'"
                v-model:value="customFieldsModelRef[item.key]"
                :placeholder="`请输入${item.label}`"
                style="max-width: calc(100% - 60px);"></ant-text-area>
            </ant-form-item>
          </ant-col>
        </ant-row>
      </ant-form>
      <empty-view v-else></empty-view>
    </div>
  </div>
  <add-field-modal
    :is-edit="false"
    v-if="isFieldModalVisible"
    @close="handleAddFieldModalClose"
    :isModalVisible="isFieldModalVisible"></add-field-modal>
</template>
<script lang="ts" setup>
import { PlusOutlined } from '@ant-design/icons-vue';
import {
  Button as AntButton,
  Col as AntCol,
  DatePicker as AntDatePicker,
  Form,
  Input as AntInput,
  message,
  Row as AntRow
} from 'ant-design-vue';
import { inject, ref } from 'vue';
import { KnowledgeApiService } from '@/api-service';
import AddFieldModal
  from '@/views/knowledge-editor/knowledge-editor-middle/knowledge-custom-fields/add-field-modal.vue';
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

const isFieldModalVisible = ref(false);

function handleOpenAddFieldModal() {
  isFieldModalVisible.value = true;
}

async function handleAddFieldModalClose() {
  isFieldModalVisible.value = false;
  await knowledgeEdit.getKnowledge(draftKnowledgeEntityId?.value || '');
}


function handleValidateItem(key: string) {
  const {
    validate, validateInfos
  } = Form.useForm(customFieldsModelRef.value, customFieldsRulesRef.value);
  customFieldsValidateInfo.value = validateInfos;
  validate(key, { trigger: ['change', 'blur'] }).catch(() => {
  });
}

async function handleSaveCustomField() {
  const {
    validate, validateInfos
  } = Form.useForm(customFieldsModelRef.value, customFieldsRulesRef.value);
  customFieldsValidateInfo.value = validateInfos;
  validate()
    .then(async (value: any) => {
      console.log(value, knowledgeCustomFields.value, customFieldsModelRef.value);
      Object.keys(customFieldsModelRef.value)
        .forEach((item) => {
          const customFieldItem = knowledgeCustomFields.value.find(
            (customFieldItem) => customFieldItem.key === item
          );
          if(customFieldItem) {
            customFieldItem.value = customFieldsModelRef.value[item];
          }
        });
      const result = await KnowledgeApiService.saveFields({
        knowledgeEntityId: draftKnowledgeEntityId?.value || '',
        customFields: knowledgeCustomFields.value
      });
      if(result.code === 0) {
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

.custom-field-form {
  @include custom-input-style-mixin;
}

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
