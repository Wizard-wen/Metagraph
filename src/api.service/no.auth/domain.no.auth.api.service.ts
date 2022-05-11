/**
 * @author songxiwen
 * @date  2021/9/17 22:49
 */

import type {
  DomainBaseTypeModelType, DomainModelType,
  DomainResponseType,
  DomainTreeNodeResponseType
} from 'metagraph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

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

  static getTree(params: { domainBaseTypeId: string }): Promise<PublicApiResponseType<{
    tree: DomainTreeNodeResponseType[],
    list: DomainModelType[]
  }>> {
    return RequestUtil.post<{ domainBaseTypeId: string }, {
      tree: DomainTreeNodeResponseType[],
      list: DomainModelType[]
    }>({
      apiPath: ApiPathEnum.GetDomainTree,
      requestBody: params
    });
  }

  static getDomainBaseTypeList(): Promise<PublicApiResponseType<DomainBaseTypeModelType[]>> {
    return RequestUtil.post<undefined, DomainBaseTypeModelType[]>({
      apiPath: ApiPathEnum.GetDomainBaseTypeList,
      requestBody: undefined
    });
  }
}
