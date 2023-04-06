<template>
  <ant-form
    id="login-by-user-name-form"
    ref="formRef"
    :model="formState"
    :rules="rules"
    :wrapper-col="wrapperCol">
    <ant-form-item name="name">
      <ant-input
        class="custom-input-style"
        autocomplete="off"
        v-model:value="formState.name"
        placeholder="请输入用户名">
      </ant-input>
    </ant-form-item>
    <ant-form-item name="password">
      <ant-input
        class="custom-input-style"
        v-model:value="formState.password"
        type="password" placeholder="请输入密码"
        autocomplete="off">
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
import { ref } from 'vue';
import { Form as AntForm, Input as AntInput, message } from 'ant-design-vue';
import { MButton } from '@/metagraph-ui';
import { UserNoAuthApiService } from '@/api-service';
import { MutationEnum, useStore } from '@/store';
import { RouterUtil } from '@/utils/router.util';

const AntFormItem = AntForm.Item;
const store = useStore();

const formRef = ref();
const wrapperCol = ref({ span: 24 });
const formState = ref<{
  name: string;
  password: string;
}>({
  name: '',
  password: '',
});

const rules = {
  name: {
    required: true,
    message: '请输入用户名！',
  },
  password: {
    required: true,
    message: '请输入密码！',
  },
};

function login() {
  formRef.value.validate()
    .then(async () => {
      const response = await UserNoAuthApiService.login({
        name: formState.value.name,
        password: formState.value.password
      });
      if (response.data) {
        store.commit(MutationEnum.SET_USER_MODEL, { userModel: response.data });
        await RouterUtil.jumpTo('/');
      } else {
        message.error(response?.message || '登录时出现问题！');
      }
    })
    .catch((error: Error) => {
      message.error(error.message);
    });
}

</script>

<style scoped lang="scss">
@import "../../style/common.scss";

#login-by-user-name-form {
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
    background-color: #FFFFFF!important;
    height: 40px;
    border-radius: 6px;

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

  .custom-input-style {
    height: 40px;
    border-radius: 6px;

    ::v-deep(.ant-input) {
      background: #FFFFFF !important;
      -webkit-box-shadow: 0 0 0 1000px #ffffff inset;
    }
  }
}

</style>
