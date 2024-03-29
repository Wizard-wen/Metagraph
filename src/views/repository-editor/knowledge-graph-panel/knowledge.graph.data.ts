/**
 * @author songxiwen
 * @date  2022/1/10 22:46
 */

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import * as AntvX6 from '@antv/x6';
import { message, Modal } from 'ant-design-vue';
import {
  EntityCompletelyListItemType,
  ExerciseModelType, KnowledgeEdgeInEdgeGroupType, KnowledgeEdgeModelType,
  KnowledgeModelType
} from 'metagraph-constant';
import { createVNode, reactive, ref } from 'vue';
import { ConfigService } from '@/config/config.service';
import { WebsocketService } from '@/service/websocket.service';
import {
  KnowledgeGraphPanel,
  newEdgeId
} from '@/views/repository-editor/knowledge-graph-panel/knowledge.graph.panel';
import {
  EdgeNoAuthApiService,
  KnowledgeNoAuthApiService,
  RepositoryApiService
} from '@/api.service';
import { RepositoryEditor } from '../model/repository-editor';

type CustomEdgeType = {
  isInnerRepository: boolean;
} & KnowledgeEdgeInEdgeGroupType;
export const isKnowledgeRelationLoading = ref(false);
export const knowledgeInEdgeList = ref<KnowledgeEdgeInEdgeGroupType[]>([]);
export const isModalVisible = ref(false);
export const selectedGraphNodeEntityId = ref();
export const entityRelationEdges = reactive<{
  entity?: EntityCompletelyListItemType,
  preInnerList: CustomEdgeType[],
  preOuterList: CustomEdgeType[],
  extendInnerList: CustomEdgeType[],
  extendOuterList: CustomEdgeType[]
}>({
  entity: undefined,
  preInnerList: [],
  preOuterList: [],
  extendInnerList: [],
  extendOuterList: []
});

export const graph = ref<AntvX6.Graph>();
export const dnd = ref<AntvX6.Addon.Dnd>();
export const websocketService = ref<WebsocketService>();

export function initWebSocket(): void {
  websocketService.value = new WebsocketService(
    // ConfigService.websocketBaseURL,
    process.env.VUE_APP_API_WEBSOCKET_BASE_URL,
    [
      {
        event: 'graph',
        handler(info) {
          // todo
        }
      }
    ]
  );
}

export class KnowledgeGraphData {
  knowledgeGraphPanel = new KnowledgeGraphPanel();

  private readonly container: {
    graph: string;
    minimap: string;
  } = {
    graph: 'container',
    minimap: 'mini-map-container'
  };

  async initData(repositoryEntityId: string, hasAuth: boolean): Promise<void> {
    this.initGraph();
    if (!graph.value) {
      return;
    }
    const result = await Promise.all([
      this.createEdges(repositoryEntityId),
      this.createNodes(repositoryEntityId, hasAuth)
    ]);
    if (result[0] === undefined || result[1] === undefined) {
      return;
    }
    graph.value.addNodes(result[1]);
    graph.value.addEdges(result[0]);
    this.initDnd(repositoryEntityId);
    KnowledgeGraphData.initEdgeMouseleaveEventHandler();
    this.initEdgeMouseenterEventHandler(repositoryEntityId, hasAuth);
    this.initEdgeRemovedEventHandler(repositoryEntityId);
    this.initNodeMovedEventHandler(repositoryEntityId);
    this.initNodeClickEventHandler(repositoryEntityId);
    KnowledgeGraphData.initEdgeChangeConnectorEventHandler();
    KnowledgeGraphData.initEdgeUnSelectedEventHandler();
    KnowledgeGraphData.initEdgeSelectedEventHandler();
    this.initEdgeConnectedEventHandler();
  }

  handleZoomInGraph() {
    graph.value?.zoom(0.1);
  }

  handleZoomOutGraph() {
    graph.value?.zoom(-0.1);
  }

  destroy() {
    graph.value?.dispose();
  }

  closeWebSocket() {
    if (!websocketService.value) {
      return;
    }
    websocketService.value.close();
  }

  dragNodeToPanel(params: {
    event: MouseEvent,
    entity: EntityCompletelyListItemType,
    repositoryEntityId: string
  }): void {
    if (!graph.value || !dnd.value) {
      return;
    }
    const ports = KnowledgeGraphData.generatePort(params.entity);
    const node = graph.value.createNode({
      id: params.entity.entity.id,
      height: 30,
      width: 150,
      label: (params.entity.content as KnowledgeModelType)?.name || '',
      data: {
        ...params.entity,
        repositoryEntityId: params.repositoryEntityId
      },
      attrs: {
        root: {
          magnet: false,
        },
        body: {
          fill: '#f5f5f5',
          stroke: '#d9d9d9',
          strokeWidth: 1,
        },
      },
      portMarkup: [
        {
          tagName: 'circle',
          selector: 'portBody',
        },
      ],
      ports,
    });
    dnd.value.start(node, params.event);
  }

  private initEdgeConnectedEventHandler() {
    if (!graph.value) {
      return;
    }
    graph.value.on('edge:connected', async ({
      edge,
      previousView,
      currentView
    }) => {
      if (edge.getSourceCell() === null || edge.getTargetCell() === null) {
        return;
      }
      const sourceCellData = edge.getSourceCell()?.data;
      const targetCellData = edge.getTargetCell()?.data;
      knowledgeInEdgeList.value = [sourceCellData, targetCellData];
      this.knowledgeGraphPanel.setKnowledgeEdgeFormState({
        temporaryEdgeId: edge.id,
        originKnowledgeEntityId: sourceCellData.entity.id,
        targetKnowledgeEntityId: targetCellData.entity.id,
        originKnowledgeEntity: sourceCellData,
        targetKnowledgeEntity: targetCellData
      });
      isModalVisible.value = true;
    });
  }

  private static initEdgeSelectedEventHandler() {
    if (!graph.value) {
      return;
    }
    graph.value.on('edge:selected', ({
      cell,
      edge
    }) => {
      edge.setAttrs({
        line: {
          stroke: '#7c68fc', // 指定 path 元素的填充色
        },
      });
    });
  }

  private static initEdgeUnSelectedEventHandler() {
    if (!graph.value) {
      return;
    }
    graph.value.on('edge:unselected', ({
      cell,
      edge
    }) => {
      edge.setAttrs({
        line: {
          stroke: '#000', // 指定 path 元素的填充色
        },
      });
    });
  }

  private static initEdgeChangeConnectorEventHandler() {
    if (!graph.value) {
      return;
    }
    graph.value.on('edge:change:connector', ({
      cell,
      edge
    }) => {
      // todo
    });
  }

  private initNodeClickEventHandler(repositoryEntityId: string) {
    if (!graph.value) {
      return;
    }
    graph.value.on('node:click', async ({ cell }) => {
      isKnowledgeRelationLoading.value = true;
      selectedGraphNodeEntityId.value = cell.id;
      await KnowledgeGraphData.getRelations(cell.id, repositoryEntityId);
      isKnowledgeRelationLoading.value = false;
    });
  }

  private static async getRelations(
    knowledgeEntityId: string,
    repositoryEntityId: string
  ): Promise<void> {
    const result = await KnowledgeNoAuthApiService.getEdgesByKnowledgeEntityId({
      knowledgeEntityId,
      repositoryEntityId
    });
    if (!result.data) {
      return;
    }
    entityRelationEdges.entity = result.data.entity;
    entityRelationEdges.extendInnerList = result.data.extendInnerList.map((item) => ({
      ...item,
      isInnerRepository: true
    }));
    entityRelationEdges.extendOuterList = result.data.extendOuterList.map((item) => ({
      ...item,
      isInnerRepository: false
    }));
    entityRelationEdges.preInnerList = result.data.preInnerList.map((item) => ({
      ...item,
      isInnerRepository: true
    }));
    entityRelationEdges.preOuterList = result.data.preOuterList.map((item) => ({
      ...item,
      isInnerRepository: false
    }));
  }

  private initNodeMovedEventHandler(repositoryEntityId: string) {
    if (!graph.value || !websocketService.value) {
      return;
    }
    graph.value.on('node:moved', async ({
      x,
      y,
      node
    }) => {
      websocketService.value?.send({
        event: 'graph',
        data: {
          entityId: node.data.entity.id,
          repositoryEntityId,
          x,
          y
        }
      });
    });
  }

  private initEdgeRemovedEventHandler(repositoryEntityId: string) {
    if (!graph.value) {
      return;
    }
    graph.value.on('edge:removed', async ({
      edge,
      options
    }) => {
      // 删除边的时候option可以自定义一个属性
      if (!options.ui) {
        return;
      }
      await this.createEdges(repositoryEntityId);
    });
  }

  private initEdgeMouseenterEventHandler(repositoryEntityId: string, hasAuth: boolean) {
    if (!graph.value) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    graph.value.on('edge:mouseenter', ({ edge }) => {
      if (hasAuth) {
        // hover展示删除按钮
        edge.addTools([
          'source-arrowhead',
          'target-arrowhead',
          // todo button 点击edge的响应事件
          // {
          //   name: 'button',
          //   args: {
          //     markup: [
          //       {
          //         tagName: 'rect',
          //         selector: 'button',
          //         attrs: {
          //           // x: 18,
          //           // y: 9,
          //           rx: 5,
          //           ry: 5,
          //           width: 50,
          //           height: 20,
          //           stroke: '#fe854f',
          //           'stroke-width': 2,
          //           fill: 'white',
          //           cursor: 'pointer',
          //         },
          //       },
          //       {
          //         tagName: 'text',
          //         textContent: 'Btn B',
          //         selector: 'icon',
          //         attrs: {
          //           fill: '#fe854f',
          //           'font-size': 10,
          //           'text-anchor': 'middle',
          //           'pointer-events': 'none',
          //           // y: '0.3em',
          //         },
          //       },
          //     ],
          //     distance: 40,
          //     onClick({ view }: any) {
          //       const edge = view.cell;
          //       // const source = edge.getSource();
          //       // const target = edge.getTarget();
          //       // edge.setSource(target);
          //       // edge.setTarget(source);
          //     },
          //   },
          // },
          {
            name: 'button-remove',
            args: {
              distance: -30,
              onClick(params: { view: any }) {
                Modal.confirm({
                  title: '确定删除知识关联?',
                  okText: '确定',
                  cancelText: '取消',
                  icon: createVNode(ExclamationCircleOutlined),
                  content: '删除关系操作不可恢复，请谨慎操作',
                  async onOk() {
                    await _this.knowledgeGraphPanel.removeEdge({
                      id: edge.id,
                      repositoryEntityId
                    });
                    graph.value?.removeEdge(params.view.cell.id, {
                      ui: true
                    });
                  },
                  onCancel() {
                    message.info('放弃删除关联');
                  },
                });
              },
            },
          },
        ]);
      }
    });
  }

  private static initEdgeMouseleaveEventHandler() {
    if (!graph.value) {
      return;
    }
    graph.value.on('edge:mouseleave', ({ edge }) => {
      edge.removeTools();
    });
  }

  private initGraph(): void {
    graph.value = new AntvX6.Graph({
      autoResize: true,
      selecting: {
        enabled: true,
        showNodeSelectionBox: true,
      },
      minimap: {
        enabled: true,
        container: document.getElementById(this.container.minimap)!,
      },
      container: document.getElementById(this.container.graph)!,
      width: window.innerWidth.valueOf() - 520,
      height: (window.innerHeight.valueOf() - 56),
      background: {
        color: '#fff', // 设置画布背景颜色
      },
      grid: {
        size: 10, // 网格大小 10px
        visible: true, // 渲染网格背景
      },
      highlighting: {
        magnetAvailable: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#47C769',
            },
          },
        },
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#31d0c6',
            },
          },
        },
      },
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        highlight: true,
        connector: 'smooth',
        connectionPoint: 'boundary',
        router: {
          name: 'er',
          args: {
            direction: 'V',
          },
        },
        createEdge() {
          const edge = new AntvX6.Shape.Edge({
            attrs: {
              line: {
                stroke: '#a0a0a0',
                strokeWidth: 1,
                targetMarker: {
                  name: 'classic',
                  size: 7,
                },
              },
            },
          });
          newEdgeId.value = edge.id;
          return edge;
        },
        validateConnection({
          sourceView,
          targetView,
          targetMagnet
        }) {
          if (!targetMagnet) {
            return false;
          }
          if (targetMagnet.getAttribute('port-group') !== 'in') {
            return false;
          }
          if (targetView) {
            const node = targetView.cell;
          }
          return true;
        },
      },
    });
  }

  private initDnd(repositoryEntityId: string): void {
    if (!graph.value) {
      return;
    }
    dnd.value = new AntvX6.Addon.Dnd({
      // 目标画布。
      target: graph.value,
      // 是否根据目标画布的缩放比例缩放拖拽的节点。
      scaled: false,
      // 拖拽结束时，而且目标节点不能添加到目标画布时，是否使用动画将代理画布移动到开始拖动的位置。
      animation: true,
      // 拖拽结束时，获取放置到目标画布的节点，默认克隆代理节点。
      // 先克隆，再验证validate
      getDropNode(draggingNode: AntvX6.Node, options: AntvX6.Addon.Dnd.GetDropNodeOptions) {
        return options.sourceNode.clone();
      },
      // 拖拽结束时，验证节点是否可以放置到目标画布中。
      async validateNode(
        droppingNode: AntvX6.Node,
        options: AntvX6.Addon.Dnd.ValidateNodeOptions
      ) {
        // 绑定节点到当前仓库
        const result = await RepositoryApiService.BindEntityToRepository({
          entityId: droppingNode.data.entity.id,
          entityType: 'Knowledge',
          repositoryEntityId: droppingNode.data.repositoryEntityId,
          position: droppingNode.position()
        });
        const position = droppingNode.position();
        // 删除原来antv x6自定义的node节点
        graph.value?.removeCell(droppingNode.id);
        // 用真实的entity id重新建立一个node
        graph.value?.addNode({
          ...options.sourceNode,
          position
        });
        if (result.code !== 0) {
          message.error('绑定实体时出错!');
        }
        isKnowledgeRelationLoading.value = true;
        // 更新当前知识库绑定的实体列表
        await new RepositoryEditor().getRepositoryBindEntityList(repositoryEntityId);
        isKnowledgeRelationLoading.value = false;
        return true;
      }
    });
  }

  private async createEdges(repositoryEntityId: string): Promise<any[] | undefined> {
    const result = await EdgeNoAuthApiService.getListByRepositoryId({
      edgeRepositoryEntityId: repositoryEntityId
    });
    if (!result.data) {
      return undefined;
    }
    return result.data.map((item: KnowledgeEdgeModelType) => ({
      id: item.id,
      source: {
        cell: `${item.originKnowledgeEntityId}`,
        port: `${item.originKnowledgeEntityId}-out`
      },
      target: {
        cell: `${item.targetKnowledgeEntityId}`,
        port: `${item.targetKnowledgeEntityId}-in`
      },
      labels: [item.description || ''],
      connector: 'rounded',
      attrs: {
        line: {
          stroke: '#a0a0a0',
          strokeWidth: 1,
          targetMarker: {
            name: 'classic',
            size: 7,
          },
        },
      },
      // todo tooltip for vue
      // tools: [
      //   {
      //     name: 'tooltip',
      //     args: {
      //       tooltip: 'Tooltip Content',
      //     },
      //   },
      // ],
    }));
  }

  private async createNodes(
    repositoryEntityId: string,
    hasAuth: boolean
  ): Promise<any[] | undefined> {
    if (!graph.value) {
      return undefined;
    }
    const result = await KnowledgeNoAuthApiService.getRepositoryKnowledgeList({
      repositoryEntityId
    });
    if (!result.data) {
      return undefined;
    }
    return result.data.list.map((item: EntityCompletelyListItemType) => {
      const ports = KnowledgeGraphData.generatePort(item);
      let node: any = {
        id: item.entity.id,
        height: 30,
        width: 150,
        label: (<KnowledgeModelType | ExerciseModelType>item.content).name,
        data: item,
        attrs: {
          root: {
            magnet: false,
          },
          body: {
            fill: '#f5f5f5',
            stroke: '#d9d9d9',
            strokeWidth: 1,
          },
        },
        portMarkup: [
          {
            tagName: 'circle',
            selector: 'portBody',
          },
        ],
      };
      if (result.data?.view[item.entity.id]) {
        node = {
          ...node,
          position: result.data.view[item.entity.id]
        };
      }
      if (hasAuth) {
        return {
          ...node,
          ports
        };
      }
      return node;
    });
  }

  private static generatePort(item: EntityCompletelyListItemType) {
    return {
      items: [
        {
          id: `${item.entity.id}-in`,
          group: 'in',
          attrs: {
            text: { text: 'in' },
          },
        },
        {
          id: `${item.entity.id}-out`,
          group: 'out',
          attrs: {
            text: { text: 'out' },
          },
        },
      ],
      groups: {
        in: {
          position: {
            name: 'left',
          },
          label: {
            position: 'left', // 标签位置
          },
          attrs: {
            portBody: {
              magnet: 'passive',
              r: 6,
              stroke: '#ffa940',
              fill: '#fff',
              strokeWidth: 2,
            },
          },
        },
        out: {
          position: {
            name: 'right',
          },
          label: {
            position: 'outside', // 标签位置
          },
          attrs: {
            portBody: {
              magnet: true,
              r: 6,
              fill: '#fff',
              stroke: '#3199FF',
              strokeWidth: 2,
            },
          },
        },
      },
    };
  }
}
