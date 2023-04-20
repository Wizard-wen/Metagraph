<template>
  <ant-modal
    :width="800"
    title="加入计划"
    okText="确定"
    cancelText="取消"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="9999"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <div class="plan-list-container">
      <will-select-plan-list
        @control="handleChangeActiveId"
        :active-id="planDataId"
        :list-data="planOptions"></will-select-plan-list>
    </div>

  </ant-modal>
</template>

<script lang="ts" setup>
import {
  AddToPlanModal,
  planOptions
} from '@/business/add-to-plan-button/add-to-plan-modal/add.to.plan.modal';
import type { PublicEntityType } from '@metagraph/constant';
import { defineEmits, defineProps, onMounted, PropType, ref, toRef } from 'vue';
import WillSelectPlanList
  from '@/business/add-to-plan-button/add-to-plan-modal/will-select-plan-list.vue';
import { Modal as AntModal } from 'ant-design-vue';

interface Option {
  value: string;
  label: string;
  loading?: boolean;
  isLeaf?: boolean;
  children?: Option[];
}

const props = defineProps({
  isModalVisible: {
    type: Boolean,
    required: true
  },
  entityId: {
    type: String,
    required: true
  },
  entityType: {
    type: String as PropType<PublicEntityType>,
    required: true
  }
});

const emit = defineEmits(['close']);
const planDataId = ref();
const addToPlanModal = new AddToPlanModal();
const entityId = toRef(props, 'entityId');
const entityType = toRef(props, 'entityType');

const modalConfirmLoading = ref(false);

function handleModalCancel() {
  emit('close');
}

function handleChangeActiveId(params: { id: string }) {
  planDataId.value = params.id;
}

function handleModalOk() {
  if (planDataId.value) {
    addToPlanModal.bindToPlanItem({
      entityId: entityId.value,
      entityType: entityType.value,
      planId: planDataId.value,
      planItemId: undefined
    });
    handleModalCancel();
  }
}

onMounted(async () => {
  await addToPlanModal.getPlanTree();
});
</script>

<style scoped lang="scss">
.plan-list-container {
  height: 60vh;
}
</style>
