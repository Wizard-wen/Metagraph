<template>
  <div class="entity-list">
    <toolbar-entity-list-item
      :entityType="'Knowledge'"></toolbar-entity-list-item>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
} from 'vue';
import ToolbarEntityListItem from './toolbar.entity.list.item.vue';

export default defineComponent({
  components: {
    ToolbarEntityListItem
  }
});
</script>

<style scoped lang="scss">
.entity-list {
  height: calc(100vh - 88px);

  .toolbar-entity-list-item {
    height: 100%;
    overflow: scroll;
  }
}
</style>
