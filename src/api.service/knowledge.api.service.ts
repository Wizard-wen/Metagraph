/**
 * @author songxiwen
 * @date  2021/9/12 23:28
 */

import {
  AlternativeKnowledgeListType,
  EntityCompletelyListItemType
} from 'metagraph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

export class KnowledgeApiService {
  static async getAlternativeKnowledgeList(params: {
    repositoryEntityId: string
  }): Promise<PublicApiResponseType<AlternativeKnowledgeListType>> {
    return RequestUtil.post<{ repositoryEntityId: string }, AlternativeKnowledgeListType>({
      apiPath: ApiPathEnum.GetAlternativeKnowledgeList,
      requestBody: params
    });
  }

  static async removeAlternativeKnowledge(params: {
    repositoryEntityId: string,
    id: string
  }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{ repositoryEntityId: string, id: string }, void>({
      apiPath: ApiPathEnum.RemoveAlternativeKnowledge,
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

  static async checkField(params: {
    knowledgeEntityId: string;
    customField: {
      label: string;
    };
  }): Promise<PublicApiResponseType<{ isExists: boolean }>> {
    return RequestUtil.post<{
      knowledgeEntityId: string;
      customField: {
        label: string;
      };
    }, { isExists: boolean }>({
      apiPath: ApiPathEnum.CheckCustomKnowledgeFormField,
      requestBody: params
    });
  }

  static async addField(params: {
    knowledgeEntityId: string;
    customField: {
      label: string;
    };
  }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{
      knowledgeEntityId: string;
      customField: {
        label: string;
      };
    }, void>({
      apiPath: ApiPathEnum.AddCustomKnowledgeFormField,
      requestBody: params
    });
  }

  static async removeField(params: {
    knowledgeEntityId: string;
    customFieldKey: string;
  }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{
      knowledgeEntityId: string;
      customFieldKey: string;
    }, void>({
      apiPath: ApiPathEnum.RemoveCustomKnowledgeFormField,
      requestBody: params
    });
  }

  static async saveFields(params: {
    knowledgeEntityId: string;
    customFields: {
      label: string;
      key: string;
      value: string;
    }[];
  }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{
      knowledgeEntityId: string;
      customFields: {
        label: string;
        key: string;
        value: string;
      }[];
    }, void>({
      apiPath: ApiPathEnum.SaveCustomKnowledgeFormFields,
      requestBody: params
    });
  }
}
