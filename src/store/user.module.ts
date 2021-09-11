/**
 *
 */

import { Module } from 'vuex';
import { MutationEnum } from './constant/mutation.enum';

export type UserStateType = {
  user?: {
    id: string;
    name: string;
  };
  isLogin?: boolean;
  token?: string;
  userState?: {
    id: string;
    name: string;
    avatar?: string;
  };
  isLoginState?: boolean;
  tokenState?: string
}

export const userModule: Module<UserStateType, any> = {
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
      }
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
