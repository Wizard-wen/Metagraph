/**
 * @author songxiwen
 * @date  2021/12/4 14:50
 */

import { IndexdbService } from '@/service/indexdb.service';
import {
  KnowledgeBaseFormType,
  KnowledgePicturesFrontendType
} from '@/views/knowledge-editor/model/knowledge.edit.type';
import { JSONContent } from '@tiptap/vue-3';
import { ValidateInfo } from 'ant-design-vue/es/form/useForm';
import { differenceWith, isEqual } from 'lodash';
import dayjs from 'dayjs';
import { computed, InjectionKey, reactive, Ref, ref } from 'vue';
import type {
  EntityCompletelyListItemType,
  KnowledgeCustomFieldType,
  KnowledgeEdgeInEdgeGroupType,
  KnowledgeModelType,
  MentionKnowledgeType,
  TagModelType
} from '@metagraph/constant';
import { Form, message } from 'ant-design-vue';
import { v1 as uuidV1 } from 'uuid';
import {
  DomainNoAuthApiService,
  KnowledgeApiService,
  KnowledgeNoAuthApiService,
  RepositoryApiService,
  RepositoryNoAuthApiService,
  TagApiService
} from '@/api-service';
import { tiptapInitData } from '@/components/tiptap-text-editor/tiptap.init.data';
import { BackupKnowledgeJSONType, HistoryVersionKnowledgeModelType } from '@metagraph/constant';

export const draftKnowledgeEntityIdInjectKey: InjectionKey<Ref<string>> = Symbol('draftKnowledgeEntityId');
export const publishedKnowledgeEntityIdInjectKey: InjectionKey<Ref<string>> = Symbol('publishedKnowledgeEntityId');
export const repositoryEntityIdInjectKey: InjectionKey<Ref<string>> = Symbol('repositoryEntityId');

// 知识点entity
export const knowledge = ref<EntityCompletelyListItemType>();
// 知识点model数据
export const knowledgeContent = ref<KnowledgeModelType>();

// 知识点名称
export const knowledgeName = computed(
  () => knowledgeContent.value?.name || '知识点名称'
);
// 知识点认证状态
export const knowledgeAuthStatus = computed(
  () => (knowledgeContent.value?.isCertificated ? '已认证' : '未认证')
);
// 知识点发布状态
export const knowledgePublishStatus = ref<string>('未发布');
// 知识点概念图册封面图
export const knowledgeCover = ref<KnowledgePicturesFrontendType>();
// 知识点概念图册
export const knowledgePictures = ref<KnowledgePicturesFrontendType[]>([]);
// 知识点文本
export const knowledgeDescription = ref();
// 知识点点赞数量
export const knowledgeStarCount = computed(() => knowledge.value?.star || 0);
// 知识点评论数量
export const knowledgeCommentCount = computed(() => knowledge.value?.comment || 0);

// 知识库已绑定知识点
export const repositoryEntityList = ref<EntityCompletelyListItemType[]>();

export const knowledgeCustomFields = ref<KnowledgeCustomFieldType[]>([]);
export const customFieldsModelRef = ref<{
  [key: string]: any
}>({});
export const customFieldsRulesRef = ref<{
  [key: string]: {
    required: boolean;
    message: string;
    trigger: string;
    type: any;
  }[]
}>({});

export const customFieldsValidateInfo = ref<{
  [key: string]: ValidateInfo;
}>();

// 知识点被引用次数
export const mentionedKnowledge = reactive<{
  count: number;
  list: EntityCompletelyListItemType[]
}>({
  count: 0,
  list: []
});

//
export const knowledgeEdges = reactive<{
  target?: {
    entity: EntityCompletelyListItemType,
    preInnerList: KnowledgeEdgeInEdgeGroupType[],
    preOuterList: KnowledgeEdgeInEdgeGroupType[],
    extendInnerList: KnowledgeEdgeInEdgeGroupType[],
    extendOuterList: KnowledgeEdgeInEdgeGroupType[]
  }
}>({
  target: undefined
});

export const knowledgeBaseForm = reactive<KnowledgeBaseFormType>({
  repositoryEntityId: '',
  name: '',
  knowledgeBaseTypeId: '',
  domain: [],
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
export const historyVersionList = ref<{
  origin: HistoryVersionKnowledgeModelType,
  parsed: BackupKnowledgeJSONType
}[]>([]);
export const compareData = ref<{
  add: {
    customField: string[]
  },
  delete: {
    customField: string[]
  },
  edit: {
    name: boolean;
    domain: boolean;
    tag: boolean;
  },
  published: {
    model: KnowledgeModelType,
    entity: EntityCompletelyListItemType,
    mentionList: EntityCompletelyListItemType[]
  },
  draft: {
    model: KnowledgeModelType,
    entity: EntityCompletelyListItemType,
    mentionList: EntityCompletelyListItemType[]
  }
}>();

export const isCompareModalShow = ref(false);

export class KnowledgeEdit {
  async getKnowledge(
    knowledgeEntityId: string
  ): Promise<void> {
    const result = await KnowledgeApiService.getDraftKnowledge({
      knowledgeEntityId
    });
    if (result.data) {
      knowledge.value = result.data;
      knowledgeContent.value = result.data.content as KnowledgeModelType;
      await IndexdbService.getInstance().put('knowledge', {
        id: result.data.entity.id,
        name: knowledgeContent.value?.name,
        description: knowledgeContent.value?.description ?? '',
        entityId: result.data.entity.id,
        type: 'draft',
        knowledgeKey: knowledgeContent.value.knowledgeKey
      });
      const knowledgeAuthor = result.data.author;
      knowledgeBaseForm.name = knowledgeContent.value.name;
      knowledgeBaseForm.knowledgeBaseTypeId = knowledgeContent.value.knowledgeBaseTypeId;
      knowledgeBaseForm.author = knowledgeAuthor.name;
      knowledgeBaseForm.domain = knowledgeContent.value.domain || [];
      knowledgeBaseForm.tagList = result.data.tag.map((item: TagModelType) => ({
        label: item.name,
        value: item.id
      }));
      this.setKnowledgePictures(knowledgeContent.value.pictures);
      this.setKnowledgeCustomField(knowledgeContent.value.customField);
      this.setKnowledgeDescription(knowledgeContent.value?.description);
    }
  }

  private setKnowledgePictures(pictures: {
    fileId: string;
    isCover?: boolean;
    url: string;
    name?: string;
    size?: number;
  }[]) {
    knowledgePictures.value = pictures.length
      ? pictures.map((item) => ({
        ...item,
        uid: uuidV1()
      })) : [];
    knowledgeCover.value = knowledgePictures.value.find((item) => item.isCover);
  }

  private setKnowledgeDescription(description?: string) {
    if (!description) {
      knowledgeDescription.value = tiptapInitData;
    } else {
      knowledgeDescription.value = JSON.parse(description);
    }
  }

  private setKnowledgeCustomField(customField?: KnowledgeCustomFieldType[]) {
    customFieldsModelRef.value = {};
    customFieldsRulesRef.value = {};

    knowledgeCustomFields.value = customField ?? [];
    knowledgeCustomFields.value.forEach((item) => {
      customFieldsModelRef.value[item.key] = item.type === 'Date' ? dayjs(item.value, 'YYYY/MM/DD') : item.value;
      customFieldsRulesRef.value[item.key] = [{
        required: true,
        message: `请输入${item.label}`,
        trigger: item.type === 'Date' ? 'change' : 'blur',
        type: item.type === 'Date' ? 'object' : 'string'
      }];
    });
    const {
      validateInfos
    } = Form.useForm(customFieldsModelRef, customFieldsRulesRef);
    customFieldsValidateInfo.value = validateInfos;
  }

  async getHistoryVersionList(knowledgeEntityId: string): Promise<void> {
    const result = await KnowledgeApiService.GetHistoryVersionList({
      knowledgeEntityId
    });
    if (result.data) {
      historyVersionList.value = result.data;
    }
  }

  /**
   * 删除引用知识点
   */
  async removeMentionKnowledge(
    knowledgeEntityId: string,
    mentionedEntityId: string
  ): Promise<void> {
    console.log(knowledgeEntityId, mentionedEntityId);
    const knowledgeContent = knowledge.value?.content as KnowledgeModelType;
    if (!knowledgeContent.mentionKnowledgeList?.length) {
      return;
    }
    const index = knowledgeContent.mentionKnowledgeList
      .findIndex((item: MentionKnowledgeType) => item.entityId === mentionedEntityId);
    if (index !== undefined) {
      knowledgeContent.mentionKnowledgeList.splice(index, 1);
      const result = await KnowledgeApiService.updateDraftKnowledge({
        knowledgeEntityId,
        mentionKnowledgeList: knowledgeContent.mentionKnowledgeList
      });
      if (result.code === 0) {
        message.success('解绑成功！');
      }
      await this.getMentionedList(knowledgeEntityId);
    }
  }

  async compareWithLatestVersion(params: {
    publishedKnowledgeEntityId: string,
    draftKnowledgeEntityId: string,
    repositoryEntityId: string
  }): Promise<void> {
    const result = await KnowledgeApiService.compareWithLatestVersion(params);
    if (result.data) {
      console.log(result.data);
      const draftKnowledge = result.data.draft;
      const publishedKnowledge = result.data.published;
      const draftCustomField = draftKnowledge.model.customField ?? [];
      const publishedCustomField = publishedKnowledge.model.customField ?? [];
      const diff1 = differenceWith(
        draftCustomField, publishedCustomField, isEqual
      );
      const diff2 = differenceWith(
        publishedCustomField, draftCustomField, isEqual
      );

      const domainDiff = differenceWith(
        draftKnowledge.model.domain || [],
        publishedKnowledge.model.domain || [],
        isEqual
      );

      const tagDiff = differenceWith(
        draftKnowledge.entity.tag || [],
        publishedKnowledge.entity.tag || [],
        isEqual
      );
      console.log(diff1.map((item: any) => item.key), diff2.map((item: any) => item.key));
      compareData.value = {
        ...result.data,
        add: {
          customField: diff1.map((item: any) => item.key)
        },
        delete: {
          customField: diff2.map((item: any) => item.key),
        },
        edit: {
          name: draftKnowledge.model.name !== publishedKnowledge.model.name,
          domain: !!domainDiff.length,
          tag: !!tagDiff.length
        }
      };
    }
  }

  async removeKnowledgePicture(params: {
    knowledgeEntityId: string;
    fileId: string;
  }): Promise<void> {
    const result = await KnowledgeApiService.removePicture(params);
    if (result.code === 0) {
      message.success('删除成功！');
    }
  }

  async setLatestVersionStatus(params: {
    publishedKnowledgeEntityId?: string;
  }): Promise<void> {
    if (!params.publishedKnowledgeEntityId) {
      knowledgePublishStatus.value = '未发布';
      return;
    }
    const result = await KnowledgeNoAuthApiService.getLatestVersion({
      publishedKnowledgeEntityId: params.publishedKnowledgeEntityId
    });
    if (result.data) {
      knowledgePublishStatus.value = `版本${result.data}`;
    }
  }

  /**
   * 发布知识点
   */
  async publishDraftKnowledge(params: {
    knowledgeEntityId: string;
    repositoryEntityId: string;
  }): Promise<{
    publishedKnowledgeEntityId: string;
    draftKnowledgeEntityId: string;
  } | undefined> {
    const result = await KnowledgeApiService.publishDraftKnowledge(params);
    if (result.data) {
      message.success('发布成功！');
      return result.data;
    }
    return undefined;
  }

  /**
   * 当前知识点引用的知识点
   * @param knowledgeEntityId
   */
  async getMentionedList(knowledgeEntityId: string): Promise<void> {
    const result = await KnowledgeApiService.getDraftKnowledgeMentionedList({
      knowledgeEntityId
    });
    if (result.data) {
      mentionedKnowledge.count = result.data.length;
      mentionedKnowledge.list = result.data;
    }
  }

  /**
   * 保存知识点描述
   * @param params
   */
  async handleSaveSectionArticle(params: {
    content: JSONContent,
    contentHtml: string,
    knowledgeEntityId: string
  }): Promise<boolean> {
    const result = await KnowledgeApiService.saveDescription({
      description: JSON.stringify(params.content),
      descriptionHTML: params.contentHtml,
      knowledgeEntityId: params.knowledgeEntityId
    });
    return result.code === 0;
  }

  /**
   * 引用知识点，建立引用关系
   * @param params
   * @private
   */
  async createDraftKnowledgeMention(params: {
    id: string,
    repositoryEntityId: string,
    knowledgeEntityId: string
  }): Promise<void> {
    const mentionKnowledgeList = knowledgeContent.value?.mentionKnowledgeList || [];
    mentionKnowledgeList.push({
      entityId: params.id,
      repositoryEntityId: params.repositoryEntityId,
      version: 1
    });
    const result = await KnowledgeApiService.updateDraftKnowledge({
      knowledgeEntityId: params.knowledgeEntityId,
      mentionKnowledgeList
    });
    if (!result.message) {
      message.success('创建成功！');
    }
    if (result.message) {
      message.warn(result.message);
    }
  }

  async getRepositoryBindList(repositoryEntityId: string): Promise<void> {
    const result = await RepositoryNoAuthApiService
      .getRepositoryBindEntityList(repositoryEntityId);
    if (result.data) {
      repositoryEntityList.value = result.data;
    }
  }

  async findEdgesByKnowledgeEntityId(params: {
    knowledgeEntityId: string;
    repositoryEntityId: string;
  }): Promise<void> {
    const result = await KnowledgeNoAuthApiService.getEdgesByKnowledgeEntityId(params);
    if (result.data) {
      knowledgeEdges.target = result.data;
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

  async updateDraftKnowledge(knowledgeEntityId: string, updateDocuments: {
    domain?: {
      domainBaseTypeId: string;
      domainName?: string;
      domainId: string;
    }[];
    pictures?: KnowledgePicturesFrontendType[];
    knowledgeBaseTypeId?: string;
    name?: string;
  }): Promise<void> {
    const result = await KnowledgeApiService.updateDraftKnowledge({
      knowledgeEntityId,
      ...updateDocuments
    });
    if (result.code === 0) {
      message.success('更新成功！');
    }
  }
}
