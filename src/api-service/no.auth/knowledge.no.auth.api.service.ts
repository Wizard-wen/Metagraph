/**
 * @author songxiwen
 * @date  2021/9/12 22:46
 */

import { RequestNewUntil } from '@/utils/request.new.until';
import { KnowledgeAuthedApi } from '@metagraph/constant';
import type {
  EntityCompletelyListItemType, KnowledgeEdgeInEdgeGroupType,
  KnowledgeNoAuthApi
} from '@metagraph/constant';
import type { PublicApiResponseType } from '@/utils';

export class KnowledgeNoAuthApiService {
  /**
   * 获取当前知识点被引用次数
   * @param entityId
   */
  static async getMentionedList(entityId: string): Promise<PublicApiResponseType<{
    count: number;
    list: EntityCompletelyListItemType[]
  }>> {
    return RequestNewUntil.post<KnowledgeNoAuthApi.GetMentionedList>({
      apiPath: '/public/knowledge/getMentionedList',
      requestBody: { knowledgeEntityId: entityId }
    });
  }


  static async getLatestVersion(params: {
    publishedKnowledgeEntityId: string;
  }): Promise<PublicApiResponseType<number>> {
    return RequestNewUntil.post<KnowledgeNoAuthApi.GetLatestVersion>({
      apiPath: '/public/knowledge/getLatestVersion',
      requestBody: params
    });
  }

  static async getPublishedKnowledgePreview(params: {
    publishedKnowledgeEntityId: string;
  }): Promise<PublicApiResponseType<{
    entity: EntityCompletelyListItemType;
    mentionList: EntityCompletelyListItemType[];
  }>> {
    return RequestNewUntil.post<KnowledgeNoAuthApi.GetPublishedKnowledgePreview>({
      apiPath: '/public/knowledge/published/preview',
      requestBody: params
    });
  }

  static async getPath(params: {
    originKnowledgeEntityId: string,
    targetKnowledgeEntityId: string
  }): Promise<PublicApiResponseType<any>> {
    return RequestNewUntil.post<KnowledgeNoAuthApi.GetGraphNodePath>({
      apiPath: '/public/knowledge/getPath',
      requestBody: params
    });
  }

  // static async getList(params: {
  //   knowledgeBaseTypeId?: string;
  //   repositoryId?: string;
  //   domainId?: string;
  // }): Promise<PublicApiResponseType<KnowledgeResponseType[]>> {
  //   return RequestNewUntil.post<KnowledgeNoAuthApi.GetList>({
  //     apiPath: '/public/knowledge/getList',
  //     requestBody: params
  //   });
  // }

  static async getRepositoryKnowledgeList(params: {
    repositoryEntityId: string;
  }): Promise<PublicApiResponseType<{
    list: EntityCompletelyListItemType[],
    view: { [key: string]: { x: number; y: number } }
  }>> {
    return RequestNewUntil.post<KnowledgeNoAuthApi.GetRepositoryKnowledgeList>({
      apiPath: '/public/knowledge/getList/repositoryEntityId',
      requestBody: params
    });
  }

  /**
   * 获取关联，返回值分为四个维度，（前置、导出）（库内、库外）
   * @param params
   */
  static async getEdgesByKnowledgeEntityId(params: {
    knowledgeEntityId: string;
    repositoryEntityId: string;
  }): Promise<PublicApiResponseType<{
    entity: EntityCompletelyListItemType,
    preInnerList: KnowledgeEdgeInEdgeGroupType[],
    preOuterList: KnowledgeEdgeInEdgeGroupType[],
    extendInnerList: KnowledgeEdgeInEdgeGroupType[],
    extendOuterList: KnowledgeEdgeInEdgeGroupType[]
  }>> {
    return RequestNewUntil.post<KnowledgeNoAuthApi.GetEdgesByKnowledgeEntityId>({
      apiPath: '/public/knowledge/findEdgesByKnowledgeEntityId',
      requestBody: params
    });
  }
}
