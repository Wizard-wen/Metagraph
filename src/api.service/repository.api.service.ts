/**
 * @author wizard
 * @date 2021/03/13 16:29
 */

import {
  RepositoryEntityType,
  RepositoryCreateType,
  RepositoryModelType, RepositoryUpdateType
} from 'metagraph-constant';
import type {
  EntityCompletelyListItemType
} from 'metagraph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

export class RepositoryApiService {
  // 创建仓库
  static async createRepository(params: RepositoryCreateType): Promise<PublicApiResponseType<EntityCompletelyListItemType>> {
    return RequestUtil.post<RepositoryCreateType, EntityCompletelyListItemType>({
      apiPath: ApiPathEnum.CreateRepository,
      requestBody: params
    });
  }

  // 编辑仓库
  static async updateRepository(params: RepositoryUpdateType): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<RepositoryUpdateType, void>({
      apiPath: ApiPathEnum.UpdateRepository,
      requestBody: params
    });
  }

  // 删除仓库
  static async removeRepository(params: { repositoryEntityId: string; }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{ repositoryEntityId: string; }, void>({
      apiPath: ApiPathEnum.RemoveRepository,
      requestBody: params
    });
  }

  // 获取知识库的基本信息
  static async getRepositoryByEntityId(params: {
    repositoryEntityId: string
  }): Promise<PublicApiResponseType<RepositoryModelType>> {
    return RequestUtil.post<{ repositoryEntityId: string }, RepositoryModelType>({
      apiPath: ApiPathEnum.GetRepositoryByEntityId,
      requestBody: params
    });
  }

  // 将知识点绑定至知识库
  static async BindEntityToRepository(params: {
    entityId: string,
    entityType: RepositoryEntityType,
    repositoryEntityId: string,
    position?: {
      x: number;
      y: number;
    }
  }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{
      entityId: string,
      entityType: RepositoryEntityType,
      repositoryEntityId: string,
      position?: {
        x: number;
        y: number;
      }
    }, void>({
      apiPath: ApiPathEnum.BindToRepository,
      requestBody: params
    });
  }

  // 从知识库接触绑定知识点
  static async UnbindEntityFromRepository(params: {
    entityId: string,
    entityType: RepositoryEntityType,
    repositoryEntityId: string,
  }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{
      entityId: string,
      entityType: RepositoryEntityType,
      repositoryEntityId: string
    }, void>({
      apiPath: ApiPathEnum.UnbindFromRepository,
      requestBody: params
    });
  }

  // 检查用户是否拥有查询的知识库
  static async checkIfUserOwnRepository(params: {
    repositoryEntityId: string
  }): Promise<PublicApiResponseType<{ hasAuth: boolean }>> {
    return RequestUtil.post<{
      repositoryEntityId: string
    }, { hasAuth: boolean }>({
      apiPath: ApiPathEnum.CheckIfUserOwnRepository,
      requestBody: params
    });
  }

  // 根据token获取用户拥有的知识库
  static async getOwnRepositoryList(): Promise<PublicApiResponseType<EntityCompletelyListItemType[]>> {
    return RequestUtil.get<EntityCompletelyListItemType[]>({
      apiPath: ApiPathEnum.GetOwnRepositoryList
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

  // static async getRepositoryBindEntityList(repositoryEntityId: string): Promise<PublicApiResponseType<EntityCompletelyListItemType[]>> {
  //   return RequestUtil.post<{ repositoryEntityId: string }, EntityCompletelyListItemType[]>({
  //     apiPath: ApiPathEnum.GetRepositoryBindEntityList,
  //     requestBody: { repositoryEntityId }
  //   });
  // }

  // static async getRepositoryBindEntityListInGraph(repositoryEntityId: string): Promise<PublicApiResponseType<RepositoryEntityModelType[]>> {
  //   return RequestUtil.post<{ repositoryEntityId: string }, RepositoryEntityModelType[]>({
  //     apiPath: ApiPathEnum.getRepositoryBindEntityListInGraph,
  //     requestBody: { repositoryEntityId }
  //   });
  // }

  // static async getEntityList(): Promise<PublicApiResponseType<EntityCompletelyListItemType[]>> {
  //   return RequestUtil.post<undefined, EntityCompletelyListItemType[]>({
  //     apiPath: ApiPathEnum.GetRepositoryEntityList,
  //     requestBody: undefined
  //   });
  // }

  /**
   * 克隆知识库
   * 克隆后接口立刻返回，通过轮询获取克隆状态
   * @param params
   */
  static async cloneRepository(params: {
    repositoryEntityId: string,
    name?: string
  }): Promise<PublicApiResponseType<{
    clonedRepositoryEntityId: string
  }>> {
    return RequestUtil.post<{
      repositoryEntityId: string,
      name?: string
    }, {
      clonedRepositoryEntityId: string
    }>({
      apiPath: ApiPathEnum.CloneRepository,
      requestBody: params
    });
  }

  /**
   * 获取克隆状态
   * 克隆知识库是通过消息队列实现的
   * 这个接口用来轮询获取状态
   * @param params
   */
  static async getCloneRepositoryStatus(params: {
    repositoryEntityId: string,
    key: string
  }): Promise<PublicApiResponseType<string | null>> {
    return RequestUtil.post<{
      repositoryEntityId: string,
      key: string
    }, string | null>({
      apiPath: ApiPathEnum.GetCloneRepositoryStatus,
      requestBody: params
    });
  }

  /**
   * 查询知识库中的知识点
   * 区分是否被其他库引用
   * 用于删除知识库时，提醒用户
   * @param params
   */
  static async getRepositoryUsingEntity(params: {
    repositoryEntityId: string
  }): Promise<PublicApiResponseType<{
    neverUsedEntityList: { entityModel: EntityCompletelyListItemType; usageCount: number }[],
    usingEntityList: { entityModel: EntityCompletelyListItemType; usageCount: number }[],
    bindEntityCount: number
  }>> {
    return RequestUtil.post<{
      repositoryEntityId: string
    }, {
      neverUsedEntityList: { entityModel: EntityCompletelyListItemType; usageCount: number }[],
      usingEntityList: { entityModel: EntityCompletelyListItemType; usageCount: number }[],
      bindEntityCount: number
    }>({
      apiPath: ApiPathEnum.GetRepositoryUsingEntity,
      requestBody: params
    });
  }
}
