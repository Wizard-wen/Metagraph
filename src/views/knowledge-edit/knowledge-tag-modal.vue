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
      <ant-tag v-for="item in selectedTagList">
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

<script setup lang="ts">
import {
  defineProps, defineEmits, ref, computed, toRef, PropType, inject
} from 'vue';
import { TagApiService } from '@/api.service';
import { tag, KnowledgeEdit, knowledgeEntityIdInjectKey } from './model/knowledge.edit';

const knowledgeEntityId = inject(knowledgeEntityIdInjectKey);
const props = defineProps({
  isModalVisible: {
    type: Boolean,
    required: true
  },
  selectedTagIdsFromProp: {
    type: Array as PropType<string[]>,
    default: () => [],
    required: true
  }
});
const selectedTagIdList = toRef(props, 'selectedTagIdsFromProp');
const emit = defineEmits(['close']);
const modalConfirmLoading = ref(false);
const selectedTagIds = ref(selectedTagIdList.value);
const knowledgeEdit = new KnowledgeEdit();
const selectedTagList = computed(
  () => selectedTagIds.value.map((item) => tag.list.find((tagItem) => tagItem.value === item))
);

function handleModalCancel() {
  emit('close');
}

async function handleModalOk() {
  await TagApiService.update({
    entityId: knowledgeEntityId?.value || '',
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
