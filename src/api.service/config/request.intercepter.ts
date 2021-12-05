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
  if (response.config.url?.includes(ConfigService.apiBaseURL) && response.data.code !== 0) {
    console.log('error', response.config.baseURL);
    message.error(response.data?.message ?? 'server unknown error');
  }
  if (response.status >= 400) {
    message.error(response.statusText);
  }
  return response;
},
(error) => {
  message.error(error.message);
});
