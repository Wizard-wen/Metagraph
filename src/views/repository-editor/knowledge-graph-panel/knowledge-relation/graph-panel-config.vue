<template>
  <panel-description
    :title="graphPanel.title"
    :description="graphPanel.content"></panel-description>
  <div class="panel-item">
    <div class="title">配置项</div>
    <div class="item">
      <div class="left">网格</div>
      <div class="right">
        <m-checkbox
          class="check-box-style"
          :type="'checkbox'"
          :modelValue="currentOption.grid"
          @update:modelValue="handleGridChange"
          :option-list="optionList"></m-checkbox>
      </div>
    </div>
    <div class="item">
      <div class="left">小地图</div>
      <div class="right">
        <m-checkbox
          class="check-box-style"
          :type="'checkbox'"
          :modelValue="currentOption.minimap"
          @update:modelValue="handleMinimapChange"
          :option-list="optionList"></m-checkbox>
      </div>
    </div>
    <div style="padding: 0 10px">
      <m-slider @update="handleChangeSlide" :unit="'px'" :value="slideLength"></m-slider>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { MCheckbox, MSlider } from '@/metagraph-ui';
import PanelDescription
  from '@/views/repository-editor/knowledge-graph-panel/knowledge-relation/panel-description.vue';
import { KnowledgeGraphData } from '../knowledge.graph.data';

const slideLength = ref(10);
const currentOption = ref({
  grid: 'has',
  minimap: 'has'
});
const optionList = ref([
  { key: 'has', name: '有' },
  { key: 'none', name: '无' }
]);

const graphPanel = ref({
  title: '属性',
  content: [{
    title: '知识点',
    content: '23'
  }, {
    title: '边',
    content: '23'
  }]
});

function handleGridChange($event: string) {
  currentOption.value.grid = $event;
  new KnowledgeGraphData().showGrid($event === 'has');
}

function handleMinimapChange($event: string) {
  currentOption.value.minimap = $event;
  new KnowledgeGraphData().showGrid($event === 'has');
}

function handleChangeSlide($event: number) {
  slideLength.value = $event;
}
</script>

<style scoped lang="scss">
@import "../../../../style/common.scss";

.panel-item {
  padding: 4px 0 8px;
  border-bottom: 1px solid $borderColor;
  width: 100%;

  .title {
    height: 36px;
    line-height: 36px;
    font-size: 12px;
    width: 100%;
    padding: 0 16px;
    font-weight: bold;
    text-align: left;
  }

  .view-item {
    &:hover {
      background: $hoverBackColor;
    }
  }

  .item {
    display: flex;
    margin: 0 16px 0 8px;
    padding: 4px 0 4px 8px;
    line-height: 20px;
    border-radius: 6px;
    font-size: 12px;
    text-align: left;
    align-items: center;

    .left {
      flex: 0 0 64px;
      color: $lightFontColor;
    }

    .right {
      flex: 1 1 auto;
      .check-box-style {
        width: 86px;
      }
    }
  }
}

</style>
