/**
 *
 */

import axios from 'axios';

export enum ApiPathEnum {
  // knowledge
  CreateKnowledge = '/knowledge/create',
  RemoveKnowledge = '/knowledge/remove/id',
  SaveKnowledgeDescription = '/knowledge/save/description',
  GetKnowledgeById = '/knowledge/get',
  GetKnowledgeList = '/knowledge/getList',
  GetKnowledgeAllList = '/knowledge/getAllList',
  GetKnowledgePageList = '/knowledge/getPageList',
  FindEdgesByKnowledgeEntityId = '/knowledge/findEdgesByKnowledgeEntityId',
  // 仓库绑定的知识点
  GetRepositoryKnowledgeList = '/knowledge/getRepositoryKnowledgeList',
  // edge
  GetKnowledgeEdgeListByRepositoryId = '/knowledge/edge/getList/repositoryId',
  GetKnowledgeEdgeList = '/knowledge/edge/getList',
  // section
  GetSectionTree = '/section/tree',
  CreateSection = '/section/create',
  UpdateSection = '/section/update',
  GetSectionContent = '/section/get/content',
  SaveSectionArticle = '/section/save/article',
  BindSectionEntity = '/section/bind/entity',
  // file
  GetQiniuFileCredential = '/file/getCredential',
  RemoveFile = '/file/remove',
  GetFileList = '/file/getList',
  GetFileByKey = '/file/get/key',
  // comment
  CreateComment = '/comment/create',
  RemoveComment = '/comment/remove',
  GetCommentByEntityId = '/comment/getCommentByEntityId',
  GetOwnCommentList = '/comment/getOwnCommentList',
  // star
  CreateStar = '/star/create',
  CancelStar = '/star/cancel',
  GetMyStarList = '/star/getList/my',
  GetEntityStarList = '/star/getEntityStarList',
  // entity
  GetEntityList = '/entity/getList',
  GetEntityById = '/entity/get/id',
  // user
  LoginByName = '/account/loginByName',
  RegisterByName = '/account/registerByName',
  // repository
  CreateRepository = '/repository/create',
  GetRepositoryList = '/repository/getList',
  GetRepositoryById = '/repository/get/id',
  GetOwnRepositoryList = '/repository/getOwnList',
  GetRepositoryBindEntityList = '/repository/getBindEntityList',
  getRepositoryBindEntityListInGraph = '/repository/getRepositoryEntityListInGraph',
  GetRepositoryEntityList = '/repository/getEntityList',
  BindToRepository = '/repository/bind/entity',
  // tag
  GetTagList = '/tag/getList'
}

export interface PublicApiResponseType<T> {
  data?: T;
  message?: string;
}

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
