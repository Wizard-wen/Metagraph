<template>
  <div class="create-repo-page">
    <div class="repo-description">
      <h3>{{ pageTitle }}知识库</h3>
      <span>知识库是一个包含单元、知识点的独立个体。你的知识库只有自己可以编辑。</span>
    </div>
    <div class="repo-create-form">
      <ant-form
        ref="repositoryFormRef"
        layout="vertical"
        :rules="repositoryFormRules"
        :model="repositoryFormState"
        :label-col="labelCol"
        :wrapper-col="wrapperCol">
        <ant-form-item label="知识库名称" name="name">
          <ant-input v-model:value="repositoryFormState.name"/>
        </ant-form-item>
        <ant-form-item
          v-if="repositoryFormState.type === 'public'"
          label="是否允许克隆" name="isAllowedClone">
          <ant-radio-group v-model:value="repositoryFormState.isAllowedClone">
            <ant-radio value="allow">允许</ant-radio>
            <ant-radio value="forbidden">不允许</ant-radio>
          </ant-radio-group>
        </ant-form-item>
        <ant-form-item label="知识库类型" name="type">
          <ant-radio-group v-model:value="repositoryFormState.type">
            <ant-radio class="radio" value="private">
              <div class="radio-box">
                <div class="radio-icon">
                  <LockOutlined style="font-size: 24px;color: #ddd"/>
                </div>
                <div class="radio-content">
                  <div class="text-title">私有</div>
                  <div class="text">只有你自己才能看到、编辑知识库。</div>
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
                  <div class="text">大家都可以看到你的知识库，但是只有你自己可以编辑。</div>
                </div>
              </div>
            </ant-radio>
          </ant-radio-group>
        </ant-form-item>
        <ant-form-item label="知识库领域" name="domain">
          <domain-select-form-item
            v-model="repositoryFormState.domain"></domain-select-form-item>
        </ant-form-item>
        <ant-form-item label="知识库封面" name="avatar">
          <upload-form-item
            :title="'上传知识库封面'"
            v-model="repositoryFormState.avatar"></upload-form-item>
        </ant-form-item>
        <ant-form-item label="知识库描述" name="description">
          <ant-text-area v-model:value="repositoryFormState.description"/>
        </ant-form-item>
      </ant-form>
      <div class="control-button">
        <ant-button type="primary" @click="onSubmit">{{ pageTitle }}</ant-button>
        <ant-button
          v-if="repositoryEntityId"
          style="margin-left: 10px"
          type="primary" danger @click="deleteRepository">删除
        </ant-button>
        <ant-button style="margin-left: 10px" @click="goBack">返回</ant-button>
      </div>
    </div>
  </div>
  <repository-delete-confirm-modal
    v-if="isDeleteModalVisible"
    :repositoryEntityId="repositoryEntityId"
    @close="handleDeleteModalClose"
    :isModalVisible="isDeleteModalVisible"></repository-delete-confirm-modal>
</template>
<script lang="ts">
import {
  Button, Form, Input, Radio
} from 'ant-design-vue';
import {
  defineComponent, onMounted, ref, computed
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  LockOutlined, BookOutlined
} from '@ant-design/icons-vue';
import type { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import RepositoryDeleteConfirmModal from '@/views/repository-edit/repository-delete-confirm-modal.vue';
import {
  repositoryFormState,
  RepositoryFormStateType,
  RepositoryEdit,
  repositoryFormRules, repositoryFormRef
} from '@/views/repository-edit/repository.edit';
import UploadFormItem from '@/components/upload/upload-form-item.vue';
import { DomainSelectFormItem } from '@/business';

export default defineComponent({
  components: {
    RepositoryDeleteConfirmModal,
    LockOutlined,
    BookOutlined,
    UploadFormItem,
    DomainSelectFormItem,
    AntForm: Form,
    AntFormItem: Form.Item,
    AntTextArea: Input.TextArea,
    AntButton: Button,
    AntRadio: Radio,
    AntRadioGroup: Radio.Group,
    AntInput: Input
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const repositoryEntityId = ref(route.query.repositoryEntityId as (string | undefined));
    if (repositoryEntityId.value === undefined) {
      repositoryFormState.name = '';
      repositoryFormState.avatar = '';
      repositoryFormState.isAllowedClone = 'allow';
      repositoryFormState.domain = [];
      repositoryFormState.type = 'public';
      repositoryFormState.description = '';
    }
    const isDeleteModalVisible = ref(false);
    const repositoryEdit = new RepositoryEdit();
    const pageTitle = computed(() => {
      if (repositoryEntityId.value) {
        return '编辑';
      }
      return '创建';
    });

    onMounted(async () => {
      if (repositoryEntityId.value) {
        await repositoryEdit.getRepository(repositoryEntityId.value);
      }
    });

    const onSubmit = async () => {
      repositoryFormRef.value
        .validate()
        .then(() => {
          if (repositoryEntityId.value) {
            repositoryEdit.updateRepository(repositoryEntityId.value)
              .then();
          } else {
            repositoryEdit.createRepository()
              .then();
          }
        })
        .catch((error: ValidateErrorEntity<RepositoryFormStateType>) => {
          console.log('error', error);
        });
    };

    function deleteRepository() {
      isDeleteModalVisible.value = true;
    }

    function handleDeleteModalClose() {
      isDeleteModalVisible.value = false;
    }

    const goBack = () => {
      router.back();
    };
    return {
      repositoryFormState,
      repositoryFormRules,
      repositoryFormRef,
      onSubmit,
      goBack,
      pageTitle,
      labelCol: { span: 4 },
      wrapperCol: { span: 24 },
      deleteRepository,
      handleDeleteModalClose,
      isDeleteModalVisible,
      repositoryEntityId
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
    padding: 50px 0;

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
      margin: 0 0 100px;
    }
  }
}
</style>
