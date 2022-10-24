/**
 * @author songxiwen
 * @date  2022/5/15 16:30
 */
import { Graph } from '@antv/x6';
import { g6CustomPortData, CustomNodeEnum } from './g6.custom.port.data';

export function initCustomRect(): void {
  Graph.registerNode(
    CustomNodeEnum.Rect,
    {
      inherit: 'rect',
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
      ports: { ...g6CustomPortData },
    },
    true,
  );
}
