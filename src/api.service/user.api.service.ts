/**
 * @author wizard
 * @date 2021/09/12 16:29
 */

import type { UserModelType } from 'metagraph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

export class UserApiService {
  static async sendBindEmail(params: { email: string, type: 'bindEmail' | 'unbindEmail' }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{ email: string, type: 'bindEmail' | 'unbindEmail' }, void>({
      apiPath: ApiPathEnum.SendBindEmailCode,
      requestBody: params
    });
  }

  static async getUserBindEmail(): Promise<PublicApiResponseType<{
    isBind: boolean, email?: string
  }>> {
    return RequestUtil.get<{
      isBind: boolean, email?: string
    }>({
      apiPath: ApiPathEnum.GetUserBindEmail
    });
  }

  static async bindEmail(params: { email: string; code: string }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{ email: string; code: string }, void>({
      apiPath: ApiPathEnum.BindEmail,
      requestBody: params
    });
  }

  static async unbindEmail(params: { email: string; code: string }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{ email: string; code: string }, void>({
      apiPath: ApiPathEnum.UnbindEmail,
      requestBody: params
    });
  }

  static async login(params: { password: string; name: string }): Promise<PublicApiResponseType<any>> {
    return RequestUtil.post<{ password: string; name: string }, any>({
      apiPath: ApiPathEnum.LoginByName,
      requestBody: params
    });
  }

  static async getById(): Promise<PublicApiResponseType<UserModelType>> {
    return RequestUtil.post<undefined, UserModelType>({
      apiPath: ApiPathEnum.GetById,
      requestBody: undefined
    });
  }

  static async getPublicUserById(params: { userId: string }): Promise<PublicApiResponseType<UserModelType>> {
    return RequestUtil.post<{ userId: string }, UserModelType>({
      apiPath: ApiPathEnum.GetPublicUserById,
      requestBody: params
    });
  }

  static async updatePassword(params: {
    oldPassword: string;
    newPassword: string;
  }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{
      oldPassword: string;
      newPassword: string;
    }, void>({
      apiPath: ApiPathEnum.UpdatePassword,
      requestBody: params
    });
  }

  static async updateUser(params: {
    userId: string;
    name: string;
    phone?: string;
    email?: string;
    avatar?: string;
    wechat?: string;
    company?: string;
    location?: string;
  }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{
      userId: string;
      name: string;
      phone?: string;
      email?: string;
      avatar?: string;
      wechat?: string;
      company?: string;
      location?: string;
    }, void>({
      apiPath: ApiPathEnum.UpdateUser,
      requestBody: params
    });
  }

  static async register(params: {
    name: string;
    password: string;
    confirmPassword: string;
    avatar: string;
    phone?: string;
    email: string;
    type: 'personal' | 'organization'
  }): Promise<PublicApiResponseType<any>> {
    return RequestUtil.post<{
      name: string;
      password: string;
      confirmPassword: string;
      avatar: string;
      phone?: string;
      email: string;
      type: 'personal' | 'organization'
    }, any>({
      apiPath: ApiPathEnum.RegisterByName,
      requestBody: params
    });
  }
}
