<template>
  <setting-header :title="'更改密码'"></setting-header>
  <ant-form
    ref="formRef"
    layout="vertical"
    :rules="rules"
    :model="formState"
    @finish="handleFinish"
    @finishFailed="handleFinishFailed"
    :label-col="labelCol" :wrapper-col="wrapperCol">
    <ant-form-item
      label="旧密码" name="oldPassword"
      class="ant-form-item-style custom-input-style">
      <ant-input type="password" v-model:value="formState.oldPassword"/>
    </ant-form-item>
    <ant-form-item
      label="新密码" name="newPassword"
      class="ant-form-item-style custom-input-style">
      <ant-input type="password" v-model:value="formState.newPassword"/>
    </ant-form-item>
    <ant-form-item
      label="请确认新密码" name="confirmNewPassword"
      class="ant-form-item-style custom-input-style">
      <ant-input type="password" v-model:value="formState.confirmNewPassword"/>
    </ant-form-item>
    <ant-form-item :wrapper-col="{ span: 8 }">
      <ant-button type="primary" html-type="submit">更新密码</ant-button>
      <ant-button style="margin-left: 10px" @click="resetForm">重置</ant-button>
    </ant-form-item>
  </ant-form>
</template>

<script lang="ts">
import {
  Button, Form, Input, message
} from 'ant-design-vue';
import {
  defineComponent, reactive, UnwrapRef, ref
} from 'vue';
import { RuleObject, ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { UserApiService } from '@/api.service';
import SettingHeader from './setting.header.vue';

interface FormState {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default defineComponent({
  name: 'Profile',
  components: {
    SettingHeader,
    AntForm: Form,
    AntFormItem: Form.Item,
    AntButton: Button,
    AntInput: Input
  },
  setup() {
    const formState: UnwrapRef<FormState> = reactive({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    const formRef = ref();
    const validateNewPassword = async (rule: RuleObject, value: string) => {
      if (value === '') {
        return Promise.reject('请输入新密码');
      }
      if (formState.confirmNewPassword !== '') {
        formRef.value.validateFields('confirmNewPassword');
      }
      return Promise.resolve();
    };
    const validateConfirmNewPassword = async (rule: RuleObject, value: string) => {
      if (value === '') {
        return Promise.reject('请再次输入新密码');
      }
      if (value !== formState.newPassword) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject('两次输入的密码不一致!');
      }
      return Promise.resolve();
    };
    const rules = {
      newPassword: [{
        required: true,
        validator: validateNewPassword,
        trigger: 'change'
      }],
      confirmNewPassword: [{
        required: true,
        validator: validateConfirmNewPassword,
        trigger: 'change'
      }],
      oldPassword: [{
        required: true,
        trigger: 'change',
        message: '请输入原始密码'
      }],
    };

    const resetForm = () => {
      formRef.value.resetFields();
    };

    const handleFinish = (values: FormState) => {
      console.log(values, formState);
      UserApiService.updatePassword({
        oldPassword: formState.oldPassword,
        newPassword: formState.newPassword
      })
        .then((data) => {
          if (!data.message) {
            message.success('密码更新成功！');
            resetForm();
          }
        });
    };
    const handleFinishFailed = (errors: ValidateErrorEntity<FormState>) => {
      console.log(errors);
    };
    return {
      labelCol: { style: { width: '150px' } },
      wrapperCol: { span: 24 },
      formState,
      formRef,
      rules,
      resetForm,
      handleFinishFailed,
      handleFinish,
    };
  }
});
</script>

<style scoped lang="scss">
@import "../../style/common.scss";
</style>
