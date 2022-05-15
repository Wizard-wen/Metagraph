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
  <create-or-bind-knowledge-modal
    :searchValue="searchingKeyword"
    v-if="isCreateBindKnowledgeModalVisible"
    @close="handleCreateBindKnowledgeModalClose"
    :is-modal-visible="isCreateBindKnowledgeModalVisible"></create-or-bind-knowledge-modal>
</template>

<script lang="ts">
import { Editor } from '@tiptap/vue-3';
import {
  PropType, ref, defineComponent
} from 'vue';
import { FindIcon } from '@/components/icons';
import CreateOrBindKnowledgeModal
  from '@/views/repository-editor/right-sidebar/create-or-bind-knowledge-modal/create-or-bind-knowledge-modal.vue';

export default defineComponent({
  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true
    }
  },
  components: {
    CreateOrBindKnowledgeModal,
    FindIcon
  },
  setup(props) {
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
      } = props.editor?.state.selection;
      if (!from || !to) {
        return;
      }
      const selectionContent = props.editor?.state.doc.textBetween(from, to, ' ');
      if (props.editor?.state?.selection?.ranges === undefined) {
        return;
      }
      searchingKeyword.value = selectionContent;
      handleCreateBindKnowledgeModalOpen();
    };

    return {
      handleCreateMention,
      handleCreateBindKnowledgeModalClose,
      handleCreateBindKnowledgeModalOpen,
      isCreateBindKnowledgeModalVisible,
      searchingKeyword
    };
  }
});

</script>
<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
