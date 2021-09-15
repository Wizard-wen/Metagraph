/**
 * @author songxiwen
 * @date  2021/9/12 23:28
 */

import type {
  CommentResponseType,
  CommentCreateRequestType,
  CommentRemoveRequestType,
  CommentPageListRequestType,
  CommentListItemType,
} from 'edu-graph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

// eslint-disable-next-line import/prefer-default-export
export class CommentApiService {
  static async create(params: CommentCreateRequestType): Promise<PublicApiResponseType<CommentResponseType>> {
    return RequestUtil.post<CommentCreateRequestType, CommentResponseType>({
      apiPath: ApiPathEnum.CreateComment,
      requestBody: params
    });
  }

  static async remove(params: CommentRemoveRequestType): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<CommentRemoveRequestType, void>({
      apiPath: ApiPathEnum.RemoveComment,
      requestBody: params
    });
  }

  static async getOwnCommentList(params: CommentPageListRequestType): Promise<PublicApiResponseType<CommentListItemType[]>> {
    return RequestUtil.post<CommentPageListRequestType, CommentListItemType[]>({
      apiPath: ApiPathEnum.GetOwnCommentList,
      requestBody: params
    });
  }
}
