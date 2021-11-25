/**
 * @author songxiwen
 * @date  2021/11/24 14:24
 */
import {
  ref, reactive, inject
} from 'vue';
import type { AlternativeKnowledgeListType } from 'edu-graph-constant';
import { repositoryEntityIdKey } from '@/views/editable.repository/provide.type';
import { KnowledgeApiService } from '@/api.service';

export const activeKey = ref('');
export const alternativeKnowledgeList = reactive<{
  target: AlternativeKnowledgeListType
}>({
  target: []
});

export class ToolbarService {
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
