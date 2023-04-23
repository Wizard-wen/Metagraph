<template>
  <panel-description
    :title="'基本信息'"
    :description="knowledgeBaseDesc"></panel-description>
  <div class="knowledge-form-content">
    <form-panel-input-item
      :editable="formStatus.name"
      @change="handleSaveKnowledgeName($event)"
      :title="'名称'">
      <template #content>
        <ant-input
          class="custom-input-style"
          v-model:value="knowledgeBaseForm.name"
          :disabled="!formStatus.name"/>
      </template>
    </form-panel-input-item>
    <form-panel-item
      @change="handleOpenDomainModal"
      :title="'领域'">
      <template #content>
        <div class="tag-box" v-if="knowledgeBaseForm.domain.length">
          <m-tag
            :key="index"
            v-for="(item, index) in knowledgeBaseForm.domain"
            :title="item.domainName">
          </m-tag>
        </div>
      </template>
    </form-panel-item>
    <form-panel-item
      @change="handleOpenTagModal"
      :title="'标签'">
      <template #content>
        <div class="tag-box" v-if="knowledgeBaseForm.tagList.length">
          <m-tag
            :key="index"
            v-for="(item, index) in knowledgeBaseForm.tagList"
            :title="item.label">
          </m-tag>
        </div>
      </template>
    </form-panel-item>
    <form-panel-item
      @change="openSetKnowledgeCover"
      :title="'封面'">
      <template #content>
        <div class="upload-cover-image">
          <div class="cover-content" v-if="knowledgeCover">
            <img class="cover-image-style" :src="knowledgeCover.url" alt="">
          </div>
          <div v-else class="no-cover-content">
            <div class="icon">
              <FileImageOutlined class="icon-style"/>
            </div>
            <div class="message">
              图片格式png/jpg
              <br/>
              高宽像素不低于320px*320px
            </div>
          </div>
        </div>
      </template>
    </form-panel-item>
    <knowledge-tag-modal
      v-if="isTagModalVisible"
      :is-modal-visible="isTagModalVisible"
      :selectedTagIdsFromProp="selectedTagIdsFromProp"
      @close="handleKnowledgeTagModalClose($event)"></knowledge-tag-modal>
    <domain-select-modal
      v-if="isDomainModalVisible"
      :selected-domain-list="domainListProp"
      :is-modal-visible="isDomainModalVisible"
      @close="handleDomainModalClose($event)"></domain-select-modal>
  </div>
</template>
<script lang="ts" setup>
import { Input as AntInput } from 'ant-design-vue';
import { MTag } from '@/metagraph-ui';
import { computed, inject, reactive, ref } from 'vue';
import { FileImageOutlined } from '@ant-design/icons-vue';
import { DomainSelectModal } from '@/business';
import FormPanelInputItem
  from '@/views/knowledge-editor/knowledge-editor-right-sidebar/form-panel-input-item.vue';
import FormPanelItem
  from '@/views/knowledge-editor/knowledge-editor-right-sidebar/form-panel-item.vue';

import PanelDescription
  from '@/views/repository-editor/knowledge-graph-panel/knowledge-relation/panel-description.vue';
import {
  draftKnowledgeEntityIdInjectKey,
  knowledgeBaseForm,
  knowledgeCover,
  KnowledgeEdit,
  repositoryEntityIdInjectKey,
  tag
} from '../model/knowledge.edit';
import KnowledgeTagModal from './knowledge-base-message-form/knowledge-tag-modal.vue';

const draftKnowledgeEntityId = inject(draftKnowledgeEntityIdInjectKey);
const repositoryEntityId = inject(repositoryEntityIdInjectKey);

const isKnowledgeNameEditable = ref(false);
const knowledgeBaseDesc = computed<{
  title: string;
  content: string
}[]>(() => [{
  title: '名称',
  content: knowledgeBaseForm.name
}, {
  title: '类型',
  content: '名词'
}, {
  title: '知识库',
  content: knowledgeBaseForm.author
}, {
  title: '点赞',
  content: '12'
}, {
  title: '引用',
  content: '12'
}, {
  title: '评论',
  content: '12'
}, {
  title: '作者',
  content: knowledgeBaseForm.author
}, {
  title: '发布于',
  content: '2022/02/12'
}, {
  title: '更新于',
  content: '2022/02/12'
}]);

const formStatus = reactive({
  name: false,
  domain: false
});

const isTagModalVisible = ref(false);
const modalConfirmLoading = ref(false);
const isDomainModalVisible = ref(false);
const knowledgeEdit = new KnowledgeEdit();
const handleModalOk = () => {
  isTagModalVisible.value = false;
};
const selectedTagIdsFromProp = ref<string[]>([]);
const handleOpenTagModal = async () => {
  tag.currentPage = 1;
  tag.list = [];
  await knowledgeEdit.getTagList();
  selectedTagIdsFromProp.value = knowledgeBaseForm
    .tagList.map((item: { label: string, value: string }) => item.value);
  isTagModalVisible.value = true;
};
const domainListProp = ref<{
  domainId: string;
  domainName?: string;
  domainBaseTypeId: string;
}[]>();

function handleOpenDomainModal() {
  isDomainModalVisible.value = true;
  domainListProp.value = knowledgeBaseForm.domain;
}

function openSetKnowledgeCover() {
  // todo
}

async function handleKnowledgeTagModalClose(event?: {
  selectedTagList: { label: string, value: string }[]
}) {
  isTagModalVisible.value = false;
  if (event && draftKnowledgeEntityId?.value) {
    await knowledgeEdit.getKnowledge(draftKnowledgeEntityId?.value);
  }
}

async function handleDomainModalClose(event?: {
  domain: {
    domainId: string;
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

async function handleSaveKnowledgeName(event: boolean) {
  if (event) {
    formStatus.name = event;
    return;
  }
  if (draftKnowledgeEntityId?.value) {
    await knowledgeEdit.updateDraftKnowledge(draftKnowledgeEntityId.value, {
      name: knowledgeBaseForm.name
    });
    await knowledgeEdit.getKnowledge(draftKnowledgeEntityId.value);
    formStatus.name = false;
  }
}

</script>
<style lang="scss" scoped>
.custom-input-style {
  border-radius: 4px;

  &:focus {
    box-shadow: none;
  }
}

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

.upload-cover-image {
  height: 186px;
  box-sizing: border-box;
  width: 100%;
  padding: 8px 0;
  background: #fbfbfb;

  &:hover {
    background: #eee;
  }

  .cover-content {
    height: 194px;
    padding-top: 20px;

    .cover-image-style {
      object-fit: cover;
      height: 170px;
      width: 170px;
    }
  }

  .no-cover-content {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 30px 0 12px 0;
    cursor: pointer;

    .icon {
      .icon-style {
        color: #dedede;
        font-size: 40px
      }
    }

    .message {
      margin-top: 26px;
      font-size: 12px;
      line-height: 18px;
      color: #999;
      margin-bottom: 20px;
    }
  }

  .choose-cover-button {
    margin-top: 20px;
    padding: 0 12px;
    height: 30px;
    background-color: #fff;
    color: #333;
    font-size: 14px;
    line-height: 28px;
    border: 1px solid #d5d5d5;
    border-radius: 2px;
  }
}

.tag-box {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 12px;
}
</style>
