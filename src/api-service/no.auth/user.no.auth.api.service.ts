/**
 * @author songxiwen
 * @date  2021/11/19 23:08
 */

import { UserModelType } from '@metagraph/constant';
import { ApiPathEnum } from '@/api-service/config/api.config';
import { PublicApiResponseType, RequestUtil } from '@/utils';

export class UserNoAuthApiService {
  // 获取用户公开信息
  // static async getUserProfileById(params: { userId: string }): Promise<PublicApiResponseType<UserModelType>> {
  //   return RequestUtil.post<{ userId: string }, UserModelType>({
  //     apiPath: ApiPathEnum.GetUserProfileById,
  //     requestBody: params
  //   });
  // }

  static async login(params: { password: string; name: string }): Promise<PublicApiResponseType<any>> {
    return RequestUtil.post<{ password: string; name: string }, any>({
      apiPath: ApiPathEnum.LoginByName,
      requestBody: params
    });
  }

  static async loginByEmail(params: { email: string; verifyCode: string }): Promise<PublicApiResponseType<any>> {
    return RequestUtil.post<{ email: string; verifyCode: string }, any>({
      apiPath: ApiPathEnum.LoginByEmail,
      requestBody: params
    });
  }

  static async getPublicUserById(params: { userId: string }): Promise<PublicApiResponseType<UserModelType>> {
    return RequestUtil.post<{ userId: string }, UserModelType>({
      apiPath: ApiPathEnum.GetPublicUserById,
      requestBody: params
    });
  }

  static async checkIfUserExists(params: { name: string }): Promise<PublicApiResponseType<{ status: boolean }>> {
    return RequestUtil.post<{ name: string }, { status: boolean }>({
      apiPath: ApiPathEnum.CheckIfUserExists,
      requestBody: params
    });
  }

  // 发送邮箱验证码
  static async sendRegisterEmailCode(params: { email: string, type: 'login' | 'register' | 'forget'}): Promise<PublicApiResponseType<any>> {
    return RequestUtil.post<{ email: string }, any>({
      apiPath: ApiPathEnum.SendRegisterEmailCode,
      requestBody: params
    });
  }

  static async registerByEmail(params: {
    email: string;
    password: string;
    verifyCode: string
  }): Promise<PublicApiResponseType<any>> {
    return RequestUtil.post<{
      email: string;
      password: string;
      verifyCode: string
    }, any>({
      apiPath: ApiPathEnum.RegisterByEmail,
      requestBody: params
    });
  }
}
