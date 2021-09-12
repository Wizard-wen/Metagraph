/**
 * @author wizard.song
 * @date 2021/09/12 23:36
 */

import axios from 'axios';

// eslint-disable-next-line no-shadow
export enum ApiPathEnum {
  /**
   * knowledge
   */
  CreateKnowledge = '/knowledge/create',
  RemoveKnowledge = '/knowledge/remove/id',
  SaveKnowledgeDescription = '/knowledge/save/description',
  // 获取知识点
  GetNoAuthKnowledgeById = '/public/knowledge/get',
  // 带分页的知识点列表
  GetNoAuthKnowledgeList = '/public/knowledge/getList',
  // 获取某个知识点的前置、导出知识点
  GetNoAuthEdgesByKnowledgeEntityId = '/public/knowledge/findEdgesByKnowledgeEntityId',
  // 仓库绑定的知识点
  GetNoAuthKnowledgeListByRepositoryEntityId = '/public/knowledge/getList/repositoryEntityId',
  /**
   * edge
   */
  CreateKnowledgeEdge = 'knowledge/edge/create',
  GetNoAuthKnowledgeEdgeList = '/public/knowledge/edge/getList',
  GetNoAuthKnowledgeEdgeListByRepositoryEntityId = '/public/knowledge/edge/getList/repositoryEntityId',
  /**
   * section
   */
  GetNoAuthSectionTree = '/public/section/tree',
  CreateSection = '/section/create',
  UpdateSection = '/section/update',
  GetNoAuthSectionContent = '/public/section/get/content',
  SaveSectionArticle = '/section/save/article',
  BindSectionEntity = '/section/bind/entity',
  /**
   * file
   */
  GetQiniuFileCredential = '/file/getCredential',
  RemoveFile = '/file/remove',
  GetFileList = '/file/getList',
  GetFileByKey = '/file/get/key',
  /**
   * comment
   */
  CreateComment = '/comment/create',
  RemoveComment = '/comment/remove',
  GetOwnCommentList = '/comment/getOwnCommentList',
  GetNoAuthCommentByEntityId = '/public/comment/getCommentByEntityId',
  /**
   * star
   */
  CreateStar = '/star/create',
  CancelStar = '/star/cancel',
  GetMyStarList = '/star/getList/my',
  GetEntityStarList = '/star/getEntityStarList',
  /**
   * entity
   */
  GetEntityList = '/entity/getList',
  GetEntityById = '/entity/get/id',
  /**
   * user
   */
  LoginByName = '/account/loginByName',
  RegisterByName = '/account/registerByName',
  /**
   * repository
   */
  CreateRepository = '/repository/create',
  // GetRepositoryList = '/repository/getList',
  // GetRepositoryById = '/repository/get/id',
  GetOwnRepositoryList = '/repository/getOwnList',
  getRepositoryBindEntityListInGraph = '/repository/getRepositoryEntityListInGraph',
  GetRepositoryEntityList = '/repository/getEntityList',
  BindToRepository = '/repository/bind/entity',
  // no.auth repository
  GetNoAuthRepositoryBindEntityList = '/public/repository/getBindEntityList',
  GetNoAuthRepositoryEntityList = '/public/repository/getList',
  GetNoAuthRepositoryById = '/public/repository/get/id',
  /**
   * tag
   */
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
