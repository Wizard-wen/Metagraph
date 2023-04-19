/**
 * @author songxiwen
 * @date  2021/9/12 23:28
 */

import { FileAuthApi, FileEnum, FileResponseType } from 'metagraph-constant';
import type {
  FilePageListResponseType,
  QiniuUploadingCredentialRequestType,
  QiniuUploadingCredentialResponseType,
} from 'metagraph-constant';
import type { PublicApiResponseType } from '@/utils';
import { RequestNewUntil } from '@/utils/request.new.until';
import axios from 'axios';

export class FileApiService {
  static async getCredential(params: QiniuUploadingCredentialRequestType): Promise<PublicApiResponseType<QiniuUploadingCredentialResponseType>> {
    return RequestNewUntil.post<FileAuthApi.GetQiniuFileCredential>({
      apiPath: '/file/get/credential',
      requestBody: { ...params, provider: 'System' }
    });
  }

  static async getFileById(params: { id: string; }): Promise<PublicApiResponseType<FileResponseType>> {
    return RequestNewUntil.post<FileAuthApi.GetFileById>({
      apiPath: '/file/get/id',
      requestBody: params
    });
  }

  static async getFileList(params: {
    pageIndex: number;
    pageSize: number;
    type?: FileEnum;
    searchInput?: string;
  }): Promise<PublicApiResponseType<FilePageListResponseType>> {
    return RequestNewUntil.post<FileAuthApi.GetFileList>({
      apiPath: '/file/get/list',
      requestBody: params
    });
  }

  static async removeFile(params: { id: string; }): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<FileAuthApi.RemoveFileById>({
      apiPath: '/file/remove/id',
      requestBody: params
    });
  }

  static async updateFile(params: {
    id: string;
    name?: string;
  }): Promise<PublicApiResponseType<void>> {
    return RequestNewUntil.post<FileAuthApi.UpdateFileById>({
      apiPath: '/file/update/id',
      requestBody: params
    });
  }

}
