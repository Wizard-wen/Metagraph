<template>
  <div class="sidebar">
    <metagraph-tab-bar
      :is-editable="true"
      :current-key="currentBar"
      @selectedChange="handleBarChange"
      :element-tabs="elementTabs"></metagraph-tab-bar>
    <div class="content">
      <plan-entity-list v-if="currentBar === 'Entity'"></plan-entity-list>
      <plan-base-message v-if="currentBar === 'Base'"></plan-base-message>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import MetagraphTabBar from '@/components/metagraph-tab-bar.vue';
import PlanEntityList from '@/views/plan/plan-board/rightbar/plan-entity-list.vue';
import PlanBaseMessage from '@/views/plan/plan-board/rightbar/plan-base-message.vue';

const currentBar = ref<string>('Base');

const elementTabs = ref<{ value: string; label: string; isAuth: boolean }[]>([
  {
    label: '基本信息',
    value: 'Base',
    isAuth: true
  },
  {
    label: '实体',
    value: 'Entity',
    isAuth: true
  },
]);

function handleBarChange(value: string) {
  currentBar.value = value;
}

</script>

<style scoped lang="scss">
@import '../../../style/common.scss';

.sidebar {
  width: 300px;
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
