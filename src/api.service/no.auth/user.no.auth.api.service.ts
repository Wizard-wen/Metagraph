/**
 * @author songxiwen
 * @date  2021/11/19 23:08
 */

import { UserModelType } from 'metagraph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { PublicApiResponseType, RequestUtil } from '@/utils';

export class UserNoAuthApiService {
  // 获取用户公开信息
  static async getUserProfileById(params: { userId: string }): Promise<PublicApiResponseType<UserModelType>> {
    return RequestUtil.post<{ userId: string }, UserModelType>({
      apiPath: ApiPathEnum.GetUserProfileById,
      requestBody: params
    });
  }
  // 发送邮箱验证码
  // static async sendRegisterEmailCode(params: { password: string; name: string }): Promise<PublicApiResponseType<any>> {
  //   return RequestUtil.post<{ password: string; name: string }, any>({
  //     apiPath: ApiPathEnum.SendRegisterEmailCode,
  //     requestBody: params
  //   });
  // }
}
