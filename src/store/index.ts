/**
 * @author wizard.song
 * @date 2021/07/10 15:13
 */

import { MutationEnum } from '@/store/constant/mutation.enum';
import { ActionEnum } from '@/store/constant/action.enum';

import { createStore, useStore as baseUseStore } from 'vuex';
import type { Store } from 'vuex';
import type { InjectionKey } from 'vue';

import type { StateType } from './state/state.type';

import { repositoryEditModule } from './repository.edit.module';
import type { RepositoryEditStateType } from './repository.edit.module';
import { userModule } from './user.module';
import type { UserStateType } from './user.module';
import { repositoryListModule } from './repository.list.module';
import type { RepositoryListType } from './repository.list.module';

export { ActionEnum } from './constant/action.enum';
export { MutationEnum } from './constant/mutation.enum';

export const key: InjectionKey<Store<{ isSpinning: boolean } &
  { repositoryEdit: RepositoryEditStateType } &
  { user: UserStateType } &
  { repositoryList: RepositoryListType }>> = Symbol();

export const store = createStore({
  state: {
    isSpinning: false,
  },
  mutations: {
    [MutationEnum.SET_IS_SPINNING](state, { status }) {
      state.isSpinning = status;
    }
  },
  actions: {},
  modules: {
    repositoryEdit: repositoryEditModule,
    repositoryList: repositoryListModule,
    user: userModule
  },
});

export const useStore = () => baseUseStore(key);
