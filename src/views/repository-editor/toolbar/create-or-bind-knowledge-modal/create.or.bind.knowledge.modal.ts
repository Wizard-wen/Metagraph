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
  EntityNoAuthApiService,
  KnowledgeApiService,
  RepositoryApiService,
  RepositoryNoAuthApiService
} from '@/api.service';

export const searchText = ref<string | undefined>(undefined);
export const searchData = reactive<{
  target: EntityCompletelyListItemType[]
}>({ target: [] });
export const bindEntityIdList = reactive<{ target: string[] }>({
  target: []
});
export const total = ref(0);
export const totalPage = computed(() => Math.ceil((total.value / 10)));
export const currentPage = ref(1);

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
        name: (<KnowledgeModelType> result.data.content).name
      }
    });
  }

  async handleBindKnowledgeToRepository(params: {
    repositoryEntityId: string,
    entityId: string
  }) {
    await RepositoryApiService.BindEntityToRepository({
      repositoryEntityId: params.repositoryEntityId,
      entityType: 'Knowledge',
      entityId: params.entityId
    });
  }

  async getEntityList() {
    const result = await EntityNoAuthApiService.getEntityList({
      name: searchText.value,
      entityType: 'Knowledge',
      pageIndex: currentPage.value - 1,
      pageSize: 10
    });
    if (result.data) {
      searchData.target = searchData.target.concat(result.data.list);
      total.value = result.data.total;
    }
  }

  async getRepositoryBindEntityList(repositoryEntityId: string) {
    const result = await RepositoryNoAuthApiService.getRepositoryBindEntityList(repositoryEntityId);
    if (result.data) {
      bindEntityIdList.target = result.data
        .map((item: EntityCompletelyListItemType) => item.entity.id);
    }
  }
}
