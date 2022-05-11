/**
 * @author wizard.song
 * @date 2021/09/12
 */

import type { PublicEntityType, TagModelType } from 'metagraph-constant';
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

  static async update(params: {
    entityId: string;
    tagIds: string[];
    entityType: PublicEntityType;
  }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{
      entityId: string;
      tagIds: string[];
      entityType: PublicEntityType;
    }, void>({
      apiPath: ApiPathEnum.UpdateTag,
      requestBody: params
    });
  }
}
