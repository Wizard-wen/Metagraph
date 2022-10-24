/**
 * @author songxiwen
 * @date  2022/5/15 16:32
 */

import { Graph } from "@antv/x6";
import { g6CustomPortData, CustomNodeEnum } from "./g6.custom.port.data";

export function initCustomImage() {
  Graph.registerNode(
    CustomNodeEnum.Image,
    {
      inherit: 'rect',
      width: 52,
      height: 52,
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'image',
        },
        {
          tagName: 'text',
          selector: 'label',
        },
      ],
      attrs: {
        body: {
          stroke: '#5F95FF',
          fill: '#5F95FF',
        },
        image: {
          width: 26,
          height: 26,
          refX: 13,
          refY: 16,
        },
        label: {
          refX: 3,
          refY: 2,
          textAnchor: 'left',
          textVerticalAnchor: 'top',
          fontSize: 12,
          fill: '#fff',
        },
      },
      ports: { ...g6CustomPortData },
    },
    true,
  )
}
