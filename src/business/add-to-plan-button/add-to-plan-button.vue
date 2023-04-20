<template>
  <div>
    <m-button
      :class="customClass"
      :title="'加入计划'"
      @click="openPlanModal"></m-button>
    <add-to-plan-modal
      @close="isAddToPlanModalShow = false"
      v-if="isAddToPlanModalShow"
      :is-modal-visible="isAddToPlanModalShow"
      :entity-id="entityId"
      :entity-type="entityType"></add-to-plan-modal>
  </div>
</template>

<script lang="ts" setup>
import type { PublicEntityType } from '@metagraph/constant';
import { defineProps, PropType, ref } from 'vue';
import { MButton } from '@/metagraph-ui';
import AddToPlanModal from './add-to-plan-modal/add-to-plan-modal.vue';

defineProps({
  entityId: {
    type: String,
    required: true
  },
  entityType: {
    required: true,
    type: String as PropType<PublicEntityType>
  },
  customClass: {
    type: Array as PropType<string[]>
  }
});
const isAddToPlanModalShow = ref(false);

function openPlanModal() {
  isAddToPlanModalShow.value = true;
}

</script>

<style lang="scss">

</style>
