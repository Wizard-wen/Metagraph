/**
 * @author songxiwen
 * @date  2022/4/6 16:30
 */
import { PlanApiService } from '@/api.service/plan.api.service';
import { CommonUtil } from '@/utils';
import { message } from 'ant-design-vue';
import { PlanListItemType } from 'metagraph-constant';
import { ref } from 'vue';

export const plan = ref<{
  list: any[];
  total: number;
}>({
  list: [],
  total: 0
});

export const planFilterObject = ref<{
  pageSize: number,
  pageNumber: number
}>({
  pageSize: 8,
  pageNumber: 1
});

export class PlanList {
  async getPlanList(): Promise<void> {
    const result = await PlanApiService.getList({
      pageSize: planFilterObject.value.pageSize,
      pageIndex: planFilterObject.value.pageNumber - 1
    });
    if (result.data) {
      plan.value.list = result.data.list.map((item: PlanListItemType) => {
        let status;
        let statusColor;
        if (item.deadlineDate) {
          if (
            new Date().getTime() - new Date(item.deadlineDate).getTime() < 259200
          ) {
            status = 'willExpired';
            statusColor = 'gold';
          }
          if (new Date().getTime() > new Date(item.deadlineDate).getTime()) {
            status = 'isExpired';
            statusColor = 'magenta';
          }
        }

        return {
          ...item,
          status,
          statusColor,
          deadlineDate: item.deadlineDate ? CommonUtil.formatDate(new Date(item.deadlineDate), 'yyyy-MM-dd hh:mm:ss') : undefined,
          planDate: item.planDate ? CommonUtil.formatDate(new Date(item.planDate), 'yyyy-MM-dd hh:mm:ss') : undefined
        };
      });
      plan.value.total = result.data.total;
    }
  }

  async createPlan(params: {
    name: string,
    deadlineDate?: Date,
    planDate?: Date;
    description?: string
  }): Promise<void> {
    const result = await PlanApiService.createPlan(params);
    if (result.code === 0) {
      message.success('创建成功!');
    }
  }

  async editPlan(params: {
    id: string;
    name: string,
    deadlineDate?: Date,
    planDate?: Date;
    description?: string
  }): Promise<void> {
    const result = await PlanApiService.updatePlan(params);
    if (result.code === 0) {
      message.success('编辑成功!');
    }
  }
}
