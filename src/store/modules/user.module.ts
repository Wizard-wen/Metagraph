/**
 * @author songxiwen
 * @date  2021/9/14 23:29
 */

import { Module } from 'vuex';
import { RootStateType, UserStateType } from '@/store/type';
import { MutationEnum } from '@/store/constant';

let userLocal: any;
if (localStorage.getItem('user') !== null) {
  userLocal = JSON.parse(localStorage.getItem('user')!);
}
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
    userState(state) {
      return () => {
        if (state.user) {
          return state.user;
        }
        if (localStorage.getItem('user') !== null) {
          return JSON.parse(localStorage.getItem('user')!);
        }
        return undefined;
      };
    },
    tokenState(state) {
      if (state.token) {
        return state.token;
      }
      if (localStorage.getItem('token') !== null) {
        return localStorage.getItem('token')!;
      }
      return undefined;
    },
    isLoginState(state) {
      if (state.isLogin) {
        return state.isLogin;
      }
      if (localStorage.getItem('isLogin') !== null) {
        return !!localStorage.getItem('isLogin');
      }
      return false;
    }
  }
};
