/**
 * @author songxiwen
 * @date  2022/1/8 23:01
 */

import { EntityCompletelyListItemType } from 'metagraph-constant';
import { reactive } from 'vue';
import { RepositoryNoAuthApiService, StarApiService } from '@/api.service';

export const myStaredEntityList = reactive<{
  target: EntityCompletelyListItemType[]
}>({ target: [] });
export const myRepositoryEntityList = reactive<{
  target: EntityCompletelyListItemType[]
}>({ target: [] });

export class PersonalProfile {
  async getOwnStaredEntityList(): Promise<void> {
    const result = await StarApiService.getMyStarList({
      pageIndex: 0,
      pageSize: 8,
    });
    if (result.data) {
      myStaredEntityList.target = result.data.list;
    }
  }

  async getOwnRepositoryEntityList(userId: string): Promise<void> {
    const result = await RepositoryNoAuthApiService.getList({
      pageIndex: 0,
      pageSize: 8,
      userId
    });
    if (result.data) {
      myRepositoryEntityList.target = result.data.list;
    }
  }
}
