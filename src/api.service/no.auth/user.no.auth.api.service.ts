/**
 * @author songxiwen
 * @date  2021/11/19 23:08
 */

import { UserModelType } from 'edu-graph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { PublicApiResponseType, RequestUtil } from '@/utils';

export class UserNoAuthApiService {
  static async getUserProfileById(params: { userId: string }): Promise<PublicApiResponseType<UserModelType>> {
    return RequestUtil.post<{ userId: string }, UserModelType>({
      apiPath: ApiPathEnum.GetUserProfileById,
      requestBody: params
    });
  }
}
