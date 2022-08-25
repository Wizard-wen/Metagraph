/**
 * @author songxiwen
 * @date  2022/5/15 16:27
 */
import { Graph } from "@antv/x6";
import { CustomNodeEnum, g6CustomPortData } from "./g6.custom.port.data";

export function initCustomPolygon() {
  Graph.registerNode(
    CustomNodeEnum.Polygon,
    {
      inherit: 'polygon',
      width: 66,
      height: 36,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF',
        },
        text: {
          fontSize: 12,
          fill: '#262626',
        },
      },
      ports: {
        ...g6CustomPortData,
        items: [
          {
            group: 'top',
          },
          {
            group: 'bottom',
          },
        ],
      },
    },
    true,
  )

}
