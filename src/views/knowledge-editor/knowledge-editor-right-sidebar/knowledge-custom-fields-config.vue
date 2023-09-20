<template>
  <div
    class="panel-item"
    v-for="(item, index) in knowledgeDescList"
    :key="index">
    <div class="title">
      <div class="title-name">{{ item.classicName }}</div>
      <div class="title-control">
        <m-button :is-icon="true" :has-border="false" @click="handleEditField(item)">
          <template #icon>
            <EditOutlined/>
          </template>
        </m-button>
        <m-button :is-icon="true" :has-border="false" @click="removeField">
          <template #icon>
            <DeleteOutlined/>
          </template>
        </m-button>
      </div>
    </div>
    <div
      class="item view-item"
      v-for="(innerItem, innerIndex) in item.descList"
      :key="innerIndex">
      <div class="left">{{ innerItem.title }}</div>
      <div class="right">{{ innerItem.content }}</div>
    </div>
  </div>
  <add-field-modal
    :is-edit="true"
    :field-model="currentFieldModel"
    v-if="isFieldModalVisible"
    @close="handleAddFieldModalClose"
    :isModalVisible="isFieldModalVisible"></add-field-modal>
</template>

<script lang="ts" setup>
import { computed, createVNode, inject, ref } from 'vue';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { MButton } from '@/metagraph-ui';
import AddFieldModal
  from '@/views/knowledge-editor/knowledge-editor-middle/knowledge-custom-fields/add-field-modal.vue';
import {
  draftKnowledgeEntityIdInjectKey,
  knowledgeBaseForm,
  knowledgeCustomFields,
  KnowledgeEdit
} from '@/views/knowledge-editor/model/knowledge.edit';
import { message, Modal } from 'ant-design-vue';
import { KnowledgeApiService } from '@/api-service';

type KnowledgeConfigItemType = {
  classicName: string;
  label: string;
  grid: 1 | 2;
  type: 'Date' | 'Input' | 'Textarea';
  key: string;
  descList: {
    title: string;
    content: string;
  }[]
};
const draftKnowledgeEntityId = inject(draftKnowledgeEntityIdInjectKey);
const knowledgeEdit = new KnowledgeEdit();
const isFieldModalVisible = ref(false);
const currentFieldModel = ref<{
  label: string;
  grid: 1 | 2;
  type: 'Date' | 'Input' | 'Textarea';
  key: string;
}>();

const knowledgeDescList = computed<KnowledgeConfigItemType[]>(
  () => knowledgeCustomFields.value.map((item) => ({
    classicName: item.label,
    key: item.key,
    grid: item.grid,
    type: item.type,
    label: item.label,
    descList: [{
      title: '名称',
      content: item.label
    }, {
      title: '分栏',
      content: item.grid.toFixed()
    }, {
      title: '类型',
      content: item.type
    }]
  })));

async function removeField(item: KnowledgeConfigItemType) {
  Modal.confirm({
    title: '确定删除自定义字段吗?',
    okText: '确定',
    cancelText: '取消',
    zIndex: 9001,
    icon: createVNode(ExclamationCircleOutlined),
    content: `该操作不可逆，确定删除自定义字段${item.classicName}吗？`,
    async onOk() {
      const result = await KnowledgeApiService.removeField({
        knowledgeEntityId: draftKnowledgeEntityId?.value || '',
        customFieldKey: item.key
      });
      if(result.code === 0) {
        await knowledgeEdit.getKnowledge(draftKnowledgeEntityId?.value || '');
        message.success('删除成功！');
      }
    },
    async onCancel() {
      message.info('取消删除');
    },
  });
}

async function handleAddFieldModalClose() {
  isFieldModalVisible.value = false;
  await knowledgeEdit.getKnowledge(draftKnowledgeEntityId?.value || '');
}

function handleEditField(item: KnowledgeConfigItemType) {
  currentFieldModel.value = {
    key: item.key,
    label: item.label,
    grid: item.grid,
    type: item.type
  };
  isFieldModalVisible.value = true;
}

</script>

<style scoped lang="scss">
@import "../../../style/common.scss";

.panel-item {
  padding: 4px 0 8px;
  border-bottom: 1px solid $borderColor;
  width: 100%;

  .title {
    height: 36px;
    line-height: 36px;
    font-size: 12px;
    width: 100%;
    padding: 0 16px;
    font-weight: bold;
    text-align: left;
    display: flex;
    align-items: center;

    .title-name {
      flex: 1;
    }

    .title-control {
      display: flex;
      align-items: center;
    }
  }

  .view-item {
    &:hover {
      background: $hoverBackColor;
    }
  }

  .item {
    display: flex;
    margin: 0 16px 0 8px;
    padding: 4px 0 4px 8px;
    line-height: 20px;
    border-radius: 6px;
    font-size: 12px;
    text-align: left;
    align-items: center;

    .left {
      flex: 0 0 64px;
      color: $lightFontColor;
    }

    .right {
      flex: 1 1 auto;
      word-wrap: break-word;
      white-space: normal;
      word-break: break-all;
    }
  }
}
</style>
