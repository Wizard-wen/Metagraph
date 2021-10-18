/**
 * @author songxiwen
 * @date  2021/9/17 22:49
 */

import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

// eslint-disable-next-line import/prefer-default-export
export class DomainNoAuthApiService {
  static async getList(params: {
    name?: string;
    pageIndex: number;
    pageSize: number;
  }): Promise<PublicApiResponseType<any>> {
    return RequestUtil.post<{
      name?: string;
      pageIndex: number;
      pageSize: number;
    }, any>({
      apiPath: ApiPathEnum.GetDomainList,
      requestBody: params
    });
  }
}
