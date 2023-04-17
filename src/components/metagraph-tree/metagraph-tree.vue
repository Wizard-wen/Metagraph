<template>
  <metagraph-tree-item
    @control="handleControl($event)"
    @selectedChange="handleSelectedChange"
    :active-item-id="activeItemId"
    :ui-tree-list="uiTreeList"></metagraph-tree-item>
</template>

<script lang="ts" setup>
import MetagraphTreeItem from '@/components/metagraph-tree/metagraph-tree-item.vue';
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
const emit = defineEmits(['selectedChange', 'control']);
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

function handleControl($event: any) {
  emit('control', $event);
}
</script>

<style scoped lang="scss">

</style>
