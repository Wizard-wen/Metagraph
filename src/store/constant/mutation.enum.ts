/* eslint-disable import/prefer-default-export */

// eslint-disable-next-line no-shadow
export enum MutationEnum {
  SET_IS_SPINNING = 'setIsSpinning',

  InitKnowledgeModelData = 'initKnowledgeModelData',

  SET_REPOSITORY_EDITABLE = 'setRepositoryEditable',

  HANDLE_WEBSOCKET_ADD = 'handleWebsocketAdd',
  // 仓库
  // 设置toolbar选中状态
  SET_TOOLBAR_STATE = 'setToolbarState',
  // 设置仓库中的单元树
  SET_SECTION_TREE = 'setSectionTree',
  // 设置当前选中的tree node keys
  SET_SELECTED_TREE_NODE_KEYS = 'setSelectedTreeNodeKeys',
  // 设置当前选中的tree node中属于section 的 keys
  SET_SELECTED_TREE_NODE_SECTION_KEYS = 'setSelectedTreeNodeSectionKeys',
  // 设置当前选中的tree node中属于entity 的 keys
  SET_SELECTED_TREE_NODE_ENTITY_KEYS = 'setSelectedTreeNodeEntityKeys',
  // 设置当前单元富文本的内容
  SET_SECTION_ARTICLE_CONTENT = 'setSectionArticleContent',
  // 设置当前单元富文本的标题
  SET_SECTION_ARTICLE_TITLE = 'setSectionArticleTitle',
  // 设置仓库中关联的实体
  SET_REPOSITORY_BIND_ENTITY_LIST = 'setRepositoryBindEntityList',
  // 设置当前选中的实体
  SET_SELECTED_ENTITY_ID = 'setSelectedEntityId',
  // 设置当前仓库包含的边
  SET_EDGE_LIST_BY_REPOSITORY_ID = 'setEdgeListByRepositoryId',
  // 设置当前仓库选中知识点的前置、导出知识点
  SET_PRE_EXTEND_KNOWLEDGE_LIST = 'setPreExtendKnowledgeList',
  // 设置当前选中知识点（实体）详情，用于graph下展示
  SET_SELECTED_ENTITY_DETAIL = 'setSelectedEntityDetail',
  INIT_GRAPH = 'initGraph',
  // user
  SET_USER_MODEL = 'setUserModel',
  // home
  SET_REPOSITORY_LIST = 'setRepositoryList',
  SET_OWN_REPOSITORY_LIST = 'setOwnRepositoryList',
  SET_QUERY_REPOSITORY_LIST = 'setQueryRepositoryList'
}
