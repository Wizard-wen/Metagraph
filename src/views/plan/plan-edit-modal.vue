<template>
  <ant-modal
    style="position: relative"
    :width="600"
    :title="planId ? '编辑计划' : '创建计划'"
    okText="确定"
    cancelText="取消"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="9999"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <ant-form
      class="plan-edit-form"
      ref="formRef"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :model="formState">
      <ant-form-item style="margin-top: 20px;" ref="name" label="计划名" name="name">
        <ant-input
          class="custom-input-style"
          v-model:value="formState.name"
          placeholder="请输入计划名称"
          autocomplete="off"/>
      </ant-form-item>
      <ant-form-item style="margin-top: 20px;" ref="planDate" label="起始日" name="planDate">
        <ant-date-picker
          :getPopupContainer="getPopupContainer"
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择起始日期"
          v-model:value="formState.planDate"/>
      </ant-form-item>
      <ant-form-item style="margin-top: 20px;" ref="deadlineDate" label="截止日"
                     name="deadlineDate">
        <ant-date-picker
          :getPopupContainer="getPopupContainer"
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择结束日期"
          v-model:value="formState.deadlineDate"/>
      </ant-form-item>
      <ant-form-item style="margin-top: 20px;" ref="description" label="描述" name="description">
        <ant-textarea
          class="custom-input-style"
          v-model:value="formState.description"
          placeholder="请对计划做一个简短的描述"
          autocomplete="off"/>
      </ant-form-item>
    </ant-form>
  </ant-modal>
</template>

<script lang="ts" setup>
import { PlanApiService } from '@/api-service/plan.api.service';
import { PlanList } from '@/views/plan/plan.list';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { defineEmits, defineProps, onMounted, reactive, ref, toRaw, toRef } from 'vue';
import {
  DatePicker as AntDatePicker,
  Form as AntForm,
  Input as AntInput,
  Modal as AntModal
} from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

interface FormState {
  name: string;
  deadlineDate: Dayjs;
  planDate: Dayjs;
  description?: string;
}

const AntTextarea = AntInput.TextArea;
const AntFormItem = AntForm.Item;
const emit = defineEmits(['close']);
const props = defineProps({
  isModalVisible: {
    type: Boolean,
    required: true
  },
  planId: {
    type: String
  }
});

const formRef = ref();
const wrapperCol = ref({ span: 24 });
const labelCol = ref({ span: 4 });
const planList = new PlanList();
const planId = toRef(props, 'planId');
const dateFormat = 'YYYY/MM/DD';

function getPopupContainer(triggerNode: any) {
  return triggerNode.parentNode;
}

const formState = reactive<FormState>({
  name: '',
  deadlineDate: dayjs().add(7, 'day'),
  planDate: dayjs(),
  description: ''
});

const modalConfirmLoading = ref(false);

function handleModalCancel() {
  emit('close');
}

async function createPlan() {
  modalConfirmLoading.value = true;
  await planList.createPlan({
    name: formState.name,
    deadlineDate: formState.deadlineDate?.toDate(),
    planDate: formState.planDate?.toDate(),
    description: formState.description
  });
  modalConfirmLoading.value = false;
  handleModalCancel();
}

async function updatePlan(planId: string) {
  modalConfirmLoading.value = true;
  await planList.editPlan({
    id: planId,
    name: formState.name,
    deadlineDate: formState.deadlineDate.toDate(),
    planDate: formState.planDate.toDate(),
    description: formState.description
  });
  modalConfirmLoading.value = false;
  handleModalCancel();
}

async function getPlanDetail(params: {
  id: string;
}): Promise<void> {
  const result = await PlanApiService.getPlanDetail(params);
  if(result.data) {
    formState.name = result.data.name;
    formState.description = result.data.description;
    formState.deadlineDate = dayjs(result.data.deadlineDate, dateFormat);
  }
}

function handleModalOk() {
  formRef.value
    .validate()
    .then(async () => {
      console.log('values', formState, toRaw(formState));
      if(planId.value) {
        await updatePlan(planId.value);
      } else {
        await createPlan();
      }
    })
    .catch((error: ValidateErrorEntity<FormState>) => {
      console.log('error', error);
    });
}

const rules = reactive({
  name: [{
    message: '请输入计划名',
    trigger: 'blur',
    required: true
  }],
  planDate: [
    {
      required: true,
      trigger: 'change',
      validator(rule: any, value: Dayjs): Promise<void> {
        return new Promise((resolve, reject) => {
          console.log(value.unix());
          if(value) {
            if(value.isAfter(formState.deadlineDate)) {
              reject('起始时间不能大于结束时间');
            } else {
              resolve();
            }
          } else {
            resolve();
          }
        });
      }
    }
  ],
  deadlineDate: [
    {
      required: true,
      trigger: ['change', 'blur'],
      validator(rule: any, value: Dayjs): Promise<void> {
        return new Promise((resolve, reject) => {
          if(value) {
            if(value.isBefore(formState.planDate)) {
              reject('起始时间不能大于结束时间');
            } else {
              resolve();
            }
          } else {
            resolve();
          }
        });
      }
    },
  ],
});

onMounted(async () => {
  if(planId.value) {
    await getPlanDetail({ id: planId.value });
  }
});

</script>

<style scoped lang="scss">
@import "../../style/common.scss";

.ant-calendar-picker-container {
  z-index: 10000 !important;
}

.plan-edit-form {
  @include custom-input-style-mixin;
}
</style>
