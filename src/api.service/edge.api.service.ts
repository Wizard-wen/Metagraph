/**
 * @author wizard
 * @date 2021/03/13 16:29
 */

import { ApiPathEnum, PublicApiResponseType, RequestUtil } from '@/api.service/api.config';
import type { KnowledgeEdgeResponseType } from 'edu-graph-constant';

// eslint-disable-next-line import/prefer-default-export
export class EdgeApiService {
  static async create(params: {
    originKnowledgeEntityId: string;
    targetKnowledgeEntityId: string;
    knowledgeEntityId: string;
    edgeRepositoryEntityId: string;
    description?: string;
  }): Promise<PublicApiResponseType<KnowledgeEdgeResponseType>> {
    return RequestUtil.post<{
      originKnowledgeEntityId: string;
      targetKnowledgeEntityId: string;
      knowledgeEntityId: string;
      edgeRepositoryEntityId: string;
      description?: string;
    }, KnowledgeEdgeResponseType>({
      apiPath: ApiPathEnum.CreateKnowledgeEdge,
      requestBody: params
    });
  }
}
