/**
 * @author songxiwen
 * @date  2021/11/22 00:04
 */

import { SelectEvent } from 'ant-design-vue/es/tree/Tree';
import { SectionModelType } from 'metagraph-constant';
import type { SectionTreeNodeType } from 'metagraph-constant';
import { computed, reactive } from 'vue';
import { EntityNoAuthApiService, SectionApiService, SectionNoAuthApiService } from '@/api.service';
import { ActionEnum, MutationEnum, store } from '@/store';

export const sectionModalData = reactive<{
  entityType: 'Section' | 'Knowledge' | 'Exercise' | 'ChangeSection';
  title: '创建单元' | '修改单元' | '绑定实体';
  parentSectionId?: string;
  parentSectionName?: string;
  sectionName: string;
  selectedEntityId: string;
  entityOptionList: { key: string; label: string; value: string }[];
  isConfirmLoading: boolean;
}>({
  entityType: 'Section',
  title: '创建单元',
  sectionName: '',
  entityOptionList: [],
  selectedEntityId: '',
  isConfirmLoading: false
});

export const sectionTree = reactive<{
  tree: SectionTreeNodeType[],
  selectedTreeNodes: string[],
  selectedTreeEntityNodes: string[],
  selectedTreeSectionNodes: string[]
}>({
  tree: [],
  selectedTreeNodes: [],
  selectedTreeEntityNodes: [],
  selectedTreeSectionNodes: []
});

export class SectionTreeService {
  async getSectionTree(repositoryEntityId: string): Promise<void> {
    const response = await SectionNoAuthApiService.getSectionTree({ repositoryEntityId });
    if (response.data) {
      sectionTree.tree = response.data;
      if (response.data.length) {
        // 如果section存在，那么选中第一个，获取section article
        await this.getSectionContent(response.data[0].key);
        sectionTree.selectedTreeNodes = [response.data[0].key];
        sectionTree.selectedTreeSectionNodes = [response.data[0].key];
      } else {
        sectionTree.selectedTreeNodes = [];
        sectionTree.selectedTreeSectionNodes = [];
      }
    }
  }

  async selectTreeNode(params: {
    selectedKeys: string[],
    info: SelectEvent
  }): Promise<void> {
    sectionTree.selectedTreeNodes = params.selectedKeys;
    if (params.info.node.dataRef.section) {
      // 如果点击的是section
      await this.getSectionContent(params.selectedKeys[0]);
      // 将当前选中的key赋值给section list
      sectionTree.selectedTreeSectionNodes = params.selectedKeys;
      // 清空当前选中的entity list
      sectionTree.selectedTreeEntityNodes = [];
    } else {
      // 如果点击的是entity
      sectionTree.selectedTreeEntityNodes = params.selectedKeys;
    }
  }

  private async getSectionContent(sectionId: string): Promise<void> {
    const result = await SectionNoAuthApiService.getSectionArticle({ sectionId });
    if (result.data) {
      store.commit(MutationEnum.SET_SECTION_ARTICLE, {
        title: result.data?.section.name,
        content: result.data.article.content,
        html: result.data.article.contentHtml
      });
    }
  }

  async createSection(repositoryEntityId: string): Promise<void> {
    if (sectionModalData.entityType === 'Section') {
      await SectionApiService.createSectionTree({
        name: sectionModalData.sectionName,
        repositoryEntityId,
        parentId: sectionModalData.parentSectionId
      });
    } else if (sectionModalData.entityType === 'ChangeSection') {
      if (!sectionModalData.parentSectionId) {
        return;
      }
      await SectionApiService.updateSectionTree({
        name: sectionModalData.sectionName,
        id: sectionModalData.parentSectionId
      });
    } else {
      if (!sectionModalData.parentSectionId) {
        return;
      }
      await SectionApiService.bindSectionEntity({
        entityId: sectionModalData.selectedEntityId,
        entityType: sectionModalData.entityType as 'Knowledge',
        repositoryEntityId,
        sectionId: sectionModalData.parentSectionId
      });
    }
    await this.getSectionTree(repositoryEntityId);
  }

  async getSectionContentByKey(key: string): Promise<void> {
    console.log('切换section item，执行获取section content ');
    await store.dispatch(ActionEnum.GET_SECTION_CONTENT, {
      sectionId: key
    });
  }

  async initSectionModal(params: {
    type: 'Section' | 'Knowledge' | 'Exercise' | 'ChangeSection',
    section?: SectionModelType,
    isRoot?: boolean
  }): Promise<void> {
    sectionModalData.entityType = params.type;
    sectionModalData.selectedEntityId = '';
    sectionModalData.sectionName = '';
    // sectionModalData.parentSectionId = undefined;
    // sectionModalData.parentSectionName = undefined;
    sectionModalData.parentSectionId = params.section?.id;
    sectionModalData.parentSectionName = params.section?.name;
    if (sectionModalData.entityType === 'Section') {
      sectionModalData.title = '创建单元';
      // sectionModalData.parentSectionId = params.section?.id;
      // sectionModalData.parentSectionName = params.section?.name;
    }
    if (sectionModalData.entityType === 'ChangeSection') {
      sectionModalData.title = '修改单元';
      sectionModalData.sectionName = params?.section?.name || '';
    }
    if (sectionModalData.entityType === 'Knowledge') {
      sectionModalData.title = '绑定实体';
      // sectionModalData.parentSectionId = params.section?.id;
      // sectionModalData.parentSectionName = params.section?.name;
      await this.initEntityOptionList();
    }
    if (params.isRoot) {
      store.commit(MutationEnum.SET_SELECTED_TREE_NODE_KEYS, { key: [] });
    }
  }

  async initEntityOptionList(): Promise<void> {
    const result = await EntityNoAuthApiService.getEntityList({
      name: sectionModalData.selectedEntityId,
      entityType: sectionModalData.entityType,
      pageIndex: 0,
      pageSize: 80
    });
    if (result.data) {
      sectionModalData.entityOptionList = result.data.list.map((item: any) => ({
        key: item.entity.id,
        label: item.content.name,
        value: item.entity.id
      }));
    }
  }
}
