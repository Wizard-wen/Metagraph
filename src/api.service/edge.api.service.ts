/**
 * @author wizard
 * @date 2021/03/13 16:29
 */

import { ApiPathEnum, PublicApiResponseType, RequestUtil } from '@/api.service/api.config';
import axios from 'axios';
import {
  QiniuUploadingCredentialRequestType,
  QiniuUploadingCredentialResponseType
} from 'edu-graph-constant';
import type { KnowledgeEdgeResponseType } from 'edu-graph-constant';

export class EdgeApiService {
  static async createKnowledgeEdge(params: {
    originKnowledgeEntityId: string;
    targetKnowledgeEntityId: string;
    knowledgeEntityId: string;
    edgeRepositoryEntityId: string;
    description?: string;
  }): Promise<KnowledgeEdgeResponseType> {
    return new Promise((resolve) => {
      axios.post<KnowledgeEdgeResponseType>('knowledge/edge/create', params).then((data) => {
        resolve(data.data);
      });
    });
  }

  static async getEdgeListByRepositoryId(params: { edgeRepositoryEntityId: string }): Promise<PublicApiResponseType<KnowledgeEdgeResponseType[]>> {
    return RequestUtil.post<{ edgeRepositoryEntityId: string }, KnowledgeEdgeResponseType[]>({
      apiPath: ApiPathEnum.GetKnowledgeEdgeListByRepositoryId,
      requestBody: params
    });
  }

  static async getEdgeList(): Promise<PublicApiResponseType<KnowledgeEdgeResponseType[]>> {
    return RequestUtil.post<undefined, KnowledgeEdgeResponseType[]>({
      apiPath: ApiPathEnum.GetKnowledgeEdgeList,
      requestBody: undefined
    });
  }
}
