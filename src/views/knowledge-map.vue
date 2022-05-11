<template>
  <div class="knowledge-map">
    <div class="header">
      <div class="left">
        <img
          class="logo"
          src="/hogwarts-logo.webp"
          height="32" width="32"
          @click="goHomePage"/>
        <h3 style="margin-bottom: 0">知识地图</h3>
        <ant-select
          ref="select"
          v-model:value="sourceNode"
          :placeholder="`${direction === 'left' ? '目标知识点' : '起始知识点'}`"
          style="width: 200px">
          <ant-select-option v-for="(item, index) in nodes.list" :key="index" :value="item.id">
            {{ item.name }}
          </ant-select-option>
        </ant-select>
        <arrow-right-icon
          v-if="direction === 'right'"
          @click="direction = 'left'"></arrow-right-icon>
        <arrow-left-icon
          v-if="direction === 'left'"
          @click="direction = 'right'"></arrow-left-icon>
        <ant-select
          ref="select"
          v-model:value="targetNode"
          :placeholder="`${direction === 'right' ? '目标知识点' : '起始知识点'}`"
          style="width: 200px">
          <ant-select-option v-for="(item, index) in nodes.list" :key="index" :value="item.id">
            {{ item.name }}
          </ant-select-option>
        </ant-select>
        <ant-button
          type="primary"
          @click="findPath"
          :disabled="!targetNode || !sourceNode">查询知识点关联链路
        </ant-button>
      </div>
      <ant-alert
        style="height: 36px;"
        message="该功能为体验版本，尚不完善，敬请期待！"
        type="info"
        closable
      />
    </div>
    <div class="content">
      <div class="left">
        <div class="left-header">知识点关联链路</div>
        <ant-spin :spinning="isPathLoading">
          <template v-if="path.target">
            <div class="step-length">链路步长 {{ path.target.length }}</div>
            <div v-for="(item, index) in path.target.segments" :key="index" class="step-card">
              <div>第{{ index + 1 }}步</div>
              <div>From {{ item.start.properties.name }}</div>
              <arrow-down-icon></arrow-down-icon>
              <div>To {{ item.end.properties.name }}</div>
            </div>
          </template>
          <ant-empty v-else :image="simpleImage"></ant-empty>
        </ant-spin>
      </div>
      <div class="right">
        <div class="control">
          <zoom-in-icon
            style="font-size: 25px; margin-right: 10px;cursor: pointer"
            @click="zoomIn"></zoom-in-icon>
          <zoom-out-icon
            style="font-size: 25px;cursor: pointer" @click="zoomOut"></zoom-out-icon>
        </div>
        <ant-spin :spinning="isLoading">
          <div id="container" style="background: #fff"></div>
        </ant-spin>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import {
  Empty, Alert, Select, Spin, Button
} from 'ant-design-vue';
import {
  defineComponent, onMounted, ref, reactive
} from 'vue';
import {
  insertCss
} from 'insert-css';
import { useRouter } from 'vue-router';
import {
  ArrowDownIcon, ArrowRightIcon, ArrowLeftIcon, ZoomInIcon, ZoomOutIcon
} from '@/components';
import { KnowledgeNoAuthApiService } from '@/api.service';
import {
  KnowledgeMap,
  graph,
  edges,
  nodes,
  knowledgeList,
  repositoryList,
  combos,
  tooltip
} from '@/views/knowledge-map/knowledge.map';

insertCss(`
  .g6-component-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #000;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
`);

export default defineComponent({
  name: 'knowledge-map',
  components: {
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    ZoomInIcon,
    ZoomOutIcon,
    AntAlert: Alert,
    AntSpin: Spin,
    AntEmpty: Empty,
    AntSelect: Select,
    AntSelectOption: Select.Option,
    AntButton: Button
  },
  setup() {
    function refreshDragedNodePosition(e: any) {
      const model = e.item.get('model');
      model.fx = e.x;
      model.fy = e.y;
    }

    const router = useRouter();

    const sourceNode = ref();
    const targetNode = ref();
    const isLoading = ref(false);
    const isPathLoading = ref(false);
    const path = reactive<{
      target?: {
        end: {
          properties: any
        };
        length: number;
        segments: {
          start: {
            properties: any
          },
          end: {
            properties: any
          },
          relationship: {
            properties: any
          }
        }[];
        start: {
          properties: any
        };
      }
    }>({
      target: undefined
    });
    const direction = ref<'right' | 'left'>('right');

    async function findPath() {
      isPathLoading.value = true;
      let result;
      if (direction.value === 'left') {
        result = await KnowledgeNoAuthApiService.getPath({
          originKnowledgeEntityId: targetNode.value,
          targetKnowledgeEntityId: sourceNode.value
        });
      } else {
        result = await KnowledgeNoAuthApiService.getPath({
          originKnowledgeEntityId: sourceNode.value,
          targetKnowledgeEntityId: targetNode.value
        });
      }
      if (result.data) {
        console.log(result.data);
        path.target = result.data;
        graph.value?.setItemState(path.target?.start.properties.knowledgeEntityId, 'hover', true);
      }
      isPathLoading.value = false;
      // const item = graph.value?.findById(path.target?.start.properties.knowledgeEntityId);
      // if (item) {
      //   graph.value?.updateItem(item, {
      //     style: {
      //       fill: 'red',
      //     },
      //   });
      //   graph.value?.updateCombos();
      // }
    }

    const goHomePage = async () => {
      await router.push('/');
    };

    const zoomIn = () => {
      const zoom = graph.value?.getZoom();
      console.log(zoom);
      if (zoom && zoom < 3) {
        graph.value?.zoom(1.2, {
          x: 0,
          y: 0
        });
      }
    };
    const zoomOut = () => {
      const zoom = graph.value?.getZoom();
      console.log(zoom);
      if (zoom && zoom > -3) {
        graph.value?.zoom(0.8, {
          x: 0,
          y: 0
        });
      }
    };

    const knowledgeMap = new KnowledgeMap();
    onMounted(async () => {
      // const container = document.getElementById('container');
      isLoading.value = true;
      await knowledgeMap.initGraph();
      isLoading.value = false;
      // if (typeof window !== 'undefined') {
      //   window.onresize = () => {
      //     if (!graph.value || graph.value.get('destroyed')) return;
      //     if (!container || !container.scrollWidth || !container.scrollHeight) return;
      //     graph.value.changeSize(container.scrollWidth, container.scrollHeight);
      //   };
      // }
    });

    return {
      graph,
      edges,
      nodes,
      knowledgeList,
      repositoryList,
      combos,
      tooltip,
      sourceNode,
      targetNode,
      isLoading,
      findPath,
      path,
      isPathLoading,
      goHomePage,
      direction,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      zoomIn,
      zoomOut
    };
  }
});
</script>

<style scoped lang="scss">
@import '../style/common.scss';

.knowledge-map {
  height: 100vh;
  width: 100vw;

  .header {
    height: 55px;
    width: 100%;
    padding: 0 30px;
    border-bottom: 1px solid $borderColor;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;

      .logo {
        margin-right: 10px;
        cursor: pointer
      }
    }

  }

  .content {
    display: flex;

    .left {
      width: 260px;
      height: calc(100vh - 55px);
      border-right: 1px solid $borderColor;

      .left-header {
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid $borderColor;
      }

      .step-length {
        height: 50px;
        line-height: 50px;
        margin-bottom: 15px;
      }

      .step-card {
        margin-bottom: 15px;
      }
    }

    .right {
      height: calc(100vh - 50px);
      flex: 1;
      overflow: hidden;
      position: relative;

      .control {
        padding: 5px 10px;
        position: absolute;
        z-index: 4;
        right: 0;
        top: 0;
      }
    }
  }
}
</style>
