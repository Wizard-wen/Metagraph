/**
 * @author wizard.song
 * @date 2021/09/12
 */

import type { TagModelType } from 'edu-graph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

export class TagApiService {
  static async getList(params: {
    pageIndex: number;
    pageSize: number;
  }): Promise<PublicApiResponseType<{ list: TagModelType[]; total: number }>> {
    return RequestUtil.post<{
      pageIndex: number;
      pageSize: number;
    }, { list: TagModelType[]; total: number }>({
      apiPath: ApiPathEnum.GetTagList,
      requestBody: params
    });
  }
}
