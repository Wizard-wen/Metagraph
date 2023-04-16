<template>
  <div class="file-panel-page">
    <file-panel-list></file-panel-list>
  </div>
</template>

<script lang="ts" setup>
import FilePanelList from './file-panel/file-panel-list.vue';
</script>

<style scoped lang="scss">
.file-panel-page {
  height: 100vh;
  width: 100%;
}
</style>
