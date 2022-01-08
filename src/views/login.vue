<template>
  <div class="login-page">
    <div class="login-box">
      <div class="login-image">
        <img :src="'./hogwarts-logo.webp'" alt="" height="300" width="300">
      </div>
      <ant-form
        id="components-form-demo-normal-login"
        ref="formRef"
        :model="formState"
        :rules="rules"
        :wrapper-col="wrapperCol">
        <ant-form-item name="name">
          <ant-input class="custom-input-style" v-model:value="formState.name" placeholder="用户名">
            <template #prefix>
              <UserOutlined/>
            </template>
          </ant-input>
        </ant-form-item>
        <ant-form-item name="password">
          <ant-input class="custom-input-style" v-model:value="formState.password" type="password" placeholder="密码">
            <template #prefix>
              <LockOutlined/>
            </template>
          </ant-input>
        </ant-form-item>
        <ant-form-item>
          <ant-button class="login-form-button" type="primary" @click="login">登录</ant-button>
          <ant-button class="login-form-button" @click="register">注册</ant-button>
        </ant-form-item>
      </ant-form>
    </div>
  </div>
</template>
<script lang="ts">
import { message } from 'ant-design-vue';
import {
  defineComponent, reactive, ref,
} from 'vue';
import { useRouter } from 'vue-router';
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue';
import { useStore, MutationEnum } from '@/store';
import { UserApiService } from '@/api.service';

export default defineComponent({
  components: {
    LockOutlined,
    UserOutlined
  },
  setup() {
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
    const login = () => {
      formRef.value
        .validate()
        .then(async () => {
          const response = await UserApiService.login({
            name: formState.name,
            password: formState.password
          });
          if (response.data) {
            store.commit(MutationEnum.SET_USER_MODEL, { userModel: response.data });
            await router.push('/');
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
      await router.push('/signup');
    };
    return {
      formRef,
      labelCol: { span: 0 },
      wrapperCol: { span: 24 },
      formState,
      rules,
      login,
      resetForm,
      register
    };
  },
});
</script>
<style lang="scss" scoped>
@import '../style/common.scss';

.login-page {
  height: 100vh;
  width: 100%;
  //background: url('../assets/login-bg.webp') no-repeat center center fixed;
  //-webkit-background-size: cover;
  //-moz-background-size: cover;
  //-o-background-size: cover;
  //background-size: cover;
  background: $backgroundColor;

  .login-box {
    background: rgba(255, 255, 255, .3);
    width: 440px;
    height: 600px;
    border: 1px solid $borderColor;
    border-radius: 6px;
    position: fixed;
    left: calc(50% - 220px);
    top: calc(50% - 300px);

    .login-image {
      height: 300px;
      width: 300px;
      margin: 20px auto 42px;
    }

    #components-form-demo-normal-login {
      width: 360px;
      margin: 0 auto;

      .login-form-button {
        width: 100%;
        margin-bottom: 10px;
      }

      .ant-input {
        background: #FFFFFF;
      }
    }

    .custom-input-style {
      //background: red;

      ::v-deep(.ant-input) {
        background: #FFFFFF !important;
        -webkit-box-shadow: 0 0 0 1000px #ffffff inset;
      }
    }

  }
}

html {

}

</style>
