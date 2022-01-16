<template>
  <ant-modal
    :title="sectionModalData.title"
    v-if="isModalVisible"
    :visible="isModalVisible"
    okText="确定"
    cancelText="取消"
    :confirm-loading="sectionModalData.isConfirmLoading"
    @ok="handleCreateSection"
    @cancel="handleCloseModal">
    <div class="section-name-container" v-if="sectionModalData.parentSectionName">
      <div v-if="sectionModalData.entityType === 'Knowledge'">
        当前单元是<span class="section-name">{{ sectionModalData.parentSectionName || '' }}</span>
      </div>
      <div v-if="sectionModalData.entityType === 'Section'">
        当前父级单元是<span class="section-name">{{ sectionModalData.parentSectionName || '' }}</span>
      </div>
      <div v-if="sectionModalData.entityType === 'ChangeSection'">
        当前单元名称是<span class="section-name">{{ sectionModalData.parentSectionName || '' }}</span>
      </div>
    </div>
    <ant-input
      v-if="sectionModalData.entityType === 'Section'
      || sectionModalData.entityType === 'ChangeSection'"
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
import { repositoryEntityIdKey } from '@/views/repository-editor/provide.type';
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
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));

    function handleCloseModal() {
      emit('close');
    }

    async function handleCreateSection() {
      sectionModalData.isConfirmLoading = true;
      await sectionTreeService.createSection(repositoryEntityId.value);
      sectionModalData.isConfirmLoading = false;
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

<style scoped lang="scss">
.section-name-container {
  line-height: 50px;

  .section-name {
    font-weight: bolder;
  }
}
</style>
