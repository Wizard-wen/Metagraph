<template>
  <ant-modal
    :width="800"
    title="绑定标签"
    okText="确定"
    cancelText="取消"
    :visible="isModalVisible"
    :confirm-loading="modalConfirmLoading"
    :zIndex="9999"
    @cancel="handleModalCancel"
    @ok="handleModalOk">
    <div class="tag-box">
      <ant-tag v-for="(item, index) in selectedTagList" :key="index">
        {{ item.label }}
      </ant-tag>
    </div>
    <ant-checkbox-group
      v-model:value="selectedTagIds"
      :options="tag.list">
    </ant-checkbox-group>
    <ant-button
      @click="handleLoadMore"
      v-if="tag.currentPage < tag.total">load more
    </ant-button>
  </ant-modal>
</template>

<script lang="ts">
import {
  ref, computed, toRef, PropType, inject, defineComponent
} from 'vue';
import {
  Modal, Button, Tag, Checkbox
} from 'ant-design-vue';
import { TagApiService } from '@/api-service';
import { tag, KnowledgeEdit, draftKnowledgeEntityIdInjectKey } from '../model/knowledge.edit';

export default defineComponent({
  name: 'knowledge-tag-modal',
  components: {
    AntModal: Modal,
    AntCheckboxGroup: Checkbox.Group,
    AntButton: Button,
    AntTag: Tag
  },
  props: {
    isModalVisible: {
      type: Boolean,
      required: true
    },
    selectedTagIdsFromProp: {
      type: Array as PropType<string[]>,
      default: () => [],
      required: true
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const selectedTagIdList = toRef(props, 'selectedTagIdsFromProp');
    const draftKnowledgeEntityId = inject(draftKnowledgeEntityIdInjectKey);
    const selectedTagIds = ref(selectedTagIdList.value);
    const knowledgeEdit = new KnowledgeEdit();
    const selectedTagList = computed(
      () => selectedTagIds.value.map((item) => tag.list.find((tagItem) => tagItem.value === item))
    );
    const modalConfirmLoading = ref(false);

    function handleModalCancel() {
      emit('close');
    }

    async function handleModalOk() {
      await TagApiService.update({
        entityId: draftKnowledgeEntityId?.value || '',
        tagIds: selectedTagIds.value || [],
        entityType: 'Knowledge'
      });
      emit('close', {
        selectedTagList: selectedTagList.value
      });
    }

    const handleLoadMore = async () => {
      tag.currentPage += 1;
      await knowledgeEdit.getTagList();
    };
    return {
      selectedTagList,
      selectedTagIds,
      modalConfirmLoading,
      handleModalCancel,
      handleModalOk,
      handleLoadMore,
      tag,
    };
  }
});
</script>

<style scoped lang="scss">
.tag-box {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
