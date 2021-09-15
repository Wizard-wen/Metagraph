/**
 * @author songxiwen
 * @date  2021/9/15 12:28
 */

import { Modal } from 'ant-design-vue';
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
  if (response.data.code !== 0) {
    Modal.error({
      content: response.data?.message ?? 'server error!'
    });
  }
  return response;
},
(error) => {
  Modal.error(error.message);
});
