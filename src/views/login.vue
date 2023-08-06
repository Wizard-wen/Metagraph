<template>
  <div class="login-page">
    <div class="logo-left" @click="goHomePage">
      <img src="@/assets/logo-header.png" height="50" alt="">
    </div>
    <div class="logo-bg">
      <img src="@/assets/logo-bg.png" alt="">
    </div>
    <div class="login-box" v-if="type === 'register'">
      <div class="login-content">
        <div class="login-title">邮箱注册</div>
        <register-by-email @change-status="handleRegisterSuccess"></register-by-email>
        <div class="register-way">
          已有账号？
          <div class="register" @click="checkType('login')">登录</div>
        </div>
      </div>
    </div>
    <div class="login-box" v-else-if="type === 'forget'">
      <div class="login-content">
        <div class="login-title">
          <m-button
            class="operation"
            @click="checkType('login')"
            :has-border="false"
            :is-icon="true">
            <template #icon>
              <LeftOutlined/>
            </template>
          </m-button>
          忘记密码
        </div>
        <forget-password></forget-password>
      </div>
    </div>
    <div class="login-box" v-else>
      <div class="login-content">
        <template v-if="loginType === 'email'">
          <div class="login-title">邮箱登录</div>
          <login-by-email></login-by-email>
          <div class="check-way" @click="loginType = 'username'">账户登录</div>
        </template>
        <template v-else>
          <div class="login-title">用户名登录</div>
          <login-by-user-name></login-by-user-name>
          <div class="check-way" @click="loginType = 'email'">邮箱登录</div>
        </template>
        <div class="register-way">
          还没有账号？
          <div class="register" @click="checkType('register')">注册</div>
        </div>
        <div
          v-if="loginType === 'username'"
          class="forget-btn"
          @click="checkType('forget')">忘记密码
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, } from 'vue';
import LoginByEmail from '@/views/login/login-by-email.vue';
import LoginByUserName from '@/views/login/login-by-user-name.vue';
import { RouterUtil } from '@/utils/router.util';
import RegisterByEmail from '@/views/sign-up/register-by-email.vue';
import { MButton } from '@/metagraph-ui';
import { LeftOutlined } from '@ant-design/icons-vue';
import ForgetPassword from '@/views/login/forget-password.vue';

const type = ref<'login' | 'register' | 'forget'>('login');

function checkType(params: 'login' | 'register' | 'forget') {
  type.value = params;
}

const loginType = ref('email');

function handleRegisterSuccess() {
  checkType('login');
}

async function goHomePage() {
  await RouterUtil.replaceTo('/');
}
</script>
<style lang="scss" scoped>
@import '../style/common.scss';

.login-page {
  height: 100vh;
  width: 100%;
  background: $backgroundColor;

  .logo-left {
    position: fixed;
    left: 20px;
    top: 20px;
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
      max-width: 1000px;
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

    .login-title {
      width: 100%;
      font-size: 20px;
      margin-bottom: 24px;
      text-align: left;
      display: flex;

      .operation {
        margin-left: -7px;
        margin-right: 4px
      }
    }

    .check-way {
      color: $themeColor;
      cursor: pointer;
      width: max-content;
      padding: 0 10px;
      margin: 0 auto 12px;
    }

    .register-way {
      display: flex;
      justify-content: center;

      .register {
        color: $themeColor;
        cursor: pointer;
      }
    }

    .forget-btn {
      width: max-content;
      margin: 28px auto 0;
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
