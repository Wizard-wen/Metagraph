/**
 * @author songxiwen
 * @date  2022/1/8 23:01
 */

import { EntityCompletelyListItemType, UpdateRecordType, UserModelType } from 'metagraph-constant';
import { reactive, ref } from 'vue';
import { ActivityApiService } from '@/api.service/activity.api.service';
import { FollowApiService } from '@/api.service/follow.api.service';
import { FollowNoAuthApiService } from '@/api.service/no.auth/follow.no.auth.api.service';
import { StarNoAuthApiService } from '@/api.service/no.auth/star.no.auth.api.service';
import { RepositoryNoAuthApiService, UserApiService } from '@/api.service';

export const myStaredEntityList = reactive<{
  target: EntityCompletelyListItemType[]
}>({ target: [] });
export const myRepositoryEntityList = reactive<{
  target: EntityCompletelyListItemType[]
}>({ target: [] });

export const followList = reactive<{
  followerUserList: UserModelType[],
  followedUserList: UserModelType[]
}>({
  followerUserList: [],
  followedUserList: []
});

export const userFollow = ref<{
  followerCount: number;
  followedCount: number;
}>({
  followerCount: 0,
  followedCount: 0
});

export const userProfile = ref<UserModelType>();

export const updateRecord = ref<UpdateRecordType>();

export class PersonalProfile {
  async getFollowCount(userId: string): Promise<void> {
    const result = await FollowNoAuthApiService.getFollowCount({
      userId
    });
    if (result.data) {
      userFollow.value.followedCount = result.data.followedCount;
      userFollow.value.followerCount = result.data.followerCount;
    }
  }

  async getUpdateRecord(): Promise<void> {
    const result = await ActivityApiService.getActivityBox();
    if (result.data) {
      updateRecord.value = result.data;
    }
  }

  async getUserModelById(userId: string): Promise<void> {
    const result = await UserApiService.getPublicUserById({ userId });
    if (result.data) {
      userProfile.value = result.data;
    }
  }

  async getOwnStaredEntityList(userId: string): Promise<void> {
    const result = await StarNoAuthApiService.getUserStarList({
      userId,
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

  async getFollowerList(userId: string): Promise<void> {
    const result = await FollowNoAuthApiService.getFollowerList({
      userId
    });
    if (result.data) {
      followList.followerUserList = result.data;
    }
  }

  async getFollowedUserList(userId: string): Promise<void> {
    const result = await FollowNoAuthApiService.getFollowedUserList({
      userId
    });
    if (result.data) {
      followList.followedUserList = result.data;
    }
  }

  async checkIfFollowed(userId: string): Promise<boolean> {
    const result = await FollowApiService.checkIfFollowed({
      followedUser: userId
    });
    if (result.data) {
      return result.data.status;
    }
    return false;
  }
}
