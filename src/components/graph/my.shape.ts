/**
 * @author songxiwen
 * @date  2021/9/2 10:43
 */
import {
  Edge, Graph, Shape, Node
} from '@antv/x6';

// 定义节点
export class MyShape extends Shape.Rect {

  getInPorts() {
    return this.getPortsByGroup('in');
  }

  getOutPorts() {
    return this.getPortsByGroup('out');
  }

  getUsedInPorts(graph: Graph) {
    console.log(graph);
    const incomingEdges = graph.getIncomingEdges(this) || [];
    return incomingEdges.map((edge: Edge) => {
      const portId = edge.getTargetPortId();
      return this.getPort(portId!);
    });
  }

  getNewInPorts(length: number) {
    return Array.from(
      {
        length,
      },
      () => ({
        group: 'in',
      }),
    );
  }

  updateInPorts(graph: Graph) {
    const minNumberOfPorts = 2;
    const ports = this.getInPorts();
    const usedPorts = this.getUsedInPorts(graph);
    const newPorts = this.getNewInPorts(
      Math.max(minNumberOfPorts - usedPorts.length, 1),
    );

    if (
      ports.length === minNumberOfPorts
      && ports.length - usedPorts.length > 0
    ) {
      // noop
    } else if (ports.length === usedPorts.length) {
      this.addPorts(newPorts);
    } else if (ports.length + 1 > usedPorts.length) {
      this.prop(
        ['ports', 'items'],
        this.getOutPorts().concat(usedPorts).concat(newPorts),
        {
          rewrite: true,
        },
      );
    }

    return this;
  }
}

// 高亮
export const magnetAvailabilityHighlighter = {
  name: 'stroke',
  args: {
    attrs: {
      fill: '#fff',
      stroke: '#47C769',
    },
  },
};
