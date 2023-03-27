/**
 * @author songxiwen
 * @date  2021/11/22 00:04
 */

import { SectionTreeNodeUIType } from '@/api-service/no.auth/section.no.auth.api.service';
import { IndexdbService } from '@/service/indexdb.service';
import type { JSONContent } from '@tiptap/vue-3';
import { message } from 'ant-design-vue';
import type {
  EntityCompletelyListItemType,
  KnowledgeResponseType,
  SectionModelType
} from 'metagraph-constant';
import { SectionEntityType } from 'metagraph-constant';
import { reactive, ref } from 'vue';
import { tiptapInitData } from '@/store/constant';
import { EntityApiService, SectionApiService, SectionNoAuthApiService } from '@/api-service';
import { TreeItemType } from '@/components/metagraph-tree/type';

export type SectionOperationType =
  'Section'
  | 'Knowledge'
  | 'Exercise'
  | 'ChangeSection'
  | 'Delete';

export const sectionModalData = reactive<{
  entityType: SectionOperationType;
  title: '创建目录' | '修改目录名' | '绑定知识点';
  parentSectionId?: string;
  parentSectionName?: string;
  entityOptionList: { key: string; label: string; value: string }[];
  isConfirmLoading: boolean;
}>({
  entityType: 'Section',
  title: '创建目录',
  entityOptionList: [],
  isConfirmLoading: false
});

export const sectionModalForm = reactive({
  sectionName: '',
  selectedEntityId: ''
});

export const sectionModalFormRules = ref({});

function generateTree(tree: SectionTreeNodeUIType[]): TreeItemType[] {
  return tree.map((item: SectionTreeNodeUIType) => {
    const newItem = {
      title: item.title,
      name: item.title,
      key: item.key,
      data: item.section
    };
    if (item.children) {
      const newList = generateTree(item.children);
      return {
        ...newItem,
        children: newList
      };
    }
    return newItem;
  });
}

export const sectionTree = reactive<{
  tree: SectionTreeNodeUIType[],
  metaTree: any[],
  selectedSectionId: string
}>({
  tree: [],
  metaTree: [],
  selectedSectionId: ''
});

export const currentSectionNode = reactive<{
  title: string;
  content: JSONContent;
  contentHtml: string;
  sectionId: string;
  entityList: EntityCompletelyListItemType[];
}>({
  title: '',
  content: tiptapInitData,
  contentHtml: '',
  sectionId: '',
  entityList: []
});

export class SectionTreeService {
  /**
   * @param repositoryEntityId 知识库entity id
   * @param selectedSectionId 可选，如果是页面刷新会传入一个初始化的sectionId
   */
  async getSectionTree(repositoryEntityId: string, selectedSectionId?: string): Promise<void> {
    const response = await SectionNoAuthApiService.getNormalSectionTree({ repositoryEntityId });
    if (response.data) {
      sectionTree.tree = response.data;
      sectionTree.metaTree = generateTree(response.data);
      if (response.data.length) {
        const currentSectionId = selectedSectionId ?? response.data[0].key;
        // 如果section存在，那么选中第一个，获取section article
        await this.setSectionContent(currentSectionId, repositoryEntityId);
        sectionTree.selectedSectionId = currentSectionId;
      } else {
        sectionTree.selectedSectionId = '';
      }
    }
  }

  async selectTreeNode(params: {
    sectionId: string,
    repositoryEntityId: string
  }): Promise<void> {
    sectionTree.selectedSectionId = params.sectionId;
    // 如果点击的是section
    // 切换section tree之前应该保存之前的section article
    await this.setSectionContent(params.sectionId, params.repositoryEntityId);
  }

  /**
   * 获取section content
   * @param sectionId 单元id
   * @param repositoryEntityId 知识库id
   * @private
   */
  async setSectionContent(sectionId: string, repositoryEntityId: string): Promise<void> {
    const result = await SectionNoAuthApiService.getSectionArticle({ sectionId });
    if (result.data) {
      currentSectionNode.content = JSON.parse(result.data.article.content);
      currentSectionNode.contentHtml = result.data.article.contentHtml;
      currentSectionNode.title = result.data.article.title;
      currentSectionNode.sectionId = sectionId;
      currentSectionNode.entityList = result.data.entityList;
      await IndexdbService.getInstance()
        .put('repository', {
          id: sectionId,
          name: currentSectionNode.title,
          content: currentSectionNode.contentHtml,
          sectionId,
          repositoryEntityId
        });
    }
  }

  initSectionView() {
    currentSectionNode.title = '';
    currentSectionNode.content = tiptapInitData;
    currentSectionNode.contentHtml = '';
    currentSectionNode.sectionId = '';
    currentSectionNode.entityList = [];
    sectionTree.selectedSectionId = '';
  }

  /**
   * 保存当前文章内容
   * @param params
   */
  async saveSectionArticle(params: {
    content: JSONContent;
    contentHtml: string;
    sectionId: string
  }): Promise<void> {
    const result = await SectionApiService.saveSectionArticle({
      ...params
    });
    if (result.code !== 0) {
      message.error('文章保存失败！');
    }
  }

  async createSection(repositoryEntityId: string): Promise<{
    entityId?: string,
    sectionId?: string
  }> {
    let sectionModel: SectionModelType | undefined;
    if (sectionModalData.entityType === 'Section') {
      const result = await SectionApiService.createSectionTree({
        name: sectionModalForm.sectionName,
        repositoryEntityId,
        parentId: sectionModalData.parentSectionId
      });
      if (result.data) {
        sectionModel = result.data;
      }
    } else if (sectionModalData.entityType === 'ChangeSection') {
      if (!sectionModalData.parentSectionId) {
        return {};
      }
      const result = await SectionApiService.updateSectionTree({
        name: sectionModalForm.sectionName,
        id: sectionModalData.parentSectionId
      });
      if (result.data) {
        sectionModel = result.data;
      }
    } else {
      if (!sectionModalData.parentSectionId) {
        return {};
      }
      await this.bindSectionEntity({
        entityId: sectionModalForm.selectedEntityId,
        entityType: sectionModalData.entityType as 'Knowledge',
        repositoryEntityId,
        sectionId: sectionModalData.parentSectionId
      });
      return {
        entityId: sectionModalForm.selectedEntityId
      };
    }
    return {
      sectionId: sectionModel?.id
    };
  }

  async bindSectionEntity(params: {
    repositoryEntityId: string;
    sectionId: string;
    entityId: string;
    entityType: SectionEntityType;
  }): Promise<void> {
    await SectionApiService.bindSectionEntity({
      ...params
    });
  }

  /**
   * 初始化单元model数据
   * @param params
   */
  async initSectionModal(params: {
    type: SectionOperationType,
    section?: SectionModelType,
    isRoot?: boolean
  }): Promise<void> {
    sectionModalData.entityType = params.type;
    sectionModalData.parentSectionId = params.section?.id;
    sectionModalData.parentSectionName = params.section?.name;
    if (sectionModalData.entityType === 'Section') {
      sectionModalData.title = '创建目录';
      sectionModalForm.sectionName = '';
      sectionModalFormRules.value = {
        sectionName: [{
          required: true,
          message: '请输入目录名称',
          trigger: 'blur'
        }, {
          min: 3,
          max: 15,
          message: '目录名称应当在3-15个字符',
          trigger: 'blur'
        }],
      };
    }
    if (sectionModalData.entityType === 'ChangeSection') {
      sectionModalData.title = '修改目录名';
      sectionModalForm.sectionName = params?.section?.name || '';
    }
    if (sectionModalData.entityType === 'Knowledge') {
      sectionModalData.title = '绑定知识点';
      sectionModalForm.selectedEntityId = '';
      sectionModalFormRules.value = {
        selectedEntityId: [{
          required: true,
          message: '请选择绑定的实体',
          trigger: 'change'
        }],
      };
      await this.initEntityOptionList();
    }
  }

  /**
   * 初始化单元可绑定实体
   * @private
   */
  private async initEntityOptionList(value?: string): Promise<void> {
    const result = await EntityApiService.getEntityList({
      name: value,
      entityType: sectionModalData.entityType,
      pageIndex: 0,
      pageSize: 80
    });
    if (result.data) {
      sectionModalData.entityOptionList = result.data
        .list.map((item: EntityCompletelyListItemType) => ({
          key: item.entity.id,
          label: (item.content as KnowledgeResponseType).name,
          value: item.entity.id
        }));
    }
  }
}
