<template>
  <ant-button
    class="control-btn plan-btn"
    @click="openPlanModal">加入计划</ant-button>
  <add-to-plan-modal
    @close="isAddToPlanModalShow = false"
    v-if="isAddToPlanModalShow"
    :is-modal-visible="isAddToPlanModalShow"
    :entity-id="entityId"
    :entity-type="entityType"></add-to-plan-modal>
</template>

<script lang="ts">
import type { PublicEntityType } from 'metagraph-constant';
import { defineComponent, PropType, ref } from 'vue';
import {
  Button
} from 'ant-design-vue';
import AddToPlanModal from './add-to-plan-modal/add-to-plan-modal.vue';

export default defineComponent({
  name: 'add-to-plan-button',
  components: {
    AddToPlanModal,
    AntButton: Button
  },
  props: {
    entityId: {
      type: String,
      required: true
    },
    entityType: {
      required: true,
      type: String as PropType<PublicEntityType>
    }
  },
  setup() {
    const isAddToPlanModalShow = ref(false);

    function openPlanModal() {
      isAddToPlanModalShow.value = true;
    }

    return {
      openPlanModal,
      isAddToPlanModalShow
    };
  }
});
</script>

<style scoped lang="scss">
.control-btn {
  position: absolute;
  padding: 2px 12px;
  font-size: 12px;
  line-height: 18px;
  border: 1px solid #1b1f2326;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;

  &::v-deep(.ant-btn) {
    height: 28px;
  }
}

.plan-btn {
  top: 16px;
  right: 83px;
}
</style>
