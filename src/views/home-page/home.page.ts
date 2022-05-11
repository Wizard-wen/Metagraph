/**
 * @author songxiwen
 * @date  2022/1/17 13:06
 */

import { message } from 'ant-design-vue';
import { ActivityModelType, EntityCompletelyListItemType, UserModelType } from 'metagraph-constant';
import { reactive, ref } from 'vue';
import { ActivityApiService } from '@/api.service/activity.api.service';
import { RepositoryApiService, RepositoryNoAuthApiService } from '@/api.service';

export const hotRepositoryList = ref<EntityCompletelyListItemType[]>([]);

export const repositoryList = reactive<{
  list: EntityCompletelyListItemType[],
  isLoading: boolean,
  total: number,
  current: number,
}>({
  list: [],
  isLoading: false,
  total: 0,
  current: 1,
});

export const activityList = reactive<{
  list: {
    user: UserModelType,
    entity?: EntityCompletelyListItemType,
    content: ActivityModelType,
    followedUser?: UserModelType
  }[],
  isLoading: boolean,
  total: number,
  current: number,
}>({
  list: [],
  isLoading: false,
  total: 0,
  current: 1,
});

export const ownRepositoryList = reactive<{
  list: EntityCompletelyListItemType[],
  isLoading: boolean,
  total: number,
  current: number,
}>({
  list: [],
  isLoading: false,
  total: 0,
  current: 1,
});

export class HomePage {
  async getRepositoryList(page?: number): Promise<void> {
    repositoryList.isLoading = true;
    const result = await RepositoryNoAuthApiService.getList({
      pageIndex: page ? page - 1 : repositoryList.current - 1,
      pageSize: 10
    });
    if (result.data) {
      repositoryList.list = result.data.list ?? [];
      repositoryList.total = result.data.total;
    } else {
      message.error('获取知识库数据时失败！');
    }
    repositoryList.isLoading = false;
  }

  async getHotList(): Promise<void> {
    const result = await RepositoryNoAuthApiService.getHotList();
    if (result.data) {
      hotRepositoryList.value = result.data;
    }
  }

  async getActivityList(page?: number): Promise<void> {
    activityList.isLoading = true;
    const result = await ActivityApiService.getList({
      pageIndex: page ? page - 1 : activityList.current - 1,
      pageSize: 10
    });
    if (result.data) {
      activityList.list = result.data.list;
      activityList.total = result.data.total;
    } else {
      message.error('获取仓库数据时失败！');
    }
    activityList.isLoading = false;
  }

  async getOwnRepositoryList(): Promise<void> {
    ownRepositoryList.isLoading = true;
    const result = await RepositoryApiService.getOwnRepositoryList();
    if (result.data) {
      ownRepositoryList.list = result.data;
    } else {
      message.error('获取知识库数据时失败！');
    }
    ownRepositoryList.isLoading = false;
  }
}
