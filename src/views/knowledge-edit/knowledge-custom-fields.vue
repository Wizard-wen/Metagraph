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
        class="custom-form"
        ref="formRef"
        :label-col="labelCol"
        :wrapper-col="wrapperCol">
        <ant-form-item
          class="form-item-custom"
          v-bind="customFieldsValidateInfo[item.key]"
          v-for="item in customFields.target"
          :key="item.key"
          :label="item.label"
          :name="item.key">
          <ant-input
            :ref="item.key"
            v-model:value="customFieldsModelRef[item.key]"
            @blur="customFieldsValidate(item.key, { trigger: 'blur' }).catch(() => {})"
            :placeholder="`请输入${item.label}`"
            style="width: 80%; margin-right: 8px"/>
          <MinusCircleOutlined
            class="dynamic-delete-button"
            @click="removeField(item)"/>
        </ant-form-item>
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
import { message, Form, Modal } from 'ant-design-vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import {
  defineComponent, reactive, ref, UnwrapRef, inject, createVNode
} from 'vue';
import {
  KnowledgeEdit,
  knowledgeEntityIdInjectKey,
  customFields,
  CustomFieldType, customFieldsModelRef, customFieldsRulesRef, customFieldsValidateInfo,
  customFieldsValidate
} from './model/knowledge.edit';
import { KnowledgeApiService } from '@/api.service';
import AddFieldModal from '@/views/knowledge-edit/knowledge-custom-fields/add-field-modal.vue';

const { useForm } = Form;
export default defineComponent({
  name: 'knowledge-custom-fields',
  setup() {
    const knowledgeEdit = new KnowledgeEdit();
    const knowledgeEntityId = inject(knowledgeEntityIdInjectKey);
    const formRef = ref();

    async function removeField(item: CustomFieldType) {
      Modal.confirm({
        title: '确定删除自定义字段吗?',
        okText: '确定',
        cancelText: '取消',
        zIndex: 9001,
        icon: createVNode(ExclamationCircleOutlined),
        content: `该操作不可逆，确定删除自定义字段${item.label}吗？`,
        async onOk() {
          const result = await KnowledgeApiService.removeField({
            knowledgeEntityId: knowledgeEntityId?.value || '',
            customFieldKey: item.key
          });
          if (result.code === 0) {
            await knowledgeEdit.getKnowledge(knowledgeEntityId?.value || '');
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
      await knowledgeEdit.getKnowledge(knowledgeEntityId?.value || '');
    }

    async function handleSaveCustomField() {
      Object.keys(customFieldsModelRef)
        .forEach((item) => {
          const customFieldItem = customFields.target.find(
            (customFieldItem) => customFieldItem.key === item
          )!;
          customFieldItem.value = customFieldsModelRef[item];
        });
      const result = await KnowledgeApiService.saveFields({
        knowledgeEntityId: knowledgeEntityId?.value || '',
        customFields: customFields.target
      });
      if (result.code === 0) {
        message.success('保存成功！');
      }
    }

    return {
      formRef,
      removeField,
      handleOpenAddFieldModal,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      isFieldModalVisible,
      handleAddFieldModalClose,
      handleSaveCustomField,
      customFields,
      customFieldsValidateInfo,
      customFieldsModelRef,
      customFieldsValidate
    };
  },
  components: {
    AddFieldModal,
    MinusCircleOutlined,
    PlusOutlined,
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
      font-size: 20px;
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

.custom-form {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;

  .form-item-custom {
    //width: 50%;
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
