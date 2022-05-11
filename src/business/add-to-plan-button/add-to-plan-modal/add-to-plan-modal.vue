<template>
  <ant-modal
    style="position: relative"
    :width="800"
    title="加入计划"
    okText="确定"
    cancelText="取消"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="9999"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <ant-cascader
      style="width: 300px"
      :popupClassName="'custom-date-picker'"
      v-model:value="planData"
      :options="planOptions"
      placeholder="请选择要加入的计划和计划项"/>
  </ant-modal>
</template>

<script lang="ts">
import { AddToPlanModal, planOptions } from '@/business/add-to-plan-button/add-to-plan-modal/add.to.plan.modal';
import type { PublicEntityType } from 'metagraph-constant';
import {
  defineComponent, onMounted, PropType, ref, toRef
} from 'vue';
import { Cascader, Modal } from 'ant-design-vue';

interface Option {
  value: string;
  label: string;
  loading?: boolean;
  isLeaf?: boolean;
  children?: Option[];
}

export default defineComponent({
  name: 'add-to-plan-modal',
  components: {
    AntCascader: Cascader,
    AntModal: Modal,
  },
  props: {
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
  },
  emits: ['close'],
  setup(props, context) {
    const planData = ref([]);
    const addToPlanModal = new AddToPlanModal();
    const entityId = toRef(props, 'entityId');
    const entityType = toRef(props, 'entityType');

    const modalConfirmLoading = ref(false);

    function handleModalCancel() {
      context.emit('close');
    }

    function handleModalOk() {
      if (planData.value.length) {
        addToPlanModal.bindToPlanItem({
          entityId: entityId.value,
          entityType: entityType.value,
          planId: planData.value[0],
          planItemId: planData.value[1] || undefined
        });
        handleModalCancel();
      }
    }

    onMounted(async () => {
      await addToPlanModal.getPlanTree();
    });
    return {
      planData,
      planOptions,
      handleModalOk,
      handleModalCancel,
      modalConfirmLoading,
    };
  }
});
</script>

<style scoped lang="scss">
.ant-cascader-menus {
  z-index: 10000 !important;
}
</style>
