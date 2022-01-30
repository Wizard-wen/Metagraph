/**
 * @author songxiwen
 * @date  2021/9/12 22:46
 */

import type {
  EntityCompletelyListItemType,
  KnowledgeResponseType
} from 'metagraph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';
type EdgeEntityType = EntityCompletelyListItemType & { edgeId: string };
export class KnowledgeNoAuthApiService {
  static async getMentionedList(entityId: string): Promise<PublicApiResponseType<{
    count: number;
    list: EntityCompletelyListItemType[]
  }>> {
    return RequestUtil.post<{ knowledgeEntityId: string; }, {
      count: number;
      list: EntityCompletelyListItemType[]
    }>({
      apiPath: ApiPathEnum.GetNoAuthKnowledgeMentionedList,
      requestBody: { knowledgeEntityId: entityId }
    });
  }

  static async get(params: { id: string; }): Promise<PublicApiResponseType<KnowledgeResponseType>> {
    return RequestUtil.post<{ id: string; }, KnowledgeResponseType>({
      apiPath: ApiPathEnum.GetNoAuthKnowledgeById,
      requestBody: params
    });
  }

  static async getPath(params: {
    originKnowledgeEntityId: string,
    targetKnowledgeEntityId: string
  }): Promise<PublicApiResponseType<any>> {
    return RequestUtil.post<{
      originKnowledgeEntityId: string,
      targetKnowledgeEntityId: string
    }, any>({
      apiPath: ApiPathEnum.GetNoAuthKnowledgePath,
      requestBody: params
    });
  }



  static async getList(params: {
    knowledgeBaseTypeId?: string;
    repositoryId?: string;
    domainId?: string;
  }): Promise<PublicApiResponseType<KnowledgeResponseType[]>> {
    return RequestUtil.post<{
      knowledgeBaseTypeId?: string;
      repositoryId?: string;
      domainId?: string;
    }, KnowledgeResponseType[]>({
      apiPath: ApiPathEnum.GetNoAuthKnowledgeList,
      requestBody: params
    });
  }

  static async getRepositoryKnowledgeList(params: {
    repositoryEntityId: string;
  }): Promise<PublicApiResponseType<{
    list: EntityCompletelyListItemType[],
    view: { [key: string]: { x: number; y: number } }
  }>> {
    return RequestUtil.post<{
      repositoryEntityId: string;
    }, {
      list: EntityCompletelyListItemType[],
      view: { [key: string]: { x: number; y: number } }
    }>({
      apiPath: ApiPathEnum.GetNoAuthKnowledgeListByRepositoryEntityId,
      requestBody: params
    });
  }

  /**
   * 获取关联，返回值分为四个维度，（前置、导出）（库内、库外）
   * @param params
   */
  static async findEdgesByKnowledgeEntityId(params: {
    knowledgeEntityId: string;
    repositoryEntityId: string;
  }): Promise<PublicApiResponseType<{
    entity: EntityCompletelyListItemType,
    preInnerList: EdgeEntityType[],
    preOuterList: EdgeEntityType[],
    extendInnerList: EdgeEntityType[],
    extendOuterList: EdgeEntityType[]
  }>> {
    return RequestUtil.post<{
      knowledgeEntityId: string;
      repositoryEntityId: string;
    }, {
      entity: EntityCompletelyListItemType,
      preInnerList: EdgeEntityType[],
      preOuterList: EdgeEntityType[],
      extendInnerList: EdgeEntityType[],
      extendOuterList: EdgeEntityType[]
    }>({
      apiPath: ApiPathEnum.GetNoAuthEdgesByKnowledgeEntityId,
      requestBody: params
    });
  }
}
