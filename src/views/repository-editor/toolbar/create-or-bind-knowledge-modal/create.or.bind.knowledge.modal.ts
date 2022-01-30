/**
 * @author songxiwen
 * @date  2021/11/26 11:54
 */

import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import type {
  EntityCompletelyListItemType,
  KnowledgeModelType
} from 'metagraph-constant';
import {
  EntityApiService,
  EntityNoAuthApiService,
  KnowledgeApiService,
  RepositoryApiService,
  RepositoryNoAuthApiService
} from '@/api.service';
import { repositoryBindEntityList } from '../../repository-editor';

export const searchText = ref<string | undefined>(undefined);
export const searchData = reactive<{
  target:(EntityCompletelyListItemType & { hasBind: boolean })[]
    }>({ target: [] });
export const bindEntityIdList = reactive<{ target: string[] }>({
  target: []
});
export const total = ref(0);
export const totalPage = computed(() => Math.ceil((total.value / 10)));
export const currentPage = ref(1);
export const isLoading = ref(true);

export class CreateOrBindKnowledgeModal {
  router = useRouter();

  async createNewEntity(repositoryEntityId: string): Promise<void> {
    if (searchText.value === undefined) {
      return;
    }
    const result = await KnowledgeApiService.create({
      knowledgeBaseTypeId: '606fe62050a08412400387e5',
      repositoryEntityId,
      name: searchText.value
    });
    if (!result.data) {
      throw new Error('');
    }
    await this.router.push({
      name: 'KnowledgeEdit',
      query: {
        knowledgeEntityId: result.data.entity.id,
        repositoryEntityId,
        name: (<KnowledgeModelType>result.data.content).name
      }
    });
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
        hasBind: !!repositoryBindEntityList.target.find((binItem) => binItem.entity.id === item.entity.id)
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
