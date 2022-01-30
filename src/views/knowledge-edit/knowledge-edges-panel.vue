<template>
  <div class="bind-panel">
    <ant-collapse accordion :defaultActiveKey="'1'">
      <ant-collapse-panel key="1" header="知识库内前置知识点">
        <div class="card-content">
          <div
            v-for="(item, index) in edges.target.preInnerList"
            :key="index"
            data-type="rect"
            class="dnd-rect">
            {{ item.content.name }}
          </div>
        </div>
      </ant-collapse-panel>
      <ant-collapse-panel key="2" header="知识库外前置知识点" :disabled="false">
        <div class="card-content">
          <div
            v-for="(item, index) in edges.target.preOuterList"
            :key="index"
            data-type="rect"
            class="dnd-rect">
            {{ item.content.name }}
          </div>
        </div>
      </ant-collapse-panel>
      <ant-collapse-panel key="3" header="知识库内导出知识点">
        <div class="card-content">
          <div
            v-for="(item, index) in edges.target.extendInnerList"
            :key="index"
            data-type="rect"
            class="dnd-rect">
            {{ item.content.name }}
          </div>
        </div>
      </ant-collapse-panel>
      <ant-collapse-panel key="4" header="知识库外导出知识点">
        <div
          v-for="(item, index) in edges.target.extendOuterList"
          :key="index"
          data-type="rect"
          class="dnd-rect">
          {{ item.content.name }}
        </div>
      </ant-collapse-panel>
    </ant-collapse>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { edges } from './model/knowledge.edit';

export default defineComponent({
  name: 'knowledge-edges-panel',
  setup() {
    const isInnerPre = ref(false);
    const isOuterPre = ref(false);
    return {
      edges,
      isOuterPre,
      isInnerPre
    };
  }
});
</script>

<style scoped lang="scss">
@import '../../style/common';

.card-content {
  height: 100%;
  overflow: scroll;
}

.dnd-rect {
  width: calc(100% - 6px);
  height: 40px;
  border: 1px solid $borderColor;
  text-align: center;
  line-height: 40px;
  margin: 3px auto;
  cursor: pointer;
}

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
