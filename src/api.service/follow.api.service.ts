/**
 * @author songxiwen
 * @date  2021/11/19 23:23
 */

import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

export class FollowApiService {
  static async checkIfFollowed(params: { followedUser: string }): Promise<PublicApiResponseType<{ status: boolean }>> {
    return RequestUtil.post<{ followedUser: string }, { status: boolean }>({
      apiPath: ApiPathEnum.CheckIfFollowed,
      requestBody: params
    });
  }

  static async follow(params: { toFollowUser: string }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{ toFollowUser: string }, void>({
      apiPath: ApiPathEnum.Follow,
      requestBody: params
    });
  }

  static async unFollow(params: { followedUser: string }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{ followedUser: string }, void>({
      apiPath: ApiPathEnum.UnFollow,
      requestBody: params
    });
  }
}
