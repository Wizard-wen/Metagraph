/**
 * @author wizard
 * @date 2021/03/13 16:29
 */

import type { KnowledgeEdgeResponseType } from 'edu-graph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

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
