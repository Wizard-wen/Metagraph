/**
 * @author songxiwen
 * @date  2021/12/4 01:36
 */

import { InjectionKey, Ref } from 'vue';
import type { UserModelType } from 'metagraph-constant';

export const userProfileKey: InjectionKey<Ref<UserModelType>> = Symbol('userProfileKey');
export const userIdKey: InjectionKey<Ref<string>> = Symbol('userIdKey');
