/**
 * @author wizard
 * @date 2021/03/13 16:29
 */

import type {
  SectionArticleUpdateRequestType,
  SectionAuthApi,
  SectionEntityType,
  SectionModelType,
  SectionResponseType
} from '@metagraph/constant';
import type { PublicApiResponseType } from '@/utils';
import { RequestNewUntil } from '@/utils';

export class SectionApiService {
  static createSectionTree(params: {
    text?: string;
    name: string;
    repositoryEntityId: string;
    parentId?: string;
  }): Promise<PublicApiResponseType<SectionResponseType>> {
    return RequestNewUntil.post<SectionAuthApi.CreateSection>({
      apiPath: '/section/create',
      requestBody: params
    });
  }

  static updateSectionTree(params: {
    name: string;
    id: string;
  }): Promise<PublicApiResponseType<SectionModelType>> {
    return RequestNewUntil.post<SectionAuthApi.UpdateSection>({
      apiPath: '/section/update',
      requestBody: params
    });
  }

  static bindSectionEntity(params: {
    repositoryEntityId: string; sectionId: string, entityId: string, entityType: SectionEntityType
  }): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<SectionAuthApi.BindEntityToSection>({
      apiPath: '/section/bind/entity',
      requestBody: params
    });
  }

  /**
   * 保存单元文章
   * @param params
   */
  static saveSectionArticle(params: SectionArticleUpdateRequestType): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<SectionAuthApi.SaveSectionArticle>({
      apiPath: '/section/save/article',
      requestBody: params
    });
  }

  static removeSection(params: {
    id: string;
    repositoryEntityId: string;
  }): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<SectionAuthApi.DeleteSection>({
      apiPath: '/section/remove',
      requestBody: params
    });
  }
}
