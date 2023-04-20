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
      :model="planItem"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
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
          :format="dateFormat" v-model:value="planItem.planDate"/>
      </ant-form-item>
      <ant-form-item style="margin-top: 20px;" ref="deadlineDate" label="截止日" name="deadlineDate">
        <ant-date-picker
          :disabled-date="disabledDeadlineDate"
          :dropdownClassName="'custom-date-picker'"
          :format="dateFormat" v-model:value="planItem.deadlineDate"/>
      </ant-form-item>
      <ant-form-item style="margin-top: 20px;" ref="description" label="描述" name="description">
        <ant-input v-model:value="planItem.description"/>
      </ant-form-item>
    </ant-form>
  </ant-modal>
</template>

<script lang="ts">
import {
  planItem, PlanBoard, PlanItemState
} from '@/views/plan/plan.board';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { PlanModelType } from '@metagraph/constant';
import {
  reactive, ref, defineComponent, toRef, onMounted, PropType
} from 'vue';
import {
  Form, Input, Modal, DatePicker, Rate
} from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';

export default defineComponent({
  name: 'plan-item-edit-modal',
  props: {
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
  },
  emits: ['close'],
  components: {
    AntModal: Modal,
    AntForm: Form,
    AntFormItem: Form.Item,
    AntInput: Input,
    AntDatePicker: DatePicker,
    AntRate: Rate
  },
  setup(props, context) {
    const formRef = ref();
    const planList = new PlanBoard();
    const planId = toRef(props, 'planId');
    const planModel = toRef(props, 'planModel');
    const planItemId = toRef(props, 'planItemId');
    const dateFormat = 'YYYY/MM/DD';

    const modalConfirmLoading = ref(false);

    function handleModalCancel() {
      context.emit('close');
    }

    async function createPlan() {
      modalConfirmLoading.value = true;
      await planList.addPlanItem(planId.value);
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
          if (planItemId.value) {
            await updatePlan(planItemId.value);
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
      if (planModel.value?.planDate) {
        if (planItem.planDate) {
          return planValue < planItem.planDate;
        }
        return planValue < dayjs(planModel.value.planDate);
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
      if (planItemId.value) {
        console.log('222222');
        await planList.getPlanItemDetail(planItemId.value);
      }
    });
    return {
      rules,
      wrapperCol: { span: 14 },
      labelCol: { span: 4 },
      handleModalOk,
      handleModalCancel,
      planItem,
      formRef,
      modalConfirmLoading,
      dateFormat,
      disabledPlanDate,
      disabledDeadlineDate
    };
  }
});

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
