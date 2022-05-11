<template>
  <ant-modal
    v-if="isModalVisible"
    :width="800"
    title="新知识库名称"
    okText="确定"
    cancelText="取消"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="9999"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <ant-form
      ref="formRef"
      :rules="rules"
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
      <ant-form-item style="margin-top: 20px;" ref="name" label="知识库名称" name="name">
        <ant-input v-model:value="formState.name"/>
      </ant-form-item>
    </ant-form>
  </ant-modal>
</template>

<script lang="ts">
import { RuleObject, ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import {
  reactive, ref, UnwrapRef, toRaw, defineComponent, toRef, inject
} from 'vue';
import { Form, Input, Modal } from 'ant-design-vue';
import { repositoryEntityIdKey } from '@/views/repository-editor/provide.type';
import { RepositoryApiService } from '@/api.service';

interface FormState {
  name: string;
}

export default defineComponent({
  name: 'clone-repository-modal',
  props: {
    isModalVisible: {
      type: Boolean,
      required: true
    },
    oldRepositoryName: {
      type: String,
      required: true
    }
  },
  emits: ['close'],
  components: {
    AntModal: Modal,
    AntForm: Form,
    AntFormItem: Form.Item,
    AntInput: Input
  },
  setup(props, context) {
    const formRef = ref();
    const initName = toRef(props, 'oldRepositoryName');
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    const formState: UnwrapRef<FormState> = reactive({
      name: `${initName.value}的副本`,
    });

    const modalConfirmLoading = ref(false);

    function handleModalCancel() {
      context.emit('close');
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
          console.log('values', formState, toRaw(formState));
          context.emit('close', {
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
    return {
      rules,
      wrapperCol: { span: 14 },
      labelCol: { span: 4 },
      handleModalOk,
      handleModalCancel,
      formState,
      formRef,
      modalConfirmLoading
    };
  }
});

</script>

<style scoped lang="scss">

</style>
