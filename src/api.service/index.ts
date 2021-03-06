/**
 * @author wizard.song
 * @date 2021/04/10 23:52
 */

// todo 用ts类型约束接口文档，建立一个仓库
// authed api
export { FileApiService } from './file.api.service';
export { EntityNoAuthApiService } from './no.auth/entity.no.auth.api.service';
export { CommentApiService } from './comment.api.service';
export { EdgeApiService } from './auth/edge.api.service';
export { KnowledgeApiService } from './auth/knowledge.api.service';
export { RepositoryApiService } from './auth/repository.api.service';
export { SectionApiService } from './section.api.service';
export { StarApiService } from './star.api.service';
export { TagApiService } from './tag.api.service';
export { UserApiService } from './user.api.service';
export { EntityApiService } from './entity.api.service';
export { PlanApiService } from './plan.api.service';
// no.auth api
export { RepositoryNoAuthApiService } from './no.auth/repository.no.auth.api.service';
export { EdgeNoAuthApiService } from './no.auth/edge.no.auth.api.service';
export { KnowledgeNoAuthApiService } from './no.auth/knowledge.no.auth.api.service';
export { CommentNoAuthApiService } from './no.auth/comment.no.auth.api.service';
export { SectionNoAuthApiService } from './no.auth/section.no.auth.api.service';
export { DomainNoAuthApiService } from './no.auth/domain.no.auth.api.service';
export { UserNoAuthApiService } from './no.auth/user.no.auth.api.service';
