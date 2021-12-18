/**
 * @author songxiwen
 * @date  2021/9/14 23:29
 */
import * as AntvX6 from '@antv/x6';
import { SelectEvent } from 'ant-design-vue/es/tree/Tree';
import type {
  EntityCompletelyListItemType, ExerciseModelType, KnowledgeModelType,
  SectionCreateRequestType
} from 'edu-graph-constant';
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
    editable: undefined,
    // section
    sectionTree: [],
    // section富文本
    sectionArticleContent: tiptapInitData,
    // section富文本标题
    sectionArticleTitle: 'Title',
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
    [MutationEnum.SET_REPOSITORY_EDITABLE](state, { status }) {
      state.editable = status;
    },
    // section
    [MutationEnum.SET_SECTION_ARTICLE_CONTENT](state, { content }) {
      state.sectionArticleContent = JSON.parse(content);
    },
    [MutationEnum.SET_SECTION_ARTICLE_TITLE](state, { content }) {
      state.sectionArticleTitle = content.title;
    },
    [MutationEnum.SET_SECTION_TREE](state, { tree }) {
      state.sectionTree = tree;
    },
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
    [MutationEnum.SET_EDGE_LIST_BY_REPOSITORY_ID](state, { nodes, edges, hasAuth }) {
      state.knowledgeList = nodes.list.map((item: EntityCompletelyListItemType) => {
        const ports = {
          items: [
            {
              id: `${item.entity.id}-in`,
              group: 'in',
              attrs: {
                text: { text: 'in' },
              },
            },
            {
              id: `${item.entity.id}-out`,
              group: 'out',
              attrs: {
                text: { text: 'out' },
              },
            },
          ],
          groups: {
            in: {
              position: {
                name: 'left',
              },
              label: {
                position: 'left', // 标签位置
              },
              attrs: {
                portBody: {
                  magnet: 'passive',
                  r: 6,
                  stroke: '#ffa940',
                  fill: '#fff',
                  strokeWidth: 2,
                },
              },
            },
            out: {
              position: {
                name: 'right',
              },
              label: {
                position: 'outside', // 标签位置
              },
              attrs: {
                portBody: {
                  magnet: true,
                  r: 6,
                  fill: '#fff',
                  stroke: '#3199FF',
                  strokeWidth: 2,
                },
              },
            },
          },
        };
        let node: any = {
          id: item.entity.id,
          height: 30,
          width: 150,
          label: (<KnowledgeModelType | ExerciseModelType> item.content).name,
          data: item,
          attrs: {
            root: {
              magnet: false,
            },
            body: {
              fill: '#f5f5f5',
              stroke: '#d9d9d9',
              strokeWidth: 1,
            },
          },
          portMarkup: [
            {
              tagName: 'circle',
              selector: 'portBody',
            },
          ],
        };
        if (nodes.view[item.entity.id]) {
          console.log(nodes.view[item.entity.id]);
          node = {
            ...node,
            position: nodes.view[item.entity.id]
          };
        }
        if (hasAuth) {
          return {
            ...node,
            ports
          };
        }
        return node;
      });
      state.repositoryEdgeList = edges.map((item: any) => ({
        id: item.id,
        source: {
          cell: `${item.originKnowledgeEntityId}`,
          port: `${item.originKnowledgeEntityId}-out`
        },
        target: {
          cell: `${item.targetKnowledgeEntityId}`,
          port: `${item.targetKnowledgeEntityId}-in`
        },
        labels: [item.description || ''],
        connector: 'rounded',
        attrs: {
          line: {
            stroke: '#a0a0a0',
            strokeWidth: 1,
            targetMarker: {
              name: 'classic',
              size: 7,
            },
          },
        },
      }));
    },
    // 前置导出知识点列表
    [MutationEnum.SET_PRE_EXTEND_KNOWLEDGE_LIST](state, {
      preInnerList,
      preOuterList,
      extendInnerList,
      extendOuterList
    }) {
      state.preInnerKnowledgeList = preInnerList;
      state.preOuterKnowledgeList = preOuterList;
      state.extendInnerKnowledgeList = extendInnerList;
      state.extendOuterKnowledgeList = extendOuterList;
    },
    // 初始化 antV Graph
    [MutationEnum.INIT_GRAPH](state) {
      state.graph.graph = new AntvX6.Graph({
        autoResize: true,
        selecting: {
          enabled: true,
          showNodeSelectionBox: true,
        },
        minimap: {
          enabled: true,
          container: document.getElementById('mini-map-container')!,
        },
        container: document.getElementById('container')!,
        width: window.innerWidth.valueOf() - 520,
        height: (window.innerHeight.valueOf() - 56),
        background: {
          color: '#fff', // 设置画布背景颜色
        },
        grid: {
          size: 10, // 网格大小 10px
          visible: true, // 渲染网格背景
        },
        highlighting: {
          magnetAvailable: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#fff',
                stroke: '#47C769',
              },
            },
          },
          magnetAdsorbed: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#fff',
                stroke: '#31d0c6',
              },
            },
          },
        },
        connecting: {
          snap: true,
          allowBlank: false,
          allowLoop: false,
          highlight: true,
          // connector: 'rounded',
          connector: 'smooth',
          connectionPoint: 'boundary',
          router: {
            name: 'er',
            args: {
              direction: 'V',
            },
          },
          createEdge() {
            return new AntvX6.Shape.Edge({
              attrs: {
                line: {
                  stroke: '#a0a0a0',
                  strokeWidth: 1,
                  targetMarker: {
                    name: 'classic',
                    size: 7,
                  },
                },
              },
            });
          },
          validateConnection({
            sourceView,
            targetView,
            targetMagnet
          }) {
            console.log(sourceView, targetView, targetMagnet);
            if (!targetMagnet) {
              return false;
            }

            if (targetMagnet.getAttribute('port-group') !== 'in') {
              return false;
            }

            if (targetView) {
              const node = targetView.cell;
              // if (node instanceof MyShape) {
              //   const portId = targetMagnet.getAttribute('port');
              //   const usedInPorts = node.getUsedInPorts(state.graph.graph!);
              //   if (usedInPorts.find((port) => port && port.id === portId)) {
              //     return false;
              //   }
              // }
            }

            return true;
          },
        },
      });
      // 初始化可拖拽节点框
      state.graph.dnd = new AntvX6.Addon.Dnd({
        // 目标画布。
        target: state.graph.graph,
        // 是否根据目标画布的缩放比例缩放拖拽的节点。
        scaled: false,
        // 拖拽结束时，而且目标节点不能添加到目标画布时，是否使用动画将代理画布移动到开始拖动的位置。
        animation: true,
        // 拖拽结束时，获取放置到目标画布的节点，默认克隆代理节点。
        getDropNode(draggingNode: AntvX6.Node, options: AntvX6.Addon.Dnd.GetDropNodeOptions) {
          console.log(draggingNode, options);
          return draggingNode.clone();
        },
        // 拖拽结束时，验证节点是否可以放置到目标画布中。
        async validateNode(
          droppingNode: AntvX6.Node,
          options: AntvX6.Addon.Dnd.ValidateNodeOptions
        ) {
          // 绑定节点到当前仓库
          await RepositoryApiService.BindEntityToRepository({
            entityId: droppingNode.data.entity.id,
            entityType: 'Knowledge',
            repositoryEntityId: droppingNode.data.repositoryEntityId
          });
          return true;
        }
      });
    }
  },
  actions: {
    // 获取section tree
    async [ActionEnum.GET_SECTION_TREE]({ commit, dispatch }, { repositoryEntityId }) {
      const response = await SectionNoAuthApiService.getSectionTree({ repositoryEntityId });
      if (response.data) {
        if (response.data.length) {
          // 如果section存在，那么选中第一个
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
      { commit, dispatch },
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
      console.log(result.data?.article, sectionId, 'set article dispatch');
      commit(MutationEnum.SET_SECTION_ARTICLE_CONTENT, { content: result.data?.article.content });
      commit(MutationEnum.SET_SECTION_ARTICLE_TITLE, { content: result.data?.article.title });
    },
    // 保存section article
    async [ActionEnum.SAVE_SECTION_CONTENT]({ dispatch, state }, { content, contentHtml }) {
      if (state.selectedTreeNodeSectionKeys.length === 0) {
        console.log('当前没有选中的单元');
        return;
      }
      await SectionApiService.saveSectionArticle({
        sectionId: state.selectedTreeNodeSectionKeys[0],
        content,
        contentHtml
      });
      // 刷新页面
      // if (state.selectedTreeNode.length) {
      //   await dispatch(ActionEnum.GET_SECTION_CONTENT, { sectionId: state.selectedTreeNode[0] });
      // }
    },
    // 创建section item
    async [ActionEnum.CREAT_SECTION_ITEM](context, params: SectionCreateRequestType) {
      await SectionApiService.createSectionTree(params);
    },

    // graph edge
    async [ActionEnum.GET_REPOSITORY_BIND_ENTITY_LIST]({ commit }, params: {
      repositoryEntityId: string
    }) {
      const result = await RepositoryNoAuthApiService
        .getRepositoryBindEntityList(params.repositoryEntityId);
      commit(MutationEnum.SET_REPOSITORY_BIND_ENTITY_LIST, { list: result });
    },
    async [ActionEnum.GET_EDGE_LIST_BY_REPOSITORY_ID]({ commit }, { repositoryEntityId, hasAuth }) {
      const edgeList = await EdgeNoAuthApiService.getListByRepositoryId({
        edgeRepositoryEntityId: repositoryEntityId
      });
      const repositoryKnowledgeList = await KnowledgeNoAuthApiService.getRepositoryKnowledgeList({
        repositoryEntityId
      });
      commit(MutationEnum.SET_EDGE_LIST_BY_REPOSITORY_ID, {
        edges: edgeList.data,
        nodes: repositoryKnowledgeList.data,
        hasAuth
      });
    },
    // 获取前置、导出知识点
    async [ActionEnum.GET_PRE_EXTEND_KNOWLEDGE_LIST]({ commit }, params
      :
      {
        repositoryEntityId: string,
        knowledgeEntityId
          :
          string
      }) {
      const result = await KnowledgeNoAuthApiService.findEdgesByKnowledgeEntityId(params);
      commit(MutationEnum.SET_PRE_EXTEND_KNOWLEDGE_LIST, result.data);
    },
    // 获取知识点详情
    async [ActionEnum.GET_SELECTED_ENTITY_DETAIL]({ commit }) {
      // commmit
    }
  }
};
