/**
 * @author songxiwen
 * @date  2022/3/23 18:20
 */

import { initDBClickEditInput } from '@/views/repository-editor/antv-flowchart/custom.nodes/g6.custom.input.edit';
import { CustomNodeEnum } from '@/views/repository-editor/antv-flowchart/custom.nodes/g6.custom.port.data';
import { Graph, Shape, Addon } from '@antv/x6';
import { insertCss } from 'insert-css';
import { reactive, ref } from 'vue';
import { initCustomCircle } from './custom.nodes/g6.custom.circle';
import { initCustomImage } from './custom.nodes/g6.custom.image';
import { initCustomPolygon } from './custom.nodes/g6.custom.polygon';
import { initCustomRect } from './custom.nodes/g6.custom.rect';
import { FlowchartService } from './flowchart.service';
import { FlowchartStencilService } from './flowchart.stencil.service';

export const graph = ref<Graph>();
export const stencil = ref<Addon.Stencil>();

export const element = reactive<{
  container: null | HTMLElement,
  stencilContainer: null | HTMLElement,
  graphContainer: null | HTMLElement
}>({
  container: null,
  stencilContainer: null,
  graphContainer: null
});

export function clearData(): void {
  graph.value?.dispose();
  graph.value = undefined;
  stencil.value = undefined;
  element.container = null;
  element.stencilContainer = null;
  element.stencilContainer = null;

  Graph.unregisterNode(CustomNodeEnum.EditInput)
}

function initDOMElement() {
  // 这里协助演示的代码，在实际项目中根据实际情况进行调整
  element.container = document.getElementById('container');
  element.stencilContainer = document.createElement('div');
  element.stencilContainer.id = 'stencil';
  element.graphContainer = document.createElement('div');
  element.graphContainer.id = 'graph-container';
  if (element.container) {
    element.container.appendChild(element.stencilContainer);
    element.container.appendChild(element.graphContainer);
  }

  insertCss(`
    #container {
      display: flex;
      border: 1px solid #dfe3e8;
    }
    #stencil {
      width: 180px;
      height: 100%;
      position: relative;
      border-right: 1px solid #dfe3e8;
    }
    #graph-container {
      width: calc(100% - 180px);
      height: 100%;
    }
    .x6-widget-stencil  {
      background-color: #fff;
    }
    .x6-widget-stencil-title {
      background-color: #fff;
    }
    .x6-widget-stencil-group-title {
      background-color: #fff !important;
    }
    .x6-widget-transform {
      margin: -1px 0 0 -1px;
      padding: 0px;
      border: 1px solid #239edd;
    }
    .x6-widget-transform > div {
      border: 1px solid #239edd;
    }
    .x6-widget-transform > div:hover {
      background-color: #3dafe4;
    }
    .x6-widget-transform-active-handle {
      background-color: #3dafe4;
    }
    .x6-widget-transform-resize {
      border-radius: 0;
    }
    .x6-widget-selection-inner {
      border: 1px solid #239edd;
    }
    .x6-widget-selection-box {
      opacity: 0;
    }
  `);
}

function initGraph(): Graph {
  if (!element.graphContainer) {
    throw new Error('graph container not init!');
  }
  return new Graph({
    container: element.graphContainer,
    grid: true,
    mousewheel: {
      enabled: true,
      zoomAtMousePosition: true,
      modifiers: 'ctrl',
      minScale: 0.5,
      maxScale: 3,
    },
    connecting: {
      router: {
        name: 'manhattan',
        args: {
          padding: 1,
        },
      },
      connector: {
        name: 'rounded',
        args: {
          radius: 8,
        },
      },
      anchor: 'center',
      connectionPoint: 'anchor',
      allowBlank: false,
      snap: {
        radius: 20,
      },
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: '#A2B1C3',
              strokeWidth: 2,
              targetMarker: {
                name: 'block',
                width: 12,
                height: 8,
              },
            },
          },
          zIndex: 0,
        });
      },
      // ValidateConnectionArgs
      validateConnection(params: any) {
        return !!params.targetMagnet;
      },
    },
    highlighting: {
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#5F95FF',
            stroke: '#5F95FF',
          },
        },
      },
    },
    resizing: true,
    rotating: true,
    // selecting: {
    //   enabled: true,
    //   rubberband: true,
    //   showNodeSelectionBox: true,
    // },
    snapline: true,
    keyboard: true,
    clipboard: true,
  });
}

function getGraphInstance(): Graph {
  if (!graph.value) {
    graph.value = initGraph();
  }
  return graph.value;
}

function initStencil(): Addon.Stencil {
  if (!element.stencilContainer) {
    throw new Error('');
  }
  const stencil = new Addon.Stencil({
    title: '流程图',
    target: getGraphInstance(),
    stencilGraphWidth: 200,
    stencilGraphHeight: 180,
    collapsable: true,
    groups: [
      {
        title: '基础流程图',
        name: 'group1',
        graphHeight: 280,
        layoutOptions: {
          rowHeight: 70,
        },
      },
      {
        title: '系统设计图',
        name: 'group2',
        graphHeight: 250,
        layoutOptions: {
          rowHeight: 70,
        },
      },
    ],
    layoutOptions: {
      columns: 2,
      columnWidth: 80,
      rowHeight: 55,
    },
  });
  element.stencilContainer.appendChild(stencil.container);
  return stencil;
}

function getStencilInstance(): Addon.Stencil {
  if (!stencil.value) {
    stencil.value = initStencil();
  }
  return stencil.value;
}

export function initFlowchart(): void {
  // 初始化元素
  initDOMElement();
  if (!element.container || !element.graphContainer || !element.stencilContainer) {
    throw new Error('');
  }
  initGraph();
  initStencil();

  const flowchartService = new FlowchartService(
    getGraphInstance(),
    element.graphContainer
  );
  flowchartService.bindKey();
  flowchartService.initEvent();

  initCustomRect();
  initCustomPolygon();
  initCustomCircle();
  initCustomImage();
  initDBClickEditInput();

  const flowchartStencilService = new FlowchartStencilService(
    getStencilInstance(),
    getGraphInstance()
  );
  flowchartStencilService.initGroup1();
  flowchartStencilService.initGroup2();
}
