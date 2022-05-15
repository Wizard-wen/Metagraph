/**
 * @author songxiwen
 * @date  2022/1/18 15:43
 */

import G6, {
  Graph, IEdge, INode, Tooltip
} from '@antv/g6';
import * as AntvG6 from '@antv/g6';
import { IG6GraphEvent, Item } from '@antv/g6-core';
import {
  EntityCompletelyListItemType,
  KnowledgeEdgeModelType, KnowledgeModelType, KnowledgeResponseType,
  RepositoryModelType
} from 'metagraph-constant';
import { reactive, ref } from 'vue';
import {
  EdgeNoAuthApiService, EntityNoAuthApiService, KnowledgeNoAuthApiService,
  RepositoryApiService,
  RepositoryNoAuthApiService
} from '@/api.service';

export const edges = reactive<{
  list?: KnowledgeEdgeModelType[]
}>({});
export const repositoryList = reactive<{
  list?: EntityCompletelyListItemType[]
}>({});
export const nodes = reactive<{
  list?: {
    id: string;
    // label: string;
    // comboId: string
  }[]
}>({});
export const knowledgeList = reactive<{
  target: EntityCompletelyListItemType[]
}>({
  target: []
});
export const combos = reactive<{
  list: { id: string, label: string }[]
}>({
  list: []
});

const nodeObject = ref({});
const isShow = ref(false);
export const comboIds = ref<string[]>([]);

export const graph = ref<AntvG6.Graph>();
export const tooltip = ref<any>();

export const graphData = ref();

export const styleConfig = ref({
  iconSize: {
    default: 22
  },
  fontSize: {
    default: 13
  },
  baseColor: {
    default: '#FF6F4B'
  },
  nodeColor: {
    default: '#FF6F4B'
  },
  nodeActiveColor: {
    default: '#FF6F4B'
  },
  activeColor: {
    default: '#FF6F4B'
  },
  labelColor: {
    default: 'gray'
  },
  labelActiveColor: {
    default: '#000'
  },
  edgeColor: {
    default: '#bdb8b8' // "#E8E8E8",
  },
  edgeActiveColor: {
    default: 'gray'
  },
  comboColor: {
    default: 'transparent'
  },
  activeFillColor: {
    default: 'rgba(255,111,75,.1)'
  }
});

// export const fontSize = ref(12);
// export const labelColor = ref();
// export const edgeColor = ref();

export class KnowledgeMap {
  initGrid() {
    return new G6.Grid();
  }

  async initGraph(): Promise<void> {
    this.initTooltip();
    const contextMenu = this.initContextMenu();
    const container = document.getElementById('container')!;
    const width = document.body.clientWidth - 260;
    const height = document.body.clientHeight - 55;
    graph.value = new Graph({
      container: 'container',
      width,
      height,
      // fitView: true,
      // fitViewPadding: 50,
      // minZoom: 0.00000001,

      fitCenter: true, // 图是否自适应画布
      enabledStack: true, // 设置为true，启用 redo & undo 栈功能
      autoPaint: true,
      fitViewPadding: [60, 0, 0, 0], // 画布上的四周留白宽度
      groupByTypes: false, // 必须将 groupByTypes 设置为 false，带有 combo 的图中元素的视觉层级才能合理
      animate: true, // 是否启用图的动画
      defaultNode: {
        type: 'circle', // 元素的图形
        size: 20,
        // visible: true, // 控制初次渲染显示与隐藏，若为 false，代表隐藏。默认不隐藏
        style: {
          // 包裹样式属性的字段 style 与其他属性在数据结构上并行
          // fill: "#fff", // 样式属性，元素的填充色
          // stroke: "red", // 样式属性，元素的描边色
          // ...              // 其他样式属性
          background: {
            fill: 'rgba(0,0,0,.2)',
            stroke: 'green',
            padding: [3, 2, 3, 2],
            radius: 2,
            lineWidth: 3
          }
        },
        // 标签（文字）配置属性
        labelCfg: {
          position: 'bottom',
          offset: 2,
          style: {
            fill: '#000', // 文本颜色
            stroke: '#fff', // 文本描边颜色
            lineWidth: 1, // 文本描边粗细
            opacity: 1, // 文本透明度
            fontFamily: '',
            fontSize: styleConfig.value.fontSize.default
          }
        }
      },
      defaultEdge: {
        type: 'quadratic', // 线的类型
        style: {
          lineWidth: 1,
          cursor: 'pointer',
          stroke: styleConfig.value.edgeColor.default,
          endArrow: {
            // 使用内置箭头路径函数，参数为箭头的 宽度、长度、偏移量（默认为 0，与 d 对应）
            path: G6.Arrow.triangle(2, 2),
            // d: 5,
            stroke: styleConfig.value.edgeColor.default,
            fill: styleConfig.value.edgeColor.default,
          }
        },
        labelCfg: {
          // 默认线上文字的设置
          position: 'center',
          refX: 0, // 标签在 x 方向的偏移量
          refY: 7, // 标签在 y 方向的偏移量
          autoRotate: true,
          style: {
            fill: styleConfig.value.labelColor.default, // 文本颜色
            fontSize: styleConfig.value.fontSize.default,
            fontFamily: '',
            cursor: 'pointer'
          }
        }
      },
      // 默认区域配置
      defaultCombo: {
        type: 'circle',
        size: 50,
        // fixSize: 200,
        padding: [30, 35, 50, 35],
        style: {
          fill: styleConfig.value.activeFillColor.default, // 'transparent',
          stroke: styleConfig.value.nodeColor.default // 区域描边颜色
        },
        position: 'top',
        offset: 5,
        labelCfg: {
          // 标签配置属性
          position: 'top',
          refY: 5, // 标签在 y 方向的偏移量
          style: {
            fill: styleConfig.value.nodeColor.default, // 文本颜色
            lineWidth: 1, // 文本描边粗细
            opacity: 1, // 文本透明度
            fontSize: styleConfig.value.fontSize.default
          }
        }
      },
      nodeStateStyles: {
        // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
        hover: {
          opacity: 1
        }
      },
      // 边在除默认状态外，其他状态下的样式属性（style）。例如鼠标放置（hover）、选中（select）等状态。
      edgeStateStyles: {
        // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
        hover: {
          stroke: styleConfig.value.edgeActiveColor,
          endArrow: {
            // path: G6.Arrow.triangle(2, 4, 10), // 使用内置箭头路径函数，参数为箭头的 宽度、长度、偏移量（默认为 0，与 d 对应）
            // d: 10,
            path: G6.Arrow.triangle(2, 2),
            stroke: styleConfig.value.edgeActiveColor.default,
            fill: styleConfig.value.edgeActiveColor.default
          }
        },
        active: {
          stroke: styleConfig.value.edgeActiveColor,
          endArrow: {
            // path: G6.Arrow.triangle(2, 4, 10), // 使用内置箭头路径函数，参数为箭头的 宽度、长度、偏移量（默认为 0，与 d 对应）
            // d: 10,
            path: G6.Arrow.triangle(2, 2),
            stroke: styleConfig.value.edgeActiveColor.default,
            fill: styleConfig.value.edgeActiveColor.default
          }
        },
        inactive: {
          stroke: styleConfig.value.edgeColor,
          endArrow: {
            // path: G6.Arrow.triangle(2, 4, 10), // 使用内置箭头路径函数，参数为箭头的 宽度、长度、偏移量（默认为 0，与 d 对应）
            // d: 10,
            path: G6.Arrow.triangle(2, 2),
            stroke: styleConfig.value.edgeColor.default,
            fill: styleConfig.value.edgeColor.default
          }
        }
      },
      comboStateStyles: {
        // hover: {
        //   fill: this.activeFillColor,
        //   stroke: this.nodeColor,
        // },
        active: {
          fill: styleConfig.value.activeFillColor, // 'transparent',
          stroke: styleConfig.value.nodeColor // 区域描边颜色
        },
        inactive: {
          fill: styleConfig.value.activeFillColor.default, // 'transparent',
          stroke: styleConfig.value.nodeColor.default // 区域描边颜色
        }
      },
      layout: {
        linkDistance: 120,
        type: 'comboForce',
        nodeSpacing: (d: any) => 18,
        preventOverlap: true, // 是否防止重叠
        preventNodeOverlap: true,
        // workerEnabled: true,
        center: [width / 2, height / 2], // 可选，默认为图的中心 ,这个属性没有用
        nodeSize: 20
      },
      // plugins: [contextMenu, Grid, tooltip.], // 将 minimap 实例配置到图上tooltip,
      modes: {
        // 图上行为模式的集合
        default: [
          'drag-canvas',
          'zoom-canvas',
          'collapse-expand-combo',
          'activate-relations'
        ],
        edit: [
          'click-add-node',
          'click-add-edge',
          'drag-node',
          'drag-canvas',
          'zoom-canvas'
        ]
        // Adding edge mode
      },
      plugins: [tooltip.value, contextMenu],
    });
    await this.initData();
    graph.value.render();

    this.initEvent(graph.value);
    // this.initNodeMouseEnterEvent();
    if (typeof window !== 'undefined') {
      window.onresize = () => {
        if (!graph.value || graph.value.get('destroyed')) return;
        if (!container || !container.scrollWidth || !container.scrollHeight) {
          return;
        }
        graph.value.changeSize(container.scrollWidth, container.scrollHeight);
      };
    }
  }

  activeToggle(type: string, graph: Graph) {
    if (type === 'enter') {
      const inactiveNodes = graph.findAllByState('node', 'inactive');
      const inactiveEdges = graph.findAllByState('edge', 'inactive');
      const inactiveCombos = graph.findAllByState('combo', 'inactive');
      const inactiveEls = [
        ...inactiveNodes,
        ...inactiveEdges,
        ...inactiveCombos,
      ];
      inactiveEls.forEach((item) => {
        const group = item.getContainer();
        const shapes = group.get('children');
        shapes.forEach((shape: any) => {
          shape.attr('opacity', 0.3);
        });
      });
    } else {
      const Nodes = graph.findAll('node', (node) => node.getModel().label !== '');
      const Edges = graph.findAll('edge', (node) => node.getModel().label !== '');
      const Combos = graph.findAll('combo', (node) => node.getModel().label !== '');
      const activeEls = [...Nodes, ...Edges, ...Combos];
      activeEls.forEach((item) => {
        const group = item.getContainer();
        const shapes = group.get('children');
        shapes.forEach((shape: any) => {
          shape.attr('opacity', 1);
        });
      });
    }
  }

  initTooltip(): void {
    tooltip.value = new Tooltip({
      offsetX: 10,
      offsetY: 10,
      fixToNode: [1, 0.5],
      // the types of items that allow the tooltip show up
      // 允许出现 tooltip 的 item 类型
      itemTypes: ['node', 'edge'],
      // custom the tooltip's content
      // 自定义 tooltip 内容
      getContent: (e?: IG6GraphEvent) => {
        if (!e) {
          return '';
        }
        const outDiv = document.createElement('div');
        outDiv.style.width = 'fit-content';
        outDiv.style.height = 'fit-content';
        const model = e.item?.getModel();
        if (e.item?.getType() === 'node') {
          outDiv.innerHTML = `名称：${model?.name}<br/>关联边数量：${(e.item as INode)?.getEdges().length}`;
        } else {
          const source = (e.item as IEdge)?.getSource();
          const target = (e.item as IEdge)?.getTarget();
          console.log(e.item?.getModel().data, '----- get edge model');
          const knowledgeEntityId = (
            e.item?.getModel().data as KnowledgeEdgeModelType
          )?.knowledgeEntityId;
          const sourceId = source?.getModel().id;
          const targetId = target?.getModel().id;
          const sourceName = source.getModel().name;
          const targetName = target.getModel().name;
          const belongs = knowledgeEntityId === sourceId ? sourceName : targetName;
          const relationType = sourceId === knowledgeEntityId ? '导出' : '前置';
          outDiv.innerHTML = `
来源：${source.getModel().name}<br/>
去向：${target.getModel().name}<br/>
归属于：${belongs}<br/>
关系类型：${relationType}`;
        }
        return outDiv;
      },
    });
  }

  private initNodeMouseEnterEvent() {
    if (!graph.value) {
      return;
    }
    graph.value.on('node:mouseenter', (e: any) => {
      const { item } = e;
      graph.value?.setAutoPaint(false);
      graph.value?.getNodes()
        .forEach((node) => {
          graph.value?.clearItemStates(node);
          graph.value?.setItemState(node, 'dark', true);
        });
      graph.value?.setItemState(item, 'dark', false);
      graph.value?.setItemState(item, 'highlight', true);
      graph.value?.getEdges()
        .forEach((edge) => {
          if (edge.getSource() === item) {
            graph.value?.setItemState(edge.getTarget(), 'dark', false);
            graph.value?.setItemState(edge.getTarget(), 'highlight', true);
            graph.value?.setItemState(edge, 'highlight', true);
            edge.toFront();
          } else if (edge.getTarget() === item) {
            graph.value?.setItemState(edge.getSource(), 'dark', false);
            graph.value?.setItemState(edge.getSource(), 'highlight', true);
            graph.value?.setItemState(edge, 'highlight', true);
            edge.toFront();
          } else {
            graph.value?.setItemState(edge, 'highlight', false);
          }
        });
      graph.value?.paint();
      graph.value?.setAutoPaint(true);
    });
  }

  private async initData(): Promise<void> {
    await Promise.all([
      this.initNodes(),
      this.initCombos()
    ]);
    const edges = await this.initEdge();
    console.log(combos.list);
    graphData.value = {
      nodes: nodes.list,
      edges,
      combos: combos.list
    };
    graph.value?.data(graphData.value);
  }

  async initEdge(): Promise<{
    source: string;
    target: string;
  }[]> {
    await this.getEdges();
    const enabledEdges: {
      source: string;
      target: string;
      label?: string;
      [key: string]: any
    }[] = [];
    edges.list?.forEach((item) => {
      const originKnowledge = knowledgeList.target?.find(
        (nodeItem) => nodeItem.entity.id === item.originKnowledgeEntityId
      );
      const targetKnowledge = knowledgeList.target?.find(
        (nodeItem) => nodeItem.entity.id === item.targetKnowledgeEntityId
      );
      if (originKnowledge && targetKnowledge) {
        const edgeItem = enabledEdges.find(
          (innerItem) => innerItem.source === originKnowledge.entity.id
            && innerItem.target === targetKnowledge.entity.id
        );
        if (edgeItem === undefined) {
          enabledEdges.push({
            data: item,
            properties: item,
            source: originKnowledge.entity.id,
            target: targetKnowledge.entity.id,
            type: originKnowledge.entity.id === targetKnowledge.entity.id ? 'loop' : 'quadratic'
          });
        }
      }
    });
    return enabledEdges;
  }

  private async initNodes(): Promise<void> {
    await this.getNodes();
  }

  initContextMenu() {
    return new G6.Menu({
      className: 'g6-component-contextmenu-1',
      // 需要加上父级容器的 padding-left 16 与自身偏移量 10
      offsetX: 16 + 10,
      // 需要加上父级容器的 padding-top 24 、画布兄弟元素高度、与自身偏移量 10
      offsetY: 0,
      // 在哪些类型的元素上响应
      itemTypes: ['node'],
      getContent: (e) => {
        const li = ` <li data-name='skip' class="dataName contextMenu-item">实例跳转</li>
        <li data-name='detail' class="dataName contextMenu-item">实例详情</li> `;
        return `
          <p class="title">${e?.item?.getModel().name}</p>
          <ul class="context-menu-list">
            ${li}
          </ul>`;
      },
      trigger: 'contextmenu',
      handleMenuClick: (target: HTMLElement, item: Item) => {
        console.log(target.dataset, item.getModel());
      },
    });
  }

  async initCombos(): Promise<void> {
    await this.getRepositoryList();
  }

  async getEdges(): Promise<void> {
    const result = await EdgeNoAuthApiService.getEdgeList();
    if (result.data) {
      edges.list = result.data;
    }
  }

  async getRepositoryList(): Promise<void> {
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

  async getNodes(): Promise<void> {
    const result = await EntityNoAuthApiService.getEntityListByEntityType({
      entityType: 'Knowledge'
    });
    if (result.data) {
      knowledgeList.target = result.data;
      nodes.list = result.data.map((item: EntityCompletelyListItemType) => {
        const content = item.content as KnowledgeModelType;
        const combo = comboIds.value.find((comboItem) => comboItem === content.repositoryEntityId);
        if (combo === undefined) {
          comboIds.value.push(content.repositoryEntityId);
        }
        return {
          id: item.entity.id,
          label: (content.name.length > 4 ? `${content.name?.substring(0, 4)}..` : content.name) || '',
          name: content.name,
          properties: content,
          comboId: content.repositoryEntityId
        };
      });
    }
  }

  initEvent(graph: Graph) {
    function clearAllStats() {
      graph.setAutoPaint(false);
      graph.getNodes()
        .forEach((node) => {
          graph.clearItemStates(node);
        });
      graph.getEdges()
        .forEach((edge) => {
          graph.clearItemStates(edge);
        });
      graph.paint();
      graph.setAutoPaint(true);
    }

    graph.on('node:click', (e) => {
      console.log(e.item);
      nodeObject.value = e.item?.getModel() || {};
      isShow.value = true;
    });
    // graph.on('node:dragstart', (e) => {
    //   graph.layout();
    //   this.refreshDragedNodePosition(e);
    // });
    // graph.on('node:drag', (e) => {
    //   const forceLayout = graph.get('layoutController').layoutMethods[0];
    //   forceLayout.execute();
    //   this.refreshDragedNodePosition(e);
    // });
    // graph.on('node:dragend', (e) => {
    //   if (e.item) {
    //     e.item.get('model').fx = null;
    //     e.item.get('model').fy = null;
    //   }
    // });

    graph.on('node:mouseenter', (e: IG6GraphEvent) => {
      const nodeItem = e.item; // 获取鼠标进入的节点元素对象
      if (!nodeItem) {
        return;
      }
      graph.setItemState(nodeItem, 'hover', true); // 设置当前节点的 hover 状态为 true
      // this.setState("hover", true, nodeItem);
      this.activeToggle('enter', graph);
      // const group = nodeItem.getContainer();
      // const shape = group.get("children")[0]; // 顺序根据 draw 时确定
      // shape &&
      //   shape.attr({
      //     shadowBlur: 10,
      //     shadowColor: nodeItem._cfg.model.style.fill,
      //   });
    });
    // 鼠标离开节点
    graph.on('node:mouseleave', (e) => {
      const nodeItem = e.item; // 获取鼠标离开的节点元素对象
      if (!nodeItem) {
        return;
      }
      graph.setItemState(nodeItem, 'hover', false); // 设置当前节点的 hover 状态为 false
      // this.setState("hover", false, nodeItem);
      this.activeToggle('leave', graph);
      // const group = nodeItem.getContainer();
      // const shape = group.get("children")[0]; // 顺序根据 draw 时确定
      // shape &&
      //   shape.attr({
      //     shadowBlur: 0,
      //     shadowColor: "#ddd",
      //   });
    });

    // graph.on('node:mouseenter', (e) => {
    //   const { item } = e;
    //   if (!item) {
    //     return;
    //   }
    //   graph?.setAutoPaint(false);
    //   graph?.getNodes()
    //     .forEach((node) => {
    //       graph?.clearItemStates(node);
    //       graph?.setItemState(node, 'dark', true);
    //     });
    //   graph?.setItemState(item, 'dark', false);
    //   graph?.setItemState(item, 'highlight', true);
    //   graph?.getEdges()
    //     .forEach((edge) => {
    //       if (edge.getSource() === item) {
    //         graph?.setItemState(edge.getTarget(), 'dark', false);
    //         graph?.setItemState(edge.getTarget(), 'highlight', true);
    //         graph?.setItemState(edge, 'highlight', true);
    //         edge.toFront();
    //       } else if (edge.getTarget() === item) {
    //         graph?.setItemState(edge.getSource(), 'dark', false);
    //         graph?.setItemState(edge.getSource(), 'highlight', true);
    //         graph?.setItemState(edge, 'highlight', true);
    //         edge.toFront();
    //       } else {
    //         graph?.setItemState(edge, 'highlight', false);
    //       }
    //     });
    //   graph?.paint();
    //   graph?.setAutoPaint(true);
    // });
    // graph.on('node:mouseleave', clearAllStats);

    // 鼠标进入连线
    graph.on('edge:mouseenter', (e) => {
      const edgeItem = e.item; // 获取鼠标进入的节点元素对象
      if (!edgeItem) {
        return;
      }
      graph.setItemState(edgeItem, 'hover', true); // 设置当前节点的 hover 状态为 true
      // 修改label
      const group = edgeItem.getContainer();
      const shape = group.get('children')[1]; // 顺序根据 draw 时确定
      shape
      && shape.attr({
        fill: styleConfig.value.labelActiveColor.default,
      });
    });
    // 鼠标离开连线
    graph.on('edge:mouseleave', (e) => {
      const edgeItem = e.item; // 获取鼠标离开的节点元素对象
      if (!edgeItem) {
        return;
      }
      graph.setItemState(edgeItem, 'hover', false); // 设置当前节点的 hover 状态为 false

      // 修改label
      const group = edgeItem.getContainer();
      const shape = group.get('children')[1]; // 顺序根据 draw 时确定
      shape
      && shape.attr({
        fill: styleConfig.value.labelColor.default,
      });
    });

    // graph.on('canvas:click', clearAllStats);

    // 鼠标点击画布，显示所有节点和边
    graph.on('canvas:click', (ev) => {
      // const nodes = graph.getNodes();
      // const edges = graph.getEdges();
      // nodes.forEach((node) => {
      //   node.show();
      // });
      // edges.forEach((edge) => {
      //   edge.show();
      // });
      const clickNodes = graph.findAllByState('node', 'click');
      clickNodes.forEach((cn) => {
        graph.setItemState(cn, 'click', false);
      });
      // 先将所有当前是 click 状态的节连线置为非 click 状态
      const clickEdges = graph.findAllByState('edge', 'click');
      clickEdges.forEach((cn) => {
        graph.setItemState(cn, 'click', false);
      });
      //
    });
  }

  refreshDragedNodePosition(e: any) {
    const model = e.item.get('model');
    model.fx = e.x;
    model.fy = e.y;
  }
}
