<template>
  <ant-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <ant-form-item ref="name" label="Activity name" name="name">
      <ant-input v-model:value="formState.name"/>
    </ant-form-item>
    <ant-form-item label="Activity zone" name="region">
      <ant-select v-model:value="formState.region" placeholder="please select your zone">
        <ant-select-option value="shanghai">Zone one</ant-select-option>
        <ant-select-option value="beijing">Zone two</ant-select-option>
      </ant-select>
    </ant-form-item>
    <ant-form-item label="Activity time" required name="date1">
      <ant-date-picker
        v-model:value="formState.date1"
        show-time
        type="date"
        placeholder="Pick a date"
        style="width: 100%"
      />
    </ant-form-item>
    <ant-form-item label="Instant delivery" name="delivery">
      <ant-switch v-model:checked="formState.delivery"/>
    </ant-form-item>
    <ant-form-item label="Activity type" name="type">
      <ant-checkbox-group v-model:value="formState.type">
        <ant-checkbox value="1" name="type">Online</ant-checkbox>
        <ant-checkbox value="2" name="type">Promotion</ant-checkbox>
        <ant-checkbox value="3" name="type">Offline</ant-checkbox>
      </ant-checkbox-group>
    </ant-form-item>
    <ant-form-item label="Resources" name="resource">
      <ant-radio-group v-model:value="formState.resource">
        <ant-radio value="1">Sponsor</ant-radio>
        <ant-radio value="2">Venue</ant-radio>
      </ant-radio-group>
    </ant-form-item>
    <ant-form-item label="Activity form" name="desc">
      <ant-textarea v-model:value="formState.desc"/>
    </ant-form-item>
    <ant-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <ant-button type="primary" @click="onSubmit">Create</ant-button>
      <ant-button style="margin-left: 10px" @click="resetForm">Reset</ant-button>
    </ant-form-item>
  </ant-form>
</template>
<script lang="ts">
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { Moment } from 'moment';
import {
  defineComponent, reactive, ref, toRaw, UnwrapRef
} from 'vue';

interface FormState {
  name: string;
  region: string | undefined;
  date1: Moment | undefined;
  delivery: boolean;
  type: string[];
  resource: string;
  desc: string;
}

export default defineComponent({
  setup() {
    const formRef = ref();
    const formState: UnwrapRef<FormState> = reactive({
      name: '',
      region: undefined,
      date1: undefined,
      delivery: false,
      type: [],
      resource: '',
      desc: '',
    });
    const rules = {
      name: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
        {
          min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur'
        },
      ],
      region: [{ required: true, message: 'Please select Activity zone', trigger: 'change' }],
      date1: [{
        required: true, message: 'Please pick a date', trigger: 'change', type: 'object'
      }],
      type: [
        {
          type: 'array',
          required: true,
          message: 'Please select at least one activity type',
          trigger: 'change',
        },
      ],
      resource: [{ required: true, message: 'Please select activity resource', trigger: 'change' }],
      desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
    };
    const onSubmit = () => {
      formRef.value
        .validate()
        .then(() => {
          console.log('values', formState, toRaw(formState));
        })
        .catch((error: ValidateErrorEntity<FormState>) => {
          console.log('error', error);
        });
    };
    const resetForm = () => {
      formRef.value.resetFields();
    };
    return {
      formRef,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: '',
      formState,
      rules,
      onSubmit,
      resetForm,
    };
  },
});
</script>
