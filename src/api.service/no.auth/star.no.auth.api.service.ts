/**
 * @author songxiwen
 * @date  2021/12/4 13:53
 */

import { EntityCompletelyListItemType, PublicEntityType } from 'metagraph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { PublicApiResponseType, RequestUtil } from '@/utils';

export class StarNoAuthApiService {
  // 获取用户公开信息
  static async getEntityStarDetailList(params: { entityId: string }): Promise<PublicApiResponseType<any>> {
    return RequestUtil.post<{ entityId: string }, any>({
      apiPath: ApiPathEnum.GetUserProfileById,
      requestBody: params
    });
  }

  static async getUserStarList(params: {
    userId: string;
    entityType?: PublicEntityType;
    pageIndex: number;
    pageSize: number;
  }): Promise<PublicApiResponseType<{
    total: number;
    list: EntityCompletelyListItemType[];
  } | undefined>> {
    return RequestUtil.post<{
      entityType?: PublicEntityType;
      pageIndex: number;
      pageSize: number;
    }, {
      total: number;
      list: EntityCompletelyListItemType[];
    } | undefined>({
      apiPath: ApiPathEnum.GetUserStarList,
      requestBody: params
    });
  }
}
