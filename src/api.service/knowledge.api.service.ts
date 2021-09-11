/**
 *
 */

import {
  FileEnum,
  KnowledgeResponseType,
  KnowledgePageListResponseType,
  EntityCompletelyListItemType
} from 'edu-graph-constant';
import { ApiPathEnum, PublicApiResponseType, RequestUtil } from './api.config';

export class KnowledgeApiService {
  static async remove(id: string): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{ id: string }, void>({
      apiPath: ApiPathEnum.RemoveKnowledge,
      requestBody: { id }
    });
  }

  static async saveDescription(params: { description: string, descriptionHTML: string, entityId: string }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{ description: string, descriptionHTML: string, entityId: string }, void>({
      apiPath: ApiPathEnum.SaveKnowledgeDescription,
      requestBody: params
    });
  }

  static async create(params: {
    name: string;
    knowledgeBaseTypeId: string;
    domainId?: string;
    description?: string;
    repositoryEntityId: string;
  }): Promise<PublicApiResponseType<EntityCompletelyListItemType>> {
    return RequestUtil.post<{
      name: string;
      knowledgeBaseTypeId: string;
      domainId?: string;
      description?: string;
      repositoryEntityId: string;
    }, EntityCompletelyListItemType>({
      apiPath: ApiPathEnum.CreateKnowledge,
      requestBody: params
    });
  }

  static async get(params: { id: string; }): Promise<PublicApiResponseType<KnowledgeResponseType>> {
    return RequestUtil.post<{ id: string; }, KnowledgeResponseType>({
      apiPath: ApiPathEnum.GetKnowledgeById,
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
      apiPath: ApiPathEnum.GetKnowledgeList,
      requestBody: params
    });
  }

  static async getAllList(): Promise<PublicApiResponseType<EntityCompletelyListItemType[]>> {
    return RequestUtil.post<undefined, EntityCompletelyListItemType[]>({
      apiPath: ApiPathEnum.GetKnowledgeAllList,
      requestBody: undefined
    });
  }

  static async getRepositoryKnowledgeList(params: {
    repositoryEntityId: string;
  }): Promise<PublicApiResponseType<KnowledgeResponseType[]>> {
    return RequestUtil.post<{
      repositoryEntityId: string;
    }, KnowledgeResponseType[]>({
      apiPath: ApiPathEnum.GetRepositoryKnowledgeList,
      requestBody: params
    });
  }

  static async getPageList(params: { name: string; fileType: FileEnum }): Promise<PublicApiResponseType<KnowledgePageListResponseType>> {
    return RequestUtil.post<{ name: string; fileType: FileEnum }, KnowledgePageListResponseType>({
      apiPath: ApiPathEnum.GetKnowledgePageList,
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
      apiPath: ApiPathEnum.FindEdgesByKnowledgeEntityId,
      requestBody: params
    });
  }
}
