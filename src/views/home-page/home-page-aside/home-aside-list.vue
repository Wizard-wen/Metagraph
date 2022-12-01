<template>
  <div class="repository-list-container">
    <template
      :key="index"
      v-for="(item, index) in filteredRepositoryList">
      <div class="repo-item" @click="goRepositoryEditorPage(item)">
        <ant-tooltip placement="topLeft" title="克隆知识库" arrow-point-at-center>
          <clone-icon
            style="margin-right: 4px;"
            v-if="item.content.cloneFromRepositoryEntityId"></clone-icon>
        </ant-tooltip>
        <ant-tooltip placement="topLeft" title="私有知识库" arrow-point-at-center>
          <LockOutlined
            v-if="
        item.content.type === 'private' &&
        !item.content.cloneFromRepositoryEntityId"
            style="margin-right: 4px;"/>
        </ant-tooltip>
        <ant-tooltip placement="topLeft" title="公有知识库" arrow-point-at-center>
          <BookOutlined
            style="margin-right: 4px;"
            v-if="
        item.content.type === 'public' &&
        !item.content.cloneFromRepositoryEntityId"/>
        </ant-tooltip>
        <div class="repository-name">
          <span>{{ item.content.name }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { EntityCompletelyListItemType } from 'metagraph-constant';
import { defineProps, PropType } from 'vue';
import { BookOutlined, LockOutlined } from '@ant-design/icons-vue';
import { Tooltip as AntTooltip } from 'ant-design-vue';
import { CloneIcon } from '@/components/icons';
import { RouterUtil } from '@/utils/router.util';

defineProps({
  filteredRepositoryList: {
    type: Array as PropType<EntityCompletelyListItemType[]>,
    required: true
  }
});

async function goRepositoryEditorPage(item: EntityCompletelyListItemType) {
  RouterUtil.openNewPage('/repository/editor', {
    repositoryEntityId: item.entity.id,
    type: 'edit'
  });
}

</script>

<style scoped lang="scss">
.repo-item {
  height: 28px;
  line-height: 28px;
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  color: #24292f;
  padding-left: 12px;

  &:hover {
    border-radius: 4px;
    background: #eff0f0;
  }

  .repository-name {
    flex: 1;
    text-align: left;
    padding-left: 4px;
  }
}
</style>
