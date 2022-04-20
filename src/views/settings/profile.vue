<template>
  <setting-header :title="'用户信息'"></setting-header>
  <ant-form
    ref="userProfileFormRef"
    layout="vertical"
    :rules="userProfileFormRules"
    :model="userProfileFormState"
    :label-col="labelCol" :wrapper-col="wrapperCol">
    <ant-form-item
      label="用户名" class="ant-form-item-style custom-input-style" name="name">
      <ant-input v-model:value="userProfileFormState.name"/>
    </ant-form-item>
    <ant-form-item
      label="头像" ref="formIconRef" class="ant-form-item-style" name="avatar">
      <upload-form-item
        :title="'上传头像'"
        :image-type="'avatar'"
        v-model="userProfileFormState.avatar"></upload-form-item>
    </ant-form-item>
    <ant-form-item
      label="账号类型" class="ant-form-item-style" ref="type" name="type">
      <ant-radio-group v-model:value="userProfileFormState.type" disabled>
        <ant-radio value="personal">个人</ant-radio>
        <ant-radio disabled value="organization">企业</ant-radio>
      </ant-radio-group>
    </ant-form-item>
    <ant-form-item
      ref="phone" label="手机号"
      class="ant-form-item-style custom-input-style" name="phone">
      <ant-input v-model:value="userProfileFormState.phone"/>
    </ant-form-item>
    <ant-form-item
      ref="email" label="邮箱"
      class="ant-form-item-style custom-input-style" name="email">
      <ant-input v-model:value="userProfileFormState.email"/>
    </ant-form-item>
    <ant-form-item
      ref="wechat" label="微信号"
      class="ant-form-item-style custom-input-style" name="wechat">
      <ant-input v-model:value="userProfileFormState.wechat"/>
    </ant-form-item>
    <ant-form-item
      ref="company" label="公司"
      class="ant-form-item-style custom-input-style" name="company">
      <ant-input v-model:value="userProfileFormState.company"/>
    </ant-form-item>
    <ant-form-item
      ref="personalWebsite" label="个人网站"
      class="ant-form-item-style" name="personalWebsite">
      <ant-input v-model:value="userProfileFormState.personalWebsite"/>
    </ant-form-item>
    <ant-form-item ref="location" label="所在地区" class="ant-form-item-style" name="location">
      <ant-input v-model:value="userProfileFormState.location"/>
    </ant-form-item>
    <ant-form-item :wrapper-col="{ span: 4 }" style="margin-top: 50px">
      <ant-button type="primary" @click="onSubmit">更新用户信息</ant-button>
    </ant-form-item>
  </ant-form>
</template>

<script lang="ts">
import {
  Button, Form, Input, message, Radio
} from 'ant-design-vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import {
  defineComponent, ref, toRaw
} from 'vue';
import { customFormRules } from '@/views/settings/custom.form.rules';
import UploadFormItem from '@/components/upload/upload-form-item.vue';
import { useStore } from '@/store';
import { UserApiService } from '@/api.service';
import SettingHeader from './setting.header.vue';
import { userProfileFormState, UserProfileFormStateType } from './settings';

export default defineComponent({
  name: 'Profile',
  components: {
    UploadFormItem,
    SettingHeader,
    AntForm: Form,
    AntFormItem: Form.Item,
    AntButton: Button,
    AntRadio: Radio,
    AntRadioGroup: Radio.Group,
    AntInput: Input
  },
  setup() {
    const store = useStore();
    const userProfileFormRef = ref();
    const userProfileFormRules = {
      name: customFormRules.name,
      phone: customFormRules.phone,
      email: customFormRules.email
    };
    const formIconRef = ref();
    const onSubmit = () => {
      userProfileFormRef.value
        .validate()
        .then(() => {
          const userId = store.state.user.user?.id;
          if (!userId) {
            return;
          }
          UserApiService.updateUser({
            ...toRaw(userProfileFormState),
            userId
          })
            .then((data) => {
              if (data.data) {
                message.success('修改成功！');
              }
              if (data.message) {
                message.error('修改信息时出现问题！');
              }
            });
        })
        .catch((error: ValidateErrorEntity<UserProfileFormStateType>) => {
          message.error('修改信息时出现问题！');
        });
    };
    return {
      labelCol: { style: { width: '150px' } },
      wrapperCol: { span: 24 },
      userProfileFormState,
      userProfileFormRef,
      userProfileFormRules,
      onSubmit,
      formIconRef
    };
  }
});
</script>

<style scoped lang="scss">
@import "../../style/common.scss";

.ant-form-item-style {
  margin-bottom: 10px;
}
</style>
