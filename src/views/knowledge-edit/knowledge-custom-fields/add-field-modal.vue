<template>
  <ant-modal
    :width="800"
    title="添加自定义字段"
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
      <ant-form-item style="margin-top: 20px;" ref="name" label="字段名" name="name">
        <ant-input v-model:value="formState.name"/>
      </ant-form-item>
    </ant-form>
  </ant-modal>
</template>

<script lang="ts">
import {
  Form, Input, message, Modal
} from 'ant-design-vue';
import { RuleObject, ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import {
  reactive, ref, UnwrapRef, inject, defineComponent
} from 'vue';
import { KnowledgeApiService } from '@/api.service';
import { knowledgeEntityIdInjectKey } from '@/views/knowledge-edit/model/knowledge.edit';

interface FormState {
  name: string;
}

export default defineComponent({
  name: 'add-field-modal',
  props: {
    isModalVisible: {
      type: Boolean,
      required: true
    }
  },
  components: {
    AntModal: Modal,
    AntForm: Form,
    AntFormItem: Form.Item,
    AntInput: Input
  },
  emits: ['close'],
  setup(props, { emit }) {
    const knowledgeEntityId = inject(knowledgeEntityIdInjectKey, ref(''));
    const formRef = ref();
    const formState: UnwrapRef<FormState> = reactive({
      name: '',
    });

    function handleModalCancel() {
      emit('close');
    }

    async function validateCustomField(rule: RuleObject, value: string): Promise<unknown> {
      return new Promise((resolve, reject) => {
        if (value === '') {
          reject('请输入自定义字段名');
        }
        KnowledgeApiService.checkField({
          knowledgeEntityId: knowledgeEntityId?.value,
          customField: {
            label: value
          }
        })
          .then((result) => {
            if (result.data) {
              if (result.data.isExists) {
                reject('自定义字段名重复！');
              }
              resolve(true);
            }
            reject(result.message);
          });
      });
    }

    function handleModalOk() {
      formRef.value
        .validate()
        .then(async () => {
          const result = await KnowledgeApiService.addField({
            knowledgeEntityId: knowledgeEntityId?.value,
            customField: {
              label: formState.name
            }
          });
          if (result.data) {
            message.success('创建成功');
          }
          emit('close');
        })
        .catch((error: ValidateErrorEntity<FormState>) => {
          console.log('error', error);
        });
    }

    const modalConfirmLoading = ref(false);
    const labelCol = { span: 4 };
    const wrapperCol = { span: 14 };
    const rules = reactive({
      name: [{
        validator: validateCustomField,
        trigger: 'blur',
        required: true
      }]
    });
    return {
      knowledgeEntityId,
      formRef,
      formState,
      labelCol,
      wrapperCol,
      rules,
      modalConfirmLoading,
      handleModalOk,
      validateCustomField,
      handleModalCancel
    };
  }
});

// const props = defineProps({
//   isModalVisible: {
//     type: Boolean,
//     required: true
//   }
// });
// const emit = defineEmits(['close']);

// const formRef = ref();
// const formState: UnwrapRef<FormState> = reactive({
//   name: '',
// });
//
// function handleModalCancel() {
//   emit('close');
// }
//
// async function validateCustomField(rule: RuleObject, value: string): Promise<unknown> {
//   if (value === '') {
//     // eslint-disable-next-line prefer-promise-reject-errors
//     return Promise.reject('请输入自定义字段名');
//   }
//   const result = await KnowledgeApiService.checkField({
//     knowledgeEntityId: knowledgeEntityId?.value,
//     customField: {
//       label: value
//     }
//   });
//   if (result.data) {
//     if (result.data.isExists) {
//       // eslint-disable-next-line prefer-promise-reject-errors
//       return Promise.reject('自定义字段名重复！');
//     }
//     return Promise.resolve();
//   }
//   return Promise.reject(result.message);
// }
//
// function handleModalOk() {
//   formRef.value
//     .validate()
//     .then(async () => {
//       console.log('values', formState, toRaw(formState));
//       const result = await KnowledgeApiService.addField({
//         knowledgeEntityId: knowledgeEntityId?.value,
//         customField: {
//           label: formState.name
//         }
//       });
//       if (result.data) {
//         message.success('创建成功');
//       }
//       emit('close');
//     })
//     .catch((error: ValidateErrorEntity<FormState>) => {
//       console.log('error', error);
//     });
// }
//
// const labelCol = { span: 4 };
// const wrapperCol = { span: 14 };
// const rules = reactive({
//   name: [{
//     validator: validateCustomField,
//     trigger: 'blur'
//   }]
// });
</script>

<style scoped>

</style>
