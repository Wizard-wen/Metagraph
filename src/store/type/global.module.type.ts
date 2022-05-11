/**
 * @author songxiwen
 * @date  2021/9/15 00:01
 */

type GuideType = {
  status: 'done' | 'doing' | 'not-start';
  step?: number;
}

export type GlobalModuleType = {
  isSpinning: boolean;
  guide: {
    homepage: GuideType;
    repositorySectionEditor: GuideType;
    repositoryGraphEditor: GuideType;
    knowledgeEditor: GuideType;
  }
};
