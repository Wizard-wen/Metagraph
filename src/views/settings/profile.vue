<template>
  <setting-header :title="'Public profile'"></setting-header>
  <ant-form layout="vertical" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
    <ant-form-item label="Name" class="ant-form-item-style">
      <ant-input v-model:value="formState.name"/>
      <p style="text-align: left">Your name may appear around GitHub where you contribute or are mentioned. You can
        remove it at any time.</p>
    </ant-form-item>
    <ant-form-item label="头像" ref="formIconRef" name="avatar">
      <upload-qiniu
        v-model="formState.avatar"
        @update:modelValue="handleIconChange"></upload-qiniu>
    </ant-form-item>
    <ant-form-item label="账号类型" ref="type" name="type">
      <ant-radio-group v-model:value="formState.type">
        <ant-radio value="personal">个人</ant-radio>
        <ant-radio value="organization">企业</ant-radio>
      </ant-radio-group>
    </ant-form-item>
    <ant-form-item ref="phone" label="手机号" name="phone">
      <ant-input v-model:value="formState.phone"/>
    </ant-form-item>
    <ant-form-item ref="email" label="邮箱" name="email">
      <ant-input v-model:value="formState.email"/>
    </ant-form-item>
    <ant-form-item :wrapper-col="{ span: 4 }">
      <ant-button type="primary">Update profile</ant-button>
    </ant-form-item>
  </ant-form>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, reactive, ref, toRaw, UnwrapRef
} from 'vue';
import { UserApiService } from '@/api.service';
import SettingHeader from './setting.header.vue';
import UploadQiniu from '@/components/upload/upload.qiniu.vue';

interface FormState {
  name: string;
  avatar: string;
  type: 'personal' | 'organization';
  phone: string;
  email: string;
}

export default defineComponent({
  name: 'Profile',
  components: {
    SettingHeader,
    UploadQiniu
  },
  setup() {
    const formState: UnwrapRef<FormState> = reactive({
      name: '',
      avatar: '',
      type: 'personal',
      phone: '',
      email: '',
    });
    const formIconRef = ref();
    const handleIconChange = (event: any) => {
      formState.avatar = event;
      // 触发图片表单验证
      formIconRef.value.onFieldChange();
    };
    const onSubmit = () => {
      console.log('submit!', toRaw(formState));
    };
    onMounted(async () => {
      const result = await UserApiService.getById();
      console.log(result);
      if (result.data) {
        formState.name = result.data.name;
        formState.avatar = result.data.avatar || '';
        formState.type = result.data.type;
        formState.phone = result.data.phone || '';
        formState.email = result.data.email || '';
      }
    });
    return {
      labelCol: { style: { width: '150px' } },
      wrapperCol: { span: 14 },
      formState,
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
