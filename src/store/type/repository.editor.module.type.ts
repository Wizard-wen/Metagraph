/**
 * @author songxiwen
 * @date  2021/9/14 23:29
 */

import { Addon, Graph } from '@antv/x6';
import type { EntityCompletelyListItemType, SectionResponseType } from 'edu-graph-constant';
import { ToolbarState } from '@/types/toolbar';

type KnowledgePreExtendEntityTreeNodeType = {
  id: string;
  label: string;
} & EntityCompletelyListItemType

export type RepositoryEditorStateType = {
  editable?: boolean;
  toolbarState: ToolbarState;

  repositoryEntityList: EntityCompletelyListItemType[];
  // section tree
  sectionTree: SectionResponseType[];
  // section对应的文章实体
  sectionArticleContent: any;
  // section对应的文章标题
  sectionArticleTitle: string;
  // 当前选中的section key(id)
  selectedTreeNode: string[];
  // 当前选中的tree node keys中属于section的部分
  selectedTreeNodeSectionKeys: string[],
  // 当前选中的tree node keys中属于entity的部分
  selectedTreeNodeEntityKeys: string[],
  // 仓库中当前选中的实体（知识点）id
  selectedEntityId: string;
  // 仓库中选中实体（知识点）详情
  selectedEntityDetail: any;
  // 选中知识点位于仓库内的前置知识点列表
  preInnerKnowledgeList?: KnowledgePreExtendEntityTreeNodeType[],
  // 选中知识点位于仓库外的前置知识点列表
  preOuterKnowledgeList?: KnowledgePreExtendEntityTreeNodeType[],
  // 选中知识点位于仓库外的导出知识点列表
  extendInnerKnowledgeList?: KnowledgePreExtendEntityTreeNodeType[],
  // 选中知识点位于仓库外的导出知识点列表
  extendOuterKnowledgeList?: KnowledgePreExtendEntityTreeNodeType[],
  // antV graph实例
  graph: {
    graph?: Graph,
    dnd?: Addon.Dnd
  }
  // 仓库内知识边列表，graph
  repositoryEdgeList: any[];
  // 仓库内知识点列表，graph
  knowledgeList: EntityCompletelyListItemType[];
}
