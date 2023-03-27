/**
 * @author songxiwen
 * @date  2022/4/11 11:58
 */

import { PlanApiService } from '@/api-service';
import { message } from 'ant-design-vue';
import { PlanItemModelType, PlanModelType, PublicEntityType } from 'metagraph-constant';
import { ref } from 'vue';

export const planOptions = ref<any[]>([]);

export class AddToPlanModal {
  async getPlanTree(): Promise<void> {
    const result = await PlanApiService.getPlanTree();
    if (result.data) {
      planOptions.value = result.data.map((item: {
        children?: PlanItemModelType[]
      } & PlanModelType) => {
        if (item.children) {
          return {
            ...item,
            value: item.id,
            label: item.name,
            children: item.children.map((childItem: PlanItemModelType) => ({
              ...childItem,
              value: childItem.id,
              label: childItem.name,
              isLeaf: true
            }))
          };
        }
        return {
          ...item,
          value: item.id,
          label: item.name,
          isLeaf: true
        };
      });
      planOptions.value.forEach((item) => {
        if (item.children) {
          item.children.unshift({
            value: '',
            label: '全部',
            isLeaf: true
          });
        }
      });
    }
  }

  async bindToPlanItem(params: {
    planId: string;
    planItemId?: string;
    entityId: string;
    entityType: PublicEntityType;
  }): Promise<void> {
    const result = await PlanApiService.bindEntityToPlanItem(params);
    if (result.code === 0) {
      message.success('绑定成功');
    }
  }
}
