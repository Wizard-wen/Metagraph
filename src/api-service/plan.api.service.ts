/**
 * @author songxiwen
 * @date  2022/4/6 16:14
 */

import type { PublicApiResponseType } from '@/utils';
import type {
  CreatePlanItemType,
  EntityCompletelyListItemType,
  PlanAuthApi,
  PlanEntityModelType,
  PlanItemModelType, PlanListItemType,
  PlanModelType,
  PlanTreeType,
  PublicEntityType
} from '@metagraph/constant';
import { RequestNewUntil } from '@/utils/request.new.until';

export type CreatePlanType = {
  name: string;
  description?: string;
  deadlineDate?: Date;
  planDate?: Date;
}

export class PlanApiService {
  static async getList(params: {
    pageIndex: number,
    pageSize: number
  }): Promise<PublicApiResponseType<{
    list: PlanListItemType[],
    total: number
  }>> {
    return RequestNewUntil.post<PlanAuthApi.GetPlanList>({
      apiPath: '/plan/getList',
      requestBody: params
    });
  }

  static async createPlan(params: {
    name: string,
    description?: string,
    deadlineDate?: Date,
    planDate?: Date
  }): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<PlanAuthApi.CreatePlan>({
      apiPath: '/plan/create',
      requestBody: params
    });
  }

  static async getPlanTree(): Promise<PublicApiResponseType<PlanTreeType>> {
    return RequestNewUntil.post<PlanAuthApi.GetPlanTree>({
      apiPath: '/plan/getTree',
      requestBody: undefined
    });
  }

  static async updatePlan(params: {
    id: string;
    name?: string;
    description?: string;
    deadlineDate?: Date;
    planDate?: Date;
  }): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<PlanAuthApi.UpdatePlan>({
      apiPath: '/plan/update',
      requestBody: params
    });
  }

  static async getPlanDetail(params: {
    id: string;
  }): Promise<PublicApiResponseType<PlanModelType>> {
    return RequestNewUntil.post<PlanAuthApi.GetPlanDetail>({
      apiPath: '/plan/getDetail',
      requestBody: params
    });
  }

  static async getPlan(params: {
    id: string;
  }): Promise<PublicApiResponseType<{
    plan: PlanModelType,
    planItemList: {
      item: PlanItemModelType;
      entityList: EntityCompletelyListItemType[];
      entityIdList: string[]
    }[],
    entityList: {
      planEntityModel: PlanEntityModelType,
      entity: EntityCompletelyListItemType
    }[]
  }>> {
    return RequestNewUntil.post<PlanAuthApi.GetPlan>({
      apiPath: '/plan/get',
      requestBody: params
    });
  }

  static async createPlanItem(params: {
    item: CreatePlanItemType,
    itemEntity?: {
      entityId: string;
      entityType: PublicEntityType;
    }
  }): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<PlanAuthApi.CreatePlanItem>({
      apiPath: '/plan/item/create',
      requestBody: params
    });
  }

  static updatePlanItem(params: {
    id: string;
    status?: 'todo' | 'doing' | 'done'
  } & Partial<CreatePlanItemType>): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<PlanAuthApi.UpdatePlanItem>({
      apiPath: '/plan/item/update',
      requestBody: params
    });
  }

  static getPlanItemDetail(params: {
    id: string;
  }): Promise<PublicApiResponseType<PlanItemModelType>> {
    return RequestNewUntil.post<PlanAuthApi.GetPlanItemDetail>({
      apiPath: '/plan/item/getDetail',
      requestBody: params
    });
  }

  static bindEntityToPlanItem(params: {
    planId: string;
    planItemId?: string;
    entityId: string;
    entityType: PublicEntityType;
  }): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<PlanAuthApi.BindEntityToPlanItem>({
      apiPath: '/plan/item/bind/entity',
      requestBody: params
    });
  }

  static unbindEntityFromPlanItem(params: {
    planId: string;
    planItemId: string;
    entityId: string;
  }): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<PlanAuthApi.UnbindEntityToPlanItem>({
      apiPath: '/plan/item/unbind/entity',
      requestBody: params
    });
  }

  static unbindEntityFromPlan(params: {
    planId: string;
    entityId: string;
  }): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<PlanAuthApi.UnbindEntityFromPlan>({
      apiPath: '/plan/unbind/entity',
      requestBody: params
    });
  }
}
