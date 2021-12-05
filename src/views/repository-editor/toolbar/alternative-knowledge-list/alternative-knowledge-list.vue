<template>
  <ant-spin :spinning="isLoading">
    <div class="control">
      <ant-button class="add-alternative-button">
        <template #icon>
          <UploadIcon/>
        </template>
        解析文本
      </ant-button>
    </div>
    <div class="alternative-list">
      <ant-collapse v-model="activeKey">
        <template #expandIcon="{ isActive }">
          <caret-right-outlined :rotate="isActive ? 90 : 0"/>
        </template>
        <template
          v-for="item in alternativeKnowledgeList.target">
          <ant-collapse-panel
            v-if="item.children.length"
            :header="item.article.name"
            :key="item.article.id">
            <div
              class="entity-item"
              v-for="childItem in item.children">
              <div class="left">
                <div class="knowledge-name">{{ childItem.name }}</div>
                <ant-tag>{{ childItem.weight }}</ant-tag>
              </div>
              <div class="right">
                <create-icon></create-icon>
                <delete-icon @click="deleteAlternativeKnowledge(childItem)"></delete-icon>
              </div>
            </div>
          </ant-collapse-panel>
        </template>
      </ant-collapse>
    </div>
  </ant-spin>
</template>

<script lang="ts">
import {
  defineComponent, inject, onMounted, ref, createVNode
} from 'vue';
import { Modal } from 'ant-design-vue';
import { CaretRightOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { AlternativeKnowledgeModelType } from 'edu-graph-constant';
import { repositoryEntityIdKey } from '@/views/editable.repository/provide.type';
import { CreateIcon, DeleteIcon, UploadIcon } from '@/components/icons';
import {
  activeKey,
  alternativeKnowledgeList,
  AlternativeKnowledgeListService
} from './alternative.knowledge.list';

export default defineComponent({
  name: 'alternative-knowledge-list',
  components: {
    CaretRightOutlined,
    UploadIcon,
    CreateIcon,
    DeleteIcon
  },
  setup() {
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    const isLoading = ref<boolean>(false);
    const alternativeKnowledgeListService = new AlternativeKnowledgeListService();

    function startLoading() {
      isLoading.value = true;
    }

    function stopLoading() {
      isLoading.value = false;
    }

    async function deleteAlternativeKnowledge(childItem: AlternativeKnowledgeModelType) {
      Modal.confirm({
        title: '删除备选知识点',
        icon: createVNode(ExclamationCircleOutlined),
        content: `确定要删除备选知识点"${childItem.name}"吗?`,
        async onOk() {
          startLoading();
          await alternativeKnowledgeListService.removeAlternativeKnowledge({
            repositoryEntityId: repositoryEntityId.value,
            id: childItem.id
          });
          await alternativeKnowledgeListService
            .getAlternativeKnowledgeList(repositoryEntityId.value);
          stopLoading();
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }

    onMounted(async () => {
      startLoading();
      await alternativeKnowledgeListService
        .getAlternativeKnowledgeList(repositoryEntityId.value);
      stopLoading();
    });
    return {
      isLoading,
      activeKey,
      alternativeKnowledgeList,
      deleteAlternativeKnowledge
    };
  }
});
</script>

<style scoped lang="scss">
.control {
  width: 100%;
  padding: 10px 15px;
  .add-alternative-button {
    width: 100%;
    font-size: 14px;
  }
}

.alternative-list {
  max-height: calc(100vh - 140px);
  overflow-y: auto;
  padding-bottom: 10px;

  &::v-deep(.ant-collapse) {
    border: none;
  }

  &::v-deep(.ant-collapse-header) {
    text-align: left;
    padding: 8px 15px 8px 30px;
    background: #f9f9f9;

    .ant-collapse-arrow {
      left: 15px;
      text-indent: 0;
    }
  }

  &::v-deep(.ant-collapse-content-box) {
    padding: 16px 0;
  }

  .entity-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 25px;
    padding-right: 15px;
    height: 35px;
    text-align: left;

    &:hover {
      cursor: pointer;
      background: #0969DC;
      color: #FFFFFF;

      .create-button {
        color: #FFFFFF;
      }
    }

    .left {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .right {
      display: flex;
      gap: 15px;
      font-size: 16px;
    }
  }
}
</style>
