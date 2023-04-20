/**
 * @author songxiwen
 * @date  2022/1/28 15:56
 */

import { EntityCompletelyListItemType } from '@metagraph/constant';
import { ApiPathEnum } from '@/api-service/config/api.config';
import { PublicApiResponseType, RequestUtil } from '@/utils';

export class EntityApiService {
  static getEntityList(params: {
    name?: string;
    entityType?: string,
    pageIndex: number,
    pageSize: number
  }): Promise<PublicApiResponseType<{
    list: EntityCompletelyListItemType[],
    total: number
  }>> {
    return RequestUtil.post<{
      name?: string;
      entityType?: string,
      pageIndex: number,
      pageSize: number
    }, {
      list: EntityCompletelyListItemType[],
      total: number
    }>({
      apiPath: ApiPathEnum.GetEntityList,
      requestBody: params
    });
  }
}
