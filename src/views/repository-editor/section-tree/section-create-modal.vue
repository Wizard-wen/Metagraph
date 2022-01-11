<template>
  <ant-modal
    :title="sectionModalData.title"
    v-if="isModalVisible"
    :visible="isModalVisible"
    :confirm-loading="sectionModalData.isConfirmLoading"
    @ok="handleCreateSection"
    @cancel="handleCloseModal">
    <ant-input
      v-if="sectionModalData.entityType === 'Section' || sectionModalData.entityType === 'ChangeSection'"
      v-model:value="sectionModalData.sectionName"></ant-input>
    <ant-select
      v-else
      v-model:value="sectionModalData.selectedEntityId"
      optionLabelProp="label"
      style="width: 100%"
      placeholder="Please select"
      :options="sectionModalData.entityOptionList"/>
  </ant-modal>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { repositoryEntityIdInjectKey } from '@/views/knowledge-edit/model/knowledge.edit';
import { sectionModalData, SectionTreeService } from './section.tree';

export default defineComponent({
  name: 'section-create-modal',
  props: {
    isModalVisible: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const sectionTreeService = new SectionTreeService();
    const repositoryEntityId = inject(repositoryEntityIdInjectKey, ref<string>(''));

    function handleCloseModal() {
      emit('close');
    }

    async function handleCreateSection() {
      await sectionTreeService.createSection(repositoryEntityId.value);
      handleCloseModal();
    }

    return {
      sectionModalData,
      handleCreateSection,
      handleCloseModal
    };
  }
});
</script>

<style scoped>

</style>
