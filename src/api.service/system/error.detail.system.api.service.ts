/**
 * @author songxiwen
 * @date  2022/1/4 23:23
 */

import { ApiPathEnum } from '@/api.service/config/api.config';
import { PublicApiResponseType, RequestUtil } from '@/utils';

export class ErrorDetailSystemApiService {
  static async create(params: {
    code: number;
    path: string;
    type: 'http' | 'business';
  }): Promise<PublicApiResponseType<any>> {
    return RequestUtil.post<{
      code: number;
      path: string;
      type: 'http' | 'business';
    }, any>({
      apiPath: ApiPathEnum.CreateErrorDetail,
      requestBody: params
    });
  }
}
