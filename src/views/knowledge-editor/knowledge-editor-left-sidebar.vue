<template>
  <div class="sidebar left-sidebar">
    <metagraph-tab-bar
      :is-editable="isEditable"
      :current-key="currentBar"
      @selectedChange="handleBarChange"
      :element-tabs="sidebarElementList"></metagraph-tab-bar>
    <div class="content">
      <div class="mention-list-container" v-if="currentBar === 'mention'">
        <knowledge-mentioned-list></knowledge-mentioned-list>
      </div>
      <knowledge-relation-edges-panel
        v-if="currentBar === 'edge'"></knowledge-relation-edges-panel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import MetagraphTabBar from '@/components/metagraph-tab-bar.vue';
import KnowledgeMentionedList from './knowledge-editor-left-sidebar/knowledge-mentioned-list.vue';
import KnowledgeRelationEdgesPanel
  from './knowledge-editor-right-sidebar/knowledge-relation-edges-panel.vue';

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
}, {
  label: '知识关联',
  value: 'edge',
  isAuth: true
}]);

function handleBarChange(value: string) {
  currentBar.value = value;
}
</script>

<style scoped lang="scss">
@import '../../style/common.scss';

.left-sidebar {
  width: 240px;
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
    flex: 1;
    position: relative;

    .mention-list-container {
      @include custom-scroll-style;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 10px 8px;
      overflow-y: auto;
    }
  }
}
</style>
