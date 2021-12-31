/**
 * @author wizard.song
 * @date 2021/09/12 23:36
 */

export enum ApiPathEnum {
  /**
   * knowledge
   */
  CreateKnowledge = '/knowledge/create',
  UpdateKnowledge = '/knowledge/update',
  RemoveKnowledge = '/knowledge/remove/id',
  SaveKnowledgeDescription = '/knowledge/save/description',
  CheckCustomKnowledgeFormField = '/knowledge/checkField',
  AddCustomKnowledgeFormField = '/knowledge/addField',
  RemoveCustomKnowledgeFormField = '/knowledge/removeField',
  SaveCustomKnowledgeFormFields = '/knowledge/saveFields',
  // 获取知识点
  GetNoAuthKnowledgeById = '/public/knowledge/get',
  // 获取引用当前知识点的知识点列表
  GetNoAuthKnowledgeMentionedList = '/public/knowledge/getMentionedList',
  // 带分页的知识点列表
  GetNoAuthKnowledgeList = '/public/knowledge/getList',
  // 获取某个知识点的前置、导出知识点
  GetNoAuthEdgesByKnowledgeEntityId = '/public/knowledge/findEdgesByKnowledgeEntityId',
  // 仓库绑定的知识点
  GetNoAuthKnowledgeListByRepositoryEntityId = '/public/knowledge/getList/repositoryEntityId',
  GetAlternativeKnowledgeList = '/knowledge/getAlternativeKnowledgeList',
  CreateAlternativeKnowledgeList = '/knowledge/createAlternativeKnowledgeList',
  RemoveAlternativeKnowledge = '/knowledge/removeAlternativeKnowledge',
  /**
   * edge
   */
  CreateKnowledgeEdge = 'knowledge/edge/create',
  RemoveKnowledgeEdge = 'knowledge/edge/remove',
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
  GetEntityStaredUserList = '/star/getEntityStaredUserList',
  // GetEntityStarDetailList = '/public/star/getEntityStarDetailList',
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
  GetPublicUserById = '/public/user/getById',
  SendRegisterEmailCode = '/public/user/sendEmailCode',
  RegisterByName = '/account/registerByName',
  UpdatePassword = '/account/updatePassword',
  /**
   * repository
   */
  CreateRepository = '/repository/create',
  UpdateRepository = '/repository/update',
  // GetRepositoryList = '/repository/getList',
  GetRepositoryByEntityId = '/repository/getRepositoryByEntityId',
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
  UpdateTag = '/tag/update',
  /**
   * nlp
   */
  ParseWord = '/nlp/parse/word',
  /**
   * domain
   */
  GetDomainList = '/public/domain/getList',
  GetDomainTree = '/public/domain/get/tree',
  /**
   * follow
   */
  CheckIfFollowed = '/follow/checkIfFollowed',
  Follow = '/follow/create',
  UnFollow = '/follow/stop'
}
