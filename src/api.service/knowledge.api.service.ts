/**
 *
 */

import {
  FileEnum,
  KnowledgeResponseType,
  KnowledgePageListResponseType,
  EntityCompletelyListItemType
} from 'edu-graph-constant';
import { ApiPathEnum, PublicApiResponseType, RequestUtil } from './api.config';

export class KnowledgeApiService {
  static async remove(id: string): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{ id: string }, void>({
      apiPath: ApiPathEnum.RemoveKnowledge,
      requestBody: { id }
    });
  }

  static async saveDescription(params: { description: string, descriptionHTML: string, entityId: string }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{ description: string, descriptionHTML: string, entityId: string }, void>({
      apiPath: ApiPathEnum.SaveKnowledgeDescription,
      requestBody: params
    });
  }

  static async create(params: {
    name: string;
    knowledgeBaseTypeId: string;
    domainId?: string;
    description?: string;
    repositoryEntityId: string;
  }): Promise<PublicApiResponseType<EntityCompletelyListItemType>> {
    return RequestUtil.post<{
      name: string;
      knowledgeBaseTypeId: string;
      domainId?: string;
      description?: string;
      repositoryEntityId: string;
    }, EntityCompletelyListItemType>({
      apiPath: ApiPathEnum.CreateKnowledge,
      requestBody: params
    });
  }
}
