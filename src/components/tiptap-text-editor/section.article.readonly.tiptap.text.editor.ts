/**
 * @author songxiwen
 * @date  2022/5/19 00:47
 */
import { knowledgeDrawerState } from '@/business';
import { AbstractTiptapTextEditor } from '@/components/tiptap-text-editor/abstract.tiptap.text.editor';
import type { EntityCompletelyListItemType } from 'metagraph-constant';

export class SectionArticleReadonlyTiptapTextEditor extends AbstractTiptapTextEditor {
  protected editable = false;

  // 当前section
  private sectionId?: string;

  handleClickMentionItem(params: { id: string; name: string }): void {
    knowledgeDrawerState.type = 'published';
    knowledgeDrawerState.entityId = params.id;
    knowledgeDrawerState.isShow = true;
  }

  handleMention(): void {
    return undefined;
  }

  /**
   * 更新当前的选中的section id
   * @param sectionId
   */
  updateCurrentSectionId(sectionId?: string): void {
    // 更新section id
    this.sectionId = sectionId;
  }

  initData(params: {
    sectionId: string,
    repositoryEntityList: EntityCompletelyListItemType[]
  }): void {
    this.sectionId = params.sectionId;
    this.setMentionKnowledgeList(params.repositoryEntityList);
  }

  protected saveToIndexDB(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
