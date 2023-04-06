<template>
  <div class="create-repo-page">
    <div class="inner-content">
      <div class="repo-description">
        <h3 style="font-weight: bold">{{ pageTitle }}知识库</h3>
        <span>知识库是一个包含文档、知识点的独立个体。你的知识库只有自己可以编辑。</span>
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
            <ant-input
              class="custom-input-style"
              v-model:value="repositoryFormState.name"
              placeholder="请输入知识库名称"
              autocomplete="off"
            />
          </ant-form-item>
          <div class="line-1px"></div>
          <ant-form-item label="知识库类型" name="type">
            <ant-radio-group v-model:value="repositoryFormState.type">
              <ant-radio class="radio" value="private">
                <div class="radio-box">
                  <LockOutlined class="icon"/>
                  <div class="radio-content">
                    <div class="text-title">
                      <div class="text">私有</div>
                    </div>
                    <div class="desc">只有你自己才能看到、编辑知识库。</div>
                  </div>
                </div>
              </ant-radio>
              <ant-radio class="radio" value="public">
                <div class="radio-box">
                  <UnlockOutlined class="icon"/>
                  <div class="radio-content">
                    <div class="text-title">
                      <div class="text">公开</div>
                    </div>
                    <div class="desc">大家都可以看到你的知识库，但是只有你自己可以编辑。</div>
                  </div>
                </div>
              </ant-radio>
            </ant-radio-group>
          </ant-form-item>
          <ant-form-item
            v-if="repositoryFormState.type === 'public'"
            label="是否允许克隆知识库" name="isAllowedClone">
            <ant-radio-group v-model:value="repositoryFormState.isAllowedClone">
              <ant-radio class="radio" value="allow">
                <div class="radio-box">
                  <SmileOutlined class="icon"/>
                  <div class="radio-content">
                    <div class="text-title">
                      <div class="text">允许</div>
                    </div>
                    <div class="desc">勾选允许，其他用户可以基于您的知识库进行创作</div>
                  </div>
                </div>
              </ant-radio>
              <ant-radio class="radio" value="forbidden">
                <div class="radio-box">
                  <FrownOutlined class="icon"/>
                  <div class="radio-content">
                    <div class="text-title">
                      <div class="text">不允许</div>
                    </div>
                    <div class="desc">勾选不允许，其他用户不能基于您的知识库进行创作</div>
                  </div>
                </div>
              </ant-radio>
            </ant-radio-group>
          </ant-form-item>
          <div class="line-1px"></div>
          <ant-form-item label="知识库领域" name="domain">
            <domain-select-form-item
              v-model="repositoryFormState.domain"></domain-select-form-item>
          </ant-form-item>
          <ant-form-item label="知识库封面" name="avatar">
            <upload-form-item
              :provider="'RepositoryAvatar'"
              :title="'上传知识库封面'"
              v-model="repositoryFormState.avatar"></upload-form-item>
          </ant-form-item>
          <ant-form-item label="知识库描述" name="description">
            <ant-text-area
              :rows="3"
              placeholder="请输入知识库描述"
              class="custom-input-style"
              v-model:value="repositoryFormState.description"/>
          </ant-form-item>
        </ant-form>
        <div class="control-button">
          <m-button :title="pageTitle" @click="onSubmit"></m-button>
          <m-button
            :title="'删除'"
            v-if="repositoryEntityId"
            style="margin-left: 10px"
            type="primary" @click="deleteRepository">
          </m-button>
          <m-button :title="'返回'" style="margin-left: 10px" @click="goBack"></m-button>
        </div>
      </div>
    </div>

  </div>
  <repository-delete-confirm-modal
    v-if="isDeleteModalVisible"
    :repositoryEntityId="repositoryEntityId"
    @close="handleDeleteModalClose"
    :isModalVisible="isDeleteModalVisible"></repository-delete-confirm-modal>
</template>
<script lang="ts" setup>
import { Form as AntForm, Input as AntInput, Radio as AntRadio } from 'ant-design-vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BookOutlined, FrownOutlined, LockOutlined, SmileOutlined, UnlockOutlined } from '@ant-design/icons-vue';
import type { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import RepositoryDeleteConfirmModal
  from '@/views/repository-edit/repository-delete-confirm-modal.vue';
import {
  RepositoryEdit,
  repositoryFormRef,
  repositoryFormRules,
  repositoryFormState,
  RepositoryFormStateType
} from '@/views/repository-edit/repository.edit';
import UploadFormItem from '@/components/upload/upload-form-item.vue';
import { DomainSelectFormItem } from '@/business';
import { MButton } from '@/metagraph-ui';

const AntFormItem = AntForm.Item;
const AntTextArea = AntInput.TextArea;
const AntRadioGroup = AntRadio.Group;

const labelCol = { span: 6 };
const wrapperCol = { span: 24 };
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

</script>

<style lang="scss" scoped>
@import "../style/common.scss";

.create-repo-page {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  @include custom-scroll-style;

  .inner-content {
    width: 800px;
    margin: 0 auto;
    padding-top: 30px;
  }

  .repo-description {
    padding: 10px 0;
    text-align: left;
    border-bottom: 1px solid $borderColor;
  }

  .repo-create-form {
    padding: 30px 0 50px;
    .line-1px {
      height: 1px;
      width: 100%;
      background: #d8dee4;
      margin: 12px 0;
    }

    .radio {
      display: flex;
      width: 800px;

      &::v-deep(.ant-radio) {
        height: max-content;
        margin-top: 9px;
        font-size: 12px;
      }
      &::v-deep(.ant-radio-inner) {
        height: 14px;
        width: 14px;
        &:after {
          left: 2px;
          top: 2px;
        }
      }

      .radio-box {
        display: flex;
        align-items: center;
        height: 50px;
        width: 750px;
        text-align: left;
        position: relative;

        .icon {
          position: absolute;
          font-size: 24px;
          color: #656d76;
          //margin-right: 6px;
          top: 6px;
        }

        .radio-content {
          padding-left: 32px;
          display: block;
          text-align: left;
          margin-left: 4px;

          .text-title {
            display: flex;
            align-items: center;
            font-size: 14px;
            height: 24px;
          }

          .desc {
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            color: $lightFontColor;
          }
        }
      }
    }

    .control-button {
      margin: 30px 0 100px;
      display: flex;
    }


    @include custom-input-style-mixin;
  }
}
</style>
