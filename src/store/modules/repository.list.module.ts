/**
 * @author wizard.song
 * @date 2021/07/14 23:46
 */

import { Module } from 'vuex';
import { RootStateType, RepositoryListType } from '@/store/type';
import { RepositoryApiService } from '@/api-service';
import { ActionEnum, MutationEnum } from '@/store/constant';

export const repositoryListModule: Module<RepositoryListType, RootStateType> = {
  state: () => ({
    followerRepositoryList: [],
    followerRepositoryListTotal: undefined,
    ownRepositoryList: []
  }),
  mutations: {
    [MutationEnum.SET_OWN_REPOSITORY_LIST](state, {
      ownRepositoryList
    }) {
      state.ownRepositoryList = ownRepositoryList;
    },
  },
  actions: {
    async [ActionEnum.GET_OWN_REPOSITORY_LIST]({ commit }) {
      const ownRepositoryList = await RepositoryApiService.getOwnRepositoryList();
      commit(MutationEnum.SET_OWN_REPOSITORY_LIST, {
        ownRepositoryList: ownRepositoryList.data
      });
    }
  },
  getters: {}
};
