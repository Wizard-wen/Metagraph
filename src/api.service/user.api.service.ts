/**
 * @author wizard
 * @date 2021/09/12 16:29
 */

import type { UserModelType } from 'edu-graph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

// eslint-disable-next-line import/prefer-default-export
export class UserApiService {
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
