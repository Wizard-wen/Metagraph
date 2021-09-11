/**
 * @author songxiwen
 * @date  2021/9/5 21:54
 */

import { Shape } from '@antv/x6';

Shape.Rect.define({
  shape: 'my-rect',
  width: 180,
  height: 80,
  ports: {
    groups: {
      in: {
        position: 'top',
        label: {
          position: 'top',
        },
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
      out: {
        position: 'bottom',
        label: {
          position: 'bottom',
        },
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
    },
  },
});
