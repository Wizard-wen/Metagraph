<template>
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
            <span>{{ childItem.name }} - {{ childItem.weight }}</span>
            <div class="control">
              <ant-button class="create-button" type="link">创建</ant-button>
            </div>
          </div>
        </ant-collapse-panel>
      </template>

    </ant-collapse>
  </div>

</template>

<script lang="ts">
import {
  defineComponent, inject, onMounted, ref
} from 'vue';
import { CaretRightOutlined } from '@ant-design/icons-vue';
import { repositoryEntityIdKey } from '@/views/editable.repository/provide.type';
import { ToolbarService, activeKey, alternativeKnowledgeList } from './toolbar';

export default defineComponent({
  name: 'alternative-knowledge-list',
  components: {
    CaretRightOutlined
  },
  setup() {
    const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
    const toolbarService = new ToolbarService();
    onMounted(async () => {
      await toolbarService.getAlternativeKnowledgeList(repositoryEntityId.value);
    });
    return {
      activeKey,
      alternativeKnowledgeList
    };
  }
});
</script>

<style scoped lang="scss">
.alternative-list {
  max-height: calc(100vh - 86px);
  overflow-y: auto;
  padding: 10px 0;

  &::v-deep(.ant-collapse) {
    border: none;
  }

  &::v-deep(.ant-collapse-header) {
    text-align: left;
    padding: 8px 8px 8px 28px;
    background: #FFFFFF;

    .ant-collapse-arrow {
      left: 10px;
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
    padding-left: 16px;
    height: 35px;
    line-height: 35px;
    text-align: left;

    &:hover {
      cursor: pointer;
      background: #0969DC;
      color: #FFFFFF;

      .create-button {
        color: #FFFFFF;
      }
    }
  }
}
</style>
