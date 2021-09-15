/**
 * @author songxiwen
 * @date  2021/9/14 22:56
 */

import axios from 'axios';
import { ApiPathEnum } from '@/api.service/config/api.config';

export interface PublicApiResponseType<T> {
  data?: T;
  message?: string;
  code?: number;
}

// eslint-disable-next-line import/prefer-default-export
export class RequestUtil {
  static post<RequestType, ResponseType>(params: {
    requestBody: RequestType,
    apiPath: ApiPathEnum
  }): Promise<PublicApiResponseType<ResponseType>> {
    return new Promise((resolve) => {
      axios.post<{
        data: ResponseType;
        code: number;
        message: string;
      }>(params.apiPath, params.requestBody).then((data) => {
        if (data.data.code === 0) {
          resolve({
            data: data.data.data
          });
        }
        resolve({ message: data.data.message });
      }).catch((error) => {
        resolve({
          message: error.message
        });
      });
    });
  }

  static get<ResponseType>(params: {
    apiPath: ApiPathEnum
  }): Promise<PublicApiResponseType<ResponseType>> {
    return new Promise((resolve) => {
      axios.get<{
        data: ResponseType;
        code: number;
        message: string;
      }>(params.apiPath).then((data) => {
        if (data.data.code === 0) {
          resolve({
            data: data.data.data
          });
        }
        resolve({ message: data.data.message });
      }).catch((error) => {
        resolve({
          message: error.message
        });
      });
    });
  }
}
