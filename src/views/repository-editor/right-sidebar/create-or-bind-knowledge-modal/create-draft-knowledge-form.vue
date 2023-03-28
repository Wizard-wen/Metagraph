<template>
  <ant-form
    ref="draftKnowledgeFormRef"
    :model="draftKnowledgeForm"
    :rules="draftKnowledgeRules"
    :label-col="labelCol" :wrapper-col="wrapperCol"
    class="knowledge-form-content">
    <ant-form-item label="名称" class="custom-form-item-name" name="name">
      <ant-input v-model:value="draftKnowledgeForm.name"/>
    </ant-form-item>
    <ant-form-item label="基础类型" name="knowledgeBaseTypeId">
      <ant-radio-group v-model:value="draftKnowledgeForm.knowledgeBaseTypeId">
        <ant-radio value="606fe7b650a08412400387e6">公理</ant-radio>
        <ant-radio value="606fe62050a08412400387e5">名词</ant-radio>
      </ant-radio-group>
    </ant-form-item>
    <ant-form-item>
      <ant-space>
        <ant-button
          :loading="isLoading"
          type="primary" @click="handleSubmit">提交
        </ant-button>
        <ant-button @click="handleCancel">取消</ant-button>
      </ant-space>
    </ant-form-item>
  </ant-form>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, ref, toRef } from 'vue';
import {
  Button as AntButton,
  Form as AntForm,
  Input as AntInput,
  Radio as AntRadio,
  Space as AntSpace
} from 'ant-design-vue';

const AntFormItem = AntForm.Item;
const AntRadioGroup = AntRadio.Group;
const labelCol = { span: 8 };
const wrapperCol = { offset: 0 };

const props = defineProps({
  initName: {
    type: String,
    required: true
  },
  isLoading: {
    type: Boolean
  }
});
const emit = defineEmits(['cancel', 'submit']);
const initName = toRef(props, 'initName');
const draftKnowledgeForm = reactive({
  name: '',
  knowledgeBaseTypeId: '606fe62050a08412400387e5',
});
const draftKnowledgeFormRef = ref();
draftKnowledgeForm.name = initName.value;
const draftKnowledgeRules = {
  name: [{
    required: true,
    message: '请输入知识点名称',
    trigger: 'blur'
  }],
  knowledgeBaseTypeId: [{
    required: true,
    message: '请选择知识点基本类型',
    trigger: 'change'
  }]
};

const options = [
  {
    value: '606fe7b650a08412400387e6',
    key: '606fe7b650a08412400387e6',
    label: '公理',
    title: '公理'
  },
  {
    value: '606fe62050a08412400387e5',
    key: '606fe62050a08412400387e5',
    label: '名词',
    title: '名词'
  }
];

function handleSubmit() {
  draftKnowledgeFormRef.value
    .validate()
    .then(() => {
      emit('submit', {
        ...draftKnowledgeForm
      });
    });
}

function handleCancel() {
  emit('cancel');
}

</script>

<style scoped lang="scss">

</style>
