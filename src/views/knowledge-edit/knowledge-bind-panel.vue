<template>
  <div class="bind-panel">
    <div class="knowledge-connection">
      <div class="title">仓库内</div>
      <div class="sub-title">
        <div class="sub-item sub-title-active">前置</div>
        <div class="sub-item">导出</div>
      </div>
      <div class="content">
        <div v-for="item in edges.preInnerList">{{item.content.name}}</div>
      </div>
    </div>

    <div class="knowledge-connection">
      <div class="title">仓库外</div>
      <div class="sub-title">
        <div class="sub-item sub-title-active">前置</div>
        <div class="sub-item">导出</div>
      </div>
      <div class="content"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineProps, PropType } from 'vue';
import { EntityCompletelyListItemType } from 'edu-graph-constant';

const props = defineProps({
  edges: {
    type: Object as PropType<{
      entity: EntityCompletelyListItemType,
      preInnerList: EntityCompletelyListItemType[],
      preOuterList: EntityCompletelyListItemType[],
      extendInnerList: EntityCompletelyListItemType[],
      extendOuterList: EntityCompletelyListItemType[]
    }>,
    default: {
      preInnerList: [],
      preOuterList: [],
      extendInnerList: [],
      extendOuterList: []
    }
  }
});
</script>

<style scoped lang="scss">
.bind-panel {
  width: 100%;
  height: calc(100vh - 55px);
}

.knowledge-connection {
  width: 100%;
  height: 50%;
  border-bottom: 1px solid #ccc;

  .title {
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 16px;
    border-bottom: 1px solid #ccc;
  }

  .sub-title {
    height: 28px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    justify-items: center;
    font-size: 12px;
    border-bottom: 1px solid #ccc;

    &:hover {
      cursor: pointer;
    }

    .sub-item {
      width: 100%;
      height: 28px;
      line-height: 28px;
    }

    .sub-title-active {
      background: #1790ff;
      color: #FFFFFF;
    }
  }

  .content {
    padding: 10px 0;
  }
}
</style>
