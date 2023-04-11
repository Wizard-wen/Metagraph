<template>

  <!--  <upload-word :is-upload-modal-shown="true"></upload-word>-->
<!--  <git-style-login></git-style-login>-->
  <file-panel-list></file-panel-list>
</template>

<script lang="ts" setup>

import 'intro.js/introjs.css';
import 'metagraph-ui/dist/style.css';
import { GitStyleLogin } from '@/github.style.component';
import FilePanelList from '@/views/file-panel/file-panel-list.vue';

</script>

<style scoped lang="scss">
.ele {
  height: 120px;
  width: 120px;
  background: red;
}
</style>
