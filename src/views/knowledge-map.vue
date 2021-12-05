<template>
  <div id="container" style="background: rgba(0,0,0,.1)"></div>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, reactive
} from 'vue';
import { Graph, INode } from '@antv/g6';
import {
  EntityCompletelyListItemType,
  ExerciseModelType,
  KnowledgeEdgeModelType,
  KnowledgeModelType,
  KnowledgeResponseType
} from 'edu-graph-constant';
import { EdgeNoAuthApiService, RepositoryApiService } from '@/api.service';

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
      list?: {
        id: string;
        // label: string;
        comboId: string
      }[]
    }>({});

    const combos = reactive<{
      list: { id: string, label: string }[]
    }>({
      list: []
    });

    async function getEdges() {
      const result = await EdgeNoAuthApiService.getEdgeList();
      edges.list = result.data!;
    }

    async function getNodes() {
      const result = await RepositoryApiService.getEntityList();
      if (result.data) {
        nodes.list = result.data!.map((item) => {
          const content = item.content as KnowledgeModelType;
          if (!combos.list.find((comboItem) => comboItem.id === content.repositoryEntityId)) {
            combos.list.push({ id: content.repositoryEntityId, label: content.repositoryEntityId });
          }
          return {
            // ...item,
            id: item.entity.id,
            // label: content.name,
            comboId: content.repositoryEntityId
          };
        });
      }
    }

    onMounted(async () => {
      const container = document.getElementById('container')!;
      const width = container.scrollWidth;
      const height = container.scrollHeight || 500;
      await getEdges();
      await getNodes();
      const graph = new Graph({
        container: 'container',
        // 图是否自适应画布。
        fitView: true,
        // 图自适应画布时的四周留白像素值
        fitViewPadding: 15,
        width: 1200,
        height: 800,
        // edgeStrength: 0.7,
        // layout: {
        //   type: 'force',
        //   preventOverlap: true,
        //   linkDistance: 100, // 指定边距离为100
        // },
        layout: {
          type: 'camboForce',
          // type: 'force',
          preventOverlap: true,
          linkDistance: 100, // 指定边距离为100
        },
        // defaultNode: {
        //   size: [100, 35],
        //   type: 'rect'
        // },
        // defaultEdge: {
        //   type: 'quadratic', // 指定边的形状为二阶贝塞尔曲线
        //   style: {
        //     stroke: '#e2e2e2',
        //   },
        // },

        defaultNode: {
          size: 25,
          color: '#5B8FF9',
          style: {
            lineWidth: 2,
            fill: '#C6E5FF',
          },
        },
        defaultEdge: {
          size: 2,
          color: '#e2e2e2',
        },
        nodeStateStyles: {
          // highlight: {
          //   opacity: 1
          // },
          // dark: {
          //   opacity: 0.2
          // },
          // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
          hover: {
            fill: 'lightsteelblue',
          },
          // 鼠标点击节点，即 click 状态为 true 时的样式
          click: {
            stroke: '#000',
            lineWidth: 3,
          },
        },
        // 边不同状态下的样式集合
        edgeStateStyles: {
          // 鼠标点击边，即 click 状态为 true 时的样式
          click: {
            stroke: 'steelblue',
          },
        },
        // modes: {
        //   default: ['drag-combo', 'drag-node', 'drag-canvas', 'zoom-canvas'],
        // },
        modes: {
          default: [
            // ...
            {
              type: 'tooltip', // 提示框
              formatText(model) {
                // 提示框文本内容
                const text = `label: ${model.label}<br/> class: ${model.label}`;
                return text;
              },
            },
          ],
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
        nodes: nodes.list,
        edges: edges.list?.map((item) => ({
          id: item.id,
          source: item.originKnowledgeEntityId,
          target: item.targetKnowledgeEntityId,
          label: item.description || '',
          value: 100
        })),
        combos: combos.list
      });
      graph.render();

      // graph.on('node:dragstart', (e) => {
      //   graph.layout();
      //   refreshDragedNodePosition(e);
      // });
      // graph.on('node:drag', (e) => {
      //   const forceLayout = graph.get('layoutController').layoutMethods[0];
      //   forceLayout.execute();
      //   refreshDragedNodePosition(e);
      // });
      // graph.on('node:dragend', (e) => {
      //   if (e.item) {
      //     e.item.get('model').fx = null;
      //     e.item.get('model').fy = null;
      //   }
      // });

      // if (typeof window !== 'undefined') {
      //   window.onresize = () => {
      //     if (!graph || graph.get('destroyed')) return;
      //     if (!container || !container.scrollWidth || !container.scrollHeight) return;
      //     graph.changeSize(container.scrollWidth, container.scrollHeight);
      //   };
      // }
      // graph.getNodes().forEach((node) => {
      //   graph.clearItemStates(node);
      //   graph.setItemState(node, 'dark', true);
      // });
      // const findNode = graph.find('node', (node) => node.get('model').id === '613e2dbaef07650f7deda419');
      // console.log(findNode);
      // graph.setItemState(findNode as INode,'highlight', true);
    });

    return {
      edges,
      nodes,
      combos
    };
  }
});
</script>

<style scoped>

</style>
