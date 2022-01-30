/**
 * @author songxiwen
 * @date  2022/1/25 11:30
 */
import {
  EntityCompletelyListItemType
} from 'metagraph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

export class LearningPlanApiService {
  static async addToPlan(params: {
    knowledgeEntityId: string
  }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{ knowledgeEntityId: string; }, void>({
      apiPath: ApiPathEnum.AddToPlan,
      requestBody: params
    });
  }

  static async getMyPlanList(params: {
    knowledgeEntityId: string
  }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{ knowledgeEntityId: string; }, void>({
      apiPath: ApiPathEnum.GetMyPlanList,
      requestBody: params
    });
  }

  static async changePlanStatus(params: {
    id: string;
    status: 'learning' | 'learned' | 'toLearn';
  }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{
      id: string;
      status: 'learning' | 'learned' | 'toLearn';
    }, void>({
      apiPath: ApiPathEnum.ChangePlanStatus,
      requestBody: params
    });
  }

  static async getOneLevelNextToStudyKnowledge(params: {
    id: string;
  }): Promise<PublicApiResponseType<EntityCompletelyListItemType[]>> {
    return RequestUtil.post<{
      id: string;
    }, EntityCompletelyListItemType[]>({
      apiPath: ApiPathEnum.GetOneLevelNextToStudyKnowledge,
      requestBody: params
    });
  }
}
