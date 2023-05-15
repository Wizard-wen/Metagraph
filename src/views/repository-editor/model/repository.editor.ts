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

export const isRepositoryEditorLoading = ref(false);


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

export class RepositoryEditor {
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

  static async cloneRepository(repositoryEntityId: string, name?: string): Promise<string | undefined> {
    return new Promise((resolve) => {
      RepositoryApiService.cloneRepository({
        repositoryEntityId,
        name
      }).then((data) => {
        if (data.data) {
          resolve(data.data.clonedRepositoryEntityId);
          message.success('克隆成功！');
        } else {
          message.error('克隆失败！');
        }
      }).catch(() => {
        resolve(undefined);
        message.error('克隆失败！');
      });
    });
  }

  static async getOwnDraftKnowledgeList(repositoryEntityId: string): Promise<void> {
    return new Promise(() => {
      KnowledgeApiService
        .GetOwnDraftKnowledgeList({ repositoryEntityId })
        .then((result) => {
          if (result.data) {
            unpublishedDraftKnowledgeList.value = result.data;
          }
        }).catch(() => {
        message.error('获取失败！');
      });
    });
  }

  static async handleMention(params: {
    repositoryEntityId: string;
    name: string,
    id: string,
    success: () => string,
    fail: () => string,
    content: Record<string, any>,
    contentHtml: string
  }): Promise<void> {
    Modal.confirm({
      title: '是否绑定知识点至当前单元?',
      okText: '确定',
      cancelText: '取消',
      icon: createVNode(ExclamationCircleOutlined),
      content: '',
      async onOk() {
        params.success();
        if (currentSectionNode.sectionId) {
          await SectionApiService.bindSectionEntity({
            entityId: params.id,
            entityType: 'Knowledge',
            repositoryEntityId: params.repositoryEntityId,
            sectionId: currentSectionNode.sectionId
          });
        }
      },
      async onCancel() {
        const json = params.fail();
      },
    });
  }

  static async removeAlternativeKnowledge(params: {
    id: string;
    repositoryEntityId: string;
  }): Promise<void> {
    return new Promise(() => {
      KnowledgeApiService.removeAlternativeKnowledge(params).then((result) => {
        if (result.code === 0) {
          message.success('删除成功！');
        }
      });
    });
  }

  static async removeKnowledgeArticle(params: {
    id: string;
  }): Promise<void> {
    return new Promise(() => {
      KnowledgeApiService.removeKnowledgeArticle(params).then((result) => {
        if (result.code === 0) {
          message.success('删除成功！');
        }
      });
    });
  }

  static async getAlternativeKnowledgeList(repositoryEntityId: string): Promise<void> {
    return new Promise(() => {
      KnowledgeApiService.getAlternativeKnowledgeList({
        repositoryEntityId
      }).then((result) => {
        if (result.data) {
          alternative.target = result.data;
          if (result.data.length) {
            alternative.activeKey = result.data[0].article.id;
          }
        }
      });
    });
  }
}
