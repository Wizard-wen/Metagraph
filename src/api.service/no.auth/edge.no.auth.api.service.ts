/**
 * @author songxiwen
 * @date  2021/9/12 22:29
 */

import { RequestNewUntil } from '@/utils/request.new.until';
import type { KnowledgeEdgeNoAuthApi, KnowledgeEdgeResponseType } from 'metagraph-constant';
import type { PublicApiResponseType } from '@/utils';

export class EdgeNoAuthApiService {
  /**
   * 通过仓库entity id获取仓库内所有的边
   * @param params edgeRepositoryEntityId 仓库的entityId
   */
  static async getListByRepositoryId(params: {
    edgeRepositoryEntityId: string
  }): Promise<PublicApiResponseType<KnowledgeEdgeResponseType[]>> {
    return RequestNewUntil.post<KnowledgeEdgeNoAuthApi.GetEdgeListByRepositoryEntityId>({
      apiPath: '/public/knowledge/edge/getList/repositoryEntityId',
      requestBody: params
    });
  }

  static async getEdgeList(): Promise<PublicApiResponseType<KnowledgeEdgeResponseType[]>> {
    return RequestNewUntil.post<KnowledgeEdgeNoAuthApi.GetEdgeList>({
      apiPath: '/public/knowledge/edge/getList',
      requestBody: undefined
    });
  }
}
