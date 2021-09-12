/**
 * @author songxiwen
 * @date  2021/9/12 22:29
 */

import { ApiPathEnum, PublicApiResponseType, RequestUtil } from '@/api.service/api.config';
import { KnowledgeEdgeResponseType } from 'edu-graph-constant';

// eslint-disable-next-line import/prefer-default-export
export class EdgeNoAuthApiService {
  /**
   * 通过仓库entity id获取仓库内所有的边
   * @param params edgeRepositoryEntityId 仓库的rntityId
   */
  static async getListByRepositoryId(params: {
    edgeRepositoryEntityId: string
  }): Promise<PublicApiResponseType<KnowledgeEdgeResponseType[]>> {
    return RequestUtil.post<{ edgeRepositoryEntityId: string }, KnowledgeEdgeResponseType[]>({
      apiPath: ApiPathEnum.GetNoAuthKnowledgeEdgeListByRepositoryEntityId,
      requestBody: params
    });
  }

  static async getEdgeList(): Promise<PublicApiResponseType<KnowledgeEdgeResponseType[]>> {
    return RequestUtil.post<undefined, KnowledgeEdgeResponseType[]>({
      apiPath: ApiPathEnum.GetNoAuthKnowledgeEdgeList,
      requestBody: undefined
    });
  }
}
