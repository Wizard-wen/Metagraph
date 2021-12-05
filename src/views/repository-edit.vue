<template>
  <div class="create-repo-page">
    <div class="repo-description">
      <h3>创建仓库</h3>
      <span>仓库是一个包含单元、知识点的独立单元。你的仓库只有自己可以编辑。</span>
    </div>
    <div class="repo-create-form">
      <ant-form
        layout="vertical"
        :model="repositoryFormState"
        :label-col="labelCol"
        :wrapper-col="wrapperCol">
        <ant-form-item label="仓库名称">
          <ant-input v-model:value="repositoryFormState.name"/>
        </ant-form-item>
        <ant-form-item label="仓库类型">
          <ant-radio-group v-model:value="repositoryFormState.type">
            <ant-radio class="radio" value="private">
              <div class="radio-box">
                <div class="radio-icon">
                  <LockOutlined style="font-size: 24px;color: #ddd"/>
                </div>
                <div class="radio-content">
                  <div class="text-title">私有</div>
                  <div class="text">只有你自己才能看到、编辑仓库。</div>
                </div>
              </div>
            </ant-radio>
            <ant-radio class="radio" value="public">
              <div class="radio-box">
                <div class="radio-icon">
                  <BookOutlined style="font-size: 24px;color: #ddd"/>
                </div>
                <div class="radio-content">
                  <div class="text-title">公开</div>
                  <div class="text">大家都可以看到你的仓库，但是只有你自己可以编辑。</div>
                </div>
              </div>
            </ant-radio>
          </ant-radio-group>
        </ant-form-item>
        <ant-form-item label="封面" name="image">
          <upload-qiniu v-model="repositoryFormState.image"></upload-qiniu>
        </ant-form-item>
        <ant-form-item label="仓库描述">
          <ant-text-area v-model:value="repositoryFormState.description"/>
        </ant-form-item>
<!--        <upload-crop></upload-crop>-->
      </ant-form>
      <div class="control-button">
        <ant-button type="primary" @click="onSubmit">创建</ant-button>
        <ant-button style="margin-left: 10px" @click="goBack">返回</ant-button>
      </div>
    </div>

  </div>
</template>
<script lang="ts">
import {
  defineComponent, reactive, UnwrapRef
} from 'vue';
import { useRouter } from 'vue-router';
import { LockOutlined, BookOutlined } from '@ant-design/icons-vue';
import { RepositoryApiService } from '@/api.service';
import UploadQiniu from '../components/upload/upload.qiniu.vue';

interface RepositoryFormStateType {
  name: string;
  type: 'public' | 'private';
  description: string;
  image: string;
}

export default defineComponent({
  components: {
    UploadQiniu,
    LockOutlined,
    BookOutlined
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
          query: {
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
      wrapperCol: { span: 24 },
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../style/common.scss";

.create-repo-page {
  width: 800px;
  margin: 0 auto;
  padding-top: 50px;

  .repo-description {
    padding: 10px 0;
    text-align: left;
    border-bottom: 1px solid $borderColor;
  }

  .repo-create-form {
    padding-top: 50px;

    .radio {
      display: block;
      width: 800px;

      .radio-box {
        display: inline-block;
        vertical-align: middle;
        height: 50px;
        width: 750px;
        text-align: left;

        .radio-icon {
          display: inline-block;
          height: 50px;
          padding-top: 13px;
          width: 30px;
          float: left;
        }

        .radio-content {
          float: left;
          display: block;
          height: 50px;
          text-align: left;
          margin-left: 10px;

          .text-title {
            font-size: 16px;
            font-weight: bold;
            height: 30px;
            line-height: 30px;
          }

          .text {
            height: 20px;
            line-height: 20px;
            font-size: 12px;
          }
        }
      }
    }

    .control-button {
      margin: 0;
    }
  }
}
</style>
