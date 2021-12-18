/**
 * @author songxiwen
 * @date  2021/9/15 12:28
 */

import { message } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ConfigService } from '@/config/config.service';
import { PublicApiResponseType } from '@/utils/request.util';

// 请求拦截
axios.interceptors.request.use((config: AxiosRequestConfig) => {
  config.baseURL = ConfigService.apiBaseURL;
  config.headers = {
    ...config.headers,
    'edu-user-token': JSON.parse(localStorage.getItem('user') || '{}')?.token || ''
  };
  return config;
});
// 响应拦截
axios.interceptors.response.use((response: AxiosResponse<PublicApiResponseType<any>>) => {
  // 捕捉业务级错误
  if (response.config.url?.includes(ConfigService.apiBaseURL) && response.data.code !== 0) {
    message.error(response.data?.message ?? 'server unknown error');
  }
  // 对于http错误，返回错误码
  // todo 增加一个report error接口
  if (response.status >= 400) {
    message.error(response.statusText);
  }
  return response;
},
(error) => {
  message.error(error.message);
});
