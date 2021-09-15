/**
 * @author wizard
 * @date 2021/09/12 16:29
 */

import type {
  PublicEntityType,
  ExerciseResponseType,
  KnowledgeEdgeResponseType,
  KnowledgeResponseType,
  StarResponseType,
  UserResponseType,
  DomainResponseType
} from 'edu-graph-constant';
import { ApiPathEnum } from '@/api.service/config/api.config';
import { RequestUtil } from '@/utils';
import type { PublicApiResponseType } from '@/utils';

// eslint-disable-next-line import/prefer-default-export
export class StarApiService {
  static async create(params: {
    entityType: PublicEntityType;
    entityId: string;
  }): Promise<PublicApiResponseType<StarResponseType>> {
    return RequestUtil.post<{
      entityType: PublicEntityType;
      entityId: string;
    }, StarResponseType>({
      apiPath: ApiPathEnum.CreateStar,
      requestBody: params
    });
  }

  static async cancel(params: {
    entityType: PublicEntityType;
    entityId: string;
  }): Promise<PublicApiResponseType<void>> {
    return RequestUtil.post<{
      entityType: PublicEntityType;
      entityId: string;
    }, void>({
      apiPath: ApiPathEnum.CancelStar,
      requestBody: params
    });
  }

  static async getMyStarList(params: {
    entityType?: PublicEntityType;
    pageIndex: number;
    pageSize: number;
  }): Promise<PublicApiResponseType<{
    total: number;
    list: {
      star: number;
      comment: number;
      tag: string[];
      content: any;
      entityId: string;
    }[];
  } | undefined>> {
    return RequestUtil.post<{
      entityType?: PublicEntityType;
      pageIndex: number;
      pageSize: number;
    }, {
      total: number;
      list: {
        star: number;
        comment: number;
        tag: string[];
        content: any;
        entityId: string;
      }[];
    } | undefined>({
      apiPath: ApiPathEnum.GetMyStarList,
      requestBody: params
    });
  }

  static async getEntityStarList(params: {
    entityType: PublicEntityType;
    entityId: string;
    pageIndex: number;
    pageSize: number;
  }): Promise<PublicApiResponseType<{
    user: {
      total: number;
      list: UserResponseType[];
    },
    entity: {
      type: PublicEntityType;
      content: KnowledgeResponseType |
        DomainResponseType |
        ExerciseResponseType |
        KnowledgeEdgeResponseType
    }
  } | undefined>> {
    return RequestUtil.post<{
      entityType: PublicEntityType;
      entityId: string;
      pageIndex: number;
      pageSize: number;
    }, {
      user: {
        total: number;
        list: UserResponseType[];
      },
      entity: {
        type: PublicEntityType;
        content: KnowledgeResponseType |
          DomainResponseType |
          ExerciseResponseType |
          KnowledgeEdgeResponseType
      }
    } | undefined>({
      apiPath: ApiPathEnum.GetEntityStarList,
      requestBody: params
    });
  }
}
