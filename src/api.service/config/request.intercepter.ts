/**
 * @author songxiwen
 * @date  2021/9/15 12:28
 */

import { message } from 'ant-design-vue';
import { MutationEnum, store } from '@/store';
import { ErrorDetailSystemApiService } from '@/api.service/system/error.detail.system.api.service';
import router from '@/router';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { PublicApiResponseType } from '@/utils/request.util';

console.info(`当前环境为：${process.env.VUE_APP_API_BASE_URL}`);
// 请求拦截
axios.interceptors.request.use((config: AxiosRequestConfig) => {
  config.baseURL = process.env.VUE_APP_API_BASE_URL;
  config.headers = {
    ...config.headers,
    'edu-user-token': store.state.user.token || ''
  };
  return config;
});
// 响应拦截
axios.interceptors.response.use((response: AxiosResponse<PublicApiResponseType<any>>) => {
  // 捕捉业务级错误
  if (response.config.url?.includes(process.env.VUE_APP_API_BASE_URL!) && response.data.code !== 0) {
    message.error(response.data?.message ?? 'server unknown error');
  }
  if (response.data.code === 70006) {
    message.error('权限认证失败，请重新登录');
    ErrorDetailSystemApiService.create({
      code: response.data.code,
      path: response.request.path,
      type: 'business'
    })
      .then();
    // 清空当前用户localstorage
    store.commit(MutationEnum.CLEAR_USER_MODEL);
    router.push('/login')
      .then();
  }
  // 对于http错误，返回错误码
  // todo 增加一个report error接口
  if (response.status >= 400) {
    console.log(response.request);
    message.error(response.statusText);
    ErrorDetailSystemApiService.create({
      code: response.status,
      path: response.request.path,
      type: 'http'
    })
      .then();
  }
  return response;
},
(error) => {
  message.error(error.message);
});
