/**
 * @author songxiwen
 * @date  2022/5/15 16:42
 */

import { Node, Addon, Graph } from '@antv/x6';
import { v1 as uuidV1 } from 'uuid';
import {
  customImageShapes,
  CustomNodeEnum
} from './custom.nodes/g6.custom.port.data';

export class FlowchartStencilService {
  constructor(
    private readonly stencil: Addon.Stencil,
    private readonly graph: Graph
  ) {
  }

  initGroup1(): void {
    const r1 = this.initStartNode();
    const r2 = this.initNode2();
    const r3 = this.initNode3();
    const r4 = this.initNode4();
    const r5 = this.initNode5();
    const r6 = this.initNode6();
    const r7 = this.initNode7();
    this.stencil.load([r1, r2, r3, r4, r5, r6, r7], 'group1');
  }

  initGroup2(): void {
    const imageNodes = this.initImageNodes();
    this.stencil.load(imageNodes, 'group2');
  }

  private initNode7() {
    return this.graph.createNode({
      shape: CustomNodeEnum.EditInput,
    });
  }

  /**
   * 开始节点
   */
  private initStartNode(): Node {
    return this.graph
      .createNode({
        shape: CustomNodeEnum.Rect,
        label: '开始',
        attrs: {
          body: {
            rx: 20,
            ry: 26,
          },
        },
      });
  }

  /**
   * 过程节点
   */
  private initNode2(): Node {
    return this.graph
      .createNode({
        shape: CustomNodeEnum.Rect,
        label: '过程',
      });
  }

  /**
   * 可选过程
   */
  private initNode3(): Node {
    return this.graph
      .createNode({
        shape: CustomNodeEnum.Rect,
        attrs: {
          body: {
            rx: 6,
            ry: 6,
          },
        },
        label: '可选过程',
      });
  }

  /**
   * 决策
   */
  private initNode4(): Node {
    return this.graph
      .createNode({
        shape: CustomNodeEnum.Polygon,
        attrs: {
          body: {
            refPoints: '0,10 10,0 20,10 10,20',
          },
        },
        label: '决策',
      });
  }

  /**
   * 数据
   */
  private initNode5(): Node {
    return this.graph
      .createNode({
        shape: CustomNodeEnum.Polygon,
        attrs: {
          body: {
            refPoints: '10,0 40,0 30,20 0,20',
          },
        },
        label: '数据',
      });
  }

  private initNode6(): Node {
    return this.graph
      .createNode({
        shape: CustomNodeEnum.Circle,
        label: '连接',
      });
  }

  private initImageNodes(): Node[] {
    return customImageShapes.map((item: {
      image: string,
      label: string
    }) => this.graph
      .createNode({
        shape: CustomNodeEnum.Image,
        label: item.label,
        attrs: {
          image: {
            'xlink:href': item.image,
          },
        },
      }),);
  }
}
