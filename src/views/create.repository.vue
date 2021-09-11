<template>
  <div class="create-repo-page">
    <ant-form
      :model="repositoryFormState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
      <ant-form-item label="仓库名称">
        <ant-input v-model:value="repositoryFormState.name"/>
      </ant-form-item>
      <ant-form-item label="仓库类型">
        <ant-radio-group v-model:value="repositoryFormState.type">
          <ant-radio value="private">私有</ant-radio>
          <ant-radio value="public">公开</ant-radio>
        </ant-radio-group>
      </ant-form-item>
      <ant-form-item label="封面" name="image">
        <upload-qiniu v-model="repositoryFormState.image"></upload-qiniu>
      </ant-form-item>
      <ant-form-item label="仓库描述">
        <ant-text-area v-model:value="repositoryFormState.description"/>
      </ant-form-item>
      <ant-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <ant-button type="primary" @click="onSubmit">创建</ant-button>
        <ant-button style="margin-left: 10px" @click="goBack">返回</ant-button>
      </ant-form-item>
    </ant-form>
  </div>
</template>
<script lang="ts">
import { RepositoryApiService } from '@/api.service';
import {
  defineComponent, reactive, toRaw, UnwrapRef
} from 'vue';
import { useRouter } from 'vue-router';
import UploadQiniu from '../components/upload/upload.qiniu.vue';

interface RepositoryFormStateType {
  name: string;
  type: 'public' | 'private';
  description: string;
  image: string;
}

export default defineComponent({
  components: {
    UploadQiniu
  },
  setup() {
    const repositoryFormState: UnwrapRef<RepositoryFormStateType> = reactive({
      name: '',
      type: 'public',
      description: '',
      image: ''
    });
    const router = useRouter();
    const onSubmit = async () => {
      const response = await RepositoryApiService.createRepository({
        name: repositoryFormState.name,
        description: repositoryFormState.description,
        type: repositoryFormState.type,
      });
      if (response.data) {
        await router.push({
          name: 'EditableRepository',
          params: {
            repositoryEntityId: response.data.entity.id
          }
        });
      }
    };
    const goBack = () => {
      router.back();
    };
    return {
      repositoryFormState,
      onSubmit,
      goBack,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
  },
});
</script>

<style lang="scss" scoped>
.create-repo-page {
  width: 800px;
  margin: 0 auto;
  padding-top: 50px;
}
</style>
