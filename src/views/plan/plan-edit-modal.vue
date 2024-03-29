<template>
  <ant-modal
    style="position: relative"
    :width="800"
    title="编辑计划"
    okText="确定"
    cancelText="取消"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="9999"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <div></div>
    <ant-form
      ref="formRef"
      :rules="rules"
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
      <ant-form-item style="margin-top: 20px;" ref="name" label="计划名" name="name">
        <ant-input v-model:value="formState.name"/>
      </ant-form-item>
      <ant-form-item style="margin-top: 20px;" ref="planDate" label="起始日" name="planDate">
        <ant-date-picker
          :dropdownClassName="'custom-date-picker'"
          :format="dateFormat" v-model:value="formState.planDate"/>
      </ant-form-item>
      <ant-form-item style="margin-top: 20px;" ref="deadlineDate" label="截止日" name="deadlineDate">
        <ant-date-picker
          :dropdownClassName="'custom-date-picker'"
          :format="dateFormat" v-model:value="formState.deadlineDate"/>
      </ant-form-item>
      <ant-form-item style="margin-top: 20px;" ref="description" label="描述" name="description">
        <ant-input v-model:value="formState.description"/>
      </ant-form-item>
    </ant-form>
  </ant-modal>
</template>

<script lang="ts">
import { PlanApiService } from '@/api.service/plan.api.service';
import { PlanList } from '@/views/plan/plan.list';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import {
  reactive, ref, toRaw, defineComponent, toRef, onMounted
} from 'vue';
import {
  Form, Input, Modal, DatePicker
} from 'ant-design-vue';
import moment, { Moment } from 'moment';

interface FormState {
  name: string;
  deadlineDate?: Moment;
  planDate?: Moment;
  description?: string;
}

export default defineComponent({
  name: 'plan-edit-modal',
  props: {
    isModalVisible: {
      type: Boolean,
      required: true
    },
    planId: {
      type: String
    }
  },
  emits: ['close'],
  components: {
    AntModal: Modal,
    AntForm: Form,
    AntFormItem: Form.Item,
    AntInput: Input,
    AntDatePicker: DatePicker
  },
  setup(props, context) {
    const formRef = ref();
    const planList = new PlanList();
    const planId = toRef(props, 'planId');
    const dateFormat = 'YYYY/MM/DD';
    const formState = reactive<FormState>({
      name: '',
      deadlineDate: moment(new Date(), dateFormat),
      planDate: moment(new Date(), dateFormat),
      description: ''
    });

    const modalConfirmLoading = ref(false);

    function handleModalCancel() {
      context.emit('close');
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
        deadlineDate: formState.deadlineDate?.toDate(),
        planDate: formState.planDate?.toDate(),
        description: formState.description
      });
      modalConfirmLoading.value = false;
      handleModalCancel();
    }

    async function getPlanDetail(params: {
      id: string;
    }): Promise<void> {
      const result = await PlanApiService.getPlanDetail(params);
      if (result.data) {
        formState.name = result.data.name;
        formState.description = result.data.description;
        formState.deadlineDate = moment(result.data.deadlineDate, dateFormat);
      }
    }

    function handleModalOk() {
      formRef.value
        .validate()
        .then(async () => {
          console.log('values', formState, toRaw(formState));
          if (planId.value) {
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
      }]
    });

    onMounted(async () => {
      if (planId.value) {
        console.log('222222');
        await getPlanDetail({ id: planId.value });
      }
    });
    return {
      rules,
      wrapperCol: { span: 14 },
      labelCol: { span: 4 },
      handleModalOk,
      handleModalCancel,
      formState,
      formRef,
      modalConfirmLoading,
      dateFormat
    };
  }
});

</script>

<style scoped lang="scss">
.ant-calendar-picker-container {
  z-index: 10000!important;
}
</style>
