/**
 * @author songxiwen
 * @date  2022/4/6 16:14
 */

import { ApiPathEnum } from '@/api.service/config/api.config';
import { PublicApiResponseType, RequestUtil } from '@/utils';
import {
  EntityCompletelyListItemType,
  PlanEntityModelType,
  PlanItemModelType,
  PlanModelType, PublicEntityType
} from 'metagraph-constant';

export type CreatePlanType = {
  name: string;
  description?: string;
  deadlineDate?: Date;
  planDate?: Date;
}

type CreatePlanItemType = {
  planId: string;
  name: string;
  priority: 1 | 2 | 3 | 4 | 5;
  description?: string;
  planDate?: Date;
  deadlineDate?: Date;
}

type CreatePlanItemParamsType = {
  item: CreatePlanItemType,
  itemEntity?: {
    entityId: string;
    entityType: PublicEntityType;
  }
}

export type PlanTreeType = ({
  children?: PlanItemModelType[]
} & PlanModelType)[]

type UpdatePlanItemParamsType = {
  status?: 'todo' | 'doing' | 'done'
} & Partial<CreatePlanItemType>;

export class PlanApiService {
  static async getList(): Promise<PublicApiResponseType<{
    list: PlanModelType[],
    total: number
  }>> {
    return RequestUtil.post<undefined, {
      list: PlanModelType[],
      total: number
    }>({
      apiPath: ApiPathEnum.GetPlanList,
      requestBody: undefined
    });
  }

  static async createPlan(params: CreatePlanType): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<CreatePlanType, void>({
      apiPath: ApiPathEnum.CreatePlan,
      requestBody: params
    });
  }

  static async getPlanTree(): Promise<PublicApiResponseType<PlanTreeType>> {
    return RequestUtil.post<void, PlanTreeType>({
      apiPath: ApiPathEnum.GetPlanTree,
      requestBody: undefined
    });
  }

  static async updatePlan(params: {
    id: string;
  } & Partial<CreatePlanType>): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{
      id: string;
    } & Partial<CreatePlanType>, void>({
      apiPath: ApiPathEnum.UpdatePlan,
      requestBody: params
    });
  }

  static async getPlanDetail(params: {
    id: string;
  }): Promise<PublicApiResponseType<PlanModelType>> {
    return RequestUtil.post<{
      id: string;
    }, PlanModelType>({
      apiPath: ApiPathEnum.GetPlanDetail,
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
    return RequestUtil.post<{
      id: string;
    }, {
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
    }>({
      apiPath: ApiPathEnum.GetPlan,
      requestBody: params
    });
  }

  static async createPlanItem(params: CreatePlanItemParamsType): Promise<PublicApiResponseType<PlanModelType>> {
    return RequestUtil.post<CreatePlanItemParamsType, PlanModelType>({
      apiPath: ApiPathEnum.CreatePlanItem,
      requestBody: params
    });
  }

  static updatePlanItem(params: {
    id: string;
  } & UpdatePlanItemParamsType): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{
      id: string;
    } & UpdatePlanItemParamsType, void>({
      apiPath: ApiPathEnum.UpdatePlanItem,
      requestBody: params
    });
  }

  static getPlanItemDetail(params: {
    id: string;
  }): Promise<PublicApiResponseType<PlanItemModelType>> {
    return RequestUtil.post<{
      id: string;
    }, PlanItemModelType>({
      apiPath: ApiPathEnum.GetPlanItemDetail,
      requestBody: params
    });
  }

  static bindEntityToPlanItem(params: {
    planId: string;
    planItemId?: string;
    entityId: string;
    entityType: PublicEntityType;
  }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{
      planId: string;
      planItemId?: string;
      entityId: string;
      entityType: PublicEntityType;
    }, void>({
      apiPath: ApiPathEnum.BindToPlanItem,
      requestBody: params
    });
  }

  static unbindEntityFromPlanItem(params: {
    planId: string;
    planItemId: string;
    entityId: string;
  }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{
      planId: string;
      planItemId: string;
      entityId: string;
    }, void>({
      apiPath: ApiPathEnum.UnbindFromPlanItem,
      requestBody: params
    });
  }

  static unbindEntityFromPlan(params: {
    planId: string;
    entityId: string;
  }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{
      planId: string;
      entityId: string;
    }, void>({
      apiPath: ApiPathEnum.UnbindEntityFromPlan,
      requestBody: params
    });
  }
}
