<template>
  <ant-modal
    :title="sectionModalTitle"
    :visible="isCreateSectionModalShown"
    :confirm-loading="confirmLoading"
    @ok="handleCreateSection"
    @cancel="handleCancel">
    <ant-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
      <ant-form-item label="Activity name">
        <ant-input v-model:value="formState.name"/>
      </ant-form-item>
    </ant-form>
    <ant-input v-if="entityType === 'Section'" v-model:value="sectionName"></ant-input>
    <ant-select
      v-else
      v-model:value="selectedlist"
      optionLabelProp="label"
      style="width: 100%"
      placeholder="Please select"
      :options="options"/>
    实体类型 {{ entityType }}
    selected {{ selectedTreeNode }}
  </ant-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { SectionApiService } from "../../../../api.service";
import { ActionEnum } from "../../../../store";

export default defineComponent({
  name: 'section.create.modal',
  setup() {
    const sectionModalTitle = ref<string>('');
    const isContextMenuShown = ref(false);
    const isCreateSectionModalShown = ref(false);
    const entityType = ref<'Section' | 'Knowledge' | 'Exercise'>('Section');
    async function handleCreateSection() {
      if (entityType.value === 'Section') {
        await SectionApiService.createSectionTree({
          name: sectionName.value,
          repositoryEntityId: repositoryEntityId as string,
          parentId: selectedTreeNode.value.length ? selectedTreeNode.value[0] : undefined,
        });
      } else {
        if (selectedTreeNode.value.length === 0) {
          return;
        }
        console.log(selectionData.selectedlist);
        await SectionApiService.bindSectionEntity({
          entityId: selectionData.selectedlist,
          entityType: entityType.value,
          repositoryEntityId: repositoryEntityId as string,
          sectionId: selectedTreeNode.value[0],
        });
      }
      isCreateSectionModalShown.value = false;
      await store.dispatch(ActionEnum.GET_SECTION_TREE, { repositoryEntityId });
    }

    return {
      handleCreateSection
    };
  }
});
</script>

<style scoped>

</style>
