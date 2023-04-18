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
        v-if="currentBar === 'edge'"></knowledge-relation-edges-panel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import MetagraphTabBar from '@/components/metagraph-tab-bar.vue';
import KnowledgeBaseMessageForm
  from './knowledge-editor-right-sidebar/knowledge-base-message-form.vue';
import KnowledgeRelationEdgesPanel
  from './knowledge-editor-right-sidebar/knowledge-relation-edges-panel.vue';

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
  label: '知识关联',
  value: 'edge',
  isAuth: true
}]);

function handleBarChange(value: string) {
  currentBar.value = value;
}


// const toolbarState = reactive({
//   label: '',
//   value: '',
//   index: 0
// });
// const setToolbarState = (tab: { label: string, value: string }, index: number) => {
//   toolbarState.label = tab.label;
//   toolbarState.value = tab.value;
//   toolbarState.index = index;
// };

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
