/**
 * @author wizard
 * @date 2021/03/13 16:29
 */

import type {
  SectionResponseType,
  SectionEntityType, SectionArticleUpdateRequestType
} from 'metagraph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

export class SectionApiService {
  static createSectionTree(params: {
    text?: string;
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

  /**
   * 保存单元文章
   * @param params
   */
  static saveSectionArticle(params: SectionArticleUpdateRequestType): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<SectionArticleUpdateRequestType, void>({
      apiPath: ApiPathEnum.SaveSectionArticle,
      requestBody: params
    });
  }
}
