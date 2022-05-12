/**
 * @author songxiwen
 * @date  2021/11/22 00:04
 */

import { IndexdbService } from '@/service/indexdb.service';
import { JSONContent } from '@tiptap/vue-3';
import { message } from 'ant-design-vue';
import { SelectEvent } from 'ant-design-vue/es/tree/Tree';
import { SectionModelType } from 'metagraph-constant';
import type { SectionTreeNodeType } from 'metagraph-constant';
import { reactive } from 'vue';
import { SectionArticleTiptapTextEditor } from '@/components/tiptap-text-editor/section.article.tiptap.text.editor';
import { tiptapInitData } from '@/store/constant';
import {
  EntityApiService,
  SectionApiService,
  SectionNoAuthApiService
} from '@/api.service';
import { MutationEnum, store } from '@/store';

export const sectionModalData = reactive<{
  entityType: 'Section' | 'Knowledge' | 'Exercise' | 'ChangeSection';
  title: '创建章节' | '修改章节' | '绑定实体';
  parentSectionId?: string;
  parentSectionName?: string;
  sectionName: string;
  selectedEntityId: string;
  entityOptionList: { key: string; label: string; value: string }[];
  isConfirmLoading: boolean;
}>({
  entityType: 'Section',
  title: '创建章节',
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

export const sectionArticle = reactive<{
  title: string;
  content: JSONContent;
  contentHtml: string;
  sectionId: string;
}>({
  title: '',
  content: tiptapInitData,
  contentHtml: '',
  sectionId: ''
});

// eslint-disable-next-line import/no-mutable-exports
export let sectionArticleTiptapTextEditor: SectionArticleTiptapTextEditor | undefined;

export class SectionTreeService {
  static initEditor(repositoryEntityId: string, editable: boolean): void {
    sectionArticleTiptapTextEditor = new SectionArticleTiptapTextEditor(
      repositoryEntityId,
      editable
    );
    sectionArticleTiptapTextEditor.initEditor();
  }

  async getSectionTree(repositoryEntityId: string, selectedSectionId?: string): Promise<void> {
    const response = await SectionNoAuthApiService.getSectionTree({ repositoryEntityId });
    if (response.data) {
      sectionTree.tree = response.data;
      if (response.data.length) {
        const currentSectionId = selectedSectionId ?? response.data[0].key;
        await sectionArticleTiptapTextEditor?.initData({
          sectionId: currentSectionId
        });
        // 如果section存在，那么选中第一个，获取section article
        await this.getSectionContent(currentSectionId);
        sectionArticleTiptapTextEditor?.setContent(sectionArticle.content);
        await IndexdbService.getInstance().put('repository', {
          id: currentSectionId,
          name: sectionArticle.title,
          content: sectionArticle.contentHtml,
          sectionId: currentSectionId,
          repositoryEntityId
        });
        sectionTree.selectedTreeNodes = [currentSectionId];
        sectionTree.selectedTreeSectionNodes = [currentSectionId];
      } else {
        sectionTree.selectedTreeNodes = [];
        sectionTree.selectedTreeSectionNodes = [];
      }
    }
  }

  async selectTreeNode(params: {
    selectedKeys: string[],
    info: SelectEvent
  }, isEditable: boolean): Promise<void> {
    sectionTree.selectedTreeNodes = params.selectedKeys;
    if (params.info.node.dataRef.section) {
      // 如果点击的是section
      // 切换section tree之前应该保存之前的section article
      await sectionArticleTiptapTextEditor?.updateSection(params.selectedKeys[0], isEditable);
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
      sectionArticle.content = JSON.parse(result.data.article.content);
      sectionArticle.contentHtml = result.data.article.contentHtml;
      sectionArticle.title = result.data.article.title;
      sectionArticle.sectionId = sectionId;
    }
  }

  async saveSectionArticle(params: {
    content: JSONContent;
    contentHtml: string;
  }): Promise<void> {
    const result = await SectionApiService.saveSectionArticle({
      ...params,
      sectionId: sectionArticle.sectionId
    });
    if (result.code !== 0) {
      message.error('文章保存失败！');
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

  // async getSectionContentByKey(key: string): Promise<void> {
  //   console.log('切换section item，执行获取section content ');
  //   await store.dispatch(ActionEnum.GET_SECTION_CONTENT, {
  //     sectionId: key
  //   });
  // }

  async initSectionModal(params: {
    type: 'Section' | 'Knowledge' | 'Exercise' | 'ChangeSection',
    section?: SectionModelType,
    isRoot?: boolean
  }): Promise<void> {
    sectionModalData.entityType = params.type;
    sectionModalData.selectedEntityId = '';
    sectionModalData.sectionName = '';
    sectionModalData.parentSectionId = params.section?.id;
    sectionModalData.parentSectionName = params.section?.name;
    if (sectionModalData.entityType === 'Section') {
      sectionModalData.title = '创建章节';
    }
    if (sectionModalData.entityType === 'ChangeSection') {
      sectionModalData.title = '修改章节';
      sectionModalData.sectionName = params?.section?.name || '';
    }
    if (sectionModalData.entityType === 'Knowledge') {
      sectionModalData.title = '绑定实体';
      await this.initEntityOptionList();
    }
    if (params.isRoot) {
      store.commit(MutationEnum.SET_SELECTED_TREE_NODE_KEYS, { key: [] });
    }
  }

  async initEntityOptionList(): Promise<void> {
    const result = await EntityApiService.getEntityList({
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
