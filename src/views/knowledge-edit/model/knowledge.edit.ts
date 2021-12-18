/**
 * @author songxiwen
 * @date  2021/12/4 14:50
 */

import { reactive, ref } from 'vue';
import { EntityCompletelyListItemType, KnowledgeModelType, TagModelType } from 'edu-graph-constant';
import {
  DomainNoAuthApiService,
  EdgeApiService,
  EntityNoAuthApiService,
  KnowledgeApiService, KnowledgeNoAuthApiService,
  RepositoryNoAuthApiService, TagApiService
} from '@/api.service';
import { tiptapInitData } from '@/store/constant';

export const knowledge = reactive<{
  target?: EntityCompletelyListItemType
}>({ target: undefined });
export const knowledgeDescription = ref();
export const repositoryEntityList = reactive<{
  target: EntityCompletelyListItemType[]
}>({
  target: []
});
export const edges = reactive<{
  target?: {
    entity: EntityCompletelyListItemType,
    preInnerList: EntityCompletelyListItemType[],
    preOuterList: EntityCompletelyListItemType[],
    extendInnerList: EntityCompletelyListItemType[],
    extendOuterList: EntityCompletelyListItemType[]
  }
}>({
  target: undefined
});

export const tag = reactive<{
  currentPage: number,
  total: number,
  pageSize: number,
  list: { label: string; value: string }[]
}>({
  currentPage: 0,
  total: 0,
  pageSize: 20,
  list: []
});

const domainList = ref([]);

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

  async getRepositoryBindList(repositoryEntityId: string): Promise<void> {
    const result = await RepositoryNoAuthApiService
      .getRepositoryBindEntityList(repositoryEntityId);
    if (result.data) {
      repositoryEntityList.target = result.data;
    }
  }

  async findEdgesByKnowledgeEntityId(params: {
    knowledgeEntityId: string;
    repositoryEntityId: string;
  }): Promise<void> {
    const result = await KnowledgeNoAuthApiService.findEdgesByKnowledgeEntityId(params);
    if (result.data) {
      edges.target = result.data;
    }
  }

  async getTagList(): Promise<void> {
    const result = await TagApiService.getList({
      pageIndex: tag.currentPage - 1,
      pageSize: 10
    });
    if (result.data) {
      tag.total = Math.ceil(Number((result.data?.total / tag.pageSize).toFixed(1)));
      tag.list = tag.list.concat(result.data?.list.map((item: TagModelType) => ({
        value: item.id,
        label: item.name
      })));
    }
  }

  async getDomainList(): Promise<void> {
    const result = await DomainNoAuthApiService.getList({
      pageIndex: 0,
      pageSize: 10
    });
    if (!result.data) {
      domainList.value = result.data.list;
    }
  }
}
