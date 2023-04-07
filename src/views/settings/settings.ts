/**
 * @author songxiwen
 * @date  2022/1/28 22:08
 */

import { message } from 'ant-design-vue';
import { reactive, UnwrapRef } from 'vue';
import { UserApiService } from '@/api-service';

export interface UserProfileFormStateType {
  name: string;
  avatar: string;
  type: 'personal' | 'organization';
  phone?: string;
  email?: string;
  wechat?: string;
  company?: string;
  personalWebsite?: string;
  location?: string;
}

export const userProfileFormState: UnwrapRef<UserProfileFormStateType> = reactive({
  name: '',
  avatar: '',
  type: 'personal',
  phone: '',
  email: '',
  wechat: '',
  company: '',
  personalWebsite: '',
  // 所在地区
  location: ''
});

export const bindEmailObject = reactive({
  email: '',
  isBind: false
});

export class Settings {
  async getUserModel(): Promise<void> {
    const result = await UserApiService.getById();
    if (result.data) {
      userProfileFormState.name = result.data.name;
      userProfileFormState.avatar = result.data.avatar || '';
      userProfileFormState.type = result.data.type;
      userProfileFormState.phone = result.data.phone || '';
      userProfileFormState.email = result.data.email || '';
      userProfileFormState.personalWebsite = result.data.personalWebsite || '';
      userProfileFormState.wechat = result.data.wechat || '';
      userProfileFormState.company = result.data.company || '';
      userProfileFormState.location = result.data.location || '';
      if (result.data.isBindEmail) {
        bindEmailObject.isBind = result.data.isBindEmail;
        bindEmailObject.email = result.data.email || '';
      }
    }
  }

  async getUserBindEmail(): Promise<void> {
    const result = await UserApiService.getUserBindEmail();
    if (result.data) {
      if (result.data) {
        bindEmailObject.isBind = result.data.isBind;
        bindEmailObject.email = result.data.email || '';
      }
    }
  }
}
