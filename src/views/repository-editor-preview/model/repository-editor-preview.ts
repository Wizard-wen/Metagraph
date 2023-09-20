/**
 * @author songxiwen
 * @date  2021/11/21 22:02
 */

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import {
  AlternativeKnowledgeListType,
  EntityCompletelyListItemType,
  RepositoryModelType
} from '@metagraph/constant';
import { computed, createVNode, reactive, ref } from 'vue';
import {
  EntityNoAuthApiService,
  KnowledgeApiService,
  RepositoryApiService,
  RepositoryNoAuthApiService,
  SectionApiService
} from '@/api-service';
import { currentSectionNode } from '@/views/repository-editor/model/section.tree';


export const alternative = reactive<{
  target: AlternativeKnowledgeListType,
  activeKey: string
}>({
  target: [],
  activeKey: ''
});

export const repositoryModel = reactive<{
  target?: EntityCompletelyListItemType
}>({
  target: undefined
});

// 常规绑定的实体
export const repositoryBindEntityList = ref<EntityCompletelyListItemType[]>([]);
// 用户的未发布草稿知识点
export const unpublishedDraftKnowledgeList = ref<EntityCompletelyListItemType[]>();

export const isPublicRepository = computed(() => ((repositoryModel.target?.content as RepositoryModelType).type === 'public'));

export class RepositoryEditorPreview {
  /**
   * 获取知识库
   * @param repositoryEntityId
   */
  static async getRepositoryByEntityId(repositoryEntityId: string): Promise<void> {
    const response = await EntityNoAuthApiService.getEntityById({
      entityId: repositoryEntityId
    });
    if (response.data) {
      repositoryModel.target = response.data;
    }
  }

  /**
   * 知识库绑定的实体
   * @param repositoryEntityId
   */
  static async getRepositoryBindEntityList(repositoryEntityId: string): Promise<void> {
    const result = await RepositoryNoAuthApiService
      .getRepositoryBindEntityList(repositoryEntityId);
    if (result.data) {
      repositoryBindEntityList.value = result.data;
    }
  }

  static async getOwnDraftKnowledgeList(repositoryEntityId: string): Promise<void> {
    return new Promise((resolve) => {
      KnowledgeApiService
        .GetOwnDraftKnowledgeList({ repositoryEntityId })
        .then((result) => {
          if (result.data) {
            unpublishedDraftKnowledgeList.value = result.data;
          }
        }).catch(() => {
        message.error('获取失败！');
      }).finally(() => {
        resolve();
      });
    });
  }

  static async getAlternativeKnowledgeList(repositoryEntityId: string): Promise<void> {
    return new Promise((resolve) => {
      KnowledgeApiService.getAlternativeKnowledgeList({
        repositoryEntityId
      }).then((result) => {
        if (result.data) {
          alternative.target = result.data;
          if (result.data.length) {
            alternative.activeKey = result.data[0].article.id;
          }
        }
      }).finally(() => {
        resolve();
      });
    });
  }
}
