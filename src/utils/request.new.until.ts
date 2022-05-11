/**
 * @author songxiwen
 * @date  2021/12/19 23:33
 */

import axios, { AxiosResponse } from 'axios';
import { PublicApiResponseType } from '@/utils/request.util';

export class RequestNewUntil {
  static post<T extends {
    [key: string]: {
      type: 'post'
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
        .then((data: AxiosResponse<{
          data: T[keyof T]['data'];
          code: number;
          message: string;
        }>) => {
          if (data.data.code === 0) {
            resolve({
              data: data.data.data,
              code: data.data.code
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

  static get<T extends {
    [key: string]: {
      type: 'get'
      data?: any;
    }
  }>(params: {
    apiPath: keyof T
  }): Promise<PublicApiResponseType<T[keyof T]['data']>> {
    return new Promise((resolve) => {
      axios.get<{
        data: T[keyof T]['data'];
        code: number;
        message: string;
      }>(params.apiPath as string)
        .then((data: AxiosResponse<{
          data: T[keyof T]['data'];
          code: number;
          message: string;
        }>) => {
          if (data.data.code === 0) {
            resolve({
              data: data.data.data,
              code: data.data.code
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
