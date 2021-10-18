<template>
  <setting-header :title="'Change password'"></setting-header>
  <ant-form layout="vertical" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
    <ant-form-item label="Old password" class="ant-form-item-style">
      <ant-input v-model:value="formState.oldPassword"/>
    </ant-form-item>
    <ant-form-item label="New password" class="ant-form-item-style">
      <ant-input v-model:value="formState.newPassword"/>
    </ant-form-item>
    <ant-form-item label="Confirm new password" class="ant-form-item-style">
      <ant-input v-model:value="formState.confirmNewPassword"/>
    </ant-form-item>
    <ant-form-item :wrapper-col="{ span: 4 }">
      <ant-button type="primary">Update password</ant-button>
    </ant-form-item>
  </ant-form>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRaw, UnwrapRef
} from 'vue';
import SettingHeader from './setting.header.vue';

interface FormState {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default defineComponent({
  name: 'Profile',
  components: {
    SettingHeader
  },
  setup() {
    const formState: UnwrapRef<FormState> = reactive({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    const onSubmit = () => {
      console.log('submit!', toRaw(formState));
    };
    return {
      labelCol: { style: { width: '150px' } },
      wrapperCol: { span: 14 },
      formState,
      onSubmit,
    };
  }
});
</script>

<style scoped lang="scss">
.ant-form-item-style {
  margin-bottom: 0px;
}

</style>
