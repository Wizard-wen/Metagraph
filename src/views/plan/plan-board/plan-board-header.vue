<template>
  <div class="operation-header">
    <ant-button type="primary" @click="addPlanItem">创建计划项</ant-button>
    <ant-form
      layout="inline"
      :model="filterFormState"
      @submit="handleFilter">
      <ant-form-item name="type">
        <ant-select v-model:value="filterFormState.type">
          <ant-select-option value="priority">优先级</ant-select-option>
          <ant-select-option disabled value="deadlineDate">截止日</ant-select-option>
          <ant-select-option disabled value="planDate">计划日</ant-select-option>
        </ant-select>
      </ant-form-item>
      <ant-form-item name="priority">
        <ant-radio-group v-model:value="filterFormState.orderBy" @change="handleChange">
          <ant-radio :value="-1">倒序</ant-radio>
          <ant-radio :value="1">正序</ant-radio>
          <ant-radio :value="0">默认</ant-radio>
        </ant-radio-group>
      </ant-form-item>
    </ant-form>
  </div>
</template>

<script lang="ts" setup>
import {
  Button as AntButton, Form as AntForm, Select as AntSelect, Radio as AntRadio
} from 'ant-design-vue';
import { PlanBoard, planBoard, } from '@/views/plan/plan.board';
import { ref } from 'vue';
const AntFormItem = AntForm.Item;
const AntRadioGroup = AntRadio.Group;
const AntSelectOption = AntSelect.Option;
const planBoardService = new PlanBoard();

const filterFormState = ref<{
  orderBy: 1 | -1 | 0,
  // type: 'priority' | 'planDate' | 'deadlineDate'
  type: 'priority'
}>({
  orderBy: 0,
  type: 'priority'
});

function handleFilter() {

}

function addPlanItem() {
  planItemId.value = undefined;
  planBoardService.clearPlanItem();
  isShowModal.value = true;
}

function handleChange(event: any) {
  console.log(event);
  const { type } = filterFormState.value;
  if (event.target.value === 1) {
    planBoard.value.doingList.sort((a, b) => a.item[type] - b.item[type]);
    planBoard.value.todoList.sort((a, b) => a.item[type] - b.item[type]);
    planBoard.value.doneList.sort((a, b) => a.item[type] - b.item[type]);
  } else if (event.target.value === -1) {
    planBoard.value.doingList.sort((a, b) => b.item[type] - a.item[type]);
    planBoard.value.todoList.sort((a, b) => b.item[type] - a.item[type]);
    planBoard.value.doneList.sort((a, b) => b.item[type] - a.item[type]);
  } else {
    console.log(planBoard.value.todoList);
    planBoard.value.doingList.length && planBoard.value.doingList.sort(
      (a, b) => b.item.updatedAt.getTime() - a.item.updatedAt.getTime()
    );
    planBoard.value.todoList.length && planBoard.value.todoList.sort(
      (a, b) => {
        console.log(b.item.updatedAt, b.item.updatedAt.getTime());
        return b.item.updatedAt.getTime() - a.item.updatedAt.getTime();
      }
    );
    planBoard.value.doneList.length && planBoard.value.doneList.sort(
      (a, b) => b.item.updatedAt.getTime() - a.item.updatedAt.getTime()
    );
  }
}
</script>

<style scoped lang="scss">
.operation-header {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}
</style>
