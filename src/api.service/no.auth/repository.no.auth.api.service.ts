/**
 * @author songxiwen
 * @date  2021/9/12 22:46
 */
import type {
  EntityCompletelyListItemType,
  RepositoryListRequestFilterType
} from 'edu-graph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

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
