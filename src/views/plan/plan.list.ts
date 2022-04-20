/**
 * @author songxiwen
 * @date  2022/4/6 16:30
 */
import { PlanApiService } from '@/api.service/plan.api.service';
import { message } from 'ant-design-vue';
import { PlanModelType } from 'metagraph-constant';
import moment from 'moment';
import { ref } from 'vue';

export const plan = ref<{
  list: any[];
  total: number;
}>({
  list: [],
  total: 0
});

export class PlanList {
  async getPlanList(): Promise<void> {
    const result = await PlanApiService.getList();
    if (result.data) {
      plan.value.list = result.data.list.map(item => {
        return {
          ...item,
          deadlineDate: moment(item.deadlineDate, 'YYYY MM DD')
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
