<template>
  <div class="plan-panel-header">
    <span>{{ planBoard.data?.name || '-' }}</span>
    <SaveOutlined
      style="font-size: 16px;"
      v-if="!isFormDisabled" @click="handleSavePlan"/>
    <EditOutlined
      style="font-size: 16px;"
      v-if="isFormDisabled" @click="isFormDisabled = false"/>
  </div>
  <ant-form
    layout="vertical"
    :model="planFormState"
    @submit="handleFilter">
    <ant-form-item
      style="margin-top: 20px;margin-bottom: 10px" ref="name" label="计划名" name="name">
      <ant-input :disabled="isFormDisabled" v-model:value="planFormState.name"/>
    </ant-form-item>
    <ant-form-item style="margin-bottom: 10px" ref="planDate" label="起始日" name="planDate">
      <ant-date-picker
        :disabled="isFormDisabled"
        style="width: 100%;"
        :dropdownClassName="'custom-date-picker'"
        :format="'YYYY/MM/DD'" v-model:value="planFormState.planDate"/>
    </ant-form-item>
    <ant-form-item
      style="margin-bottom: 10px" ref="deadlineDate" label="截止日" name="deadlineDate">
      <ant-date-picker
        :disabled="isFormDisabled"
        style="width: 100%;"
        :dropdownClassName="'custom-date-picker'"
        :format="'YYYY/MM/DD'" v-model:value="planFormState.deadlineDate"/>
    </ant-form-item>
    <ant-form-item ref="description" label="描述" name="description">
      <ant-text-area :disabled="isFormDisabled" v-model:value="planFormState.description"/>
    </ant-form-item>
  </ant-form>
</template>

<script lang="ts" setup>
import PlanItemEditModal from '@/views/plan/plan-item-edit-modal.vue';
import { computed, createVNode, onMounted, ref } from 'vue';
import {
  Col as AntCol,
  DatePicker as AntDatePicker,
  Form as AntForm,
  Input as AntInput,
} from 'ant-design-vue';
import {
  EditOutlined,
  SaveOutlined
} from '@ant-design/icons-vue';
import { isLoading, planBindEntityList, planBoard, PlanBoard, planFormState } from '../plan.board';

const AntFormItem = AntForm.Item;
const AntTextArea = AntInput.TextArea;

const isFormDisabled = ref(true);

function handleFilter() {

}

function handleSavePlan() {

}
</script>

<style scoped lang="scss">

</style>
