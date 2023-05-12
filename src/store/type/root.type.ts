/**
 * @author songxiwen
 * @date  2021/9/14 23:28
 */

import type {
  GlobalModuleType,
  UserStateType
} from '@/store/type';

export type RootStateType = {
  user: UserStateType;
  global: GlobalModuleType;
};
