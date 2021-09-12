/**
 * @author wizard.song
 * @date 2021/09/12
 */

import { ApiPathEnum, PublicApiResponseType, RequestUtil } from '@/api.service/api.config';
import { TagModelType } from '../../../edu-graph-constant/dist/type/tag.type';

// eslint-disable-next-line import/prefer-default-export
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
