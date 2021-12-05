/**
 * @author songxiwen
 * @date  2021/12/4 14:50
 */

import { reactive, ref } from 'vue';
import { EntityCompletelyListItemType, KnowledgeModelType } from 'edu-graph-constant';
import { EdgeApiService, EntityNoAuthApiService, KnowledgeApiService } from '@/api.service';
import { tiptapInitData } from '@/store/constant';

export const knowledge = reactive<{
  target?: EntityCompletelyListItemType
}>({ target: undefined });
export const knowledgeDescription = ref(tiptapInitData);

export class KnowledgeEdit {
  async getKnowledge(knowledgeEntityId: string): Promise<void> {
    const result = await EntityNoAuthApiService.getEntityById({
      entityId: knowledgeEntityId
    });
    if (result.data) {
      knowledge.target = result.data;
      const description = (<KnowledgeModelType> result.data.content)?.description;
      if (!description) {
        knowledgeDescription.value = tiptapInitData;
      } else {
        knowledgeDescription.value = JSON.parse(description);
      }
    }
  }

  async handleSaveSectionArticle(params: {
    content: Record<string, any>,
    contentHtml: any,
    knowledgeEntityId: string
  }): Promise<void> {
    const result = await KnowledgeApiService.saveDescription({
      description: JSON.stringify(params.content),
      descriptionHTML: params.contentHtml,
      entityId: params.knowledgeEntityId
    });
    if (!result.message) {
      console.log('success');
    }
  }

  async createEdge(params: {
    id: string,
    knowledgeEntityId: string;
    repositoryEntityId: string;
    name: string
  }): Promise<void> {
    const result = await EdgeApiService.create({
      originKnowledgeEntityId: params.id,
      knowledgeEntityId: params.knowledgeEntityId,
      targetKnowledgeEntityId: params.knowledgeEntityId,
      edgeRepositoryEntityId: params.repositoryEntityId,
      description: `From ${params.name}`
    });
    if (!result.message) {
      console.log('success');
    }
  }
}
