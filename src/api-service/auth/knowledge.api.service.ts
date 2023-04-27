/**
 * @author songxiwen
 * @date  2021/9/12 23:28
 */

import { RequestNewUntil } from '@/utils/request.new.until';
import {
  AlternativeKnowledgeListType, BackupKnowledgeJSONType,
  EntityCompletelyListItemType, HistoryVersionKnowledgeModelType,
  KnowledgeAuthedApi, KnowledgeModelType
} from '@metagraph/constant';
import type { PublicApiResponseType } from '@/utils';

export class KnowledgeApiService {
  static async createDraftKnowledge(params: {
    name: string;
    knowledgeBaseTypeId: string;
    repositoryEntityId: string;
  }): Promise<PublicApiResponseType<EntityCompletelyListItemType>> {
    return RequestNewUntil.post<KnowledgeAuthedApi.CreateDraftKnowledge>({
      apiPath: '/knowledge/draft/create',
      requestBody: params
    });
  }

  static async updateDraftKnowledge(params: {
    knowledgeEntityId: string,
    name?: string,
    knowledgeBaseTypeId?: string,
    domain?: {
      domainBaseTypeId: string;
      domainId: string;
    }[],
    pictures?: {
      fileId: string;
      url: string;
      name?: string;
      size?: number;
    }[];
    mentionKnowledgeList?: {
      entityId: string;
      repositoryEntityId: string;
      version: number;
    }[];
  }): Promise<PublicApiResponseType<EntityCompletelyListItemType>> {
    return RequestNewUntil.post<KnowledgeAuthedApi.UpdateDraftKnowledge>({
      apiPath: '/knowledge/draft/update',
      requestBody: params
    });
  }

  static async getDraftKnowledge(params: {
    knowledgeEntityId: string;
  }): Promise<PublicApiResponseType<EntityCompletelyListItemType>> {
    return RequestNewUntil.post<KnowledgeAuthedApi.GetDraftKnowledge>({
      apiPath: '/knowledge/draft/get',
      requestBody: params
    });
  }

  static async getDraftKnowledgePreview(params: {
    draftKnowledgeEntityId: string;
  }): Promise<PublicApiResponseType<{
    entity: EntityCompletelyListItemType;
    mentionList: EntityCompletelyListItemType[];
  }>> {
    return RequestNewUntil.post<KnowledgeAuthedApi.GetDraftKnowledgePreview>({
      apiPath: '/knowledge/draft/preview',
      requestBody: params
    });
  }

  static async getDraftKnowledgeMentionedList(params: {
    knowledgeEntityId: string;
  }): Promise<PublicApiResponseType<EntityCompletelyListItemType[]>> {
    return RequestNewUntil.post<KnowledgeAuthedApi.GetDraftKnowledgeMentionedEntityList>({
      apiPath: '/knowledge/draft/getMentionList',
      requestBody: params
    });
  }

  static async publishDraftKnowledge(params: {
    knowledgeEntityId: string;
    repositoryEntityId: string;
  }): Promise<PublicApiResponseType<{
    publishedKnowledgeEntityId: string;
    draftKnowledgeEntityId: string;
  }>> {
    return RequestNewUntil.post<KnowledgeAuthedApi.PublishDraftKnowledge>({
      apiPath: '/knowledge/draft/publish',
      requestBody: params
    });
  }

  static async compareWithLatestVersion(params: {
    publishedKnowledgeEntityId: string,
    draftKnowledgeEntityId: string,
    repositoryEntityId: string
  }): Promise<PublicApiResponseType<{
    published: {
      model: KnowledgeModelType,
      entity: EntityCompletelyListItemType,
      mentionList: EntityCompletelyListItemType[]
    },
    draft: {
      model: KnowledgeModelType,
      entity: EntityCompletelyListItemType,
      mentionList: EntityCompletelyListItemType[]
    }
  }>> {
    return RequestNewUntil.post<KnowledgeAuthedApi.CompareWithLatestVersion>({
      apiPath: '/knowledge/draft/compare',
      requestBody: params
    });
  }

  static async GetOwnDraftKnowledgeList(params: {
    repositoryEntityId?: string;
  }): Promise<PublicApiResponseType<EntityCompletelyListItemType[]>> {
    return RequestNewUntil.post<KnowledgeAuthedApi.GetOwnDraftKnowledgeList>({
      apiPath: '/knowledge/getOwnDraftList',
      requestBody: params
    });
  }

  static async getAlternativeKnowledgeList(params: {
    repositoryEntityId: string
  }): Promise<PublicApiResponseType<AlternativeKnowledgeListType>> {
    return RequestNewUntil.post<KnowledgeAuthedApi.GetAlternativeKnowledgeList>({
      apiPath: '/knowledge/getAlternativeKnowledgeList',
      requestBody: params
    });
  }

  static async removeAlternativeKnowledge(params: {
    repositoryEntityId: string,
    id: string
  }): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<KnowledgeAuthedApi.RemoveAlternativeKnowledge>({
      apiPath: '/knowledge/removeAlternativeKnowledge',
      requestBody: params
    });
  }

  static async createAlternativeKnowledgeList(
    params: {
      article: {
        name: string;
        url: string;
        type: 'word';
      };
      repositoryEntityId: string;
      entityList: {
        name: string;
        weight: number;
      }[];
    }
  ): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<KnowledgeAuthedApi.CreateMultipleAlternativeKnowledge>({
      apiPath: '/knowledge/createMultipleAlternativeKnowledge',
      requestBody: params
    });
  }

  static async saveDescription(params: {
    description: string,
    descriptionHTML: string,
    knowledgeEntityId: string
  }): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<KnowledgeAuthedApi.SaveDraftKnowledgeDescription>({
      apiPath: '/knowledge/save/description',
      requestBody: params
    });
  }

  static async remove(id: string): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<KnowledgeAuthedApi.RemoveKnowledge>({
      apiPath: '/knowledge/remove/id',
      requestBody: { id }
    });
  }

  static async removePicture(params: {
    knowledgeEntityId: string;
    fileId: string;
  }): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<KnowledgeAuthedApi.RemoveDraftKnowledgePicture>({
      apiPath: '/knowledge/draft/removePicture',
      requestBody: params
    });
  }

  static async checkField(params: {
    knowledgeEntityId: string;
    customField: {
      label: string;
    };
  }): Promise<PublicApiResponseType<{ isExists: boolean }>> {
    return RequestNewUntil.post<KnowledgeAuthedApi.CheckCustomField>({
      apiPath: '/knowledge/checkField',
      requestBody: params
    });
  }

  static async addField(params: {
    knowledgeEntityId: string;
    customField: {
      label: string;
      type: 'Date' | 'Input' | 'Textarea';
      grid: 1 | 2;
    };
  }): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<KnowledgeAuthedApi.AddCustomField>({
      apiPath: '/knowledge/addField',
      requestBody: params
    });
  }

  static async editField(params: {
    knowledgeEntityId: string;
    customField: {
      key: string;
      label: string;
      type: 'Date' | 'Input' | 'Textarea';
      grid: 1 | 2;
    };
  }): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<KnowledgeAuthedApi.EditCustomField>({
      apiPath: '/knowledge/editField',
      requestBody: params
    });
  }

  static async removeField(params: {
    knowledgeEntityId: string;
    customFieldKey: string;
  }): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<KnowledgeAuthedApi.RemoveCustomField>({
      apiPath: '/knowledge/removeField',
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
    return RequestNewUntil.post<KnowledgeAuthedApi.SaveCustomFields>({
      apiPath: '/knowledge/saveFields',
      requestBody: params
    });
  }

  static async GetHistoryVersionList(params: {
    knowledgeEntityId: string;
  }): Promise<PublicApiResponseType<{
    origin: HistoryVersionKnowledgeModelType,
    parsed: BackupKnowledgeJSONType
  }[]>> {
    return RequestNewUntil.post<KnowledgeAuthedApi.GetHistoryVersionList>({
      apiPath: '/knowledge/getHistoryVersionList',
      requestBody: params
    });
  }
}
