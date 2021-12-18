/**
 * @author songxiwen
 * @date  2021/9/15 11:29
 */

export type UserStateType = {
  user?: {
    id: string;
    name: string;
    avatar: string;
    token: string;
    userType: 'personal' | 'organization'
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
