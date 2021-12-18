/**
 * @author songxiwen
 * @date  2021/9/14 23:29
 */

import { Module } from 'vuex';
import { RootStateType, UserStateType } from '@/store/type';
import { MutationEnum } from '@/store/constant';

export const userModule: Module<UserStateType, RootStateType> = {
  state: () => ({
    user: undefined,
    isLogin: false,
    token: undefined
  }),
  mutations: {
    [MutationEnum.SET_USER_MODEL](state, { userModel }) {
      state.user = userModel;
      state.token = userModel.token;
      state.isLogin = true;
    },
  },
  actions: {},
  getters: {

  }
};
