/**
 * @author songxiwen
 * @date  2021/9/12 23:21
 */

import type { SectionArticleResponseType, SectionTreeNodeType } from 'metagraph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

export class SectionNoAuthApiService {
  static async getSectionTree(params: { repositoryEntityId: string }): Promise<PublicApiResponseType<SectionTreeNodeType[]>> {
    return RequestUtil.post<{ repositoryEntityId: string }, SectionTreeNodeType[]>({
      apiPath: ApiPathEnum.GetNoAuthSectionTree,
      requestBody: params
    });
  }

  static getSectionArticle(params: { sectionId: string }): Promise<PublicApiResponseType<SectionArticleResponseType>> {
    return RequestUtil.post<{ sectionId: string }, SectionArticleResponseType>({
      apiPath: ApiPathEnum.GetNoAuthSectionContent,
      requestBody: params
    });
  }
}
