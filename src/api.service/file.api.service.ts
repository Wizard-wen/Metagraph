/**
 * @author songxiwen
 * @date  2021/9/12 23:28
 */

import { FileEnum, } from 'edu-graph-constant';
import type {
  QiniuUploadingCredentialRequestType,
  QiniuUploadingCredentialResponseType,
  FilePageListResponseType, FileResponseType,
} from 'edu-graph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

// eslint-disable-next-line import/prefer-default-export
export class FileApiService {
  static async getCredential(params: QiniuUploadingCredentialRequestType): Promise<PublicApiResponseType<QiniuUploadingCredentialResponseType>> {
    return RequestUtil.post<QiniuUploadingCredentialRequestType, QiniuUploadingCredentialResponseType>({
      apiPath: ApiPathEnum.GetQiniuFileCredential,
      requestBody: params
    });
  }

  static async getFileByKey(params: { key: string; }): Promise<PublicApiResponseType<FileResponseType>> {
    return RequestUtil.post<{ key: string; }, FileResponseType>({
      apiPath: ApiPathEnum.GetFileByKey,
      requestBody: params
    });
  }

  static async getFileList(params: { pageIndex: number; pageSie: number; fileType: FileEnum }): Promise<PublicApiResponseType<FilePageListResponseType>> {
    return RequestUtil.post<{ pageIndex: number; pageSie: number; fileType: FileEnum }, FilePageListResponseType>({
      apiPath: ApiPathEnum.GetFileList,
      requestBody: params
    });
  }

  static async removeFile(params: { key: string; }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{ key: string; }, void>({
      apiPath: ApiPathEnum.RemoveFile,
      requestBody: params
    });
  }
}
