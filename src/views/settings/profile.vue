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
    <ant-form-item label="头像" ref="formIconRef" class="ant-form-item-style" name="avatar">
      <upload-qiniu
        v-model="userProfileFormState.avatar"
        @update:modelValue="handleIconChange"></upload-qiniu>
    </ant-form-item>
    <ant-form-item label="账号类型" class="ant-form-item-style" ref="type" name="type">
      <ant-radio-group v-model:value="userProfileFormState.type" disabled>
        <ant-radio value="personal">个人</ant-radio>
        <ant-radio value="organization">企业</ant-radio>
      </ant-radio-group>
    </ant-form-item>
    <ant-form-item ref="phone" label="手机号" class="ant-form-item-style" name="phone">
      <ant-input v-model:value="userProfileFormState.phone"/>
    </ant-form-item>
    <ant-form-item ref="email" label="邮箱" class="ant-form-item-style" name="email">
      <ant-input v-model:value="userProfileFormState.email"/>
    </ant-form-item>
    <ant-form-item ref="wechat" label="微信号" class="ant-form-item-style" name="wechat">
      <ant-input v-model:value="userProfileFormState.wechat"/>
    </ant-form-item>
    <ant-form-item ref="company" label="公司" class="ant-form-item-style" name="company">
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
    <ant-form-item :wrapper-col="{ span: 4 }">
      <ant-button type="primary" @click="onSubmit">更新用户信息</ant-button>
    </ant-form-item>
  </ant-form>
</template>

<script lang="ts">
import { message } from 'ant-design-vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import {
  defineComponent, onMounted, reactive, ref, toRaw, UnwrapRef
} from 'vue';
import { useStore } from '@/store';
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
    const store = useStore();
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
        {
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 15,
          message: '用户名应当在3-15个字符',
          trigger: 'blur'
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
              console.log(data);
            });
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
        userProfileFormState.personalWebsite = result.data.personalWebsite || '';
        userProfileFormState.wechat = result.data.wechat || '';
        userProfileFormState.company = result.data.company || '';
        userProfileFormState.location = result.data.location || '';
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
  margin-bottom: 10px;
}
</style>
