/**
 * @author songxiwen
 * @date  2021/11/28 00:25
 */

import axios, { AxiosResponse } from 'axios';
import { FileEnum } from 'edu-graph-constant';
import * as qiniu from 'qiniu-js';
import { FileApiService } from '@/api.service';

export class QiniuUploadService {
  async customRequestUploadHandler(params: {
    file?: File,
    base64?: string,
    name: string;
    type: FileEnum
  }): Promise<{ key: string; url: string; } | undefined> {
    const result: {
      data?: {
        key: string;
        uploadToken: string;
      };
      message?: string;
    } = await FileApiService.getCredential({
      name: params.name,
      type: params.type
    });
    if (result.data === undefined) {
      return undefined;
    }
    const tokenForUploading = result.data;
    return new Promise((resolve) => {
      if (params.file) {
        qiniu
          .upload(
            params.file,
            tokenForUploading.key,
            tokenForUploading.uploadToken
          )
          .subscribe({
            complete(response: { key: string; url: string; }) {
              console.log(response);
              resolve(response);
            }
          });
      }
      if (params.base64) {
        const formattedPicBase64 = this.formatPicBase64(params.base64);
        const EncodedKey = window.btoa(tokenForUploading.key).replace(/\+/g, '-').replace(/\//g, '_');
        axios.post<string, AxiosResponse<{ key: string; url: string; }>>(
          'http://upload-z2.qiniup.com/putb64/-1',
          formattedPicBase64,
          {
            headers: {
              EncodedKey,
              'Content-Type': 'application/octet-stream',
              Authorization: `UpToken ${tokenForUploading.uploadToken}`
            }
          }
        ).then((data: AxiosResponse<{ key: string; url: string; }>) => {
          console.log(data);
          resolve(data.data);
        });
      }
    });
  }

  formatPicBase64(pictureInBase64: string): string {
    // 去掉逗号之前的所有字符包括逗号
    const arr = pictureInBase64.split(',');
    return pictureInBase64.substring(arr[0].length + 1);
  }

  /**
   * 根据base64生成文件大小
   * @param base64String
   */
  generateFileSize(base64String: string): number {
    if (base64String.indexOf('=') > 0) {
      const indexOf = base64String.indexOf('=');
      base64String = base64String.substring(0, indexOf);
    }
    return parseInt(String(base64String.length - (base64String.length / 8) * 2), 10);
  }
}
