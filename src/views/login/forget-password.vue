<template>
  <ant-form
    id="login-by-email-form"
    ref="forgetFormRef"
    :model="forgetFormState"
    :rules="registerRules"
    :wrapper-col="wrapperCol">
    <ant-form-item name="email">
      <ant-input
        class="custom-input-style"
        autocomplete="off"
        v-model:value="forgetFormState.email"
        placeholder="请输入邮箱">
      </ant-input>
    </ant-form-item>
    <ant-form-item name="verifyCode">
      <ant-input
        class="custom-input-style"
        v-model:value="forgetFormState.verifyCode"
        placeholder="请输入验证码"
        autocomplete="off">
        <template #suffix>
          <div class="send-code">
            <div v-if="!isEnding" @click="handleGetCode">获取</div>
            <end-time v-else @timeEnd="isEnding = false;" :endTime="endTime"></end-time>
          </div>
        </template>
      </ant-input>
    </ant-form-item>
    <ant-form-item
      ref="password"
      name="password">
      <ant-input-password
        placeholder="请输入新密码"
        autocomplete="new-password"
        class="custom-input-style"
        v-model:value="forgetFormState.password"/>
    </ant-form-item>
    <ant-form-item
      ref="confirmPassword"
      name="confirmPassword">
      <ant-input-password
        placeholder="请再次确认新密码"
        class="custom-input-style"
        autocomplete="off"
        v-model:value="forgetFormState.confirmPassword"/>
    </ant-form-item>
    <ant-form-item>
      <m-button
        :size="'large'"
        class="login-form-button"
        :title="'找回密码'"
        @click="resetPassword"></m-button>
    </ant-form-item>
  </ant-form>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { Form as AntForm, Input as AntInput, message } from 'ant-design-vue';
import { MButton } from '@/metagraph-ui';
import EndTime from '@/views/settings/end-time.vue';
import { UserNoAuthApiService } from '@/api-service';

const AntFormItem = AntForm.Item;
const AntInputPassword = AntInput.Password;

const forgetFormRef = ref();
const forgetFormState = ref({
  email: '',
  verifyCode: '',
  password: '',
  confirmPassword: ''
});

const registerRules = {
  email: {
    required: true,
    message: '请输入邮箱！',
  },
  verifyCode: {
    required: true,
    message: '请输入验证码！',
  },
  password: [
    {
      required: true,
      trigger: 'change',
      validator(rule: any, value: string): Promise<void> {
        return new Promise((resolve, reject) => {
          if(!value) {
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
      trigger: 'change',
      validator(rule: any, value: string): Promise<void> {
        return new Promise((resolve, reject) => {
          if(!value) {
            reject('请输入密码');
          }
          if(value !== forgetFormState.value.password) {
            reject('两次输入密码不一致');
          }
          resolve();
        });
      }
    },
  ],
};

function resetPassword() {
  forgetFormRef.value.validate().then(async() => {
    console.log(forgetFormState.value);
    const result = await UserNoAuthApiService.resetPasswordByEmail({
      email: forgetFormState.value.email,
      verifyCode: forgetFormState.value.verifyCode,
      password: forgetFormState.value.password
    });
    if (result.code === 0) {
      message.success('修改密码成功！');
    }
  });
}

const wrapperCol = ref({ span: 24 });

const endTime = ref(new Date().getTime());
const isEnding = ref(false);

async function handleGetCode() {
  forgetFormRef.value.validate('email').then(async() => {
    endTime.value = new Date().getTime() + 60000;
    localStorage.setItem('emailEndTime', endTime.value.toString());
    isEnding.value = true;

    const result = await UserNoAuthApiService.sendRegisterEmailCode({
      email: forgetFormState.value.email,
      type: 'forget'
    });
    if(result.code === 0) {
      message.success('邮件发送成功！');
    }
    if(result.message) {
      message.error('邮件发送失败！');
    }
  });
}

onMounted(() => {
  const emailEndTime = localStorage.getItem('emailEndTime');
  if(emailEndTime) {
    isEnding.value = true;
    endTime.value = Number(emailEndTime);
  }
});

</script>

<style scoped lang="scss">
@import "../../style/common.scss";

#login-by-email-form {
  width: 296px;
  margin: 0 auto;

  &::v-deep(.ant-form-item) {
    margin-bottom: 12px;
  }

  &::v-deep(.ant-form-item-explain-error) {
    text-align: left;
    height: 18px;
    min-height: 18px;
    font-size: 12px;
    line-height: 18px;
  }

  &::v-deep(.ant-form-item-control-input-content) {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &::v-deep(.ant-input-affix-wrapper) {
    &:hover {
      border-color: $themeColor;
    }
  }

  &::v-deep(.ant-form-item-has-error .ant-input-affix-wrapper) {
    &:hover {
      border-color: #ff4d4f;
    }
  }

  &::v-deep(.ant-input-affix-wrapper-focused) {
    box-shadow: none;
    border-color: $themeColor;
  }

  &::v-deep(.ant-form-item-has-error .ant-input-affix-wrapper-focused) {
    box-shadow: none;
    border-color: #ff4d4f;
  }

  .login-form-button {
    width: 100%;
    margin-bottom: 10px;
    background: $themeColor;
    color: #FFF;
    font-size: 14px;
  }

  .ant-input {
    background: #FFFFFF;

    &:hover {
      border-color: $themeColor;
    }

    &:focus {
      border-color: $themeColor;
      box-shadow: none;
    }

    &:-webkit-autofill {
      -webkit-box-shadow: inset 0 0 0 1000px #fff;
      background-color: transparent;
    }

    &:autofill {
      -webkit-box-shadow: inset 0 0 0 1000px #fff;
      background-color: transparent;
    }
  }

  .ant-form-item-has-error .ant-input {
    background: #FFFFFF;

    &:hover {
      border-color: #ff4d4f;
    }

    &:focus {
      border-color: #ff4d4f;
      box-shadow: none;
    }
  }
}

.custom-input-style {
  height: 40px;
  border-radius: 6px;

  ::v-deep(.ant-input) {
    background: #FFFFFF !important;
    -webkit-box-shadow: 0 0 0 1000px #ffffff inset;
  }
}

.send-code {
  display: flex;
  align-items: center;
  color: $themeColor;
  cursor: pointer;
  padding-left: 4px;
  height: 40px;
  line-height: 40px;
}
</style>
