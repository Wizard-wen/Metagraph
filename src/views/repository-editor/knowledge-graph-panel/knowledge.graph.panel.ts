/**
 * @author songxiwen
 * @date  2021/12/1 11:26
 */

import { reactive } from 'vue';
import { message } from 'ant-design-vue';
import type {
  EntityCompletelyListItemType,
  KnowledgeEdgeResponseType,
  KnowledgeModelType
} from 'metagraph-constant';
import { EdgeApiService } from '@/api.service';

export interface KnowledgeEdgeFormState {
  knowledgeEntityId?: string;
  targetKnowledgeEntityId?: string;
  targetKnowledgeEntity?: EntityCompletelyListItemType;
  originKnowledgeEntityId?: string;
  originKnowledgeEntity?: EntityCompletelyListItemType;
  // antv生成的临时 edge id
  temporaryEdgeId?: string;
  description?: string;
}

export const knowledgeEdgeFormState = reactive<KnowledgeEdgeFormState>({
  knowledgeEntityId: undefined,
  targetKnowledgeEntity: undefined,
  targetKnowledgeEntityId: undefined,
  originKnowledgeEntity: undefined,
  originKnowledgeEntityId: undefined,
  description: ''
});

export class KnowledgeGraphPanel {
  setKnowledgeEdgeFormState(params: KnowledgeEdgeFormState): void {
    knowledgeEdgeFormState.originKnowledgeEntityId = params.originKnowledgeEntityId;
    knowledgeEdgeFormState.originKnowledgeEntity = params.originKnowledgeEntity;
    knowledgeEdgeFormState.targetKnowledgeEntity = params.targetKnowledgeEntity;
    knowledgeEdgeFormState.targetKnowledgeEntityId = params.targetKnowledgeEntityId;
    knowledgeEdgeFormState.knowledgeEntityId = params.knowledgeEntityId;
    knowledgeEdgeFormState.temporaryEdgeId = params.temporaryEdgeId;
    knowledgeEdgeFormState.description = '';
  }

  async createEdgeInServer(repositoryEntityId: string): Promise<KnowledgeEdgeResponseType | undefined> {
    if (knowledgeEdgeFormState.originKnowledgeEntityId === undefined
      || knowledgeEdgeFormState.targetKnowledgeEntityId === undefined
      || knowledgeEdgeFormState.knowledgeEntityId === undefined
      || knowledgeEdgeFormState.targetKnowledgeEntity === undefined
      || knowledgeEdgeFormState.originKnowledgeEntity === undefined) {
      return undefined;
    }
    const result = await EdgeApiService.create({
      originKnowledgeEntityId: knowledgeEdgeFormState.originKnowledgeEntityId,
      knowledgeEntityId: knowledgeEdgeFormState.knowledgeEntityId,
      targetKnowledgeEntityId: knowledgeEdgeFormState.targetKnowledgeEntityId,
      edgeRepositoryEntityId: repositoryEntityId,
      description: `From ${(knowledgeEdgeFormState.originKnowledgeEntity.content as KnowledgeModelType).name}`
    });
    if (result.data) {
      return result.data;
    }
    return undefined;
  }

  async removeEdgeInServer(params: {
    id: string,
    repositoryEntityId: string
  }): Promise<void> {
    const result = await EdgeApiService.remove({
      edgeId: params.id,
      edgeRepositoryEntityId: params.repositoryEntityId
    });
    if (result.data) {
      message.success('删除成功');
    }
  }
}
