<template>
  <div class="login-page">
    <div class="login-box">
      <ant-form
        id="components-form-demo-normal-login"
        ref="formRef"
        :model="formState"
        :rules="rules"
        :wrapper-col="wrapperCol">
        <ant-form-item name="name">
          <ant-input v-model:value="formState.name" placeholder="name">
            <template #prefix>
              <LockOutlined/>
            </template>
          </ant-input>
        </ant-form-item>
        <ant-form-item name="password">
          <ant-input v-model:value="formState.password" placeholder="password">
            <template #prefix>
              <UserOutlined/>
            </template>
          </ant-input>
        </ant-form-item>
        <ant-form-item>
          <ant-button class="login-form-button" type="primary" @click="login">Login</ant-button>
        </ant-form-item>
      </ant-form>
    </div>
  </div>
</template>
<script lang="ts">
import { UserApiService } from '@/api.service';
import {
  defineComponent, reactive, ref, toRaw,
} from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useStore, ActionEnum, MutationEnum } from '@/store';
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    LockOutlined,
    UserOutlined
  },
  setup() {
    const formRef = ref();
    const store = useStore();
    const route = useRoute();
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
        message: 'Please input name',
      },
      password: {
        required: true,
        message: 'Please input password',
      },
    };
    const login = () => {
      formRef.value
        .validate()
        .then(async () => {
          console.log('values', formState, toRaw(formState));
          // await store.dispatch(ActionEnum.LOGIN_BY_NAME, {
          //   name: formState.name,
          //   password: formState.password
          // });
          const response = await UserApiService.login({
            name: formState.name,
            password: formState.password
          });
          if (response.data) {
            console.log(response.data);
            store.commit(MutationEnum.SET_USER_MODEL, { userModel: response.data });
            localStorage.setItem('isLogin', 'true');
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('token', response.data.token);
            await router.push('/');
          }
          // if (store.state.isLogin) {
          //   alert('login');
          // }
        })
        .catch((error: Error) => {
          console.log('error', error);
        });
    };
    const resetForm = () => {
      formRef.value.resetFields();
    };
    return {
      formRef,
      labelCol: { span: 0 },
      wrapperCol: { span: 24 },
      formState,
      rules,
      login,
      resetForm,
    };
  },
});
</script>
<style lang="scss" scoped>
.login-page {
  height: 100vh;
  width: 100%;

  .login-box {
    width: 600px;

    #components-form-demo-normal-login {
      width: 600px;
      position: fixed;
      left: calc(50% - 300px);
      top: 50%;

      .login-form-button {
        width: 100%;
      }
    }
  }
}

</style>
