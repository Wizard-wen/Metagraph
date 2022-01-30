/**
 * @author songxiwen
 * @date  2022/1/27 11:15
 */

import { ApiPathEnum } from '@/api.service/config/api.config';
import { PublicApiResponseType, RequestUtil } from '@/utils';
import { UserModelType } from 'metagraph-constant';

export class FollowNoAuthApiService {
  static getFollowCount(params: { userId: string; }): Promise<PublicApiResponseType<{
    followerCount: number;
    followedCount: number;
  }>> {
    return RequestUtil.post<{ userId: string; }, {
      followerCount: number;
      followedCount: number;
    }>({
      apiPath: ApiPathEnum.GetFollowCount,
      requestBody: params
    });
  }

  static getFollowedUserList(params: { userId: string; }): Promise<PublicApiResponseType<UserModelType[]>> {
    return RequestUtil.post<{ userId: string; }, UserModelType[]>({
      apiPath: ApiPathEnum.GetFollowedList,
      requestBody: params
    });
  }

  static getFollowerList(params: { userId: string; }): Promise<PublicApiResponseType<UserModelType[]>> {
    return RequestUtil.post<{ userId: string; }, UserModelType[]>({
      apiPath: ApiPathEnum.GetFollowerList,
      requestBody: params
    });
  }
}
