<template>
  <div class="repository-list-container">
    <template
      :key="index"
      v-for="(item, index) in asideList">
      <div class="repo-item" @click="goRepositoryEditorPage(item)">
        <operation-tooltip :desc="'克隆知识库'" :placement="'bottomLeft'">
          <clone-icon
            class="icon-style"
            v-if="item.type === 'clone'"></clone-icon>
        </operation-tooltip>
        <operation-tooltip :placement="'bottomLeft'" :desc="'私有知识库'">
          <LockOutlined
            class="icon-style"
            v-if="item.type === 'private'"/>
        </operation-tooltip>
        <operation-tooltip :placement="'bottomLeft'" :desc="'公有知识库'">
          <BookOutlined
            class="icon-style"
            v-if="item.type === 'public'"/>
        </operation-tooltip>
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
import { CloneIcon } from '@/components/icons';
import { RouterUtil } from '@/utils/router.util';
import OperationTooltip from '@/components/tiptap-text-editor/controls/operation-tooltip.vue';

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
  height: 32px;
  line-height: 32px;
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
