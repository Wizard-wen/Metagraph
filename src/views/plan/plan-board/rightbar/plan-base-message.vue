<template>

  <panel-description
    :title="'基本信息'"
    :description="planBaseDesc"></panel-description>
  <div class="plan-panel-content">
    <form-panel-input-item
      :editable="formStatus.name"
      @change="handleSavePlanName($event)"
      :title="'名称'">
      <template #content>
        <ant-input
          class="custom-input-style"
          v-model:value="planFormState.name"
          :disabled="!formStatus.name"/>
      </template>
    </form-panel-input-item>
    <form-panel-input-item
      :editable="formStatus.planDate"
      @change="handleSavePlanDate"
      :title="'计划日'">
      <template #content>
        <ant-date-picker
          :disabled="!formStatus.planDate"
          style="width: 100%;"
          :dropdownClassName="'custom-date-picker'"
          :format="'YYYY/MM/DD'" v-model:value="planFormState.planDate"/>
      </template>
    </form-panel-input-item>
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
import { computed, ref } from 'vue';
import { DatePicker as AntDatePicker, Form as AntForm, Input as AntInput, } from 'ant-design-vue';
import { planFormState } from '../plan.board';
import PanelDescription
  from '@/views/repository-editor/knowledge-graph-panel/knowledge-relation/panel-description.vue';
import FormPanelInputItem
  from '@/views/knowledge-editor/knowledge-editor-right-sidebar/form-panel-input-item.vue';

import { CommonUtil } from '@/utils';


const formStatus = ref({
  name: false,
  planDate: false,
  deadlineDate: false
});
const AntFormItem = AntForm.Item;
const AntTextArea = AntInput.TextArea;


const planBaseDesc = computed<{
  title: string;
  content: string
}[]>(() => [{
  title: '名称',
  content: planFormState.name
}, {
  title: '起始日',
  content: CommonUtil.formatDate(planFormState.planDate.toDate(), 'yyyy-MM-dd')
}, {
  title: '截止日',
  content: CommonUtil.formatDate(planFormState.deadlineDate.toDate(), 'yyyy-MM-dd')
}, {
  title: '名称',
  content: planFormState.name
}]);
const isFormDisabled = ref(true);

function handleSavePlanName(event: boolean) {
  if (event) {
    formStatus.value.name = event;
    return;
  }
}

function handleSavePlanDate(event: boolean) {
  if (event) {
    formStatus.value.planDate = event;
    return;
  }
}

function handleOpenDomainModal() {

}

function handleFilter() {

}

function handleSavePlan() {

}
</script>

<style scoped lang="scss">
.plan-panel-content {
  padding: 0 15px;
}
</style>
