/**
 * @author wizard.song
 * @date 2021/09/12 23:36
 */

export enum ApiPathEnum {
  /**
   * knowledge
   */
  // SaveKnowledgeDescription = '/knowledge/save/description',
  // CheckCustomKnowledgeFormField = '/knowledge/checkField',
  // AddCustomKnowledgeFormField = '/knowledge/addField',
  // RemoveCustomKnowledgeFormField = '/knowledge/removeField',
  // SaveCustomKnowledgeFormFields = '/knowledge/saveFields',
  // // 获取知识点
  // GetNoAuthKnowledgeById = '/public/knowledge/get',
  // GetNoAuthKnowledgePath = '/public/knowledge/getPath',
  // // 获取引用当前知识点的知识点列表
  // GetNoAuthKnowledgeMentionedList = '/public/knowledge/getMentionedList',
  // // 带分页的知识点列表
  // GetNoAuthKnowledgeList = '/public/knowledge/getList',
  // // 获取某个知识点的前置、导出知识点
  // GetNoAuthEdgesByKnowledgeEntityId = '/public/knowledge/findEdgesByKnowledgeEntityId',
  // // 仓库绑定的知识点
  // GetNoAuthKnowledgeListByRepositoryEntityId = '/public/knowledge/getList/repositoryEntityId',
  // GetAlternativeKnowledgeList = '/knowledge/getAlternativeKnowledgeList',
  // CreateMultipleAlternativeKnowledge = '/knowledge/createMultipleAlternativeKnowledge',
  // RemoveAlternativeKnowledge = '/knowledge/removeAlternativeKnowledge',
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
  GetNoAuthNormalSectionTree = '/public/section/tree/normal',
  CreateSection = '/section/create',
  UpdateSection = '/section/update',
  RemoveSection = '/section/remove',
  GetNoAuthSectionContent = '/public/section/get/content',
  SaveSectionArticle = '/section/save/article',
  BindSectionEntity = '/section/bind/entity',
  /**
   * file
   */
  // GetQiniuFileCredential = '/public/file/getCredential',
  // RemoveFile = '/public/file/remove',
  // GetFileList = '/public/file/getList',
  // GetFileByKey = '/public/file/get/key',
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
  GetEntityStaredUserList = '/public/star/getEntityStaredUserList',
  GetUserStarList = '/public/star/getList/user',
  // GetEntityStarDetailList = '/public/star/getEntityStarDetailList',
  /**
   * entity
   */
  GetEntityList = '/entity/getList',
  GetEntityById = '/public/entity/get/id',
  GetEntityListByEntityType = '/public/entity/getListByEntityType',
  GetSearchEntityList = '/public/entity/getSearchList',
  /**
   * user
   */

  SendBindEmailCode = '/account/sendBindMailCode',
  BindEmail = '/account/bindEmail',
  UnbindEmail = '/account/unbindEmail',
  GetById = '/account/getById',
  LoginByName = '/public/user/loginByName',
  LoginByEmail = '/public/user/loginByEmail',
  UpdatePassword = '/account/updatePassword',
  GetUserBindEmail = '/account/getUserBindEmail',
  UpdateUser = '/account/updateUser',
  RegisterByName = '/public/user/registerByName',
  GetPublicUserById = '/public/user/getById',
  SendRegisterEmailCode = '/public/user/sendMailCode',
  RegisterByEmail = '/public/user/registerByEmail',
  ResetPasswordByEmail = '/public/user/resetPasswordByEmail',
  CheckIfUserExists = '/public/user/check/nickname',
  /**
   * repository
   */
  CreateRepository = '/repository/create',
  UpdateRepository = '/repository/update',
  RemoveRepository = '/repository/remove',
  GetRepositoryByEntityId = '/repository/getModelByEntityId',
  BindToRepository = '/repository/bind/entity',
  UnbindFromRepository = '/repository/unbind/entity',
  // CheckIfUserOwnRepository = '/repository/checkIfUserOwnRepository',
  GetOwnRepositoryList = '/repository/getOwnList',
  // GetRepositoryList = '/repository/getList',

  // getRepositoryBindEntityListInGraph = '/repository/getRepositoryEntityListInGraph',

  // GetRepositoryEntityList = '/repository/getEntityList',
  CloneRepository = '/repository/clone',
  GetCloneRepositoryStatus = '/repository/getCloneStatus',
  GetRepositoryUsingEntity = '/repository/getUsingEntity',

  // no.auth repository
  GetNoAuthRepositoryBindEntityList = '/public/repository/getBindEntityList',
  GetNoAuthRepositoryEntityList = '/public/repository/getList',
  GetNoAuthHotRepositoryEntityList = '/public/repository/get/hotList',
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
  GetDomainBaseTypeList = '/public/domain/baseType/getList',
  /**
   * follow
   */
  CheckIfFollowed = '/follow/checkIfFollowed',
  Follow = '/follow/create',
  UnFollow = '/follow/stop',
  GetFollowCount = '/public/follow/getFollowCount',
  GetFollowerList = '/public/follow/getFollowerList',
  GetFollowedList = '/public/follow/getFollowedList',
  /**
   * error detail
   */
  CreateErrorDetail = '/system/errorDetail/create',
  /**
   * activity
   */
  GetActivityList = '/activity/getList'
}
