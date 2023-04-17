<template>
  <div class="sidebar left-sidebar">
    <metagraph-tab-bar
      :is-editable="isEditable"
      :current-key="currentBar"
      @selectedChange="handleBarChange"
      :element-tabs="sidebarElementList"></metagraph-tab-bar>
    <knowledge-mentioned-list
      v-if="currentBar === 'mention'"></knowledge-mentioned-list>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import MetagraphTabBar from '@/components/metagraph-tab-bar.vue';
import KnowledgeMentionedList from './knowledge-editor-left-sidebar/knowledge-mentioned-list.vue';

const isEditable = ref(true);
const currentBar = ref<string>('mention');
const sidebarElementList = ref<{
  value: string;
  label: string;
  isAuth: boolean
}[]>([{
  label: '引用',
  value: 'mention',
  isAuth: true
}]);

function handleBarChange(value: string) {
  currentBar.value = value;
}
</script>

<style scoped lang="scss">
@import '../../style/common.scss';
.left-sidebar {
  width: 220px;
  border-right: 1px solid $borderColor;
}
.sidebar {
  border-left: solid 1px $borderColor;
  background-color: #fff;
  min-height: 100%;
  display: flex;
  flex-direction: column;

  .content {
    font-size: 13px;
    overflow-y: auto;
  }
}
</style>
