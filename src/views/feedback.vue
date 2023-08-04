<template>
  <!--  <empty-view></empty-view>-->

  <div class="feedback">
    <div class="title">反馈给Metagraph</div>
    <ant-form
      class="feedback-form"
      ref="repositoryFormRef"
      layout="vertical"
      :rules="feedbackFormRules"
      :model="feedbackForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
      <ant-form-item label="反馈类型">
        <ant-radio-group v-model:value="feedbackForm.type">
          <ant-radio value="1">困惑与建议</ant-radio>
          <ant-radio value="2">缺陷</ant-radio>
        </ant-radio-group>
      </ant-form-item>
      <ant-form-item label="功能模块" name="module">
        <ant-select
          style="max-width: 300px; text-align: left"
          v-model:value="feedbackForm.module"
          placeholder="请选择功能模块">
          <ant-select-option v-for="d in moduleList" :key="d.id">
            {{ d.name }}
          </ant-select-option>
        </ant-select>
      </ant-form-item>
      <ant-form-item label="联系方式" name="contact">
        <ant-input
          class="custom-input-style"
          v-model:value="feedbackForm.contact"
          placeholder="请输入联系方式"
          autocomplete="off"
        />
      </ant-form-item>
      <ant-form-item label="问题描述" name="description">
        <ant-text-area
          :rows="3"
          placeholder="请输入问题描述"
          class="custom-input-style"
          v-model:value="feedbackForm.description"/>
      </ant-form-item>
    </ant-form>
    <div class="control-button">
      <m-button :type="'primary'" :title="'提交'" @click="onSubmit"></m-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {
  Checkbox as AntCheckbox,
  Form as AntForm,
  Input as AntInput,
  Radio as AntRadio,
  Select as AntSelect
} from 'ant-design-vue';
import { MButton } from '@/metagraph-ui';

const AntFormItem = AntForm.Item;
const AntTextArea = AntInput.TextArea;
const AntRadioGroup = AntRadio.Group;
const AntCheckboxGroup = AntCheckbox.Group;
const AntSelectOption = AntSelect.Option;
const labelCol = { span: 6 };
const wrapperCol = { span: 24 };

const feedbackForm = ref({
  type: '1',
  module: undefined,
  title: '',
  description: '',
  contact: ''
});

const moduleList = ref([
  {
    id: '0',
    name: '知识库'
  },
  {
    id: '1',
    name: '知识点'
  }, {
    id: '2',
    name: '计划'
  },
  {
    id: '3',
    name: '文件面板'
  },
  {
    id: '4',
    name: '知识地图'
  }
]);

const feedbackFormRules = {};

function onSubmit() {

}

</script>

<style scoped lang="scss">
@import "../style/common.scss";
.feedback {
  margin: 24px auto;
  max-width: 676px;
  padding: 56px 48px;
  background: var(--yq-bg-primary);
  box-shadow: 0 2px 8px -4px rgba(5, 8, 82, .04), 0 8px 24px -8px rgba(5, 8, 82, .12);
  border-radius: 8px;

  .title {
    height: 32px;
    line-height: 32px;
    text-align: left;
    font-size: 20px;
    margin-bottom: 36px;
    color: var(--yq-text-body);
  }

  .feedback-form {
    &::v-deep(.ant-form-item-label >label) {
      color: #000;
      font-weight: 500;
    }
    @include custom-input-style-mixin;
  }
}
</style>
