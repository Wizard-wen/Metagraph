/**
 * @author wizard.song
 * @date 2021/09/14 23:35
 */

// eslint-disable-next-line no-shadow
export enum ActionEnum {
  GET_SECTION_TREE = 'getSectionTree',
  SELECTED_SECTION_TREE_NODE = 'selectSectionTreeNode',
  GET_SECTION_CONTENT = 'getSectionContent',
  SAVE_SECTION_CONTENT = 'saveSectionContent',
  CREAT_SECTION_ITEM = 'createSectionItem',
  GET_REPOSITORY_BIND_ENTITY_LIST = 'getRepositoryBindEntityList',
  GET_EDGE_LIST_BY_REPOSITORY_ID = 'getEdgeListByRepositoryId',
  // 获取当前仓库选中知识点的前置、导出知识点
  GET_PRE_EXTEND_KNOWLEDGE_LIST = 'getPreExtendKnowledgeList',
  // 获取选中实体（知识点）的详情
  GET_SELECTED_ENTITY_DETAIL = 'getSelectedEntityDetail',
  /**
   * user
   */
  LOGIN_BY_NAME = 'loginByName',
  /**
   * home-page
   */
  GET_REPOSITORY_LIST = 'getRepositoryList',
  GET_OWN_REPOSITORY_LIST = 'getOwnRepositoryList',
  GET_QUERY_REPOSITORY_LIST = 'getQueryRepositoryList'
}
