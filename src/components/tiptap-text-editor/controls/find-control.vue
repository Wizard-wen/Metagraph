<template>
  <div class="operation-icon" @click="handleCreateMention">
    <div class="icon">
      <FindIcon
        class="icon-svg"
        :class="{ 'is-active': !editor?.state?.selection?.empty }"/>
    </div>
    <div class="name">
      查找
    </div>
  </div>
  <CreateBindKnowledgeModal
    :searchValue="searchingKeyword"
    v-if="isCreateBindKnowledgeModalVisible"
    @close="handleCreateBindKnowledgeModalClose"
    :is-modal-visible="isCreateBindKnowledgeModalVisible"></CreateBindKnowledgeModal>
</template>

<script lang="ts" setup>
import { Editor } from '@tiptap/vue-3';
import { defineProps, PropType, ref } from 'vue';
import { FindIcon } from '@/components/icons';
import CreateBindKnowledgeModal
  from '@/views/repository-editor/toolbar/create-or-bind-knowledge-modal/create-or-bind-knowledge-modal.vue';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  }
});
const searchingKeyword = ref('');
const isCreateBindKnowledgeModalVisible = ref<boolean>(false);
const handleCreateBindKnowledgeModalClose = () => {
  isCreateBindKnowledgeModalVisible.value = false;
};
const handleCreateBindKnowledgeModalOpen = () => {
  isCreateBindKnowledgeModalVisible.value = true;
};
// 增加section
const handleCreateMention = () => {
  const {
    from,
    to
  } = props.editor.value?.state.selection;
  if (!from || !to) {
    return;
  }
  const selectionContent = props.editor.value?.state.doc.textBetween(from, to, ' ');
  if (props.editor.value?.state?.selection?.ranges === undefined) {
    return;
  }
  searchingKeyword.value = selectionContent;
  handleCreateBindKnowledgeModalOpen();
};
</script>
<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
