<template>
  <ant-form
    :model="knowledgeBaseForm"
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
      <ant-input v-model:value="knowledgeBaseForm.name" :disabled="isKnowledgeNameDisabled"/>
    </ant-form-item>
    <ant-form-item label="基础类型">
      <ant-select
        v-model:value="knowledgeBaseForm.knowledgeBaseTypeId"
        disabled
        placeholder="请选择知识点基本类型">
        <ant-select-option value="606fe7b650a08412400387e6">公理</ant-select-option>
        <ant-select-option value="606fe62050a08412400387e5">名词</ant-select-option>
      </ant-select>
    </ant-form-item>
    <ant-form-item label="知识点领域">
      <div class="tag-box" v-if="knowledgeBaseForm.domain.length">
        <ant-tag
          :key="index"
          v-for="(item, index) in knowledgeBaseForm.domain">{{ item.domainName }}
        </ant-tag>
      </div>
      <ant-button
        style="display: block" type="primary" size="default" @click="handleOpenDomainModal">
        <template #icon>
          <EditOutlined/>
        </template>
        修改领域
      </ant-button>
    </ant-form-item>
    <ant-form-item label="知识库">
      <ant-select disabled v-model:value="repositoryEntityId">
        <ant-select-option
          :key="index"
          :value="item.entity.id"
          v-for="(item, index) in ownRepositoryList">
          {{ item.content.name }}
        </ant-select-option>
      </ant-select>
    </ant-form-item>
    <ant-form-item label="作者">
      <ant-input :value="knowledgeBaseForm.author" disabled/>
    </ant-form-item>
    <ant-form-item label="标签">
      <div class="tag-box" v-if="knowledgeBaseForm.tagList.length">
        <ant-tag
          :key="index"
          v-for="(item, index) in knowledgeBaseForm.tagList">{{ item.label }}
        </ant-tag>
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
  Button, Form, Input, Select, Tag
} from 'ant-design-vue';
import {
  defineComponent, ref, inject
} from 'vue';
import { EditOutlined } from '@ant-design/icons-vue';
import { DomainSelectModal } from '@/business';
import { EditIcon, SaveIcon } from '@/components/icons';
import KnowledgeTagModal from './knowledge-base-message-form/knowledge-tag-modal.vue';
import {
  KnowledgeEdit,
  domainList,
  ownRepositoryList,
  tag,
  knowledgeBaseForm,
  draftKnowledgeEntityIdInjectKey,
  repositoryEntityIdInjectKey
} from './model/knowledge.edit';

export default defineComponent({
  name: 'knowledge-base-message-form',
  components: {
    DomainSelectModal,
    EditOutlined,
    KnowledgeTagModal,
    EditIcon,
    SaveIcon,
    AntSelect: Select,
    AntSelectOption: Select.Option,
    AntForm: Form,
    AntFormItem: Form.Item,
    AntButton: Button,
    AntTag: Tag,
    AntInput: Input
  },
  setup() {
    const draftKnowledgeEntityId = inject(draftKnowledgeEntityIdInjectKey);
    const repositoryEntityId = inject(repositoryEntityIdInjectKey);
    const isKnowledgeNameDisabled = ref(true);
    const isModalVisible = ref(false);
    const modalConfirmLoading = ref(false);
    const isDomainModalVisible = ref(false);
    const knowledgeEdit = new KnowledgeEdit();
    const handleModalOk = () => {
      isModalVisible.value = false;
    };
    const selectedTagIdsFromProp = ref<string[]>([]);
    const handleOpenModal = async () => {
      tag.currentPage = 1;
      tag.list = [];
      await knowledgeEdit.getTagList();
      selectedTagIdsFromProp.value = knowledgeBaseForm
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
      domainListProp.value = knowledgeBaseForm.domain;
    };

    async function handleKnowledgeTagModalClose(event?: {
      selectedTagList: { label: string, value: string }[]
    }) {
      isModalVisible.value = false;
      if (event && draftKnowledgeEntityId?.value) {
        await knowledgeEdit.getKnowledge(draftKnowledgeEntityId?.value);
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
      if (event && draftKnowledgeEntityId?.value) {
        knowledgeBaseForm.domain = event.domain;
        await knowledgeEdit.updateDraftKnowledge(draftKnowledgeEntityId.value, {
          domain: event.domain
        });
        await knowledgeEdit.getKnowledge(draftKnowledgeEntityId?.value as string);
      }
    }

    async function handleSaveKnowledgeName() {
      if (draftKnowledgeEntityId?.value) {
        await knowledgeEdit.updateDraftKnowledge(draftKnowledgeEntityId.value, {
          name: knowledgeBaseForm.name
        });
        await knowledgeEdit.getKnowledge(draftKnowledgeEntityId.value);
        isKnowledgeNameDisabled.value = true;
      }
    }

    return {
      labelCol: { span: 8 },
      wrapperCol: { offset: 0 },
      knowledgeBaseForm,
      domainList,
      ownRepositoryList,
      repositoryEntityId,
      isModalVisible,
      modalConfirmLoading,
      selectedTagIdsFromProp,
      isDomainModalVisible,
      domainListProp,
      isKnowledgeNameDisabled,
      handleModalOk,
      handleOpenModal,
      handleKnowledgeTagModalClose,
      handleDomainModalClose,
      handleOpenDomainModal,
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
