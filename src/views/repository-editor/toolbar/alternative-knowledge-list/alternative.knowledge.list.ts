/**
 * @author songxiwen
 * @date  2021/11/28 16:14
 */
import { reactive, ref } from 'vue';
import type { AlternativeKnowledgeListType } from 'metagraph-constant';
import { KnowledgeApiService } from '@/api.service';

export const activeKey = ref('');
export const alternativeKnowledgeList = reactive<{
  target: AlternativeKnowledgeListType
}>({
  target: []
});

export class AlternativeKnowledgeListService {
  async createKnowledge(name: string, repositoryEntityId: string) {
    await KnowledgeApiService.create({
      name,
      knowledgeBaseTypeId: '',
      repositoryEntityId
    });
  }

  async removeAlternativeKnowledge(params: {
    id: string;
    repositoryEntityId: string;
  }) {
    const result = await KnowledgeApiService.removeAlternativeKnowledge(params);
    if (result.data) {
      // todo
    }
  }

  async getAlternativeKnowledgeList(repositoryEntityId: string) {
    const result = await KnowledgeApiService.getAlternativeKnowledgeList({
      repositoryEntityId
    });
    if (result.data) {
      alternativeKnowledgeList.target = result.data;
      activeKey.value = result.data[0].article.id;
    }
  }
}
