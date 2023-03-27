/**
 * @author wizard
 * @date 2021/03/13 16:29
 */

import { RequestNewUntil } from '@/utils/request.new.until';
import type {
  RepositoryEntityType,
  RepositoryCreateType,
  RepositoryModelType, RepositoryUpdateType, RepositoryAuthApi, EntityCompletelyListItemType
} from 'metagraph-constant';
import type { PublicApiResponseType } from '@/utils';

export class RepositoryApiService {
  /**
   * 创建知识库
   * @param params
   */
  static async createRepository(params: RepositoryCreateType): Promise<PublicApiResponseType<EntityCompletelyListItemType>> {
    return RequestNewUntil.post<RepositoryAuthApi.Create>({
      apiPath: '/repository/create',
      requestBody: params
    });
  }

  /**
   * 编辑知识库
   * @param params
   */
  static async updateRepository(params: RepositoryUpdateType): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<RepositoryAuthApi.Update>({
      apiPath: '/repository/update',
      requestBody: params
    });
  }

  /**
   * 删除知识库
   * @param params
   */
  static async removeRepository(params: { repositoryEntityId: string; }): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<RepositoryAuthApi.Remove>({
      apiPath: '/repository/remove',
      requestBody: params
    });
  }

  // 获取知识库的基本信息
  static async getRepositoryByEntityId(params: {
    repositoryEntityId: string
  }): Promise<PublicApiResponseType<RepositoryModelType>> {
    return RequestNewUntil.post<RepositoryAuthApi.GetModelByEntityId>({
      apiPath: '/repository/getModelByEntityId',
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
    return RequestNewUntil.post<RepositoryAuthApi.BindEntity>({
      apiPath: '/repository/bind/entity',
      requestBody: params
    });
  }

  // 从知识库接触绑定知识点
  static async UnbindEntityFromRepository(params: {
    entityId: string,
    entityType: RepositoryEntityType,
    repositoryEntityId: string,
  }): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<RepositoryAuthApi.UnbindEntity>({
      apiPath: '/repository/unbind/entity',
      requestBody: params
    });
  }

  // 根据token获取用户拥有的知识库
  static async getOwnRepositoryList(): Promise<PublicApiResponseType<EntityCompletelyListItemType[]>> {
    return RequestNewUntil.get<RepositoryAuthApi.GetOwnList>({
      apiPath: '/repository/getOwnList'
    });
  }

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
    return RequestNewUntil.post<RepositoryAuthApi.Clone>({
      apiPath: '/repository/clone',
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
    return RequestNewUntil.post<RepositoryAuthApi.GetCloneStatus>({
      apiPath: '/repository/getCloneStatus',
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
    return RequestNewUntil.post<RepositoryAuthApi.GetUsingEntity>({
      apiPath: '/repository/getUsingEntity',
      requestBody: params
    });
  }
}
