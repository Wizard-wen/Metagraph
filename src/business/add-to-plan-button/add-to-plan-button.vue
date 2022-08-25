<template>
  <div>
    <metagraph-button
      :class="customClass"
      :title="'加入计划'"
      @click="openPlanModal"></metagraph-button>
    <add-to-plan-modal
      @close="isAddToPlanModalShow = false"
      v-if="isAddToPlanModalShow"
      :is-modal-visible="isAddToPlanModalShow"
      :entity-id="entityId"
      :entity-type="entityType"></add-to-plan-modal>
  </div>
</template>

<script lang="ts">
import type { PublicEntityType } from 'metagraph-constant';
import { defineComponent, PropType, ref } from 'vue';
import { MetagraphButton } from 'metagraph-ui';
import AddToPlanModal from './add-to-plan-modal/add-to-plan-modal.vue';

export default defineComponent({
  name: 'add-to-plan-button',
  components: {
    AddToPlanModal,
    MetagraphButton
  },
  props: {
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

<style lang="scss">

</style>
