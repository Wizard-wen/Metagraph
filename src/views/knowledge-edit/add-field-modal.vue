<template>
  <ant-modal
    :width="800"
    title="添加字段"
    okText="确定"
    cancelText="取消"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="9999"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <ant-form
      ref="formRef"
      :rules="rules"
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
      <ant-form-item style="margin-top: 20px;" ref="name" label="字段名" name="name">
        <ant-input v-model:value="formState.name"/>
      </ant-form-item>
    </ant-form>
  </ant-modal>
</template>

<script setup lang="ts">
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import {
  defineEmits, defineProps, reactive, ref, UnwrapRef, toRaw
} from 'vue';

interface FormState {
  name: string;
}
const props = defineProps({
  isModalVisible: {
    type: Boolean,
    required: true
  }
});
const emit = defineEmits(['close']);

const formRef = ref();
const formState: UnwrapRef<FormState> = reactive({
  name: '',
});

function handleModalCancel() {
  emit('close');
}

function handleModalOk() {
  formRef.value
    .validate()
    .then(() => {
      console.log('values', formState, toRaw(formState));
      emit('close', {
        name: formState.name
      });
    })
    .catch((error: ValidateErrorEntity<FormState>) => {
      console.log('error', error);
    });
}

const labelCol = { span: 4 };
const wrapperCol = { span: 14 };
const rules = reactive({
  name: [
    {
      required: true,
      message: '请输入字段名',
      trigger: 'blur'
    },
  ]
});
</script>

<style scoped>

</style>
