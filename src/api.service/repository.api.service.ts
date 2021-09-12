/* eslint-disable import/prefer-default-export */
/**
 * @author wizard
 * @date 2021/03/13 16:29
 */

import { ApiPathEnum, PublicApiResponseType, RequestUtil } from '@/api.service/api.config';
import {
  RepositoryEntityType,
  RepositoryCreateType,
  RepositoryListRequestFilterType, RepositoryEntityModelType
} from 'edu-graph-constant';
import type {
  EntityCompletelyListItemType
} from 'edu-graph-constant';

export class RepositoryApiService {
  // 创建仓库
  static async createRepository(params: RepositoryCreateType): Promise<PublicApiResponseType<EntityCompletelyListItemType>> {
    return RequestUtil.post<RepositoryCreateType, EntityCompletelyListItemType>({
      apiPath: ApiPathEnum.CreateRepository,
      requestBody: params
    });
  }

  // // 查询仓库列表 模糊搜索
  // static async getRepositoryList(params: RepositoryListRequestFilterType): Promise<PublicApiResponseType<{
  //   list: EntityCompletelyListItemType[],
  //   total: number
  // }>> {
  //   console.log('params', params);
  //   return RequestUtil.post<RepositoryListRequestFilterType, {
  //     list: EntityCompletelyListItemType[],
  //     total: number
  //   }>({
  //     apiPath: ApiPathEnum.GetRepositoryList,
  //     requestBody: params
  //   });
  // }

  static async getOwnRepositoryList(): Promise<PublicApiResponseType<EntityCompletelyListItemType[]>> {
    return RequestUtil.get<EntityCompletelyListItemType[]>({
      apiPath: ApiPathEnum.GetOwnRepositoryList
    });
  }

  // static async getRepositoryById(params: { repositoryEntityId: string }): Promise<PublicApiResponseType<EntityCompletelyListItemType>> {
  //   return RequestUtil.post<{ repositoryEntityId: string }, EntityCompletelyListItemType>({
  //     apiPath: ApiPathEnum.GetRepositoryById,
  //     requestBody: params
  //   });
  // }

  // static async getRepositoryBindEntityList(repositoryEntityId: string): Promise<PublicApiResponseType<EntityCompletelyListItemType[]>> {
  //   return RequestUtil.post<{ repositoryEntityId: string }, EntityCompletelyListItemType[]>({
  //     apiPath: ApiPathEnum.GetRepositoryBindEntityList,
  //     requestBody: { repositoryEntityId }
  //   });
  // }

  static async getRepositoryBindEntityListInGraph(repositoryEntityId: string): Promise<PublicApiResponseType<RepositoryEntityModelType[]>> {
    return RequestUtil.post<{ repositoryEntityId: string }, RepositoryEntityModelType[]>({
      apiPath: ApiPathEnum.getRepositoryBindEntityListInGraph,
      requestBody: { repositoryEntityId }
    });
  }

  static async getEntityList(): Promise<PublicApiResponseType<EntityCompletelyListItemType[]>> {
    return RequestUtil.post<undefined, EntityCompletelyListItemType[]>({
      apiPath: ApiPathEnum.GetRepositoryEntityList,
      requestBody: undefined
    });
  }

  static async BindEntityToRepository(params: {
    entityId: string,
    entityType: RepositoryEntityType,
    repositoryEntityId: string
  }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{
      entityId: string,
      entityType: RepositoryEntityType,
      repositoryEntityId: string
    }, void>({
      apiPath: ApiPathEnum.BindToRepository,
      requestBody: params
    });
  }
}
