/**
 * @author songxiwen
 * @date  2021/12/19 23:33
 */

import axios from 'axios';
import { CreateKnowledge } from 'metagraph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { PublicApiResponseType } from '@/utils/request.util';

export class RequestUtil {
  static post<T extends {
    [key: string]: {
      params?: any;
      data?: any;
    }
  }>(params: {
    requestBody: T[keyof T]['params'],
    apiPath: keyof T
  }): Promise<PublicApiResponseType<T[keyof T]['data']>> {
    return new Promise((resolve) => {
      axios.post<{
        data: T[keyof T]['data'];
        code: number;
        message: string;
      }>(params.apiPath as string, params.requestBody)
        .then((data) => {
          if (data.data.code === 0) {
            resolve({
              data: data.data.data
            });
          }
          resolve({ message: data.data.message });
        })
        .catch((error) => {
          resolve({
            message: error.message
          });
        });
    });
  }
}

RequestUtil.post<CreateKnowledge>({
  requestBody: {
    name: ''
  },
  apiPath: '/knowledge/create'
});
