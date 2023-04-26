<template>
  <ant-modal
    :width="800"
    title="添加自定义字段"
    okText="确定"
    cancelText="取消"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="9999"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <ant-form
      class="add-field-form"
      ref="formRef"
      :rules="rules"
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
      <ant-form-item label="字段名" name="name">
        <ant-input
          class="custom-input-style"
          placeholder="请输入自定义字段名"
          autocomplete="off"
          v-model:value="formState.name"/>
      </ant-form-item>
      <ant-form-item label="字段类型" name="type">
        <ant-radio-group v-model:value="formState.type">
          <ant-radio value="Date">日期选择器</ant-radio>
          <ant-radio value="Input">文本输入框</ant-radio>
          <ant-radio value="Textarea">多行文本输入框</ant-radio>
        </ant-radio-group>
      </ant-form-item>
      <ant-form-item label="字段长度" name="grid">
        <ant-radio-group v-model:value="formState.grid">
          <ant-radio :value="1">半行</ant-radio>
          <ant-radio :value="2">独占一行</ant-radio>
        </ant-radio-group>
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
  Radio as AntRadio
} from 'ant-design-vue';
import { RuleObject, ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { defineEmits, defineProps, inject, reactive, ref, UnwrapRef } from 'vue';
import { KnowledgeApiService } from '@/api-service';
import { draftKnowledgeEntityIdInjectKey } from '@/views/knowledge-editor/model/knowledge.edit';

interface FormState {
  name: string;
  grid: 1 | 2;
  type: 'Date' | 'Input' | 'Textarea';
}

const AntFormItem = AntForm.Item;
const AntRadioGroup = AntRadio.Group;

const draftKnowledgeEntityId = inject(draftKnowledgeEntityIdInjectKey, ref(''));
const formRef = ref();
const formState: UnwrapRef<FormState> = reactive({
  name: '',
  grid: 1,
  type: 'Input'
});

const props = defineProps({
  isModalVisible: {
    type: Boolean,
    required: true
  }
});
const emit = defineEmits(['close']);

function handleModalCancel() {
  emit('close');
}

async function validateCustomField(rule: RuleObject, value: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    if (value === '') {
      reject('请输入自定义字段名');
    }
    KnowledgeApiService.checkField({
      knowledgeEntityId: draftKnowledgeEntityId?.value,
      customField: {
        label: value
      }
    })
      .then((result) => {
        if (result.data) {
          if (result.data.isExists) {
            reject('自定义字段名重复！');
          }
          resolve(true);
        }
        reject(result.message);
      });
  });
}

function handleModalOk() {
  formRef.value
    .validate()
    .then(async () => {
      const result = await KnowledgeApiService.addField({
        knowledgeEntityId: draftKnowledgeEntityId?.value,
        customField: {
          label: formState.name,
          type: formState.type,
          grid: Number(formState.grid) as 1 | 2
        }
      });
      if (result.data) {
        message.success('创建成功');
      }
      emit('close');
    })
    .catch((error: ValidateErrorEntity<FormState>) => {
      console.log('error', error);
    });
}

const modalConfirmLoading = ref(false);
const labelCol = { span: 4 };
const wrapperCol = { span: 14 };
const rules = reactive({
  name: [{
    validator: validateCustomField,
    trigger: 'blur',
    required: true
  }],
  type: [{
    trigger: 'change',
    required: true,
    message: '请选择字段类型'
  }],
  grid: [{
    type: 'number',
    trigger: 'change',
    required: true,
    message: '请选择字段单元格'
  }]
});

// export default defineComponent({
//   name: 'add-field-modal',
//   props: ,
//   components: {
//     AntModal: Modal,
//     AntForm: Form,
//     AntFormItem: Form.Item,
//     AntInput: Input,
//     AntRadio: Radio,
//     AntRadioGroup: Radio.Group
//   },
//   emits: ['close'],
//   setup(props, { emit }) {
//
//     return {
//       formRef,
//       formState,
//       labelCol,
//       wrapperCol,
//       rules,
//       modalConfirmLoading,
//       handleModalOk,
//       validateCustomField,
//       handleModalCancel
//     };
//   }
// });
</script>

<style scoped lang="scss">
@import "../../../../style/common.scss";

.add-field-form {
  @include custom-input-style-mixin;
}

</style>
