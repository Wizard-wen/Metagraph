/**
 * @author songxiwen
 * @date  2021/9/15 12:28
 */

import { message } from 'ant-design-vue';
import { store } from '@/store';
import { ErrorDetailSystemApiService } from '@/api.service/system/error.detail.system.api.service';
import router from '@/router';
import 'ant-design-vue/dist/antd.css';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ConfigService } from '@/config/config.service';
import { PublicApiResponseType } from '@/utils/request.util';
// 请求拦截
axios.interceptors.request.use((config: AxiosRequestConfig) => {
  config.baseURL = ConfigService.apiBaseURL;
  // store
  config.headers = {
    ...config.headers,
    'edu-user-token': store.state.user.token || ''
  };
  return config;
});
// 响应拦截
axios.interceptors.response.use((response: AxiosResponse<PublicApiResponseType<any>>) => {
  // 捕捉业务级错误
  if (response.config.url?.includes(ConfigService.apiBaseURL) && response.data.code !== 0) {
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
