<template>
  <ant-modal
    :width="800"
    title="编辑计划项"
    okText="确定"
    cancelText="取消"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="9000"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <ant-form
      ref="formRef"
      :rules="rules"
      :model="planItem">
      <ant-form-item style="margin-top: 20px;" ref="name" label="计划项名" name="name">
        <ant-input v-model:value="planItem.name"/>
      </ant-form-item>
      <ant-form-item style="margin-top: 20px;" ref="priority" label="优先级" name="priority">
        <ant-rate v-model:value="planItem.priority"/>
      </ant-form-item>
      <ant-form-item style="margin-top: 20px;" ref="planDate" label="开始日" name="planDate">
        <ant-date-picker
          :disabled-date="disabledPlanDate"
          :dropdownClassName="'custom-date-picker'"
          v-model:value="testDate"/>
      </ant-form-item>
      <ant-form-item style="margin-top: 20px;" ref="deadlineDate" label="截止日" name="deadlineDate">
        <ant-date-picker
          :disabled-date="disabledDeadlineDate"
          :dropdownClassName="'custom-date-picker'"
          v-model:value="planItem.deadlineDate"/>
      </ant-form-item>
      <ant-form-item style="margin-top: 20px;" ref="description" label="描述" name="description">
        <ant-input v-model:value="planItem.description"/>
      </ant-form-item>
    </ant-form>
  </ant-modal>
</template>

<script lang="ts" setup>
import { PlanBoard, planItem, PlanItemState } from '@/views/plan/plan-board/plan.board';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { PlanModelType } from '@metagraph/constant';
import { defineEmits, defineProps, onMounted, PropType, reactive, ref } from 'vue';
import {
  DatePicker as AntDatePicker,
  Form as AntForm,
  Input as AntInput,
  Modal as AntModal,
  Rate as AntRate
} from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';

const AntFormItem = AntForm.Item;
const props = defineProps({
  isModalVisible: {
    type: Boolean,
    required: true
  },
  planId: {
    type: String,
    required: true
  },
  planModel: {
    type: Object as PropType<PlanModelType>,
    required: true
  },
  planItemId: {
    type: String
  }
});

const emit = defineEmits(['close']);
const testDate = ref<Dayjs>();
const formRef = ref();
const planList = new PlanBoard();
// const planId = toRef(props, 'planId');
const dateFormat = 'YYYY/MM/DD';

const modalConfirmLoading = ref(false);

function handleModalCancel() {
  emit('close');
}

async function createPlan() {
  modalConfirmLoading.value = true;
  await planList.addPlanItem(props.planId);
  handleModalCancel();
  modalConfirmLoading.value = false;
}

async function updatePlan(planItemId: string) {
  modalConfirmLoading.value = true;
  await planList.updatePlanItem(planItemId);
  handleModalCancel();
  modalConfirmLoading.value = false;
}

function handleModalOk() {
  formRef.value
    .validate()
    .then(async () => {
      if (props.planItemId) {
        await updatePlan(props.planItemId);
      } else {
        await createPlan();
      }
    })
    .catch((error: ValidateErrorEntity<PlanItemState>) => {
      console.log('error', error);
    });
}

const disabledPlanDate = (planValue: Dayjs) => {
  return planValue < dayjs(new Date());
};

const disabledDeadlineDate = (planValue: Dayjs) => {
  if (props.planModel?.planDate) {
    if (planItem.planDate) {
      return planValue < planItem.planDate;
    }
    return planValue < dayjs(props.planModel.planDate);
  }
  return false;
};
const rules = reactive({
  name: [{
    message: '请输入计划名',
    trigger: 'blur',
    required: true
  }]
});

onMounted(async () => {
  if (props.planItemId) {
    await planList.getPlanItemDetail(props.planItemId);
  }
});

// export default defineComponent({
//   name: 'plan-item-edit-modal',
//   props: ,
//   emits: ['close'],
//   components: {
//     AntModal: Modal,
//     AntForm: Form,
//
//     AntInput: Input,
//     AntDatePicker: DatePicker,
//     AntRate: Rate
//   },
//   setup(props, context) {
//
//     return {
//       rules,
//       wrapperCol: { span: 14 },
//       labelCol: { span: 4 },
//       handleModalOk,
//       handleModalCancel,
//       planItem,
//       formRef,
//       modalConfirmLoading,
//       dateFormat,
//       disabledPlanDate,
//       disabledDeadlineDate
//     };
//   }
// });

</script>

<style scoped lang="scss">
.custom-date-picker {
  &::v-deep(.ant-calendar-picker-container) {
    z-index: 10000;
  }
}

.ant-calendar-picker-container {
  z-index: 10000;
}
</style>
