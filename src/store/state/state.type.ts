import { ToolbarState } from '@/types/toolbar';
import {
  KnowledgeEdgeResponseType,
  SectionResponseType
} from 'edu-graph-constant';
import { RepositoryEditStateType } from '../repository.edit.module';
import { UserStateType } from '../user.module';

export type StateType = {
  toolbarState: ToolbarState;
  activeElementIdList: string[];
  sectionTree: SectionResponseType[];
  repositoryEntityList: any[];
  sectionContent: string;
  sectionArticleTitle: string;
  selectedEntityId: string;
  repositoryEdgeList: any[];
  knowledgeList: any[];
}
