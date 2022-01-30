<template>
  <ant-form
    :model="knowledgeForm"
    layout="vertical"
    :label-col="labelCol" :wrapper-col="wrapperCol"
    class="knowledge-form-content">
    <ant-form-item label="名称" class="custom-form-item-name">
      <edit-icon
        @click="isKnowledgeNameDisabled = false"
        class="edit-icon"
        v-if="isKnowledgeNameDisabled"></edit-icon>
      <save-icon
        @click="handleSaveKnowledgeName"
        class="edit-icon"
        v-if="!isKnowledgeNameDisabled"></save-icon>
      <ant-input v-model:value="knowledgeForm.name" :disabled="isKnowledgeNameDisabled"/>
    </ant-form-item>
    <ant-form-item label="基础类型">
      <ant-select
        v-model:value="knowledgeForm.knowledgeBaseTypeId"
        disabled
        placeholder="请选择知识点基本类型">
        <ant-select-option value="606fe7b650a08412400387e6">公理</ant-select-option>
        <ant-select-option value="606fe62050a08412400387e5">名词</ant-select-option>
      </ant-select>
    </ant-form-item>
    <ant-form-item label="知识点领域">
      <div class="tag-box">
        <ant-tag v-for="item in knowledgeForm.domain">{{ item.domainName }}</ant-tag>
      </div>
      <ant-button style="display: block" type="primary" size="default" @click="handleOpenDomainModal">
        <template #icon>
          <EditOutlined/>
        </template>
        修改领域
      </ant-button>
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

    <knowledge-tag-modal
      v-if="isModalVisible"
      :isModalVisible="isModalVisible"
      :selectedTagIdsFromProp="selectedTagIdsFromProp"
      @close="handleKnowledgeTagModalClose($event)"></knowledge-tag-modal>
    <domain-select-modal
      v-if="isDomainModalVisible"
      :domain-list="domainListProp"
      :isModalVisible="isDomainModalVisible"
      @close="handleDomainModalClose($event)"></domain-select-modal>
  </ant-form>
</template>
<script lang="ts">
import {
  defineComponent, onMounted, ref, inject
} from 'vue';
import { EditOutlined } from '@ant-design/icons-vue';
import { DomainSelectModal } from '@/business';
import KnowledgeTagModal from './knowledge-base-message-form/knowledge-tag-modal.vue';
import {
  KnowledgeEdit,
  domainList,
  ownRepositoryList,
  tag,
  knowledgeForm,
  knowledgeEntityIdInjectKey,
  repositoryEntityIdInjectKey
} from './model/knowledge.edit';
import { EditIcon, SaveIcon } from '@/components/icons';

interface FormState {
  name: string;
  knowledgeBaseTypeId: string;
  domainId?: '';
  repositoryEntityId: string;
}

export default defineComponent({
  components: {
    DomainSelectModal,
    EditOutlined,
    KnowledgeTagModal,
    EditIcon,
    SaveIcon
  },
  setup() {
    const knowledgeEntityId = inject(knowledgeEntityIdInjectKey);
    const repositoryEntityId = inject(repositoryEntityIdInjectKey);
    const isKnowledgeNameDisabled = ref(true);
    const isModalVisible = ref(false);
    const modalConfirmLoading = ref(false);
    const isDomainModalVisible = ref(false);
    const knowledgeEdit = new KnowledgeEdit();
    onMounted(async () => {
      await knowledgeEdit.getDomainList();
      await knowledgeEdit.getOwnRepositoryList();
    });
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
    const domainListProp = ref<{
      domainId: string[];
      domainName?: string;
      domainBaseTypeId: string;
    }[]>();
    const handleOpenDomainModal = () => {
      isDomainModalVisible.value = true;
      domainListProp.value = knowledgeForm.domain;
    };

    async function handleKnowledgeTagModalClose(event?: {
      selectedTagList: { label: string, value: string }[]
    }) {
      isModalVisible.value = false;
      if (event && knowledgeEntityId?.value) {
        await knowledgeEdit.getKnowledge(knowledgeEntityId?.value);
      }
    }

    async function handleDomainModalClose(event?: {
      domain: {
        domainId: string[];
        domainName?: string;
        domainBaseTypeId: string;
      }[]
    }) {
      isDomainModalVisible.value = false;
      if (event && knowledgeEntityId?.value) {
        knowledgeForm.domain = event.domain;
        await knowledgeEdit.updateKnowledge(knowledgeEntityId.value, {
          domain: event.domain
        });
        await knowledgeEdit.getKnowledge(knowledgeEntityId?.value as string);
      }
    }

    async function handleSaveKnowledgeName() {
      if (knowledgeEntityId?.value) {
        await knowledgeEdit.updateKnowledge(knowledgeEntityId.value, {
          name: knowledgeForm.name
        });
        await knowledgeEdit.getKnowledge(knowledgeEntityId.value);
        isKnowledgeNameDisabled.value = true;
      }
    }

    return {
      labelCol: { span: 8 },
      wrapperCol: { offset: 0 },
      knowledgeForm,
      domainList,
      ownRepositoryList,
      repositoryEntityId,
      isModalVisible,
      handleModalOk,
      handleOpenModal,
      modalConfirmLoading,
      handleKnowledgeTagModalClose,
      selectedTagIdsFromProp,
      isDomainModalVisible,
      handleDomainModalClose,
      handleOpenDomainModal,
      domainListProp,
      isKnowledgeNameDisabled,
      handleSaveKnowledgeName
    };
  },
});
</script>
<style lang="scss" scoped>
.knowledge-form-content {
  padding: 0 15px;

  .custom-form-item-name {
    position: relative;

    .edit-icon {
      position: absolute;
      right: 5px;
      top: -25px;
      cursor: pointer;
      font-size: 18px;
    }
  }

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
