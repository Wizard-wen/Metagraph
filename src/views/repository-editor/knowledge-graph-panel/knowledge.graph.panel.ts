/**
 * @author songxiwen
 * @date  2021/12/1 11:26
 */

import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { reactive, ref, toRaw } from 'vue';
import { message } from 'ant-design-vue';
import { EntityCompletelyListItemType, KnowledgeModelType } from 'edu-graph-constant';
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

export const knowledgeEdgeFormRef = ref();
export const knowledgeEdgeFormState = reactive<{
  knowledgeEntityId?: string;
  targetKnowledgeEntity?: EntityCompletelyListItemType;
  targetKnowledgeEntityId?: string;
  originKnowledgeEntity?: EntityCompletelyListItemType;
  originKnowledgeEntityId?: string;
  temporaryEdgeId?: string;
  description: string;
}>({
  knowledgeEntityId: undefined,
  targetKnowledgeEntity: undefined,
  targetKnowledgeEntityId: undefined,
  originKnowledgeEntity: undefined,
  originKnowledgeEntityId: undefined,
  description: ''
});

export const knowledgeEdgeFormRules = {
  knowledgeEntityId: [
    { required: true, message: '请选择所属实体', trigger: 'change' }
  ],
  targetKnowledgeEntityId: [
    { required: true, message: '请选择目标实体', trigger: 'change' }
  ],
  originKnowledgeEntityId: [
    { required: true, message: '请选择源实体', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入关联描述', trigger: 'blur' }
  ],
};

export class KnowledgeGraphPanel {
  async validateEdge(): Promise<undefined | ValidateErrorEntity<KnowledgeEdgeFormState>> {
    return new Promise((resolve) => {
      knowledgeEdgeFormRef.value.validate().then(() => {
        console.log('values', knowledgeEdgeFormState, toRaw(knowledgeEdgeFormState));
        resolve(undefined);
      }).catch((error: ValidateErrorEntity<KnowledgeEdgeFormState>) => {
        console.log('error', error);
        resolve(error);
      });
    });
  }

  setKnowledgeEdgeFormState(params: KnowledgeEdgeFormState): void {
    knowledgeEdgeFormState.originKnowledgeEntityId = params.originKnowledgeEntityId;
    knowledgeEdgeFormState.originKnowledgeEntity = params.originKnowledgeEntity;
    knowledgeEdgeFormState.targetKnowledgeEntity = params.targetKnowledgeEntity;
    knowledgeEdgeFormState.targetKnowledgeEntityId = params.targetKnowledgeEntityId;
    knowledgeEdgeFormState.knowledgeEntityId = params.knowledgeEntityId;
    knowledgeEdgeFormState.temporaryEdgeId = params.temporaryEdgeId;
  }

  async createEdge(repositoryEntityId: string) {
    if (knowledgeEdgeFormState.originKnowledgeEntityId === undefined
      || knowledgeEdgeFormState.targetKnowledgeEntityId === undefined
      || knowledgeEdgeFormState.knowledgeEntityId === undefined
      || knowledgeEdgeFormState.targetKnowledgeEntity === undefined
      || knowledgeEdgeFormState.originKnowledgeEntity === undefined) {
      return;
    }
    let edgeOwner = knowledgeEdgeFormState.targetKnowledgeEntity;
    if (knowledgeEdgeFormState.knowledgeEntityId === knowledgeEdgeFormState.originKnowledgeEntityId) {
      edgeOwner = knowledgeEdgeFormState.originKnowledgeEntity;
    }
    const result = await EdgeApiService.create({
      originKnowledgeEntityId: knowledgeEdgeFormState.originKnowledgeEntityId,
      knowledgeEntityId: knowledgeEdgeFormState.knowledgeEntityId,
      targetKnowledgeEntityId: knowledgeEdgeFormState.targetKnowledgeEntityId,
      edgeRepositoryEntityId: repositoryEntityId,
      description: `From ${(knowledgeEdgeFormState.originKnowledgeEntity.content as KnowledgeModelType).name}
      ,to ${(knowledgeEdgeFormState.targetKnowledgeEntity.content as KnowledgeModelType).name}
      ,belongs to ${(edgeOwner.content as KnowledgeModelType).name}`
    });
    if (result.data) {
      message.success('关联创建成功');
    }
  }

  async removeEdge(params: {
    id: string,
    repositoryEntityId: string
  }) {
    const result = await EdgeApiService.remove({
      edgeId: params.id,
      edgeRepositoryEntityId: params.repositoryEntityId
    });
    if (result.data) {
      message.success('删除成功');
    }
  }
}
