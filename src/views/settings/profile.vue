<template>
  <setting-header :title="'用户信息'"></setting-header>
  <ant-form
    class="profile-form"
    ref="userProfileFormRef"
    layout="vertical"
    :rules="userProfileFormRules"
    :model="userProfileFormState"
    :label-col="labelCol" :wrapper-col="wrapperCol">
    <ant-form-item
      label="用户名" name="name">
      <ant-input
        placeholder="请输入用户名"
        v-model:value="userProfileFormState.name"
        class="custom-input-style"/>
    </ant-form-item>
    <ant-form-item
      label="头像" ref="formIconRef" name="avatar">
      <upload-form-item
        :provider="'UserAvatar'"
        :title="'上传头像'"
        :image-type="'avatar'"
        v-model="userProfileFormState.avatar"></upload-form-item>
    </ant-form-item>
    <ant-form-item
      label="账号类型" ref="type" name="type">
      <ant-radio-group v-model:value="userProfileFormState.type" disabled>
        <ant-radio value="personal">个人</ant-radio>
        <ant-radio disabled value="organization">企业</ant-radio>
      </ant-radio-group>
    </ant-form-item>
    <ant-form-item
      ref="phone" label="手机号" name="phone">
      <ant-input
        placeholder="请输入手机号"
        class="custom-input-style"
        v-model:value="userProfileFormState.phone"/>
    </ant-form-item>
    <ant-form-item
      ref="wechat" label="微信号" name="wechat">
      <ant-input
        placeholder="请输入微信号"
        class="custom-input-style"
        v-model:value="userProfileFormState.wechat"/>
    </ant-form-item>
    <ant-form-item
      ref="company" label="公司" name="company">
      <ant-input
        placeholder="请输入公司名称"
        class="custom-input-style"
        v-model:value="userProfileFormState.company"/>
    </ant-form-item>
    <ant-form-item
      ref="personalWebsite" label="个人网站" name="personalWebsite">
      <ant-input
        placeholder="请输入个人网站地址"
        class="custom-input-style"
        v-model:value="userProfileFormState.personalWebsite"/>
    </ant-form-item>
    <ant-form-item ref="location" label="所在地区" name="location">
      <ant-input
        placeholder="请输入所在地区"
        class="custom-input-style"
        v-model:value="userProfileFormState.location"/>
    </ant-form-item>
    <ant-form-item :wrapper-col="{ span: 4 }" style="margin-top: 50px;">
      <ant-button type="primary" @click="onSubmit">更新用户信息</ant-button>
    </ant-form-item>
  </ant-form>
</template>

<script lang="ts" setup>
import {
  Button as AntButton,
  Form as AntForm,
  Input as AntInput,
  message,
  Radio as AntRadio
} from 'ant-design-vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { ref, toRaw } from 'vue';
import { customFormRules } from '@/views/settings/custom.form.rules';
import UploadFormItem from '@/components/upload/upload-form-item.vue';
import { MutationEnum, useStore } from '@/store';
import { UserApiService } from '@/api-service';
import SettingHeader from './setting.header.vue';
import { userProfileFormState, UserProfileFormStateType } from './settings';

const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 24 };

const AntFormItem = AntForm.Item;
const AntRadioGroup = AntRadio.Group;

const store = useStore();
const userProfileFormRef = ref();
const userProfileFormRules = {
  name: customFormRules.name,
  phone: customFormRules.phone
};
const formIconRef = ref();

function onSubmit() {
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
            store.commit(MutationEnum.UPDATE_USER_MODEL, { userModel: data.data });
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
}
</script>

<style scoped lang="scss">
@import "../../style/common.scss";

.profile-form {
  @include custom-input-style-mixin;
  margin-bottom: 100px;
}

</style>
