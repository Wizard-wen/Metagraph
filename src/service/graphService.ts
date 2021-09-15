import { magnetAvailabilityHighlighter } from '@/components/graph/my.shape';
import {
  Graph, Shape, Node, Edge
} from '@antv/x6';
import {
  EntityCompletelyListItemType,
  ExerciseModelType, KnowledgeEdgeModelType,
  KnowledgeModelType
} from 'edu-graph-constant';

/**
 * @author songxiwen
 * @date  2021/9/13 14:55
 */

// eslint-disable-next-line import/prefer-default-export
export class GraphService {
  static initGraph(): Graph {
    return new Graph({
      autoResize: true,
      selecting: {
        enabled: true,
        showNodeSelectionBox: true,
      },
      minimap: {
        enabled: true,
        container: document.getElementById('mini-map-container')!,
      },
      container: document.getElementById('container')!,
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
        magnetAvailable: magnetAvailabilityHighlighter,
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
          return new Shape.Edge({
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
        },
        validateConnection({
          sourceView,
          targetView,
          targetMagnet
        }) {
          console.log(sourceView, targetView, targetMagnet);
          return true;
        },
      },
    });
  }

  static generateNode(item: EntityCompletelyListItemType, hasAuth: boolean): Node {
    const ports = {
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
    const node = {
      id: item.entity.id,
      height: 30,
      width: 150,
      label: (<KnowledgeModelType | ExerciseModelType> item.content).name,
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
    if (hasAuth) {
      return new Node({
        ...node,
        ports
      });
    }
    return new Node(node);
  }

  static generateEdge(item: KnowledgeEdgeModelType): Edge {
    return new Edge({
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
    });
  }
}
