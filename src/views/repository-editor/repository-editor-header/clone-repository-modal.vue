<template>
  <ant-modal
    title="新知识库名称"
    okText="确定"
    cancelText="取消"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="9999"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <ant-form
      class="clone-form"
      ref="formRef"
      layout="vertical"
      :rules="rules"
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
      <ant-form-item label="新知识库名称" name="name">
        <ant-input
          ref="cloneNameRef"
          class="custom-input-style"
          placeholder="请输入克隆库知识库名称"
          v-model:value="formState.name"/>
      </ant-form-item>
    </ant-form>
  </ant-modal>
</template>

<script lang="ts" setup>
import { RuleObject, ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import {
  reactive, ref, UnwrapRef, defineProps, defineEmits, inject, watchEffect, onMounted, nextTick
} from 'vue';
import { Form as AntForm, Input as AntInput, Modal as AntModal } from 'ant-design-vue';
import { repositoryEntityIdKey } from '@/views/repository-editor/model/provide.type';
import { RepositoryApiService } from '@/api-service';

const AntFormItem = AntForm.Item;
const wrapperCol = { offset: 0 };
const labelCol = { span: 8 };

interface FormState {
  name: string;
}

const formRef = ref();
const cloneNameRef = ref();

const props = defineProps({
  isModalVisible: {
    type: Boolean,
    required: true
  },
  oldRepositoryName: {
    type: String,
    required: true
  }
});
const emit = defineEmits(['close']);


const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));

const formState: UnwrapRef<FormState> = reactive({
  name: '',
});
watchEffect(() => {
  formState.name = `${ props.oldRepositoryName }的副本`;
});

const modalConfirmLoading = ref(false);

function handleModalCancel() {
  emit('close');
}

async function validateCustomField(rule: RuleObject, value: string): Promise<unknown> {
  if (value === '') {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('请输入自定义字段名');
  }
  return Promise.resolve();
}

function handleModalOk() {
  formRef.value
    .validate()
    .then(async () => {
      emit('close', {
        name: formState.name
      });
    })
    .catch((error: ValidateErrorEntity<FormState>) => {
      console.log('error', error);
    });
}

async function getCloneStatus() {
  const result = await RepositoryApiService.getCloneRepositoryStatus({
    repositoryEntityId: repositoryEntityId.value,
    key: ''
  });
  return !result.data;
}

async function handleClone(name: string) {
  const clonedRepositoryEntityId = await RepositoryApiService.cloneRepository({
    repositoryEntityId: repositoryEntityId.value,
    name
  });
  let isFinish = false;
  const timer = setInterval(async () => {
    isFinish = await getCloneStatus();
    if (isFinish) {
      clearInterval(timer);
    }
  }, 500);
}

const rules = reactive({
  name: [{
    validator: validateCustomField,
    trigger: 'blur',
    required: true
  }]
});

onMounted(() => {
  if (cloneNameRef.value) {
    console.log(cloneNameRef.value);
    nextTick(() => {
      cloneNameRef.value.focus();
    });
  }
});

</script>

<style scoped lang="scss">
@import "../../../style/common.scss";

.clone-form {
  @include custom-input-style-mixin;
}
</style>
