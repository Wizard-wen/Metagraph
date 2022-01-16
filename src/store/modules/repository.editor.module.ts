/**
 * @author songxiwen
 * @date  2021/9/14 23:29
 */
import * as AntvX6 from '@antv/x6';
import { SelectEvent } from 'ant-design-vue/es/tree/Tree';
import type {
  EntityCompletelyListItemType, ExerciseModelType, KnowledgeModelType,
  SectionCreateRequestType
} from 'metagraph-constant';
import { Module } from 'vuex';
import {
  SectionApiService,
  RepositoryApiService,
  EdgeNoAuthApiService,
  KnowledgeNoAuthApiService,
  RepositoryNoAuthApiService,
  SectionNoAuthApiService
} from '@/api.service';
import { ActionEnum, MutationEnum, tiptapInitData } from '@/store/constant';
import { RepositoryEditorStateType, RootStateType } from '@/store/type';

export const repositoryEditorModule: Module<RepositoryEditorStateType, RootStateType> = {
  state: () => ({
    // todo 待删除
    // editable: false,
    // section
    // sectionTree: [],
    // section富文本
    // sectionArticleContent: tiptapInitData,

    section: {
      title: '',
      articleHtml: '',
      articleContent: tiptapInitData
    },

    // section富文本标题
    // sectionArticleTitle: 'Title',
    // sectionArticleHtml: '',
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
    // todo 待删除
    // [MutationEnum.SET_REPOSITORY_EDITABLE](state, { status }) {
    //   state.editable = status;
    // },
    // section
    [MutationEnum.SET_SECTION_ARTICLE](state, {
      content,
      html,
      title
    }) {
      state.section = {
        articleContent: JSON.parse(content),
        title,
        articleHtml: html
      };
    },

    // [MutationEnum.SET_SECTION_ARTICLE_CONTENT](state, { content }) {
    //   state.sectionArticleContent = JSON.parse(content);
    // },
    // [MutationEnum.SET_SECTION_ARTICLE_TITLE](state, { content }) {
    //   state.sectionArticleTitle = content;
    // },
    //
    // [MutationEnum.SET_SECTION_ARTICLE_HTML](state, { content }) {
    //   state.sectionArticleHtml = content;
    // },
    // [MutationEnum.SET_SECTION_TREE](state, { tree }) {
    //   state.sectionTree = tree;
    // },
    [MutationEnum.SET_SELECTED_TREE_NODE_KEYS](state, { keys }) {
      state.selectedTreeNode = keys;
    },
    [MutationEnum.SET_SELECTED_TREE_NODE_SECTION_KEYS](state, { sectionKeys }) {
      state.selectedTreeNodeSectionKeys = sectionKeys;
    },
    [MutationEnum.SET_SELECTED_TREE_NODE_ENTITY_KEYS](state, { entityKeys }) {
      state.selectedTreeNodeEntityKeys = entityKeys;
    },
    [MutationEnum.SET_TOOLBAR_STATE](state, type) {
      state.toolbarState = type;
    },
    [MutationEnum.SET_REPOSITORY_BIND_ENTITY_LIST](state, { list }) {
      state.repositoryEntityList = list.data;
    },
    [MutationEnum.SET_SELECTED_ENTITY_DETAIL](state, { detail }) {
      state.selectedEntityDetail = detail;
    },
  },
  actions: {
    // 获取section tree
    async [ActionEnum.GET_SECTION_TREE]({
      commit,
      dispatch
    }, { repositoryEntityId }) {
      const response = await SectionNoAuthApiService.getSectionTree({ repositoryEntityId });
      if (response.data) {
        if (response.data.length) {
          // 如果section存在，那么选中第一个，获取section article
          await dispatch(ActionEnum.GET_SECTION_CONTENT, {
            sectionId: response.data[0].key
          });
          commit(MutationEnum.SET_SELECTED_TREE_NODE_KEYS, { keys: [response.data[0].key] });
          commit(MutationEnum.SET_SELECTED_TREE_NODE_SECTION_KEYS, {
            sectionKeys: [response.data[0].key]
          });
        } else {
          commit(MutationEnum.SET_SELECTED_TREE_NODE_KEYS, { keys: [] });
          commit(MutationEnum.SET_SELECTED_TREE_NODE_SECTION_KEYS, { sectionKeys: [] });
        }
        commit(MutationEnum.SET_SECTION_TREE, { tree: response.data });
      }
    },
    // 切换section tree node
    async [ActionEnum.SELECTED_SECTION_TREE_NODE](
      {
        commit,
        dispatch
      },
      params: { selectedKeys: string[], info: SelectEvent }
    ) {
      // 提交commit改变当前选中的 tree node
      commit(MutationEnum.SET_SELECTED_TREE_NODE_KEYS, {
        keys: params.selectedKeys
      });
      commit(MutationEnum.SET_IS_SPINNING, { status: true });
      // 上次选中的key
      // const lastSelectedKey = selectedTreeNodeSectionKeys.value[0];
      if (params.info.node.dataRef.section) {
        // 如果点击的是section
        // await sectionTreeService.getSectionContentByKey(params.selectedKeys[0]);
        await dispatch(ActionEnum.GET_SECTION_CONTENT, {
          sectionId: params.selectedKeys[0]
        });
        // 将当前选中的key赋值给section list
        commit(MutationEnum.SET_SELECTED_TREE_NODE_SECTION_KEYS, {
          sectionKeys: params.selectedKeys
        });
        // 清空当前选中的entity list
        commit(MutationEnum.SET_SELECTED_TREE_NODE_ENTITY_KEYS, {
          entityKeys: []
        });
      } else {
        // 如果点击的是entity
        // isDrawerShown.value = true;
        commit(MutationEnum.SET_SELECTED_TREE_NODE_ENTITY_KEYS, {
          entityKeys: params.selectedKeys
        });
      }
      commit(MutationEnum.SET_IS_SPINNING, { status: false });
    },
    // 获取section article
    async [ActionEnum.GET_SECTION_CONTENT]({ commit }, { sectionId }) {
      const result = await SectionNoAuthApiService.getSectionArticle({ sectionId });
      commit(MutationEnum.SET_SECTION_ARTICLE_CONTENT, { content: result.data?.article.content });
      commit(MutationEnum.SET_SECTION_ARTICLE_TITLE, { content: result.data?.article.title });
      commit(MutationEnum.SET_SECTION_ARTICLE_HTML, { content: result.data?.article.contentHtml });
    },
    // 保存section article
    async [ActionEnum.SAVE_SECTION_CONTENT]({ state }, {
      content,
      contentHtml
    }) {
      if (state.selectedTreeNodeSectionKeys.length === 0) {
        // 当前没有选中的单元
        return;
      }
      await SectionApiService.saveSectionArticle({
        sectionId: state.selectedTreeNodeSectionKeys[0],
        content,
        contentHtml
      });
    },
    // 创建section item
    // async [ActionEnum.CREAT_SECTION_ITEM](context, params: SectionCreateRequestType) {
    //   await SectionApiService.createSectionTree(params);
    // }
  }
};
