<template>
  <div class="right-sidebar-container">
    <div class="control-button-content">
      <ant-button class="full-button-style" @click="handleOpenParseTextModal">
        <template #icon>
          <UploadOutlined/>
        </template>
        解析文本
      </ant-button>
    </div>
    <div class="right-sidebar-content">
      <template v-if="alternative.target.length">
        <ant-collapse v-model="alternative.activeKey" class="custom-collapse">
          <template #expandIcon="{ isActive }">
            <caret-right-outlined :rotate="isActive ? 90 : 0"/>
          </template>
          <template
            :key="index"
            v-for="(item, index) in alternative.target">
            <ant-collapse-panel
              v-if="item.children.length"
              :header="item.article.name"
              :key="item.article.id">
              <div
                class="entity-item"
                :key="index"
                v-for="(childItem, index) in item.children">
                <div class="left">
                  <div class="knowledge-name">{{ childItem.name }}</div>
                </div>
                <div class="right">
                  <ant-tag class="custom-tag">{{ childItem.weight }}</ant-tag>
                  <PlusCircleOutlined @click="createKnowledge(childItem)"/>
                  <DeleteOutlined @click="deleteAlternativeKnowledge(childItem)"/>
                </div>
              </div>
            </ant-collapse-panel>
          </template>
        </ant-collapse>
      </template>
      <empty-view v-else></empty-view>
    </div>
  </div>
</template>

<script lang="ts">
import EmptyView from '@/components/empty-view/empty-view.vue';
import {
  defineComponent, inject, ref, createVNode
} from 'vue';
import {
  Modal, message, Collapse, Tag, Button
} from 'ant-design-vue';
import {
  CaretRightOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  UploadOutlined
} from '@ant-design/icons-vue';
import { AlternativeKnowledgeModelType } from 'metagraph-constant';
import { repositoryEntityIdKey } from '@/views/repository-editor/model/provide.type';
import { RepositoryEditor, alternative } from '../model/repository.editor';

export default defineComponent({
  name: 'alternative-knowledge-list',
  components: {
    EmptyView,
    CaretRightOutlined,
    UploadOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
    AntTag: Tag,
    AntButton: Button,
    AntCollapse: Collapse,
    AntCollapsePanel: Collapse.Panel
  },
  emits: ['open', 'createOrBindEntity'],
  setup(props, { emit }) {
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    const repositoryEditor = new RepositoryEditor();

    async function createKnowledge(childItem: AlternativeKnowledgeModelType) {
      emit('createOrBindEntity', {
        searchText: childItem.name
      });
    }

    function handleOpenParseTextModal() {
      emit('open');
    }

    async function deleteAlternativeKnowledge(childItem: AlternativeKnowledgeModelType) {
      Modal.confirm({
        title: '删除备选知识点',
        icon: createVNode(ExclamationCircleOutlined),
        content: `确定要删除备选知识点"${childItem.name}"吗?`,
        okText: '确定',
        cancelText: '取消',
        async onOk() {
          await repositoryEditor.removeAlternativeKnowledge({
            repositoryEntityId: repositoryEntityId.value,
            id: childItem.id
          });
          await repositoryEditor
            .getAlternativeKnowledgeList(repositoryEntityId.value);
        },
        onCancel() {
          message.info('取消删除！');
        },
      });
    }

    return {
      alternative,
      deleteAlternativeKnowledge,
      createKnowledge,
      handleOpenParseTextModal
    };
  }
});
</script>

<style scoped lang="scss">
@import '../../../style/common';
@import "right-sidebar.scss";

.custom-collapse {
  border: none;

  &::v-deep(.ant-collapse-header) {
    text-align: left;
    padding: 6px 15px 6px 30px !important;
    background: #f9f9f9;
    font-size: 12px;

    .ant-collapse-arrow {
      left: 12px !important;
      text-indent: 0;
    }
  }

  &::v-deep(.ant-collapse-content-box) {
    padding: 10px 0;
  }
}

.entity-item {
  height: 32px;
  line-height: 32px;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  font-size: 12px;

  &:hover {
    @include list-item-highlight;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .right {
    .custom-tag {
      padding: 0 5px;
      line-height: 18px;
      margin-right: 0;
    }

    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
  }
}
</style>
