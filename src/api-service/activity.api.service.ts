/**
 * @author songxiwen
 * @date  2022/1/27 15:18
 */

import type {
  UserModelType,
  EntityCompletelyListItemType,
  ActivityModelType, UpdateRecordType
} from '@metagraph/constant';
import { ApiPathEnum } from '@/api-service/config/api.config';
import { PublicApiResponseType, RequestUtil } from '@/utils';

export class ActivityApiService {
  static async getList(params: {
    pageIndex: number,
    pageSize: number
  }): Promise<PublicApiResponseType<{
    list: {
      user: UserModelType,
      entity?: EntityCompletelyListItemType,
      content: ActivityModelType,
      followedUser?: UserModelType
    }[],
    total: number
  }>> {
    return RequestUtil.post<{ pageIndex: number, pageSize: number }, {
      list: {
        user: UserModelType,
        entity?: EntityCompletelyListItemType,
        content: ActivityModelType,
        followedUser?: UserModelType
      }[],
      total: number
    }>({
      apiPath: ApiPathEnum.GetActivityList,
      requestBody: params
    });
  }

  static async getActivityBox(): Promise<PublicApiResponseType<UpdateRecordType | undefined>> {
    return RequestUtil.get<UpdateRecordType | undefined>({
      apiPath: ApiPathEnum.GetActivityList
    });
  }
}
