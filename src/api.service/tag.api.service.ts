import { ApiPathEnum, PublicApiResponseType, RequestUtil } from '@/api.service/api.config';
import { PublicEntityType, StarResponseType } from '../../../edu-graph-constant';
import { TagModelType } from '../../../edu-graph-constant/dist/type/tag.type';

/**
 * @author wizard.song
 */

export class TagApiService {
  static create() {
    // todo
  }

  static async getList(params: {
    pageIndex: number;
    pageSize: number;
  }): Promise<PublicApiResponseType<{ list: TagModelType[]; total: number }>> {
    return RequestUtil.post<{
      pageIndex: number;
      pageSize: number;
    }, { list: TagModelType[]; total: number }>({
      apiPath: ApiPathEnum.GetTagList,
      requestBody: params
    });
  }
}
