<template>
  <div id="container"></div>
</template>

<script lang="ts">
import { EdgeApiService, KnowledgeApiService, RepositoryApiService } from '@/api.service';
import {
  defineComponent, onMounted, reactive
} from 'vue';
import { Graph } from '@antv/g6';
import {
  EntityCompletelyListItemType,
  ExerciseModelType,
  KnowledgeEdgeModelType,
  KnowledgeModelType,
  KnowledgeResponseType
} from 'edu-graph-constant';

export default defineComponent({
  name: 'knowledge.map',
  setup() {
    function refreshDragedNodePosition(e: any) {
      const model = e.item.get('model');
      model.fx = e.x;
      model.fy = e.y;
    }

    const edges = reactive<{
      list?: KnowledgeEdgeModelType[]
    }>({});
    const nodes = reactive<{
      list?: EntityCompletelyListItemType[]
    }>({});

    async function getEdges() {
      const result = await EdgeApiService.getEdgeList();
      edges.list = result.data!;
    }

    async function getNodes() {
      const result = await RepositoryApiService.getEntityList();
      nodes.list = result.data!;
    }

    onMounted(async () => {
      const container = document.getElementById('container')!;
      const width = container.scrollWidth;
      const height = container.scrollHeight || 500;
      await getEdges();
      await getNodes();
      const graph = new Graph({
        container: 'container',
        width: 700,
        height: 400,
        // edgeStrength: 0.7,
        layout: {
          type: 'force',
        },
        defaultNode: {
          size: 35,
        },
        defaultEdge: {
          type: 'quadratic', // 指定边的形状为二阶贝塞尔曲线
          style: {
            stroke: '#e2e2e2',
          },
        },
        // modes: {
        //   default: ['drag-canvas', 'activate-relations'],
        // },
        // defaultNode: {
        //   size: [10, 10],
        //   /* style for the keyShape */
        //   // style: {
        //   //   lineWidth: 2,
        //   //   fill: '#DEE9FF',
        //   //   stroke: '#5B8FF9',
        //   // },
        // },
        // defaultEdge: {
        //   /* style for the keyShape */
        //   style: {
        //     stroke: '#aaa',
        //     lineAppendWidth: 2,
        //     opacity: 0.3,
        //   },
        // },
      });
      graph.data({
        nodes: nodes.list?.map(item => ({
          id: item.entity.id,
          // height: 30,
          // width: 150,
          // shape: 'custom-node',
          label: (<KnowledgeModelType | ExerciseModelType> item.content).name.substring(0, 10),
          // data: item,
        })),
        edges: edges.list?.map((item) => ({
          id: item.id,
          source: item.originKnowledgeEntityId,
          target: item.targetKnowledgeEntityId,
          labels: [item.description || ''],
          value: 100
        })),
      });
      graph.render();

      graph.on('node:dragstart', (e) => {
        graph.layout();
        refreshDragedNodePosition(e);
      });
      graph.on('node:drag', (e) => {
        const forceLayout = graph.get('layoutController').layoutMethods[0];
        forceLayout.execute();
        refreshDragedNodePosition(e);
      });
      graph.on('node:dragend', (e) => {
        if (e.item) {
          e.item.get('model').fx = null;
          e.item.get('model').fy = null;
        }
      });

      if (typeof window !== 'undefined') {
        window.onresize = () => {
          if (!graph || graph.get('destroyed')) return;
          if (!container || !container.scrollWidth || !container.scrollHeight) return;
          graph.changeSize(container.scrollWidth, container.scrollHeight);
        };
      }
    });
  }
});
</script>

<style scoped>

</style>
