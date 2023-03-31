<template>
  <div class="log-in">
    <div class="logo">
      <div class="logo-image"></div>
    </div>
    <div class="login-form">
      <div class="login-form-header">
        <h1>Sign in to GitHub</h1>
      </div>
      <div class="login-form-body">
        <form>
          <label class="label" for="user_name">用户名或邮箱</label>
          <input type="text" name="user_name" id="user_name"
                 class="form-control input-block"
                 autocapitalize="off"
                 autocorrect="off"
                 autocomplete="username"
                 autofocus="autofocus">
          <div class="position-relative">
            <label class="label" for="password">Password</label>
            <input id="password" type="password" name="password"
                   class="form-control input-block"
                   autocomplete="current-password">
            <router-link to="#"
                         class="forget-password position-absolute">忘记密码?
            </router-link>
            <input type="submit" value="Sign in" name="commit" class="submit-btn">
          </div>
        </form>
      </div>
      <p class="login-callout">
        New to Github?
        <router-link to="#" class="">Create an account</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'login-in',
});
</script>

<style scoped lang="scss">
@import "../style/common";

.log-in {
  .logo {
    padding: 32px 0 24px 0;
    height: 106px;
    width: 100%;

    .logo-image {
      height: 50px;
      width: 50px;
      margin: 0 auto;
      background: $fontColor;
      border-radius: 50%;
    }
  }

  .login-form {
    width: 340px;
    margin: 0 auto;
    padding: 0 16px;

    .login-form-header {
      margin-bottom: 15px;
      color: $fontColor;
      text-align: center;
      text-shadow: none;
      background-color: initial;
      border: 0;
      border-radius: 6px 6px 0 0;

      h1 {
        font-size: 24px;
        font-weight: 300;
      }
    }

    .login-form-body {
      border: 1px solid #eaecef;
      border-radius: 6px;
      padding: 20px;
      font-size: 14px;
      background: #f6f8fa;

      .label {
        display: block;
        margin-bottom: 7px;
        font-weight: 400;
        text-align: left;
        color: $fontColor;
        font-size: 14px;
      }

      .form-control {
        margin-top: 5px;
        margin-bottom: 15px;
        display: block;
        width: 100%;
        padding: 5px 12px;
        font-size: 14px;
        line-height: 20px;
        color: $fontColor;
        background: #fff;
        border-radius: 6px;
        border: 1px solid #e1e4e8;
      }

      .submit-btn {
        width: 100%;
        margin-top: 20px;
        display: block;
        text-align: center;
        color: #fff;
        background: #2ea44f;
        padding: 5px 16px;
        font-weight: 500;
        line-height: 20px;
        cursor: pointer;
        border-radius: 6px;
        border: 1px solid;
      }

      .forget-password {
        right: 0;
        top: 0;
        font-size: 12px;
        color: #0366d6;
      }
    }
    .login-callout {
      padding: 15px 20px;
      text-align: center;
      border: 1px solid #d1d5da ;
      border-radius: 6px;
      margin-top: 16px;
      margin-bottom: 10px;
    }
  }
}
</style>
