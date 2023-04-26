<template>
  <panel-description
    v-for="item in knowledgeDescList"
    :title="item.classicName"
    :description="item.descList"></panel-description>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import {
  knowledgeBaseForm,
  knowledgeCustomFields
} from '@/views/knowledge-editor/model/knowledge.edit';
import PanelDescription
  from '@/views/repository-editor/knowledge-graph-panel/knowledge-relation/panel-description.vue';
const knowledgeDescList = computed(() => knowledgeCustomFields.value.map(item => ({
  classicName: item.label,
  descList: [{
    title: '名称',
    content: item.label
  }, {
    title: '分栏',
    content: item.grid.toFixed()
  }, {
    title: '类型',
    content: item.type
  }]
})));



const knowledgeBaseDesc = computed<{
  title: string;
  content: string
}[]>(() => [{
  title: '名称',
  content: knowledgeBaseForm.name
}, {
  title: '类型',
  content: '名词'
}, {
  title: '知识库',
  content: knowledgeBaseForm.author
}]);

</script>

<style scoped lang="scss">

</style>
