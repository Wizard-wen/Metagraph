<template>
  <div class="repo-description">
    <h3>用户注册</h3>
    <span>成为注册用户，开始创作你的知识库！</span>
  </div>
  <div class="sign-up">
    <ant-form
      autocomplete="off"
      ref="formRef"
      :model="signUpFormState"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
      <ant-form-item ref="name" label="用户名" name="name" class="custom-input-style">
        <ant-input autocomplete="off" v-model:value="signUpFormState.name"/>
      </ant-form-item>
      <ant-form-item
        ref="password"
        label="密码"
        name="password">
        <ant-input-password
          autocomplete="new-password"
          class="custom-input-style"
          v-model:value="signUpFormState.password"/>
      </ant-form-item>
      <ant-form-item
        ref="confirmPassword"
        label="确认密码"
        name="confirmPassword">
        <ant-input-password
          class="custom-input-style"
          v-model:value="signUpFormState.confirmPassword"/>
      </ant-form-item>
      <ant-form-item label="头像" ref="formIconRef" name="avatar">
        <upload-form-item
          :provider="'UserAvatar'"
          :image-type="'avatar'"
          :title="'上传头像'" v-model="signUpFormState.avatar"></upload-form-item>
      </ant-form-item>
      <ant-form-item label="账号类型" ref="type" name="type">
        <ant-radio-group v-model:value="signUpFormState.type">
          <ant-radio value="personal">个人</ant-radio>
          <ant-radio disabled value="organization">企业</ant-radio>
        </ant-radio-group>
      </ant-form-item>
      <ant-form-item ref="phone" label="手机号" name="phone" class="custom-input-style">
        <ant-input v-model:value="signUpFormState.phone"/>
      </ant-form-item>
      <ant-form-item ref="email" label="邮箱" name="email" class="custom-input-style">
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
import {
  Button, Form, Input, message, Radio
} from 'ant-design-vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import {
  defineComponent, reactive, ref, UnwrapRef
} from 'vue';
import { useRouter } from 'vue-router';
import { customFormRules } from '@/views/settings/custom.form.rules';
import UploadFormItem from '@/components/upload/upload-form-item.vue';
import { UserNoAuthApiService } from '@/api.service/no.auth/user.no.auth.api.service';
import { UserApiService } from '@/api.service';

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
    UploadFormItem,
    AntForm: Form,
    AntFormItem: Form.Item,
    AntInputPassword: Input.Password,
    AntButton: Button,
    AntRadio: Radio,
    AntRadioGroup: Radio.Group,
    AntInput: Input
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
      name: customFormRules.name,
      phone: customFormRules.phone,
      password: [
        {
          required: true,
          trigger: 'blur',
          validator(rule: any, value: string): Promise<void> {
            return new Promise((resolve, reject) => {
              if (!value) {
                reject('请输入密码');
              }
              resolve();
            });
          }
        }
      ],
      confirmPassword: [
        {
          required: true,
          trigger: 'blur',
          validator(rule: any, value: string): Promise<void> {
            return new Promise((resolve, reject) => {
              if (!value) {
                reject('请输入密码');
              }
              if (value !== signUpFormState.password) {
                reject('两次输入密码不一致');
              }
              resolve();
            });
          }
        },
      ],
      email: customFormRules.email,
      avatar: customFormRules.avatar
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
            router.push('/login').then();
          }
          if (result.message) {
            message.error('注册时出现问题！');
          }
        })
        .catch((error: ValidateErrorEntity<SignUpFormState>) => {
          console.log(error);
          message.error('注册时出现问题！');
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
  margin: 0 auto 200px;
}
</style>
