<template>

  <upload-word :is-upload-modal-shown="true"></upload-word>
</template>

<script lang="ts" setup>

import 'intro.js/introjs.css';
import 'metagraph-ui/dist/style.css';

import MetagraphTreeDemo from './test/metagraph-tree-demo.vue';
import UploadWord from '@/views/repository-editor/section-article-tip-tap/upload-word.vue';
</script>

<style scoped lang="scss">
.ele {
  height: 120px;
  width: 120px;
  background: red;
}
</style>
