/**
 * @author wizard
 * @date 2021/03/13 16:29
 */

import type {
  SectionCreateRequestType,
  SectionTreeNodeType,
  SectionResponseType,
  SectionEntityType, SectionArticleResponseType
} from 'edu-graph-constant';
import { ApiPathEnum, RequestUtil, PublicApiResponseType } from './api.config';

// eslint-disable-next-line import/prefer-default-export
export class SectionApiService {
  static async getSectionTree(params: { repositoryEntityId: string }): Promise<PublicApiResponseType<SectionTreeNodeType[]>> {
    return RequestUtil.post<{ repositoryEntityId: string }, SectionTreeNodeType[]>({
      apiPath: ApiPathEnum.GetSectionTree,
      requestBody: params
    });
  }

  static createSectionTree(params: {
    name: string;
    repositoryEntityId: string;
    parentId?: string;
  }): Promise<PublicApiResponseType<SectionResponseType>> {
    return RequestUtil.post<{
      name: string;
      repositoryEntityId: string;
      parentId?: string;
    }, SectionResponseType>({
      apiPath: ApiPathEnum.CreateSection,
      requestBody: params
    });
  }

  static updateSectionTree(params: {
    name: string;
    id: string;
  }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{
      name: string;
      id: string;
    }, void>({
      apiPath: ApiPathEnum.UpdateSection,
      requestBody: params
    });
  }

  static bindSectionEntity(params: {
    repositoryEntityId: string; sectionId: string, entityId: string, entityType: SectionEntityType
  }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{
      repositoryEntityId: string; sectionId: string, entityId: string, entityType: SectionEntityType
    }, void>({
      apiPath: ApiPathEnum.BindSectionEntity,
      requestBody: params
    });
  }

  static getSectionArticle(params: { sectionId: string }): Promise<PublicApiResponseType<SectionArticleResponseType>> {
    return RequestUtil.post<{ sectionId: string }, SectionArticleResponseType>({
      apiPath: ApiPathEnum.GetSectionContent,
      requestBody: params
    });
  }

  static saveSectionArticle(params: { sectionId: string; content: any; contentHtml?: any }): Promise<PublicApiResponseType<any>> {
    return RequestUtil.post<{ sectionId: string; content: any; contentHtml?: any }, any>({
      apiPath: ApiPathEnum.SaveSectionArticle,
      requestBody: params
    });
  }

  static getEntityList(params: { name: string; entityType?: string; pageIndex: number; pageSize: number }): Promise<PublicApiResponseType<any>> {
    return RequestUtil.post<{ name: string; entityType?: string; pageIndex: number; pageSize: number }, any>({
      apiPath: ApiPathEnum.GetEntityList,
      requestBody: params
    });
  }
}