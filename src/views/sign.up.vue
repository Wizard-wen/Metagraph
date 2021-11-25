<template>
  <div class="repo-description">
    <h3>用户注册</h3>
    <span>成为注册用户，开始创作你的知识图谱！</span>
  </div>
  <div class="sign-up">
    <ant-form
      ref="formRef"
      :model="signUpFormState"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
      <ant-form-item ref="name" label="用户名" name="name">
        <ant-input v-model:value="signUpFormState.name"/>
      </ant-form-item>
      <ant-form-item ref="password" label="密码" name="password">
        <ant-input-password v-model:value="signUpFormState.password"/>
      </ant-form-item>
      <ant-form-item ref="confirmPassword" label="确认密码" name="confirmPassword">
        <ant-input-password v-model:value="signUpFormState.confirmPassword"/>
      </ant-form-item>
      <ant-form-item label="头像" ref="formIconRef" name="avatar">
        <upload-qiniu
          v-model="signUpFormState.avatar"
          @update:modelValue="handleIconChange"></upload-qiniu>
      </ant-form-item>
      <ant-form-item label="账号类型" ref="type" name="type">
        <ant-radio-group v-model:value="signUpFormState.type">
          <ant-radio value="personal">个人</ant-radio>
          <ant-radio value="organization">企业</ant-radio>
        </ant-radio-group>
      </ant-form-item>
      <ant-form-item ref="phone" label="手机号" name="phone">
        <ant-input v-model:value="signUpFormState.phone"/>
      </ant-form-item>
      <ant-form-item ref="email" label="邮箱" name="email">
        <ant-input v-model:value="signUpFormState.email"/>
      </ant-form-item>
      <ant-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <ant-button type="primary" @click="handleSignUp">注册</ant-button>
        <ant-button style="margin-left: 10px" @click="resetForm">重置</ant-button>
        <ant-button style="margin-left: 10px" @click="goBack">返回</ant-button>
      </ant-form-item>
    </ant-form>
  </div>

</template>
<script lang="ts">
import { message } from 'ant-design-vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import {
  defineComponent, reactive, ref, UnwrapRef
} from 'vue';
import { useRouter } from 'vue-router';
import { UserApiService } from '@/api.service';
import UploadQiniu from '@/components/upload/upload.qiniu.vue';

interface SignUpFormState {
  name: string;
  password: string;
  confirmPassword: string;
  avatar: string;
  phone?: string;
  email: string;
  type: 'personal' | 'organization'
}

export default defineComponent({
  components: {
    UploadQiniu
  },
  setup() {
    const formRef = ref();
    const formIconRef = ref();
    const router = useRouter();
    const signUpFormState: UnwrapRef<SignUpFormState> = reactive({
      name: '',
      password: '',
      confirmPassword: '',
      avatar: '',
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
          trigger: 'blur',
          validator: (rule: any, value: string, callback: any) => {
            if (!value) {
              callback(new Error('请输入密码'));
            }
            if (value !== signUpFormState.password) {
              callback(new Error('两次输入密码不一致'));
            }
            callback();
          }
        },
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
      ],
      avatar: [
        { required: true, message: '请上传头像', trigger: 'change' },
      ]
    };
    const handleIconChange = (event: any) => {
      signUpFormState.avatar = event;
      // 触发图片表单验证
      formIconRef.value.onFieldChange();
    };
    const handleSignUp = () => {
      formRef.value
        .validate()
        .then(async () => {
          const result = await UserApiService.register(signUpFormState);
          if (result.data) {
            message.info('注册成功，请登录！');
            await router.push('/login');
          }
        })
        .catch((error: ValidateErrorEntity<SignUpFormState>) => {
          console.log('error', error);
        });
    };
    const resetForm = () => {
      formRef.value.resetFields();
    };
    const goBack = () => {
      router.go(-1);
    };
    return {
      formRef,
      formIconRef,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: '',
      signUpFormState,
      rules,
      handleSignUp,
      resetForm,
      goBack,
      handleIconChange
    };
  },
});
</script>
<style lang="scss" scoped>
@import "../style/common.scss";
.repo-description {
  width: 800px;
  margin: 0 auto;
  padding-top: 50px;
  text-align: left;
  border-bottom: 1px solid $borderColor;
}
.sign-up {
  padding-top: 50px;
  width: 650px;
  margin: 0 auto;
}
</style>
