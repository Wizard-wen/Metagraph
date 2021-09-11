/**
 *
 */

import {
  PublicEntityType,
  CommentResponseType,
  CommentCreateRequestType,
  CommentRemoveRequestType,
  CommentPageListRequestType,
  CommentListItemType, CommentEntityType,
} from 'edu-graph-constant';
import { ApiPathEnum, PublicApiResponseType, RequestUtil } from './api.config';

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

  static async getCommentByEntityId(params: {
    entityType: CommentEntityType;
    entityId: string;
    pageIndex: number;
    pageSize: number;
  }): Promise<PublicApiResponseType<any>> {
    return RequestUtil.post<{
      entityType: CommentEntityType;
      entityId: string;
      pageIndex: number;
      pageSize: number;
    }, any>({
      apiPath: ApiPathEnum.GetCommentByEntityId,
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
