/**
 * @author songxiwen
 * @date  2021/11/28 16:14
 */
import { message } from 'ant-design-vue';
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
  async createKnowledge(name: string, repositoryEntityId: string): Promise<void> {
    const result = await KnowledgeApiService.create({
      name,
      knowledgeBaseTypeId: '',
      repositoryEntityId
    });
    if (result.code === 0) {
      message.success('创建知识点成功！');
    }
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
      alternativeKnowledgeList.target = result.data;
      if (result.data.length) {
        activeKey.value = result.data[0].article.id;
      }
    }
  }
}
