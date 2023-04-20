/**
 * @author wizard
 * @date 2021/03/13 16:29
 */

import { RequestNewUntil } from '@/utils/request.new.until';
import type {
  KnowledgeEdgeAuthApi,
  KnowledgeEdgeResponseType,
  KnowledgeEdgeModelType
} from '@metagraph/constant';
import type { PublicApiResponseType } from '@/utils';

export class EdgeApiService {
  static async create(params: {
    originKnowledgeEntityId: string;
    targetKnowledgeEntityId: string;
    knowledgeEntityId: string;
    edgeRepositoryEntityId: string;
    description?: string;
  }): Promise<PublicApiResponseType<KnowledgeEdgeResponseType>> {
    return RequestNewUntil.post<KnowledgeEdgeAuthApi.Create>({
      apiPath: '/knowledge/edge/create',
      requestBody: params
    });
  }

  static async remove(params: {
    edgeId: string,
    edgeRepositoryEntityId: string
  }): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<KnowledgeEdgeAuthApi.Remove>({
      apiPath: '/knowledge/edge/remove',
      requestBody: params
    });
  }

  static async update(params: {
    edgeId: string;
    weight?: number;
    description?: string;
  }): Promise<PublicApiResponseType<KnowledgeEdgeModelType>> {
    return RequestNewUntil.post<KnowledgeEdgeAuthApi.Update>({
      apiPath: '/knowledge/edge/update',
      requestBody: params
    });
  }
}
