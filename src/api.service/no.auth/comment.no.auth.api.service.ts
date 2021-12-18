/**
 * @author songxiwen
 * @date  2021/9/12 23:28
 */

import type { CommentEntityType, CommentListItemType } from 'metagraph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

export class CommentNoAuthApiService {
  static async getCommentByEntityId(params: {
    entityType: CommentEntityType;
    entityId: string;
    pageIndex: number;
    pageSize: number;
  }): Promise<PublicApiResponseType<{
    list: CommentListItemType[],
    total: number;
    commentCount: number;
  }>> {
    return RequestUtil.post<{
      entityType: CommentEntityType;
      entityId: string;
      pageIndex: number;
      pageSize: number;
    }, {
      list: CommentListItemType[],
      total: number;
      commentCount: number;
    }>({
      apiPath: ApiPathEnum.GetNoAuthCommentByEntityId,
      requestBody: params
    });
  }
}
