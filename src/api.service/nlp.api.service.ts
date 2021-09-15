/**
 * @author songxiwen
 * @date  2021/9/13 22:52
 */

import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

// eslint-disable-next-line import/prefer-default-export
export class NlpApiService {
  // 创建仓库
  static async parseWord(params: {
    url: string;
    repositoryEntityId: string;
  }): Promise<PublicApiResponseType<{
    list: { word: string; weight: number; }[],
    text: string;
  }>> {
    return RequestUtil.post<{
      url: string;
      repositoryEntityId: string;
    }, {
      list: { word: string; weight: number; }[],
      text: string;
    }>({
      apiPath: ApiPathEnum.ParseWord,
      requestBody: params
    });
  }
}
