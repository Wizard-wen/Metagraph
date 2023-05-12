/**
 * @author wizard.song
 * @date 2021/07/10 21:13
 */

import type { Store } from 'vuex';
import { createStore, useStore as baseUseStore } from 'vuex';
import type { InjectionKey } from 'vue';
import createPersistedState from 'vuex-persistedstate';
import { globalModule, userModule, } from '@/store/modules';
import { RootStateType } from '@/store/type';

export { MutationEnum } from './constant/mutation.enum';
// 定义 injection key
export const key: InjectionKey<Store<RootStateType>> = Symbol('store');

// 持久化来自userModule中的user token isLogin
const dataState = createPersistedState({
  paths: ['user', 'token', 'isLogin', 'global.guide']
});

export const store = createStore({
  modules: {
    user: userModule,
    global: globalModule
  },
  plugins: [dataState],
});

// 定义自己的 `useStore` 组合式函数
export const useStore = (): Store<RootStateType> => baseUseStore(key);
