/**
 * @author songxiwen
 * @date  2022/4/9 18:01
 */

import { CreatePlanType } from '@/api.service/plan.api.service';
import moment, { Moment } from 'moment';
import { reactive } from 'vue';

const dateFormat = 'YYYY/MM/DD';

export interface PlanFormState {
  name: string;
  deadlineDate?: Moment;
  planDate?: Moment;
  description?: string;
}

export const planFormState = reactive<PlanFormState>({
  name: '',
  deadlineDate: moment(new Date(), dateFormat),
  planDate: moment(new Date(), dateFormat),
  description: ''
});

export const planFormRules = reactive({
  name: [{
    message: '请输入计划名',
    trigger: 'blur',
    required: true
  }]
});

export function initPlanFormState(): void {
  planFormState.planDate = moment(new Date(), dateFormat);
  planFormState.deadlineDate = moment(new Date(), dateFormat);
  planFormState.name = '';
  planFormState.description = '';
}

export function setPlanFormState(params: CreatePlanType): void {
  planFormState.planDate = moment(params.planDate, dateFormat);
  planFormState.deadlineDate = moment(params.deadlineDate, dateFormat);
  planFormState.name = params.name;
  planFormState.description = params.description;
}

export async function commitPlanState(): Promise<void> {

}
