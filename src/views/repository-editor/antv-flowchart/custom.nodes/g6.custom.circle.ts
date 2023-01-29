/**
 * @author songxiwen
 * @date  2022/5/15 16:31
 */
import { Graph } from '@antv/x6';
import { CustomNodeEnum, g6CustomPortData } from './g6.custom.port.data';

export function initCustomCircle() {
  Graph.registerNode(
    CustomNodeEnum.Circle,
    {
      inherit: 'circle',
      width: 45,
      height: 45,
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
      ports: { ...g6CustomPortData },
    },
    true,
  );
}
