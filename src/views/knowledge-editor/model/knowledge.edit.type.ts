/**
 * @author songxiwen
 * @date  2022/5/4 23:41
 */
import { KnowledgePictureType } from '@metagraph/constant';

export type KnowledgeBaseFormType = {
  name: string;
  knowledgeBaseTypeId: string;
  domain: {
    domainBaseTypeId: string;
    domainName?: string;
    domainId: string;
  }[];
  repositoryEntityId: string;
  author: string;
  tagList: { label: string, value: string }[];
}

// 知识点概念图册
export type KnowledgePicturesFrontendType = KnowledgePictureType & {
  // 非业务字段，是ant design 约定的字段
  uid: string;
  url: string;
  fileKey: string;
  isCover?: boolean;
  name?: string;
  size?: number;
}
