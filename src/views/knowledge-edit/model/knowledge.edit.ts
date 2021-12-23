/**
 * @author songxiwen
 * @date  2021/12/4 14:50
 */

import {
  computed, InjectionKey, reactive, Ref, ref
} from 'vue';
import { EntityCompletelyListItemType, KnowledgeModelType, TagModelType } from 'metagraph-constant';
import { Form } from 'ant-design-vue';
import {
  DomainNoAuthApiService,
  EdgeApiService,
  EntityNoAuthApiService,
  KnowledgeApiService, KnowledgeNoAuthApiService, RepositoryApiService,
  RepositoryNoAuthApiService, TagApiService
} from '@/api.service';
import { tiptapInitData } from '@/store/constant';

export const knowledgeEntityIdInjectKey: InjectionKey<Ref<string>> = Symbol('knowledgeEntityId');
export const repositoryEntityIdInjectKey: InjectionKey<Ref<string>> = Symbol('repositoryEntityId');
export const knowledge = reactive<{
  target?: EntityCompletelyListItemType
}>({ target: undefined });
// 知识点名称
export const knowledgeName = computed(
  () => (knowledge.target?.content as KnowledgeModelType).name || '知识点名称'
);
// 知识点认证状态
export const knowledgeAuthStatus = computed(
  () => ((knowledge.target?.content as KnowledgeModelType).isCertificated ? '已认证' : '未认证')
);
// 知识点点赞数量
export const knowledgeStarCount = computed(() => knowledge.target?.star || 0);
// 知识点评论数量
export const knowledgeCommentCount = computed(() => knowledge.target?.comment || 0);
// 知识点文本
export const knowledgeDescription = ref();
// 仓库已绑定知识点
export const repositoryEntityList = reactive<{
  target: EntityCompletelyListItemType[]
}>({
  target: []
});
// 知识点自定义字段
// export const customFields = computed(
//   () => (knowledge.target?.content as KnowledgeModelType).customField || []
// );
export interface CustomFieldType {
  value: string;
  label: string;
  key: string;
}

export const customFields = reactive<{
  target: CustomFieldType[]
}>({
  target: []
});
export const customFieldsModelRef = reactive<{
  [key: string]: any
}>({});
export const customFieldsRulesRef = reactive<{
  [key: string]: {
    required: boolean;
    message: string;
    trigger: string;
  }[]
}>({});
export const customFieldsValidateInfo = ref();
export const customFieldsValidate = ref();
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

interface KnowledgeFormType {
  name: string;
  knowledgeBaseTypeId: string;
  domainId?: string;
  repositoryEntityId: string;
  author: string;
  tagList: { label: string, value: string }[];
}

export const knowledgeForm = reactive<KnowledgeFormType>({
  repositoryEntityId: '',
  name: '',
  knowledgeBaseTypeId: '',
  domainId: '',
  author: '',
  tagList: []
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

export const domainList = ref([]);

export const ownRepositoryList = ref<EntityCompletelyListItemType[]>([]);

export class KnowledgeEdit {
  async getKnowledge(knowledgeEntityId: string): Promise<void> {
    const result = await EntityNoAuthApiService.getEntityById({
      entityId: knowledgeEntityId
    });
    if (result.data) {
      knowledge.target = result.data;
      const knowledgeContent = result.data.content as KnowledgeModelType;
      const knowledgeAuthor = result.data.author;
      knowledgeForm.name = knowledgeContent.name;
      knowledgeForm.knowledgeBaseTypeId = knowledgeContent.knowledgeBaseTypeId;
      knowledgeForm.author = knowledgeAuthor.name;
      knowledgeForm.domainId = knowledgeContent?.domainId || '';
      knowledgeForm.tagList = result.data.tag.map((item: TagModelType) => ({
        label: item.name,
        value: item.id
      }));
      customFields.target = knowledgeContent.customField || [];
      const customFieldsKeys = customFields.target.map((item) => item.key);
      customFields.target.forEach((item) => {
        customFieldsModelRef[item.key] = item.value;
        customFieldsRulesRef[item.key] = [{
          required: true,
          message: `请输入${item.label}`,
          trigger: 'blur'
        }];
      });
      const {
        resetFields,
        validate,
        validateInfos
      } = Form.useForm(customFieldsModelRef, customFieldsRulesRef);
      customFieldsValidateInfo.value = validateInfos;
      customFieldsValidate.value = validate;
      const description = (<KnowledgeModelType>result.data.content)?.description;
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

  async getOwnRepositoryList(): Promise<void> {
    const result = await RepositoryApiService.getOwnRepositoryList();
    if (result.data) {
      ownRepositoryList.value = result.data;
    }
  }

  async getDomainList(): Promise<void> {
    const result = await DomainNoAuthApiService.getList({
      pageIndex: 0,
      pageSize: 10
    });
    if (result.data) {
      domainList.value = result.data.list;
    }
  }

  async updateKnowledge(knowledgeEntityId: string): Promise<void> {
    await KnowledgeApiService.update({
      knowledgeEntityId,
      domainId: knowledgeForm.domainId,
      knowledgeBaseTypeId: knowledgeForm.knowledgeBaseTypeId,
      name: knowledgeForm.name,
    });
  }
}
