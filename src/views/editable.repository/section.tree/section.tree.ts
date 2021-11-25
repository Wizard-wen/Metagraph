/**
 * @author songxiwen
 * @date  2021/11/22 00:04
 */

import type { EntityCompletelyListItemType } from 'edu-graph-constant';
import { computed, reactive } from 'vue';
import { EntityNoAuthApiService, SectionApiService } from '@/api.service';
import { ActionEnum, MutationEnum, store } from '@/store';

export const sectionModalData = reactive<{
  entityType: 'Section' | 'Knowledge' | 'Exercise' | 'ChangeSection';
  title: '创建Section' | '修改Section' | '绑定实体';
  sectionName: string;
  selectedEntityId: string;
  entityOptionList: EntityCompletelyListItemType[]
}>({
  entityType: 'Section',
  title: '创建Section',
  sectionName: '',
  entityOptionList: [],
  selectedEntityId: ''
});
export const selectedTreeNode = computed(() => store.state.repositoryEditor.selectedTreeNode);

export class SectionTreeService {
  async createSection(repositoryEntityId: string): Promise<void> {
    if (sectionModalData.entityType === 'Section') {
      await SectionApiService.createSectionTree({
        name: sectionModalData.sectionName,
        repositoryEntityId,
        parentId: selectedTreeNode.value?.length ? selectedTreeNode.value[0] : undefined,
      });
    } else if (sectionModalData.entityType === 'ChangeSection') {
      await SectionApiService.updateSectionTree({
        name: sectionModalData.sectionName,
        id: selectedTreeNode.value[0]
      });
    } else {
      if (selectedTreeNode.value.length === 0) {
        return;
      }
      await SectionApiService.bindSectionEntity({
        entityId: sectionModalData.selectedEntityId,
        entityType: sectionModalData.entityType as 'Knowledge',
        repositoryEntityId,
        sectionId: selectedTreeNode.value[0],
      });
    }
    await store.dispatch(ActionEnum.GET_SECTION_TREE, {
      repositoryEntityId
    });
  }

  async getSectionContentByKey(key: string): Promise<void> {
    console.log('切换section item，执行获取section content ');
    await store.dispatch(ActionEnum.GET_SECTION_CONTENT, {
      sectionId: key
    });
  }

  async initSectionModal(params: {
    type: 'Section' | 'Knowledge' | 'Exercise' | 'ChangeSection',
    section?: any,
    isRoot?: boolean
  }): Promise<void> {
    sectionModalData.entityType = params.type;
    sectionModalData.selectedEntityId = '';
    sectionModalData.sectionName = '';
    if (sectionModalData.entityType === 'Section') {
      sectionModalData.title = '创建Section';
    }
    if (sectionModalData.entityType === 'ChangeSection') {
      sectionModalData.title = '修改Section';
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
    const result = await EntityNoAuthApiService.getEntityList({
      name: sectionModalData.selectedEntityId,
      entityType: sectionModalData.entityType,
      pageIndex: 0,
      pageSize: 80
    });
    sectionModalData.entityOptionList = result.data.list.map((item: any) => ({
      key: item.entity.id,
      label: item.content.name,
      value: item.entity.id
    }));
  }
}
