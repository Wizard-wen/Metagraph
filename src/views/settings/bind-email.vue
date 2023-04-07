<template>
  <setting-header :title="'绑定邮箱'"></setting-header>
  <div v-if="bindEmailObject.isBind">当前绑定邮箱：{{ bindEmailObject.email }}</div>
  <ant-form
    class="bind-email-form"
    v-if="!bindEmailObject.isBind"
    ref="bindEmailFormRef"
    layout="vertical"
    :rules="bindEmailRules"
    :model="bindEmailForm"
    :label-col="labelCol" :wrapper-col="wrapperCol">
    <ant-form-item label="邮箱" name="email">
      <ant-input
        class="custom-input-style"
        placeholder="请输入邮箱地址"
        v-model:value="bindEmailForm.email">
        <template #suffix>
          <div class="send-code">
            <div v-if="!isEnding" @click="sendEmail('bindEmail')">获取</div>
            <end-time v-else @timeEnd="isEnding = false;" :endTime="endTime"></end-time>
          </div>
        </template>
      </ant-input>
    </ant-form-item>
    <!--    <div style="display: flex;gap: 20px;justify-content: flex-start; margin-bottom: 20px;">-->
    <!--      <ant-button @click="sendEmail('bindEmail')" :disabled="isEnding || !isEmailValid">-->
    <!--        <span v-if="!isEnding">发送验证码</span>-->
    <!--        <end-time v-else @timeEnd="isEnding = false;" :endTime="endTime"></end-time>-->
    <!--      </ant-button>-->
    <!--    </div>-->
    <ant-form-item label="验证码" name="code">
      <ant-input
        placeholder="请输入验证码"
        class="custom-input-style"
        v-model:value="bindEmailForm.code"/>
    </ant-form-item>
    <ant-form-item :wrapper-col="{ span: 4 }">
      <ant-button type="primary" @click="bindEmail">绑定邮箱</ant-button>
    </ant-form-item>
  </ant-form>
  <ant-form
    v-if="bindEmailObject.isBind"
    ref="unbindEmailFormRef"
    class="bind-email-form"
    layout="vertical"
    :rules="unbindEmailRules"
    :model="unbindEmailForm"
    :label-col="labelCol" :wrapper-col="wrapperCol">
    <ant-form-item
      label="验证码" name="code">
      <ant-input class="custom-input-style" v-model:value="unbindEmailForm.code">
        <template #suffix>
          <div class="send-code">
            <div v-if="!isEnding" @click="sendEmail('unbindEmail')">获取</div>
            <end-time v-else @timeEnd="isEnding = false;" :endTime="endTime"></end-time>
          </div>
        </template>
      </ant-input>
    </ant-form-item>
    <!--    <div style="display: flex;gap: 20px;justify-content: flex-start; margin-bottom: 20px;">-->
    <!--      <ant-button @click="sendEmail('unbindEmail')" :disabled="isEnding">-->
    <!--        <span v-if="!isEnding">发送验证码</span>-->
    <!--        <end-time v-else @timeEnd="isEnding = false;" :endTime="endTime"></end-time>-->
    <!--      </ant-button>-->
    <!--    </div>-->
    <ant-form-item :wrapper-col="{ span: 4 }">
      <ant-button type="primary" @click="unbindEmail">解绑邮箱</ant-button>
    </ant-form-item>
  </ant-form>
</template>

<script lang="ts">
import { Button, Form, Input, message } from 'ant-design-vue';
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { UserApiService } from '@/api-service';
import EndTime from '@/views/settings/end-time.vue';
import { bindEmailObject, Settings } from './settings';
import SettingHeader from './setting.header.vue';

export default defineComponent({
  name: 'bind-email',
  components: {
    EndTime,
    SettingHeader,
    AntForm: Form,
    AntFormItem: Form.Item,
    AntButton: Button,
    AntInput: Input
  },
  setup() {
    const endTime = ref(new Date().getTime());
    const isEnding = ref(false);
    const isEmailValid = ref(false);
    const bindEmailFormRef = ref();
    const bindEmailForm = reactive<{
      email: string;
      code: string;
    }>({
      email: '',
      code: ''
    });
    const unbindEmailFormRef = ref();
    const unbindEmailForm = reactive<{
      code: string;
    }>({
      code: ''
    });

    const bindEmailRules = {
      email: [
        {
          trigger: 'blur',
          required: true,
          validator(rule: any, value: string): Promise<void> {
            console.log(value);
            return new Promise((resolve, reject) => {
              if (!value) {
                isEmailValid.value = false;
                reject('请输入邮箱');
              }
              const regExp = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/i;
              if (!regExp.test(value)) {
                isEmailValid.value = false;
                reject('邮箱格式不正确');
              } else {
                console.log('zhixing');
                isEmailValid.value = true;
                resolve();
              }
            });
          }
        },
      ],
      code: [
        {
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }
      ]
    };

    const unbindEmailRules = {
      code: [
        {
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }
      ]
    };

    async function sendEmail(type: 'bindEmail' | 'unbindEmail') {
      if (type === 'bindEmail') {
        await bindEmailFormRef.value.validate('email');
      } else {
        await unbindEmailFormRef.value.validate('email');
      }
      endTime.value = new Date().getTime() + 60000;
      localStorage.setItem('emailEndTime', endTime.value.toString());
      isEnding.value = true;
      let email;
      if (type === 'bindEmail') {
        email = bindEmailForm.email;
      } else {
        email = bindEmailObject.email;
      }
      const result = await UserApiService.sendBindEmail({
        email,
        type
      });
      if (result.code === 0) {
        message.success('邮件发送成功！');
      }
      if (result.message) {
        message.error('邮件发送失败！');
      }
    }

    const settings = new Settings();

    async function bindEmail() {
      bindEmailFormRef.value
        .validate()
        .then(() => {
          UserApiService.bindEmail({
            email: bindEmailForm.email,
            code: bindEmailForm.code
          })
            .then((result) => {
              if (result.code === 0) {
                message.success('邮箱绑定成功！');
                endTime.value = new Date().getTime();
                localStorage.setItem('emailEndTime', '');
                settings.getUserBindEmail()
                  .then();
              }
              if (result.message) {
                message.error('邮箱绑定失败！');
              }
            });
        });
    }

    async function unbindEmail() {
      unbindEmailFormRef.value
        .validate()
        .then(() => {
          UserApiService.unbindEmail({
            email: bindEmailObject.email,
            code: unbindEmailForm.code
          })
            .then((result) => {
              if (result.code === 0) {
                message.success('邮箱解绑成功！');
                endTime.value = new Date().getTime();
                localStorage.setItem('emailEndTime', '');
                settings.getUserBindEmail()
                  .then();
              }
              if (result.message) {
                message.error('邮箱解绑失败！');
              }
            });
        });
    }

    onMounted(async () => {
      const emailEndTime = localStorage.getItem('emailEndTime');
      if (emailEndTime) {
        isEnding.value = true;
        endTime.value = Number(emailEndTime);
      }
      await settings.getUserBindEmail();
    });

    return {
      endTime,
      isEnding,
      sendEmail,
      bindEmailForm,
      bindEmailRules,
      bindEmailFormRef,
      unbindEmailFormRef,
      unbindEmailForm,
      isEmailValid,
      labelCol: { style: { width: '150px' } },
      wrapperCol: { span: 24 },
      bindEmail,
      bindEmailObject,
      unbindEmailRules,
      unbindEmail
    };
  }
});
</script>

<style scoped lang="scss">
@import "../../style/common.scss";

.ant-form-item-style {
  display: flex;
  gap: 20px;
}

.bind-email-form {
  @include custom-input-style-mixin;
}

.send-code {
  display: flex;
  align-items: center;
  color: $themeColor;
  cursor: pointer;
  padding-left: 4px;
  //height: 40px;
  //line-height: 40px;
}
</style>
