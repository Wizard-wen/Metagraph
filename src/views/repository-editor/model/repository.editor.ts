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
import {
  reactive, createVNode, computed, ref
} from 'vue';
import { store } from '@/store';
import {
  EntityNoAuthApiService, KnowledgeApiService, RepositoryApiService,
  RepositoryNoAuthApiService,
  SectionApiService
} from '@/api-service';

export const isRepositoryEditorLoading = ref(false);

export interface RepositoryEditorInterface {
  getRepositoryByEntityId(repositoryEntityId: string): Promise<void>
}

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

export const sectionEntityId = computed(() => {
  if (store.state.repositoryEditor.selectedTreeNodeSectionKeys) {
    return store.state.repositoryEditor.selectedTreeNodeSectionKeys[0];
  }
  return undefined;
});
// 常规绑定的实体
export const repositoryBindEntityList = ref<EntityCompletelyListItemType[]>([]);
// 用户的未发布草稿知识点
export const unpublishedDraftKnowledgeList = ref<EntityCompletelyListItemType[]>();

export const isPublicRepository = computed(() => ((repositoryModel.target?.content as RepositoryModelType).type === 'public'));

export class RepositoryEditor implements RepositoryEditorInterface {
  async getRepositoryByEntityId(repositoryEntityId: string): Promise<void> {
    const response = await EntityNoAuthApiService.getEntityById({
      entityId: repositoryEntityId
    });
    if (response.data) {
      repositoryModel.target = response.data;
    }
  }

  async getRepositoryBindEntityList(repositoryEntityId: string): Promise<void> {
    const result = await RepositoryNoAuthApiService
      .getRepositoryBindEntityList(repositoryEntityId);
    if (result.data) {
      repositoryBindEntityList.value = result.data;
    }
  }

  async cloneRepository(repositoryEntityId: string, name?: string): Promise<string | undefined> {
    const response = await RepositoryApiService.cloneRepository({
      repositoryEntityId,
      name
    });
    if (response.data) {
      message.success('克隆成功！');
      return response.data.clonedRepositoryEntityId;
    }
    message.error('克隆失败！');
    return undefined;
  }

  async getOwnDraftKnowledgeList(repositoryEntityId: string): Promise<void> {
    const result = await KnowledgeApiService.GetOwnDraftKnowledgeList({ repositoryEntityId });
    if (result.data) {
      unpublishedDraftKnowledgeList.value = result.data;
    }
  }

  async handleMention(params: {
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
        if (sectionEntityId.value) {
          await SectionApiService.bindSectionEntity({
            entityId: params.id,
            entityType: 'Knowledge',
            repositoryEntityId: params.repositoryEntityId,
            sectionId: sectionEntityId.value
          });
          // await store.dispatch(ActionEnum.SAVE_SECTION_CONTENT, {
          //   content: params.content,
          //   contentHtml: params.contentHtml
          // });
        }
      },
      async onCancel() {
        const json = params.fail();
        // await store.dispatch(ActionEnum.SAVE_SECTION_CONTENT, {
        //   content: json,
        //   contentHtml: params.contentHtml
        // });
      },
    });
  }

  async removeAlternativeKnowledge(params: {
    id: string;
    repositoryEntityId: string;
  }): Promise<void> {
    const result = await KnowledgeApiService.removeAlternativeKnowledge(params);
    if (result.code === 0) {
      message.success('删除成功！');
    }
  }

  async getAlternativeKnowledgeList(repositoryEntityId: string): Promise<void> {
    const result = await KnowledgeApiService.getAlternativeKnowledgeList({
      repositoryEntityId
    });
    if (result.data) {
      alternative.target = result.data;
      if (result.data.length) {
        alternative.activeKey = result.data[0].article.id;
      }
    }
  }
}
