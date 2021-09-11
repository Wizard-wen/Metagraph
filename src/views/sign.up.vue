<template>
  <ant-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol">
    <ant-form-item ref="name" label="用户名" name="name">
      <ant-input v-model:value="formState.name"/>
    </ant-form-item>
    <ant-form-item ref="password" label="密码" name="password">
      <ant-input-password v-model:value="formState.password"/>
    </ant-form-item>
    <ant-form-item ref="confirmPassword" label="确认密码" name="confirmPassword">
      <ant-input-password v-model:value="formState.confirmPassword"/>
    </ant-form-item>
    <ant-form-item label="头像" :ref="formIconRef" name="icon">
      <upload-qiniu :model-value="formState.icon" @update:modelValue="handleIconChange"></upload-qiniu>
    </ant-form-item>
    <ant-form-item label="账号类型" ref="type" name="type">
      <ant-radio-group v-model:value="formState.type">
        <ant-radio value="personal">个人</ant-radio>
        <ant-radio value="organization">企业</ant-radio>
      </ant-radio-group>
    </ant-form-item>
    <ant-form-item ref="phone" label="手机号" name="phone">
      <ant-input v-model:value="formState.phone"/>
    </ant-form-item>
    <ant-form-item ref="email" label="邮箱" name="email">
      <ant-input v-model:value="formState.email"/>
    </ant-form-item>
    <ant-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <ant-button type="primary" @click="onSubmit">Create</ant-button>
      <ant-button style="margin-left: 10px" @click="resetForm">Reset</ant-button>
    </ant-form-item>
  </ant-form>
</template>
<script lang="ts">
import { UserApiService } from "@/api.service";
import { message } from "ant-design-vue";
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import {
  defineComponent, reactive, ref, toRaw, UnwrapRef, watch
} from 'vue';
import { useRouter } from "vue-router";
import UploadQiniu from '../components/upload/upload.qiniu.vue';

interface FormState {
  name: string;
  password: string;
  confirmPassword: string;
  icon: string;
  phone?: string;
  email: string;
  type: 'personal' | 'organization'
}

export default defineComponent({
  components: {
    UploadQiniu
  },
  setup(props, context) {
    const formRef = ref();
    const formIconRef = ref();
    const router = useRouter();
    const formState: UnwrapRef<FormState> = reactive({
      name: '',
      password: '',
      confirmPassword: '',
      icon: '',
      phone: '',
      email: '',
      type: 'personal'
    });
    const rules = {
      name: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
      ],
      password: [
        {
          required: true,
          trigger: 'blur',
          validator: (rule: any, value: string, callback: any) => {
            if (!value) {
              callback(new Error('请输入密码'));
            }
            callback();
          }
        }
      ],
      confirmPassword: [
        {
          required: true,
          // message: 'Please select Activity zone',
          trigger: 'blur',
          validator: (rule: any, value: string, callback: any) => {
            if (!value) {
              callback(new Error('请输入密码'));
            }
            if (value !== formState.password) {
              callback(new Error('两次输入密码不一致'));
            }
            callback();
          }
        },
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
      ],
      icon: [
        { required: true, message: '请上传头像', trigger: 'change' },
      ]
    };
    const handleIconChange = (event: any) => {
      console.log(event);
      formState.icon = event;
      formIconRef.value.onFieldChange();
    };
    const onSubmit = () => {
      formRef.value
        .validate()
        .then(async () => {
          console.log('values', formState, toRaw(formState));
          const result = await UserApiService.register(formState);
          if (result.data) {
            message.info('success');
            await router.push('/login');
          }
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
      formIconRef,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: '',
      formState,
      rules,
      onSubmit,
      resetForm,
      handleIconChange
    };
  },
});
</script>
