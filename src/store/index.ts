/**
 * @author wizard.song
 * @date 2021/07/10 15:13
 */

import { createStore, useStore as baseUseStore } from 'vuex';
import type { Store } from 'vuex';
import type { InjectionKey } from 'vue';
import {
  globalModule,
  repositoryEditorModule,
  userModule,
  repositoryListModule
} from '@/store/modules';
import { RootStateType } from '@/store/type';

export { ActionEnum } from './constant/action.enum';
export { MutationEnum } from './constant/mutation.enum';
// 定义 injection key
export const key: InjectionKey<Store<RootStateType>> = Symbol('store');

export const store = createStore({
  modules: {
    repositoryEditor: repositoryEditorModule,
    repositoryList: repositoryListModule,
    user: userModule,
    global: globalModule
  },
});

// 定义自己的 `useStore` 组合式函数
export const useStore = (): Store<RootStateType> => baseUseStore(key);
