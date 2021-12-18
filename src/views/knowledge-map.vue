<template>
  <div id="container" style="background: rgba(0,0,0,.1)"></div>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, reactive
} from 'vue';
import {
  insertCss
} from 'insert-css';
import { Graph, INode, Tooltip } from '@antv/g6';
import {
  EntityCompletelyListItemType,
  ExerciseModelType,
  KnowledgeEdgeModelType,
  KnowledgeModelType,
  KnowledgeResponseType, RepositoryModelType
} from 'metagraph-constant';
import { EdgeNoAuthApiService, RepositoryApiService, RepositoryNoAuthApiService } from '@/api.service';

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
  setup() {
    function refreshDragedNodePosition(e: any) {
      const model = e.item.get('model');
      model.fx = e.x;
      model.fy = e.y;
    }

    const edges = reactive<{
      list?: KnowledgeEdgeModelType[]
    }>({});
    const repositoryList = reactive<{
      list?: EntityCompletelyListItemType[]
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

    async function getRepositoryList() {
      const result = await RepositoryNoAuthApiService.getList({
        pageIndex: 0,
        pageSize: 1000
      });
      if (result.data) {
        repositoryList.list = result.data.list;
        combos.list = repositoryList.list.map((item) => ({
          id: item.entity.id,
          label: (item.content as RepositoryModelType).name
        }));
      }
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
            label: content.name || '',
            comboId: content.repositoryEntityId
          };
        });
      }
    }

    const tooltip = new Tooltip({
      offsetX: 10,
      offsetY: 10,
      fixToNode: [1, 0.5],
      // the types of items that allow the tooltip show up
      // 允许出现 tooltip 的 item 类型
      itemTypes: ['node', 'edge'],
      // custom the tooltip's content
      // 自定义 tooltip 内容
      getContent: (e: any) => {
        const outDiv = document.createElement('div');
        outDiv.style.width = 'fit-content';
        outDiv.style.height = 'fit-content';
        const model = e.item.getModel();
        if (e.item.getType() === 'node') {
          outDiv.innerHTML = `${model.label}`;
        } else {
          const source = e.item.getSource();
          const target = e.item.getTarget();
          outDiv.innerHTML = `来源：${source.getModel().label}<br/>去向：${target.getModel().label}`;
        }
        return outDiv;
      },
    });

    onMounted(async () => {
      const container = document.getElementById('container')!;
      const width = container.scrollWidth;
      const height = container.scrollHeight || 500;
      await getEdges();
      await getNodes();
      await getRepositoryList();
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
          type: 'comboForce',
          nodeSpacing: 10,
          // 防止重叠
          preventOverlap: true,
          preventComboOverlap: true,
          comboSpacing: 30
          // linkDistance: 100, // 指定边距离为100
        },
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
        plugins: [tooltip]
        // modes: {
        //   default: ['drag-combo', 'drag-node', 'drag-canvas', 'zoom-canvas'],
        // },
        // modes: {
        //   default: [
        //     // ...
        //     {
        //       type: 'tooltip', // 提示框
        //       formatText(model) {
        //         // 提示框文本内容
        //         const text = `名称: ${ model.label }`;
        //         return text;
        //       },
        //     },
        //   ],
        // },
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
          // label: item.description || '',
          value: 100
        })),
        combos: combos.list
      });
      graph.render();

      graph.on('node:mouseenter', (e: any) => {
        const { item } = e;
        graph.setAutoPaint(false);
        graph.getNodes().forEach((node) => {
          graph.clearItemStates(node);
          graph.setItemState(node, 'dark', true);
        });
        graph.setItemState(item, 'dark', false);
        graph.setItemState(item, 'highlight', true);
        graph.getEdges().forEach((edge) => {
          if (edge.getSource() === item) {
            graph.setItemState(edge.getTarget(), 'dark', false);
            graph.setItemState(edge.getTarget(), 'highlight', true);
            graph.setItemState(edge, 'highlight', true);
            edge.toFront();
          } else if (edge.getTarget() === item) {
            graph.setItemState(edge.getSource(), 'dark', false);
            graph.setItemState(edge.getSource(), 'highlight', true);
            graph.setItemState(edge, 'highlight', true);
            edge.toFront();
          } else {
            graph.setItemState(edge, 'highlight', false);
          }
        });
        graph.paint();
        graph.setAutoPaint(true);
      });

      function clearAllStats() {
        graph.setAutoPaint(false);
        graph.getNodes().forEach((node) => {
          graph.clearItemStates(node);
        });
        graph.getEdges().forEach((edge) => {
          graph.clearItemStates(edge);
        });
        graph.paint();
        graph.setAutoPaint(true);
      }

      graph.on('node:mouseleave', clearAllStats);
      graph.on('canvas:click', clearAllStats);
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
