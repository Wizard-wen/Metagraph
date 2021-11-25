/**
 * @author songxiwen
 * @date  2021/9/12 23:28
 */

import {
  AlternativeKnowledgeListType,
  EntityCompletelyListItemType
} from 'edu-graph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

// eslint-disable-next-line import/prefer-default-export
export class KnowledgeApiService {
  static async getAlternativeKnowledgeList(params: {
    repositoryEntityId: string
  }): Promise<PublicApiResponseType<AlternativeKnowledgeListType>> {
    return RequestUtil.post<{ repositoryEntityId: string }, AlternativeKnowledgeListType>({
      apiPath: ApiPathEnum.GetAlternativeKnowledgeList,
      requestBody: params
    });
  }

  static async createAlternativeKnowledgeList(params: {
    article: {
      name: string;
      url: string;
      type: 'word'
    },
    repositoryEntityId: string,
    entityList: {
      name: string,
      weight: number,
    }[]
  }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{
      article: {
        name: string;
        url: string;
        type: 'word'
      },
      repositoryEntityId: string,
      entityList: {
        name: string,
        weight: number,
      }[]
    }, void>({
      apiPath: ApiPathEnum.CreateAlternativeKnowledgeList,
      requestBody: params
    });
  }

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

  static async update(params: {
    knowledgeEntityId: string;
    name: string;
    knowledgeBaseTypeId: string;
    domainId?: string;
  }): Promise<PublicApiResponseType<EntityCompletelyListItemType>> {
    return RequestUtil.post<{
      knowledgeEntityId: string;
      name: string;
      knowledgeBaseTypeId: string;
      domainId?: string;
    }, EntityCompletelyListItemType>({
      apiPath: ApiPathEnum.UpdateKnowledge,
      requestBody: params
    });
  }
}
