<template>
  <metagraph-tab-bar
    :is-editable="isEditable"
    :current-key="currentBar"
    @selectedChange="handleBarChange"
    :element-tabs="sidebarElementList"></metagraph-tab-bar>
  <knowledge-map-config v-if="currentBar === 'config'"></knowledge-map-config>
  <knowledge-path v-if="currentBar === 'road'"></knowledge-path>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import MetagraphTabBar from '@/components/metagraph-tab-bar.vue';
import KnowledgeMapConfig
  from '@/views/knowledge-map/knowledge-map-sidebar/knowledge-map-config.vue';
import KnowledgePath from '@/views/knowledge-map/knowledge-map-sidebar/knowledge-path.vue';

const isEditable = ref(false);
const currentBar = ref<string>('road');
const sidebarElementList = ref<{
  value: string;
  label: string;
  isAuth: boolean
}[]>([{
  label: '图配置',
  value: 'config',
  isAuth: false
}, {
  label: '知识链路',
  value: 'road',
  isAuth: false
}]);
function handleBarChange(value: string) {
  currentBar.value = value;
}
</script>

<style scoped lang="scss">

</style>
