<template>
  <div class="custom-field-box">
    <div class="header">
      <div class="title">信息栏</div>
      <ant-button @click="handleOpenAddFieldModal">
        <PlusOutlined/>
        添加字段
      </ant-button>
    </div>
    <div class="content">
      <ant-form
        class="custom-form"
        ref="formRef"
        :model="dynamicValidateForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol">
        <ant-form-item
          class="form-item-custom"
          v-for="domain in dynamicValidateForm.domains"
          :key="domain.key"
          :label="domain.label"
          :name="domain.key">
          <ant-input
            :ref="domain.key"
            v-model:value="domain.value"
            :placeholder="`请输入 ${domain.label}`"
            style="width: 80%; margin-right: 8px"/>
          <MinusCircleOutlined
            class="dynamic-delete-button"
            @click="removeField(domain)"/>
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
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import {
  defineComponent, reactive, ref, UnwrapRef
} from 'vue';
import AddFieldModal from '@/views/knowledge-edit/add-field-modal.vue';

interface Domain {
  value: string;
  label: string;
  key: number;
}

export default defineComponent({
  name: 'knowledge-custom-message',
  setup() {
    const formRef = ref();
    const dynamicValidateForm: UnwrapRef<{ domains: Domain[] }> = reactive({
      domains: [],
    });
    const removeField = (item: Domain) => {
      const index = dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        dynamicValidateForm.domains.splice(index, 1);
      }
    };
    const isFieldModalVisible = ref(false);

    function handleOpenAddFieldModal() {
      isFieldModalVisible.value = true;
    }

    function handleAddFieldModalClose(event?: {
      name: string;
    }) {
      isFieldModalVisible.value = false;
      if (event) {
        dynamicValidateForm.domains.push({
          value: '',
          label: event.name,
          key: Date.now(),
        });
      }
    }

    return {
      formRef,
      dynamicValidateForm,
      removeField,
      handleOpenAddFieldModal,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      isFieldModalVisible,
      handleAddFieldModalClose
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
.custom-field-box {
  padding: 15px;
  background: #FFFFFF;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .05);

  .header {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;

    .title {
      font-size: 20px;
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
