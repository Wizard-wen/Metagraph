/**
 * @author songxiwen
 * @date  2022/5/15 21:19
 */
import {
  CustomNodeEnum,
  g6CustomPortData
} from '@/views/repository-editor/antv-flowchart/custom.nodes/g6.custom.port.data';
import { Graph } from '@antv/x6';
import DBClickEditInput from '@/components/dbclick-edit-input/dbclick-edit-input.vue';

export function initDBClickEditInput(): void {
  Graph.registerNode(CustomNodeEnum.EditInput, {
    inherit: 'vue-shape',
    // x: 200,
    // y: 150,
    width: 66,
    height: 36,
    component: {
      template: `
        <DBClickEditInput/>`,
      components: {
        DBClickEditInput,
      },
    },
    ports: { ...g6CustomPortData },
  });
}
