import { ApiPathEnum, PublicApiResponseType, RequestUtil } from '@/api.service/api.config';
import {
  EntityCompletelyListItemType,
  FileEnum,
  KnowledgePageListResponseType,
  KnowledgeResponseType
} from 'edu-graph-constant';

/**
 * @author songxiwen
 * @date  2021/9/12 22:46
 */

// eslint-disable-next-line import/prefer-default-export
export class KnowledgeNoAuthApiService {
  static async get(params: { id: string; }): Promise<PublicApiResponseType<KnowledgeResponseType>> {
    return RequestUtil.post<{ id: string; }, KnowledgeResponseType>({
      apiPath: ApiPathEnum.GetNoAuthKnowledgeById,
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

  // static async getAllList(): Promise<PublicApiResponseType<EntityCompletelyListItemType[]>> {
  //   return RequestUtil.post<undefined, EntityCompletelyListItemType[]>({
  //     apiPath: ApiPathEnum.GetNoAuthKnowledgeAllList,
  //     requestBody: undefined
  //   });
  // }

  static async getRepositoryKnowledgeList(params: {
    repositoryEntityId: string;
  }): Promise<PublicApiResponseType<KnowledgeResponseType[]>> {
    return RequestUtil.post<{
      repositoryEntityId: string;
    }, KnowledgeResponseType[]>({
      apiPath: ApiPathEnum.GetNoAuthKnowledgeListByRepositoryEntityId,
      requestBody: params
    });
  }

  // static async getPageList(params: { name: string; fileType: FileEnum }): Promise<PublicApiResponseType<KnowledgePageListResponseType>> {
  //   return RequestUtil.post<{ name: string; fileType: FileEnum }, KnowledgePageListResponseType>({
  //     apiPath: ApiPathEnum.GetNoAuthKnowledgePageList,
  //     requestBody: params
  //   });
  // }

  /**
   * 获取关联，返回值分为四个维度，（前置、导出）（库内、库外）
   * @param params
   */
  static async findEdgesByKnowledgeEntityId(params: {
    knowledgeEntityId: string;
    repositoryEntityId: string;
  }): Promise<PublicApiResponseType<{
    entity: EntityCompletelyListItemType,
    preInnerList: EntityCompletelyListItemType[],
    preOuterList: EntityCompletelyListItemType[],
    extendInnerList: EntityCompletelyListItemType[],
    extendOuterList: EntityCompletelyListItemType[]
  }>> {
    return RequestUtil.post<{
      knowledgeEntityId: string;
      repositoryEntityId: string;
    }, {
      entity: EntityCompletelyListItemType,
      preInnerList: EntityCompletelyListItemType[],
      preOuterList: EntityCompletelyListItemType[],
      extendInnerList: EntityCompletelyListItemType[],
      extendOuterList: EntityCompletelyListItemType[]
    }>({
      apiPath: ApiPathEnum.GetNoAuthEdgesByKnowledgeEntityId,
      requestBody: params
    });
  }
}
