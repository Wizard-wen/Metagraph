/**
 * @author songxiwen
 * @date  2021/9/12 16:50
 */

import { ApiPathEnum, PublicApiResponseType, RequestUtil } from '@/api.service/api.config';
import {
  EntityCompletelyListItemType,
  RepositoryCreateType,
  RepositoryListRequestFilterType
} from 'edu-graph-constant';

// eslint-disable-next-line import/prefer-default-export
export class RepositoryNoAuthApiService {
  // 创建仓库
  // 查询仓库列表 模糊搜索
  static async getList(params: RepositoryListRequestFilterType): Promise<PublicApiResponseType<{
    list: EntityCompletelyListItemType[],
    total: number
  }>> {
    return RequestUtil.post<RepositoryListRequestFilterType, {
      list: EntityCompletelyListItemType[],
      total: number
    }>({
      apiPath: ApiPathEnum.GetNoAuthRepositoryEntityList,
      requestBody: params
    });
  }

  static async getById(params: { repositoryEntityId: string }): Promise<PublicApiResponseType<EntityCompletelyListItemType>> {
    return RequestUtil.post<{ repositoryEntityId: string }, EntityCompletelyListItemType>({
      apiPath: ApiPathEnum.GetNoAuthRepositoryById,
      requestBody: params
    });
  }

  static async getRepositoryBindEntityList(repositoryEntityId: string): Promise<PublicApiResponseType<EntityCompletelyListItemType[]>> {
    return RequestUtil.post<{ repositoryEntityId: string }, EntityCompletelyListItemType[]>({
      apiPath: ApiPathEnum.GetNoAuthRepositoryBindEntityList,
      requestBody: { repositoryEntityId }
    });
  }
}
