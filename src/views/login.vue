<template>
  <div class="login-page">
    <div class="logo-left" @click="goHomePage">
      <img src="@/assets/logo-header.png" height="50" alt="">
    </div>
    <div class="logo-bg">
      <img src="@/assets/logo-bg.png" alt="">
    </div>
    <div class="login-box">
      <div class="login-content" v-if="loginType === 'email'">
        <div class="project-name">邮箱登录</div>
<!--        <ant-form-->
<!--          id="components-form-demo-normal-login"-->
<!--          ref="formRef"-->
<!--          :model="emailFormState"-->
<!--          :rules="emailRules"-->
<!--          :wrapper-col="wrapperCol">-->
<!--          <ant-form-item name="name">-->
<!--            <ant-input-->
<!--              class="custom-input-style"-->
<!--              autocomplete="off"-->
<!--              v-model:value="emailFormState.email"-->
<!--              placeholder="请输入邮箱">-->
<!--            </ant-input>-->
<!--          </ant-form-item>-->
<!--          <ant-form-item name="password">-->
<!--            <ant-input-->
<!--              class="custom-input-style"-->
<!--              v-model:value="emailFormState.verifyCode"-->
<!--              placeholder="请输入验证码"-->
<!--              autocomplete="off">-->
<!--              <template #suffix>-->
<!--                <div class="send-code">获取</div>-->
<!--              </template>-->
<!--            </ant-input>-->
<!--          </ant-form-item>-->
<!--          <ant-form-item>-->
<!--            <m-button :size="'large'" class="login-form-button" :title="'登 录'"-->
<!--                      @click="login"></m-button>-->
<!--          </ant-form-item>-->
<!--        </ant-form>-->
        <login-by-email></login-by-email>
        <div class="check-way" @click="loginType = 'username'">账户登录</div>
        <div class="register-way">
          还没有账号？
          <div class="register">注册</div>
        </div>
        <div class="forget">忘记密码</div>
      </div>

      <div class="login-content" v-else>
        <div class="project-name">账户登录</div>
        <ant-form
          id="components-form-demo-normal-login"
          ref="formRef"
          :model="formState"
          :rules="rules"
          :wrapper-col="wrapperCol">
          <ant-form-item name="name">
            <ant-input
              class="custom-input-style"
              autocomplete="off"
              v-model:value="formState.name" placeholder="请输入用户名"
              allow-clear>
            </ant-input>
          </ant-form-item>
          <ant-form-item name="password">
            <ant-input
              class="custom-input-style"
              v-model:value="formState.password"
              type="password" placeholder="请输入密码"
              autocomplete="off"
              allow-clear>
            </ant-input>
          </ant-form-item>
          <ant-form-item>
            <m-button :size="'large'" class="login-form-button" :title="'登 录'"
                      @click="login"></m-button>
          </ant-form-item>
        </ant-form>
        <div class="check-way" @click="loginType = 'email'">邮箱登录</div>
        <div class="register-way">
          还没有账号？
          <div class="register">注册</div>
        </div>
        <div class="forget">忘记密码</div>
      </div>

    </div>
  </div>
</template>
<script lang="ts" setup>
import { Button as AntButton, Form as AntForm, Input as AntInput, message } from 'ant-design-vue';
import {
  reactive, ref,
} from 'vue';
import { useRouter } from 'vue-router';
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue';
import { useStore, MutationEnum } from '@/store';
import { UserNoAuthApiService } from '@/api-service';
import { MButton } from '@/metagraph-ui';
import LoginByEmail from '@/views/login/login-by-email.vue';

const AntFormItem = AntForm.Item;

const labelCol = ref({ span: 0 });
const wrapperCol = ref({ span: 24 });
const loginType = ref('email');
const formRef = ref();
const store = useStore();
const router = useRouter();
const formState = reactive<{
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

const login = () => {
  formRef.value
    .validate()
    .then(async () => {
      const response = await UserNoAuthApiService.login({
        name: formState.name,
        password: formState.password
      });
      if (response.data) {
        store.commit(MutationEnum.SET_USER_MODEL, { userModel: response.data });
        router.push('/').then();
      } else {
        message.error(response?.message || '登录时出现问题！');
      }
    })
    .catch((error: Error) => {
      message.error(error.message);
    });
};
const resetForm = () => {
  formRef.value.resetFields();
};

const register = async () => {
  router.push('/signup').then();
};

const goHomePage = async () => {
  router.replace({
    path: '/',
    force: true
  }).then();
};
</script>
<style lang="scss" scoped>
@import '../style/common.scss';

.login-page {
  height: 100vh;
  width: 100%;
  background: $backgroundColor;

  .logo-left {
    position: fixed;
    left: 32px;
    top: 32px;
    cursor: pointer;
  }

  .logo-bg {
    display: flex;
    align-items: center;
    width: calc(100% - 460px);
    height: 100%;
    justify-content: center;

    img {
      display: block;
      width: 80%;
      margin-top: -60px;

    }
  }

  .login-box {
    background: #FFF;
    width: 360px;
    border: 1px solid rgba(19, 18, 43, 0.07);
    border-radius: 10px;
    position: fixed;
    right: 100px;
    top: calc(50% - 200px);
    box-shadow: 0 4px 24px rgba(128, 128, 128, 0.1);

    .login-content {
      width: 296px;
      margin: 0 auto;
      padding: 32px 0 16px;
    }

    .login-image {
      height: 300px;
      width: 300px;
      margin: 20px auto 5px;
    }

    .project-name {
      width: 100%;
      font-size: 20px;
      margin-bottom: 24px;
      text-align: left;
    }

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
      color: $themeColor;
      cursor: pointer;
      padding-left: 4px;
      height: 40px;
      line-height: 40px;
    }

    .check-way {
      color: $themeColor;
      margin-bottom: 12px;
      cursor: pointer;
    }

    .register-way {
      display: flex;
      justify-content: center;

      .register {
        color: $themeColor;
        cursor: pointer;
      }
    }

    .forget {
      margin: 0 auto;
      width: max-content;
      margin-top: 28px;
      cursor: pointer;
      color: #8b8c8f;

      &:hover {
        color: #000;
      }
    }
  }
}

html {

}

</style>
