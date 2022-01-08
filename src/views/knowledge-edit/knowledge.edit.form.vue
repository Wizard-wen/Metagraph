<template>
  <ant-form
    :model="knowledgeForm"
    layout="vertical"
    :label-col="labelCol" :wrapper-col="wrapperCol"
    class="knowledge-form-content">
    <ant-form-item label="名称">
      <ant-input v-model:value="knowledgeForm.name"/>
    </ant-form-item>
    <ant-form-item label="基础类型">
      <ant-select v-model:value="knowledgeForm.knowledgeBaseTypeId" placeholder="请选择知识点基本类型">
        <ant-select-option value="606fe7b650a08412400387e6">公理</ant-select-option>
        <ant-select-option value="606fe62050a08412400387e5">名词</ant-select-option>
      </ant-select>
    </ant-form-item>
    <ant-form-item label="领域">
      <ant-select v-model:value="knowledgeForm.domainId" placeholder="请指定知识点领域">
        <ant-select-option
          v-for="item in domainList"
          :value="item.id">{{ item.name }}
        </ant-select-option>
      </ant-select>
    </ant-form-item>
    <ant-form-item label="知识库">
      <ant-select disabled v-model:value="repositoryEntityId">
        <ant-select-option
          :value="item.entity.id"
          v-for="item in ownRepositoryList">
          {{ item.content.name }}
        </ant-select-option>
      </ant-select>
    </ant-form-item>
    <ant-form-item label="作者">
      <ant-input :value="knowledgeForm.author" disabled/>
    </ant-form-item>
    <ant-form-item label="标签">
      <div class="tag-box">
        <ant-tag v-for="item in knowledgeForm.tagList">{{ item.label }}</ant-tag>
      </div>
      <ant-button style="display: block" type="primary" size="default" @click="handleOpenModal">
        <template #icon>
          <EditOutlined/>
        </template>
        修改标签
      </ant-button>
    </ant-form-item>
    <div class="control">
    </div>
    <knowledge-tag-modal
      v-if="isModalVisible"
      :isModalVisible="isModalVisible"
      :selectedTagIdsFromProp="selectedTagIdsFromProp"
      @close="handleKnowledgeTagModalClose($event)"></knowledge-tag-modal>
  </ant-form>
</template>
<script lang="ts">
import {
  defineComponent, onMounted, ref, inject
} from 'vue';
import { EditOutlined } from '@ant-design/icons-vue';
import KnowledgeTagModal from '@/views/knowledge-edit/knowledge-tag-modal.vue';
import {
  KnowledgeEdit,
  domainList,
  ownRepositoryList,
  tag,
  knowledgeForm,
  knowledgeEntityIdInjectKey,
  repositoryEntityIdInjectKey
} from './model/knowledge.edit';

interface FormState {
  name: string;
  knowledgeBaseTypeId: string;
  domainId?: '';
  repositoryEntityId: string;
}

export default defineComponent({
  components: {
    EditOutlined,
    KnowledgeTagModal
  },
  setup() {
    const knowledgeEntityId = inject(knowledgeEntityIdInjectKey);
    const repositoryEntityId = inject(repositoryEntityIdInjectKey);

    const isModalVisible = ref(false);
    const modalConfirmLoading = ref(false);
    const knowledgeEdit = new KnowledgeEdit();
    onMounted(async () => {
      await knowledgeEdit.getDomainList();
      await knowledgeEdit.getOwnRepositoryList();
    });
    const onSubmit = async () => {
      await knowledgeEdit.updateKnowledge(knowledgeEntityId?.value || '');
    };
    const handleModalOk = () => {
      isModalVisible.value = false;
    };
    const selectedTagIdsFromProp = ref<string[]>([]);
    const handleOpenModal = async () => {
      tag.currentPage = 1;
      tag.list = [];
      await knowledgeEdit.getTagList();
      selectedTagIdsFromProp.value = knowledgeForm
        .tagList.map((item: { label: string, value: string }) => item.value);
      isModalVisible.value = true;
    };

    async function handleKnowledgeTagModalClose(event?: {
      selectedTagList: { label: string, value: string }[]
    }) {
      isModalVisible.value = false;
      if (event && knowledgeEntityId?.value) {
        // knowledgeForm.tagList = event.selectedTagList;
        await knowledgeEdit.getKnowledge(knowledgeEntityId?.value);
      }
    }

    return {
      labelCol: { span: 6 },
      wrapperCol: { offset: 0 },
      knowledgeForm,
      domainList,
      ownRepositoryList,
      repositoryEntityId,
      onSubmit,
      isModalVisible,
      handleModalOk,
      handleOpenModal,
      modalConfirmLoading,
      handleKnowledgeTagModalClose,
      selectedTagIdsFromProp
    };
  },
});
</script>
<style lang="scss" scoped>
.knowledge-form-content {
  padding: 0 15px;

  &::v-deep(.ant-form-item) {
    margin-bottom: 10px;
  }

  .control {
    display: flex;
    justify-content: flex-start;
  }
}

.tag-box {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;
}
</style>
