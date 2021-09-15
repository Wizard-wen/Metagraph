/**
 * @author wizard.song
 * @date 2021/09/12 23:35
 */

import type { EntityCompletelyListItemType } from 'edu-graph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

// eslint-disable-next-line import/prefer-default-export
export class EntityNoAuthApiService {
  static getEntityList(params: {
    name?: string;
    entityType?: string,
    pageIndex: number,
    pageSize: number
  }): Promise<PublicApiResponseType<any>> {
    return RequestUtil.post<{
      name?: string;
      entityType?: string,
      pageIndex: number,
      pageSize: number
    }, any>({
      apiPath: ApiPathEnum.GetEntityList,
      requestBody: params
    });
  }

  static getEntityById(params: { entityId: string; }): Promise<PublicApiResponseType<EntityCompletelyListItemType>> {
    return RequestUtil.post<{ entityId: string; }, EntityCompletelyListItemType>({
      apiPath: ApiPathEnum.GetEntityById,
      requestBody: params
    });
  }
}
