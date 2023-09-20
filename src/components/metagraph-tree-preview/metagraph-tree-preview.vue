<template>
  <metagraph-tree-item-preview
    @selectedChange="handleSelectedChange"
    :active-item-id="activeItemId"
    :ui-tree-list="uiTreeList"></metagraph-tree-item-preview>
</template>

<script lang="ts" setup>
import MetagraphTreeItemPreview
  from '@/components/metagraph-tree-preview/metagraph-tree-item-preview.vue';
import { defineEmits, defineProps, PropType, ref, watchEffect } from 'vue';
import { TreeItemType, TreeItemUIType } from '@/components/metagraph-tree/type';

const props = defineProps({
  treeList: {
    type: Array as PropType<TreeItemType[]>,
    default: () => []
  },
  level: {
    type: Number,
    default: 0
  },
  activeItemId: {
    type: String,
    default: ''
  }
});
const uiTreeList = ref<TreeItemUIType[]>([]);
const emit = defineEmits(['selectedChange']);
watchEffect(() => {
  uiTreeList.value = props.treeList?.map((item) => ({
    ...item,
    isActive: false,
    isExpand: false
  }));
});

function handleSelectedChange(params: { id: string }) {
  emit('selectedChange', params);
}
</script>

<style scoped lang="scss">

</style>
