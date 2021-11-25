/**
 * @author wizard.song
 * @date 2021/09/12 23:36
 */

// eslint-disable-next-line no-shadow,import/prefer-default-export
export enum ApiPathEnum {
  /**
   * knowledge
   */
  CreateKnowledge = '/knowledge/create',
  UpdateKnowledge = '/knowledge/update',
  RemoveKnowledge = '/knowledge/remove/id',
  SaveKnowledgeDescription = '/knowledge/save/description',
  // 获取知识点
  GetNoAuthKnowledgeById = '/public/knowledge/get',
  // 带分页的知识点列表
  GetNoAuthKnowledgeList = '/public/knowledge/getList',
  // 获取某个知识点的前置、导出知识点
  GetNoAuthEdgesByKnowledgeEntityId = '/public/knowledge/findEdgesByKnowledgeEntityId',
  // 仓库绑定的知识点
  GetNoAuthKnowledgeListByRepositoryEntityId = '/public/knowledge/getList/repositoryEntityId',
  GetAlternativeKnowledgeList = '/knowledge/getAlternativeKnowledgeList',
  CreateAlternativeKnowledgeList = '/knowledge/createAlternativeKnowledgeList',
  /**
   * edge
   */
  CreateKnowledgeEdge = 'knowledge/edge/create',
  GetNoAuthKnowledgeEdgeList = '/public/knowledge/edge/getList',
  GetNoAuthKnowledgeEdgeListByRepositoryEntityId = '/public/knowledge/edge/getList/repositoryEntityId',
  /**
   * section
   */
  GetNoAuthSectionTree = '/public/section/tree',
  CreateSection = '/section/create',
  UpdateSection = '/section/update',
  GetNoAuthSectionContent = '/public/section/get/content',
  SaveSectionArticle = '/section/save/article',
  BindSectionEntity = '/section/bind/entity',
  /**
   * file
   */
  GetQiniuFileCredential = '/file/getCredential',
  RemoveFile = '/file/remove',
  GetFileList = '/file/getList',
  GetFileByKey = '/file/get/key',
  /**
   * comment
   */
  CreateComment = '/comment/create',
  RemoveComment = '/comment/remove',
  GetOwnCommentList = '/comment/getOwnCommentList',
  GetNoAuthCommentByEntityId = '/public/comment/getCommentByEntityId',
  /**
   * star
   */
  CreateStar = '/star/create',
  CancelStar = '/star/cancel',
  GetMyStarList = '/star/getList/my',
  GetEntityStarList = '/star/getEntityStarList',
  /**
   * entity
   */
  GetEntityList = '/entity/getList',
  GetEntityById = '/entity/get/id',
  /**
   * user
   */
  LoginByName = '/account/loginByName',
  GetById = '/account/getById',
  GetUserProfileById = '/public/user/profile',
  RegisterByName = '/account/registerByName',
  /**
   * repository
   */
  CreateRepository = '/repository/create',
  // GetRepositoryList = '/repository/getList',
  // GetRepositoryById = '/repository/get/id',
  GetOwnRepositoryList = '/repository/getOwnList',
  getRepositoryBindEntityListInGraph = '/repository/getRepositoryEntityListInGraph',
  CheckIfUserOwnRepository = '/repository/checkIfUserOwnRepository',
  GetRepositoryEntityList = '/repository/getEntityList',
  BindToRepository = '/repository/bind/entity',
  // no.auth repository
  GetNoAuthRepositoryBindEntityList = '/public/repository/getBindEntityList',
  GetNoAuthRepositoryEntityList = '/public/repository/getList',
  GetNoAuthRepositoryById = '/public/repository/get/id',
  /**
   * tag
   */
  GetTagList = '/tag/getList',
  /**
   * nlp
   */
  ParseWord = '/nlp/parse/word',
  // domain
  GetDomainList = '/public/domain/getList',

  /**
   * follow
   */
  CheckIfFollowed = '/follow/checkIfFollowed',
  Follow = '/follow/create',
  UnFollow = '/follow/stop'
}
