<template>
  <div class="custom-field-box">
    <div class="header">
      <div class="title">信息栏</div>
      <div class="right">
        <ant-button @click="handleOpenAddFieldModal">
          <PlusOutlined/>
          添加字段
        </ant-button>
        <ant-button type="primary" @click="handleSaveCustomField">
          保存
        </ant-button>
      </div>
    </div>
    <div class="content">
      <ant-form
        ref="formRef">
        <ant-row>
          <ant-col
            :span="item.grid * 12"
            v-for="item in knowledgeCustomFields"
            :key="item.key"
            v-bind="customFieldsValidateInfo[item.key]">
            <ant-form-item
              class="custom-form-item"
              :label="item.label"
              :name="item.key">
              <ant-date-picker
                v-model:value="customFieldsModelRef[item.key]"
                style="width: 80%; margin-right: 8px"
                v-if="item.type === 'Date'"/>
              <ant-input
                v-if="item.type === 'Input'"
                v-model:value="customFieldsModelRef[item.key]"
                :placeholder="`请输入${item.label}`"
                style="width: 80%; margin-right: 8px"/>
              <ant-text-area
                v-if="item.type === 'Textarea'"
                v-model:value="customFieldsModelRef[item.key]"
                :placeholder="`请输入${item.label}`"
                style="max-width: calc(100% - 60px); margin-right: 8px"></ant-text-area>
              <MinusCircleOutlined
                style="font-size: 16px"
                class="dynamic-delete-button"
                @click="removeField(item)"/>
            </ant-form-item>
          </ant-col>
        </ant-row>
      </ant-form>
    </div>
  </div>
  <add-field-modal
    v-if="isFieldModalVisible"
    @close="handleAddFieldModalClose"
    :isModalVisible="isFieldModalVisible"></add-field-modal>
</template>
<script lang="ts">
import { ExclamationCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import {
  message, Form, Modal, Input, Button, DatePicker, Row, Col
} from 'ant-design-vue';
import type { KnowledgeCustomFieldType } from 'metagraph-constant';
import {
  defineComponent, ref, inject, createVNode
} from 'vue';
import { KnowledgeApiService } from '@/api.service';
import AddFieldModal from '@/views/knowledge-edit/knowledge-custom-fields/add-field-modal.vue';
import {
  KnowledgeEdit,
  draftKnowledgeEntityIdInjectKey,
  knowledgeCustomFields, customFieldsValidateInfo,
  customFieldsModelRef, customFieldsRulesRef
} from './model/knowledge.edit';

export default defineComponent({
  name: 'knowledge-custom-fields',
  setup() {
    const knowledgeEdit = new KnowledgeEdit();
    const draftKnowledgeEntityId = inject(draftKnowledgeEntityIdInjectKey);
    const formRef = ref();

    async function removeField(item: KnowledgeCustomFieldType) {
      Modal.confirm({
        title: '确定删除自定义字段吗?',
        okText: '确定',
        cancelText: '取消',
        zIndex: 9001,
        icon: createVNode(ExclamationCircleOutlined),
        content: `该操作不可逆，确定删除自定义字段${item.label}吗？`,
        async onOk() {
          const result = await KnowledgeApiService.removeField({
            knowledgeEntityId: draftKnowledgeEntityId?.value || '',
            customFieldKey: item.key
          });
          if (result.code === 0) {
            await knowledgeEdit.getKnowledge(draftKnowledgeEntityId?.value || '');
            message.success('删除成功！');
          }
        },
        async onCancel() {
          message.info('取消删除');
        },
      });
    }

    const isFieldModalVisible = ref(false);

    function handleOpenAddFieldModal() {
      isFieldModalVisible.value = true;
    }

    async function handleAddFieldModalClose() {
      isFieldModalVisible.value = false;
      await knowledgeEdit.getKnowledge(draftKnowledgeEntityId?.value || '');
    }

    async function handleSaveCustomField() {
      const { validate } = Form.useForm(customFieldsModelRef, customFieldsRulesRef);
      // Object.keys(customFieldsModelRef)
      //   .forEach((item) => {
      //     const customFieldItem = knowledgeCustomFields.value.find(
      //       (customFieldItem) => customFieldItem.key === item
      //     )!;
      //     customFieldItem.value = customFieldsModelRef[item];
      //   });
      validate()
        .then(async () => {
          const result = await KnowledgeApiService.saveFields({
            knowledgeEntityId: draftKnowledgeEntityId?.value || '',
            customFields: knowledgeCustomFields.value
          });
          console.log(result);
          if (result.code === 0) {
            message.success('保存成功！');
          }
        })
        .catch((err) => {
          console.log('error', err);
        });
    }

    return {
      formRef,
      removeField,
      handleOpenAddFieldModal,
      isFieldModalVisible,
      handleAddFieldModalClose,
      handleSaveCustomField,
      knowledgeCustomFields,
      customFieldsValidateInfo,
      customFieldsModelRef
    };
  },
  components: {
    AddFieldModal,
    MinusCircleOutlined,
    PlusOutlined,
    AntForm: Form,
    AntFormItem: Form.Item,
    AntButton: Button,
    AntInput: Input,
    AntTextArea: Input.TextArea,
    AntDatePicker: DatePicker,
    AntRow: Row,
    AntCol: Col
  },
});
</script>
<style lang="scss" scoped>
@import '../../style/common.scss';

.custom-field-box {
  padding: 0 15px 15px 15px;
  background: #FFFFFF;
  max-width: 850px;
  margin: 0 auto 15px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .05);

  .header {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid $borderColor;

    .title {
      font-size: 18px;
    }

    .right {
      display: flex;
      gap: 10px;
    }
  }

  .content {
    padding-top: 15px;
  }
}

.custom-form-item {
  &::v-deep(.ant-form-item-label) {
    width: 100px;
  }

}

.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}

.dynamic-delete-button:hover {
  color: #777;
}

.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
