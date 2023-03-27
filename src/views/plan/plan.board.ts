/**
 * @author songxiwen
 * @date  2022/4/7 11:44
 */
import { PlanApiService } from '@/api-service/plan.api.service';
import { message } from 'ant-design-vue';
import {
  EntityCompletelyListItemType,
  PlanEntityModelType,
  PlanItemModelType,
  PlanModelType
} from 'metagraph-constant';
import moment, { Moment } from 'moment';
import { reactive, ref } from 'vue';

export const planBoard = ref<{
  data?: PlanModelType,
  list: {
    item: PlanItemModelType;
    entityList: EntityCompletelyListItemType[];
    entityIdList: string[];
  }[],
  todoList: {
    item: PlanItemModelType;
    entityList: EntityCompletelyListItemType[];
    entityIdList: string[];
  }[],
  doingList: {
    item: PlanItemModelType;
    entityList: EntityCompletelyListItemType[];
    entityIdList: string[];
  }[],
  doneList: {
    item: PlanItemModelType;
    entityList: EntityCompletelyListItemType[];
    entityIdList: string[];
  }[]
}>({
  data: undefined,
  list: [],
  todoList: [],
  doingList: [],
  doneList: []
});

export const planBindEntityList = ref<{
  entity?: EntityCompletelyListItemType,
  planEntityModel: PlanEntityModelType
}[]>([]);

interface PlanFormState {
  name: string;
  deadlineDate?: Moment;
  planDate?: Moment;
  description?: string;
}

const dateFormat = 'YYYY/MM/DD';
export const planFormState = reactive<PlanFormState>({
  name: '',
  deadlineDate: moment(new Date(), dateFormat),
  planDate: moment(new Date(), dateFormat),
  description: ''
});

export type PlanItemState = {
  name: string;
  priority: 1 | 2 | 3 | 4 | 5;
  status?: 'todo' | 'doing' | 'done';
  description?: string;
  planDate?: Moment;
  deadlineDate?: Moment;
}

export const planItem = reactive<PlanItemState>({
  name: '',
  priority: 1,
  description: '',
  status: undefined,
  planDate: moment(new Date(), dateFormat),
  deadlineDate: moment(new Date(), dateFormat),
});

export const isLoading = ref(false);

export class PlanBoard {
  clearPlanItem(): void {
    planItem.name = '';
    planItem.description = '';
    planItem.priority = 1;
    planItem.status = undefined;
    planItem.planDate = moment(new Date(), dateFormat);
    planItem.deadlineDate = moment(new Date(), dateFormat);
  }

  async getPlan(id: string): Promise<void> {
    isLoading.value = true;
    const result = await PlanApiService.getPlan({ id });
    if (result.data) {
      planBindEntityList.value = result.data.entityList;
      planBoard.value.data = result.data.plan;
      planBoard.value.list = result.data.planItemList;
      planFormState.name = result.data.plan.name;
      planFormState.description = result.data.plan.description;
      planFormState.deadlineDate = moment(result.data.plan.deadlineDate, dateFormat);
      planFormState.planDate = moment(result.data.plan.planDate, dateFormat);
      planBoard.value.doingList = [];
      planBoard.value.todoList = [];
      planBoard.value.doneList = [];
      result.data.planItemList.forEach((item) => {
        if (item.item.status === 'todo') {
          planBoard.value.todoList.push(item);
        } else if (item.item.status === 'doing') {
          planBoard.value.doingList.push(item);
        } else {
          planBoard.value.doneList.push(item);
        }
      });
    }
    isLoading.value = false;
  }

  async addPlanItem(planId: string): Promise<void> {
    await PlanApiService.createPlanItem({
      item: {
        ...planItem,
        planId,
        planDate: planItem.planDate?.toDate(),
        deadlineDate: planItem.deadlineDate?.toDate()
      }
    });
  }

  async updatePlanItem(planItemId: string, status?: 'todo' | 'doing' | 'done'): Promise<boolean> {
    console.log(planItemId, status);
    let result;
    if (status) {
      result = await PlanApiService.updatePlanItem({
        id: planItemId,
        status
      });
    } else {
      result = await PlanApiService.updatePlanItem({
        ...planItem,
        status: status || planItem.status,
        id: planItemId,
        planDate: planItem.planDate?.toDate(),
        deadlineDate: planItem.deadlineDate?.toDate()
      });
    }
    return result.code === 0;
  }

  async getPlanItemDetail(planItemId: string): Promise<void> {
    const result = await PlanApiService.getPlanItemDetail({
      id: planItemId
    });
    if (result.data) {
      planItem.priority = result.data.priority;
      planItem.planDate = moment(result.data.planDate, dateFormat);
      planItem.deadlineDate = moment(result.data.deadlineDate, dateFormat);
      planItem.description = result.data.description;
      planItem.name = result.data.name;
    }
  }

  async unbindEntityFromPlanItem(params: {
    planId: string;
    planItemId: string;
    entityId: string;
  }): Promise<void> {
    const result = await PlanApiService.unbindEntityFromPlanItem(params);
    if (result.code === 0) {
      message.success('解绑成功！');
    }
  }

  async unbindEntityFromPlan(params: {
    planId: string;
    entityId: string;
  }): Promise<void> {
    const result = await PlanApiService.unbindEntityFromPlan(params);
    if (result.code === 0) {
      message.success('解绑成功！');
    }
  }
}
