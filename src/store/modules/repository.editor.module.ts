/**
 * @author songxiwen
 * @date  2021/9/14 23:29
 */

import { Module } from 'vuex';

import { tiptapInitData } from '@/store/constant';
import { RepositoryEditorStateType, RootStateType } from '@/store/type';

export const repositoryEditorModule: Module<RepositoryEditorStateType, RootStateType> = {
  state: () => ({


    section: {
      title: '',
      articleHtml: '',
      articleContent: tiptapInitData
    },

    // 当前选中的tree node keys
    selectedTreeNode: [],
    // 当前选中的tree node keys中属于section的部分
    selectedTreeNodeSectionKeys: [],
    // 当前选中的tree node keys中属于entity的部分
    selectedTreeNodeEntityKeys: [],

    toolbarState: 'EntityList',
    repositoryEntityList: [],
    selectedEntityId: '',
    selectedEntityDetail: null,
    // 被选中的知识点类型的实体
    selectedKnowledgeEntityId: '',
    // 仓库中的边
    repositoryEdgeList: [],
    // 仓库关联的知识点
    knowledgeList: [],
    // 某个选中知识点的前置知识点树
    preInnerKnowledgeList: undefined,
    // 某个选中知识点的导出知识点树
    preOuterKnowledgeList: undefined,
    extendInnerKnowledgeList: undefined,
    extendOuterKnowledgeList: undefined,
    graph: {
      graph: undefined,
      dnd: undefined
    }
  }),
  getters: {
    repositoryEntityIdList: (state) => state.repositoryEntityList.map((item) => item.entity.id)
  },
  mutations: {

  },
  actions: {

  }
};
