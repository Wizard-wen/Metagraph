/**
 * @author songxiwen
 * @date  2021/11/26 11:54
 */

import { message } from 'ant-design-vue';
import { computed, reactive, ref } from 'vue';
import type {
  EntityCompletelyListItemType
} from 'metagraph-constant';
import {
  EntityApiService,
  KnowledgeApiService,
  RepositoryApiService,
  RepositoryNoAuthApiService
} from '@/api.service';
import { repositoryBindEntityList } from '../../repository-editor';

export const searchText = ref<string | undefined>(undefined);
export const searchData = reactive<{
  target: (EntityCompletelyListItemType & { hasBind: boolean })[]
}>({ target: [] });
export const bindEntityIdList = reactive<{ target: string[] }>({
  target: []
});
export const total = ref(0);
export const totalPage = computed(() => Math.ceil((total.value / 10)));
export const currentPage = ref(1);
export const isLoading = ref(true);

export class CreateOrBindKnowledgeModal {
  async createNewDraftKnowledge(repositoryEntityId: string): Promise<EntityCompletelyListItemType | undefined> {
    if (searchText.value === undefined) {
      return undefined;
    }
    const result = await KnowledgeApiService.createDraftKnowledge({
      knowledgeBaseTypeId: '606fe62050a08412400387e5',
      repositoryEntityId,
      name: searchText.value
    });
    if (!result.data) {
      message.error('创建新的知识点时出错！');
      return undefined;
    }
    return result.data;
  }

  async handleBindKnowledgeToRepository(params: {
    repositoryEntityId: string,
    entityId: string
  }): Promise<void> {
    await RepositoryApiService.BindEntityToRepository({
      repositoryEntityId: params.repositoryEntityId,
      entityType: 'Knowledge',
      entityId: params.entityId
    });
  }

  async getEntityList(): Promise<void> {
    isLoading.value = true;
    const result = await EntityApiService.getEntityList({
      name: searchText.value,
      entityType: 'Knowledge',
      pageIndex: currentPage.value - 1,
      pageSize: 10
    });
    isLoading.value = false;
    if (result.data) {
      const list = result.data.list.map((item: EntityCompletelyListItemType) => ({
        ...item,
        hasBind: !!repositoryBindEntityList.target
          .find((binItem) => binItem.entity.id === item.entity.id)
      }));
      searchData.target = searchData.target.concat(list);
      total.value = result.data.total;
    }
  }

  async getRepositoryBindEntityList(repositoryEntityId: string): Promise<void> {
    const result = await RepositoryNoAuthApiService.getRepositoryBindEntityList(repositoryEntityId);
    if (result.data) {
      bindEntityIdList.target = result.data
        .map((item: EntityCompletelyListItemType) => item.entity.id);
    }
  }
}
