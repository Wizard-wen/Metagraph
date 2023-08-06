<template>
  <ant-form
    id="login-by-email-form"
    ref="formRef"
    :model="emailFormState"
    :rules="emailRules"
    :wrapper-col="wrapperCol">
    <ant-form-item name="email">
      <ant-input
        class="custom-input-style"
        autocomplete="off"
        v-model:value="emailFormState.email"
        placeholder="请输入邮箱">
      </ant-input>
    </ant-form-item>
    <ant-form-item name="verifyCode">
      <ant-input
        class="custom-input-style"
        v-model:value="emailFormState.verifyCode"
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
    <ant-form-item>
      <m-button
        :size="'large'"
        class="login-form-button"
        :title="'登录'"
        @click="login"></m-button>
    </ant-form-item>
  </ant-form>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { Form as AntForm, Input as AntInput, message } from 'ant-design-vue';
import { MButton } from '@/metagraph-ui';
import EndTime from '@/views/settings/end-time.vue';
import { UserNoAuthApiService } from '@/api-service';
import { RouterUtil } from '@/utils/router.util';
import { MutationEnum, useStore } from '@/store';

const AntFormItem = AntForm.Item;
const store = useStore();
const formRef = ref();

const wrapperCol = ref({ span: 24 });

const endTime = ref(new Date().getTime());
const isEnding = ref(false);

const emailFormState = ref({
  email: '',
  verifyCode: ''
});

const emailRules = {
  email: {
    trigger: ['blur', 'change'],
    required: true,
    validator(rule: any, value: string): Promise<void> {
      return new Promise((resolve, reject) => {
        if (!value) {
          reject('请输入邮箱');
        }
        const regExp = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/i;
        if (!regExp.test(value)) {
          reject('邮箱格式不正确');
        }
        resolve();
      });
    }
  },
  verifyCode: {
    required: true,
    message: '请输入验证码！',
  },
};

function login() {
  formRef.value.validate().then(async () => {
    const result = await UserNoAuthApiService.loginByEmail({
      email: emailFormState.value.email,
      verifyCode: emailFormState.value.verifyCode
    });
    if (result.code === 0) {
      message.success('登录成功！');
    }
    if (result.data) {
      store.commit(MutationEnum.SET_USER_MODEL, { userModel: result.data });
      await RouterUtil.jumpTo('/');
    } else {
      message.error(result?.message || '登录时出现问题！');
    }
  }).catch(() => {

  });
}

async function handleGetCode() {
  formRef.value.validate('email').then(async () => {
    const result = await UserNoAuthApiService.sendRegisterEmailCode({
      email: emailFormState.value.email,
      type: 'login'
    });
    if (result.code === 0) {
      message.success('邮件发送成功！');
      endTime.value = new Date().getTime() + 60000;
      localStorage.setItem('loginEmailEndTime', endTime.value.toString());
      isEnding.value = true;
    }
    if (result.message) {
      message.error(result.message || '邮件发送失败！');
    }
  });
}

onMounted(() => {
  const loginEmailEndTime = localStorage.getItem('loginEmailEndTime');
  if (loginEmailEndTime) {
    isEnding.value = true;
    endTime.value = Number(loginEmailEndTime);
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

  &::v-deep(.ant-form-item-control-input-content) {
    display: flex;
    align-items: center;
    gap: 4px;
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
