/**
 * @author songxiwen
 * @date  2021/9/14 23:28
 */

import type {
  GlobalModuleType,
  RepositoryEditorStateType,
  RepositoryListType,
  UserStateType
} from '@/store/type';

export type RootStateType = {
  repositoryEditor: RepositoryEditorStateType;
  user: UserStateType;
  repositoryList: RepositoryListType;
  global: GlobalModuleType;
};
