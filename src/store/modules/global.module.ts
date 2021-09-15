/**
 * @author songxiwen
 * @date  2021/9/15 00:01
 */

import { Module } from 'vuex';
import { MutationEnum } from '@/store/constant';
import { GlobalModuleType, RootStateType } from '@/store/type';

export const globalModule: Module<GlobalModuleType, RootStateType> = {
  state: () => ({
    isSpinning: false,
  }),
  mutations: {
    [MutationEnum.SET_IS_SPINNING](state, { status }) {
      state.isSpinning = status;
    }
  }
};
