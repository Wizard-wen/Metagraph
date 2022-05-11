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
    guide: {
      homepage: {
        status: 'not-start'
      },
      repositorySectionEditor: {
        status: 'not-start'
      },
      repositoryGraphEditor: {
        status: 'not-start'
      },
      knowledgeEditor: {
        status: 'not-start'
      }
    }
  }),
  mutations: {
    [MutationEnum.SET_IS_SPINNING](state, { status }) {
      state.isSpinning = status;
    },
    [MutationEnum.SET_GUIDE_STATUS](state) {
      if (!state.guide) {
        state.guide = {
          homepage: {
            status: 'not-start'
          },
          repositorySectionEditor: {
            status: 'not-start'
          },
          repositoryGraphEditor: {
            status: 'not-start'
          },
          knowledgeEditor: {
            status: 'not-start'
          }
        };
      }
    },
    [MutationEnum.SET_GUIDE_STATUS](state, params: {
      type: 'homepage' | 'repositorySectionEditor' | 'repositoryGraphEditor' | 'knowledgeEditor',
      step: number,
      status: 'done' | 'doing' | 'not-start'
    }) {
      state.guide[params.type] = {
        status: params.status,
        step: params.step
      };
    }
  }
};
