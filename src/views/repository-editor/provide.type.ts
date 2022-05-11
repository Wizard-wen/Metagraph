/**
 * @author songxiwen
 * @date  2021/11/24 22:43
 */

import { InjectionKey, Ref } from 'vue';

export const repositoryEntityIdKey: InjectionKey<Ref<string>> = Symbol('repositoryEntityId');
export const isEditableKey: InjectionKey<Ref<boolean>> = Symbol('isEditable');
