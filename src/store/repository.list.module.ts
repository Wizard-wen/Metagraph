/**
 * @author wizard.song
 * @date 2021/07/14 23:46
 */

import { RepositoryApiService } from '@/api.service';
import { ActionEnum } from '@/store/constant/action.enum';
import { Module } from 'vuex';
import { EntityCompletelyListItemType, RepositoryListRequestFilterType } from 'edu-graph-constant';
import { MutationEnum } from './constant/mutation.enum';

export type RepositoryListType = {
  // repositoryList: EntityCompletelyListItemType[],
  // repositoryListTotal?: number,
  ownRepositoryList: EntityCompletelyListItemType[];
}

export const repositoryListModule: Module<RepositoryListType, any> = {
  state: () => ({
    // repositoryList: [],
    // repositoryListTotal: undefined,
    followerRepositoryList: [],
    followerRepositoryListTotal: undefined,
    ownRepositoryList: []
  }),
  mutations: {
    // [MutationEnum.SET_REPOSITORY_LIST](state, {
    //   repositoryList,
    //   repositoryListTotal,
    // }) {
    //   state.repositoryList = repositoryList;
    //   state.repositoryListTotal = repositoryListTotal;
    // },
    [MutationEnum.SET_OWN_REPOSITORY_LIST](state, {
      ownRepositoryList
    }) {
      state.ownRepositoryList = ownRepositoryList;
    },
  },
  actions: {
    // async [ActionEnum.GET_REPOSITORY_LIST]({ commit }, filter: RepositoryListRequestFilterType) {
    //   const repositoryList = await RepositoryApiService.getRepositoryList(filter);
    //   commit(MutationEnum.SET_REPOSITORY_LIST, {
    //     repositoryList: repositoryList.data?.list,
    //     repositoryListTotal: repositoryList.data?.total
    //   });
    // },
    async [ActionEnum.GET_OWN_REPOSITORY_LIST]({ commit }) {
      const ownRepositoryList = await RepositoryApiService.getOwnRepositoryList();
      commit(MutationEnum.SET_OWN_REPOSITORY_LIST, {
        ownRepositoryList: ownRepositoryList.data
      });
    }
  },
  getters: {}
};
