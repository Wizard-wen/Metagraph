<template>
  <setting-header :title="'用户信息'"></setting-header>
  <ant-form
    ref="userProfileFormRef"
    layout="vertical"
    :rules="userProfileFormRules"
    :model="userProfileFormState"
    :label-col="labelCol" :wrapper-col="wrapperCol">
    <ant-form-item label="用户名" class="ant-form-item-style" name="name">
      <ant-input v-model:value="userProfileFormState.name"/>
    </ant-form-item>
    <ant-form-item label="头像" ref="formIconRef" name="avatar">
      <upload-qiniu
        v-model="userProfileFormState.avatar"
        @update:modelValue="handleIconChange"></upload-qiniu>
    </ant-form-item>
    <ant-form-item label="账号类型" ref="type" name="type">
      <ant-radio-group v-model:value="userProfileFormState.type">
        <ant-radio value="personal">个人</ant-radio>
        <ant-radio value="organization">企业</ant-radio>
      </ant-radio-group>
    </ant-form-item>
    <ant-form-item ref="phone" label="手机号" name="phone">
      <ant-input v-model:value="userProfileFormState.phone"/>
    </ant-form-item>
    <ant-form-item ref="email" label="邮箱" name="email">
      <ant-input v-model:value="userProfileFormState.email"/>
    </ant-form-item>
    <ant-form-item ref="wechat" label="微信号" name="email">
      <ant-input v-model:value="userProfileFormState.wechat"/>
    </ant-form-item>
    <ant-form-item ref="company" label="公司" name="email">
      <ant-input v-model:value="userProfileFormState.company"/>
    </ant-form-item>
    <ant-form-item ref="email" label="邮箱" name="email">
      <ant-input v-model:value="userProfileFormState.email"/>
    </ant-form-item>
    <ant-form-item ref="location" label="所在地区" name="location">
      <ant-input v-model:value="userProfileFormState.location"/>
    </ant-form-item>
    <ant-form-item :wrapper-col="{ span: 4 }">
      <ant-button type="primary">更新用户信息</ant-button>
    </ant-form-item>
  </ant-form>
</template>

<script lang="ts">
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import {
  defineComponent, onMounted, reactive, ref, toRaw, UnwrapRef
} from 'vue';
import { UserApiService } from '@/api.service';
import SettingHeader from './setting.header.vue';
import UploadQiniu from '@/components/upload/upload.qiniu.vue';

interface UserProfileFormStateType {
  name: string;
  avatar: string;
  type: 'personal' | 'organization';
  phone?: string;
  email: string;
  wechat?: string;
  company?: string;
  personalWebsite?: string;
  location?: string;
}

export default defineComponent({
  name: 'Profile',
  components: {
    SettingHeader,
    UploadQiniu
  },
  setup() {
    const userProfileFormState: UnwrapRef<UserProfileFormStateType> = reactive({
      name: '',
      avatar: '',
      type: 'personal',
      phone: '',
      email: '',
      wechat: '',
      company: '',
      personalWebsite: '',
      // 所在地区
      location: ''
    });
    const userProfileFormRef = ref();
    const userProfileFormRules = {
      name: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        {
          min: 3, max: 15, message: '用户名应当在3-15个字符', trigger: 'blur'
        }
      ]
    };
    const formIconRef = ref();
    const handleIconChange = (event: any) => {
      userProfileFormState.avatar = event;
      // 触发图片表单验证
      formIconRef.value.onFieldChange();
    };
    const onSubmit = () => {
      userProfileFormRef.value
        .validate()
        .then(() => {
          console.log('values', userProfileFormState, toRaw(userProfileFormState));
        })
        .catch((error: ValidateErrorEntity<UserProfileFormStateType>) => {
          console.log('error', error);
        });
    };
    onMounted(async () => {
      const result = await UserApiService.getById();
      console.log(result);
      if (result.data) {
        userProfileFormState.name = result.data.name;
        userProfileFormState.avatar = result.data.avatar || '';
        userProfileFormState.type = result.data.type;
        userProfileFormState.phone = result.data.phone || '';
        userProfileFormState.email = result.data.email || '';
      }
    });
    return {
      labelCol: { style: { width: '150px' } },
      wrapperCol: { span: 24 },
      userProfileFormState,
      userProfileFormRef,
      userProfileFormRules,
      onSubmit,
      handleIconChange,
      formIconRef
    };
  }
});
</script>

<style scoped lang="scss">
.ant-form-item-style {
  margin-bottom: 0px;
}
</style>
