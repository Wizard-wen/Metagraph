<template>
  <ant-form
    id="components-form-demo-normal-login"
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
    <ant-form-item name="password">
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
      <m-button :size="'large'" class="login-form-button" :title="'登 录'"
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

const AntFormItem = AntForm.Item;
const formRef = ref();
const emailFormState = ref({
  email: '',
  verifyCode: ''
});

const emailRules = {
  email: {
    required: true,
    message: '请输入邮箱！',
  },
  verifyCode: {
    required: true,
    message: '请输入验证码！',
  },
};


function login() {

}

const wrapperCol = ref({ span: 24 });

const endTime = ref(new Date().getTime());
const isEnding = ref(false);

async function handleGetCode() {
  formRef.value.validate('email').then(async () => {
    endTime.value = new Date().getTime() + 60000;
    localStorage.setItem('emailEndTime', endTime.value.toString());
    isEnding.value = true;

    const result = await UserNoAuthApiService.sendRegisterEmailCode({
      email: emailFormState.value.email,
      type: 'bindEmail'
    });
    if (result.code === 0) {
      message.success('邮件发送成功！');
    }
    if (result.message) {
      message.error('邮件发送失败！');
    }
  });

}

onMounted(() => {
  const emailEndTime = localStorage.getItem('emailEndTime');
  if (emailEndTime) {
    isEnding.value = true;
    endTime.value = Number(emailEndTime);
  }
});

</script>

<style scoped lang="scss">
@import "../../style/common.scss";

#components-form-demo-normal-login {
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

  .login-form-button {
    width: 100%;
    margin-bottom: 10px;
    background: $themeColor;
    color: #FFF;
    font-size: 14px;
  }

  .ant-input {
    background: #FFFFFF;
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
