<template>
  <div class="repository-list-container">
    <template
      :key="index"
      v-for="(item, index) in asideList">
      <div class="repo-item" @click="goRepositoryEditorPage(item)">
        <ant-tooltip placement="topLeft" title="克隆知识库" arrow-point-at-center>
          <clone-icon
            class="icon-style"
            v-if="item.type === 'clone'"></clone-icon>
        </ant-tooltip>
        <ant-tooltip placement="topLeft" title="私有知识库" arrow-point-at-center>
          <LockOutlined
            class="icon-style"
            v-if="item.type === 'private'"/>
        </ant-tooltip>
        <ant-tooltip placement="topLeft" title="公有知识库" arrow-point-at-center>
          <BookOutlined
            class="icon-style"
            v-if="item.type === 'public'"/>
        </ant-tooltip>
        <div class="repository-name">
          <span>{{ item.content.name }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { EntityCompletelyListItemType, RepositoryModelType } from 'metagraph-constant';
import { computed, defineProps, PropType } from 'vue';
import { BookOutlined, LockOutlined } from '@ant-design/icons-vue';
import { Tooltip as AntTooltip } from 'ant-design-vue';
import { CloneIcon } from '@/components/icons';
import { RouterUtil } from '@/utils/router.util';

const props = defineProps({
  filteredRepositoryList: {
    type: Array as PropType<EntityCompletelyListItemType[]>,
    required: true
  }
});

const asideList = computed<(EntityCompletelyListItemType & {
    type: 'private' | 'clone' | 'public'
  })[]>(() => props.filteredRepositoryList.map((item) => {
    const content = item.content as RepositoryModelType;
    let type: 'private' | 'clone' | 'public' = 'private';
    if (content.cloneFromRepositoryEntityId) {
      type = 'clone';
    }

    if (content.type === 'private' && !content.cloneFromRepositoryEntityId) {
      type = 'private';
    }
    if (content.type === 'public' && !content.cloneFromRepositoryEntityId) {
      type = 'public';
    }
    return {
      ...item,
      type
    };
  }));

async function goRepositoryEditorPage(item: EntityCompletelyListItemType) {
  RouterUtil.jumpToBlankPage('/repository/editor', {
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

  .icon-style {
    margin-right: 4px;
  }

  .repository-name {
    flex: 1;
    text-align: left;
    padding-left: 4px;
  }
}
</style>
