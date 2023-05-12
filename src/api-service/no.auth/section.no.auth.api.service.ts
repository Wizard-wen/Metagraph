/**
 * @author songxiwen
 * @date  2021/9/12 23:21
 */

import type {
  EntityCompletelyListItemType,
  SectionArticleModelType,
  SectionModelType,
  SectionNoAuthApi,
  SectionTreeNodeUIType
} from '@metagraph/constant';
import type { PublicApiResponseType } from '@/utils';
import { RequestNewUntil } from '@/utils';

export class SectionNoAuthApiService {
  static async getNormalSectionTree(params: {
    repositoryEntityId: string
  }): Promise<PublicApiResponseType<SectionTreeNodeUIType[]>> {

    return RequestNewUntil.post<SectionNoAuthApi.GetSectionTree>({
      apiPath: '/public/section/tree',
      requestBody: params
    });
  }

  static getSectionArticle(params: { sectionId: string }): Promise<PublicApiResponseType<{
    section: SectionModelType,
    article: SectionArticleModelType,
    entityList: EntityCompletelyListItemType[]
  }>> {
    return RequestNewUntil.post<SectionNoAuthApi.GetSectionContent>({
      apiPath: '/public/section/get/content',
      requestBody: params
    });
  }
}
