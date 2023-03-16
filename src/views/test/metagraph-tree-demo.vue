<template>
  <div class="content">
    <metagraph-tree :tree-list="treeList"></metagraph-tree>
  </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue';

const treeList = ref([
  {
    title: 'section 111111111111111111111',
    name: 'a',
    key: '1',
    children: [
      {
        title: 'section 1-1',
        name: 'a',
        key: 2,
        children: [
          {
            title: 'section 1-1-1',
            name: 'aa',
            key: 3,
          }
        ]
      }
    ]
  },
  {
    title: 'section 2',
    name: 'b',
    key: '2',
  }
]);
</script>

<style scoped lang="scss">
.content {
  border: 1px solid #ccc;
  padding: 20px;
  width: 280px;
  height: max-content;
}
</style>
