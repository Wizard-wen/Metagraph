/**
 * @author songxiwen
 * @date  2022/1/28 15:19
 */

import type { EntityCompletelyListItemType, PublicEntityType } from 'metagraph-constant';
import { reactive } from 'vue';
import { EntityNoAuthApiService } from '@/api.service';

export const searchList = reactive<{
  pageSize: number,
  pageNumber: number,
  list: EntityCompletelyListItemType[],
  total: number
}>({
  pageSize: 10,
  pageNumber: 1,
  list: [],
  total: 0
});

export class SearchList {
  async onPaginationChange(searchText: string, entityType: PublicEntityType): Promise<void> {
    const result = await EntityNoAuthApiService.getSearchList({
      pageIndex: searchList.pageNumber - 1,
      pageSize: searchList.pageSize,
      searchText,
      entityType
    });
    searchList.list = result.data?.list ?? [];
    searchList.total = result.data?.total || 0;
  }
}
