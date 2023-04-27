<template>
  <div class="sidebar right-sidebar">
    <metagraph-tab-bar
      :is-editable="isEditable"
      :current-key="currentBar"
      @selectedChange="handleBarChange"
      :element-tabs="sidebarElementList"></metagraph-tab-bar>
    <div class="content">
      <knowledge-base-message-form
        v-if="currentBar === 'knowledge'"></knowledge-base-message-form>
      <knowledge-relation-edges-panel
        v-if="currentBar === 'config'"></knowledge-relation-edges-panel>
      <knowledge-history-version
        v-if="currentBar === 'history'"></knowledge-history-version>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import MetagraphTabBar from '@/components/metagraph-tab-bar.vue';
import KnowledgeBaseMessageForm
  from './knowledge-editor-right-sidebar/knowledge-base-message-form.vue';
import KnowledgeRelationEdgesPanel
  from './knowledge-editor-right-sidebar/knowledge-custom-fields-config.vue';
import KnowledgeHistoryVersion
  from '@/views/knowledge-editor/knowledge-editor-right-sidebar/knowledge-history-version.vue';

const isEditable = ref(true);
const currentBar = ref<string>('knowledge');
const sidebarElementList = ref<{
  value: string;
  label: string;
  isAuth: boolean
}[]>([{
  label: '知识点',
  value: 'knowledge',
  isAuth: true
}, {
  label: '信息栏',
  value: 'config',
  isAuth: true
}, {
  label: '历史版本',
  value: 'history',
  isAuth: true
}]);

function handleBarChange(value: string) {
  currentBar.value = value;
}

</script>

<style scoped lang="scss">
@import '../../style/common';

.right-sidebar {
  width: 300px;
  height: 100%;
}

.sidebar {
  border-left: solid 1px $borderColor;
  background-color: #fff;
  display: flex;
  flex-direction: column;

  .content {
    flex: 1;
    font-size: 13px;
    overflow-y: auto;
    @include custom-scroll-style;
  }
}
</style>
