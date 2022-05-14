/**
 * @author songxiwen
 * @date  2021/9/12 23:21
 */

import type {
  EntityCompletelyListItemType, SectionArticleModelType,
  SectionArticleResponseType,
  SectionModelType,
  SectionTreeNodeType
} from 'metagraph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

type SectionItemUIType = {
  section: SectionModelType,
  parentId?: string
  title: string;
  key: string;
};

export type SectionTreeNodeUIType = SectionItemUIType & {
  children?: SectionTreeNodeUIType[]
};

export class SectionNoAuthApiService {
  static async getSectionTree(params: { repositoryEntityId: string }): Promise<PublicApiResponseType<SectionTreeNodeType[]>> {
    return RequestUtil.post<{ repositoryEntityId: string }, SectionTreeNodeType[]>({
      apiPath: ApiPathEnum.GetNoAuthSectionTree,
      requestBody: params
    });
  }

  static async getNormalSectionTree(params: { repositoryEntityId: string }): Promise<
    PublicApiResponseType<SectionTreeNodeUIType[]>
  > {
    return RequestUtil.post<{ repositoryEntityId: string }, SectionTreeNodeUIType[]>({
      apiPath: ApiPathEnum.GetNoAuthNormalSectionTree,
      requestBody: params
    });
  }

  static getSectionArticle(params: { sectionId: string }): Promise<PublicApiResponseType<{
    section: SectionModelType,
    article: SectionArticleModelType,
    entityList: EntityCompletelyListItemType[]
  }>> {
    return RequestUtil.post<{ sectionId: string }, {
      section: SectionModelType,
      article: SectionArticleModelType,
      entityList: EntityCompletelyListItemType[]
    }>({
      apiPath: ApiPathEnum.GetNoAuthSectionContent,
      requestBody: params
    });
  }
}
