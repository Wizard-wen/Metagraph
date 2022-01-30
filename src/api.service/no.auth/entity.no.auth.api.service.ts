/**
 * @author wizard.song
 * @date 2021/09/12 23:35
 */

import type { EntityCompletelyListItemType, PublicEntityType } from 'metagraph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

export class EntityNoAuthApiService {
  static getEntityById(params: { entityId: string; }): Promise<PublicApiResponseType<EntityCompletelyListItemType>> {
    return RequestUtil.post<{ entityId: string; }, EntityCompletelyListItemType>({
      apiPath: ApiPathEnum.GetEntityById,
      requestBody: params
    });
  }

  static getEntityListByEntityType(params: { entityType?: PublicEntityType; }): Promise<PublicApiResponseType<EntityCompletelyListItemType[]>> {
    return RequestUtil.post<{ entityType?: PublicEntityType; }, EntityCompletelyListItemType[]>({
      apiPath: ApiPathEnum.GetEntityListByEntityType,
      requestBody: params
    });
  }

  static getSearchList(params: {
    pageIndex: number;
    pageSize: number;
    entityType?: PublicEntityType,
    // 目前只按名字搜索
    searchText: string,
  }): Promise<PublicApiResponseType<{ list: EntityCompletelyListItemType[], total: number }>> {
    return RequestUtil.post<{
      pageIndex: number;
      pageSize: number;
      entityType?: PublicEntityType,
      // 目前只按名字搜索
      searchText: string,
    }, { list: EntityCompletelyListItemType[], total: number }>({
      apiPath: ApiPathEnum.GetSearchEntityList,
      requestBody: params
    });
  }
}
