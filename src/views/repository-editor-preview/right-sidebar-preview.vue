<template>
  <div class="sidebar">
    <metagraph-tab-bar
      :is-editable="isEditable"
      :current-key="currentBar"
      @selectedChange="handleBarChange"
      :element-tabs="elementTabs"></metagraph-tab-bar>
    <div class="content">
      <toolbar-entity-list
        v-if="currentBar === 'EntityList'"></toolbar-entity-list>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, inject, ref } from 'vue';
import { isEditableKey, repositoryEntityIdKey } from '@/views/repository-editor/model/provide.type';

import MetagraphTabBar from '@/components/metagraph-tab-bar.vue';
import ToolbarEntityList from './right-sidebar-preview/bind-entity-list.vue';

const isEditable = inject(isEditableKey, ref(false));
const repositoryEntityId = inject(repositoryEntityIdKey, ref(''));
const currentBar = ref<string>('EntityList');



const emit = defineEmits(['refreshSection']);
const elementTabs = ref<{ value: string; label: string; isAuth: boolean }[]>([
  {
    label: '知识点',
    value: 'EntityList',
    isAuth: false
  }
]);

function handleBarChange(value: string) {
  currentBar.value = value;
}

</script>

<style lang="scss" scoped>
@import '../../style/common.scss';

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
