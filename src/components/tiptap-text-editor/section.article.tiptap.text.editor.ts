/**
 * @author songxiwen
 * @date  2022/1/11 10:38
 */

import { knowledgeDrawerState } from '@/business';
import { IndexdbService } from '@/service/indexdb.service';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Range } from '@tiptap/core';
import { JSONContent } from '@tiptap/vue-3';
import { Modal } from 'ant-design-vue';
import { EntityCompletelyListItemType } from '@metagraph/constant';
import { createVNode } from 'vue';
import {
  SectionTreeService
} from '@/views/repository-editor/model/section.tree';
import { AbstractTiptapTextEditor } from '@/components/tiptap-text-editor/abstract.tiptap.text.editor';

export class SectionArticleTiptapTextEditor extends AbstractTiptapTextEditor {
  protected limit = 10000;

  // 当前section
  private sectionId?: string;

  constructor(
    private readonly repositoryEntityId: string,
    protected readonly editable: boolean,
    private readonly sectionTreeService: SectionTreeService
  ) {
    super();
  }

  /**
   * 将section内容更新到本地(更新频率较快，所以持久化到本地)
   * @param params
   * @protected
   */
  protected async saveToIndexDB(params: {
    content: JSONContent,
    contentHtml: string
  }): Promise<void> {
    if (this.sectionId) {
      await IndexdbService.getInstance()
        .update('repository', this.sectionId, {
          content: params.contentHtml,
        });
    }
  }

  /**
   * 在改变section前保存上一个section的内容
   * @param params
   */
  async saveSectionContentBeforeUpdate(params: {
    sectionId: string,
    isEditable: boolean,
    sectionName?: string
  }): Promise<void> {
    // editable 的情况下更新section 之前先保存之前的section
    if (params.isEditable && this.editor.value?.getJSON() && this.editor.value?.getHTML()) {
      if (this.sectionId) {
        await this.sectionTreeService.saveSectionArticle({
          sectionId: this.sectionId,
          content: this.editor.value?.getJSON(),
          contentHtml: this.editor.value?.getHTML()
        });
        await IndexdbService.getInstance()
          .put('repository', {
            id: this.sectionId,
            name: params.sectionName ?? '',
            content: this.editor.value?.getHTML(),
            sectionId: this.sectionId,
            repositoryEntityId: this.repositoryEntityId
          });
      }
    }
    // 更新section id
    this.updateCurrentSectionId(params.sectionId);
  }

  /**
   * 更新当前的选中的section id
   * @param sectionId
   */
  updateCurrentSectionId(sectionId?: string): void {
    // 更新section id
    this.sectionId = sectionId;
  }

  /**
   * 初始化异步数据
   * @param params
   */
  async initData(params: {
    sectionId: string,
    repositoryEntityList: EntityCompletelyListItemType[]
  }): Promise<void> {
    this.sectionId = params.sectionId;
    this.setMentionKnowledgeList(params.repositoryEntityList);
  }

  handleMention(params: {
    name: string;
    id: string;
    content: JSONContent;
    contentHtml: string;
    range: Range
  }): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    Modal.confirm({
      title: '是否绑定知识点至当前单元?',
      okText: '确定',
      cancelText: '取消',
      icon: createVNode(ExclamationCircleOutlined),
      content: '',
      async onOk() {
        that.handleMentionedSuccess(params.range, {
          id: params.id,
          name: params.name
        });
        if (that.sectionId) {
          await that.sectionTreeService.bindSectionEntity({
            entityId: params.id,
            entityType: 'Knowledge',
            repositoryEntityId: that.repositoryEntityId,
            sectionId: that.sectionId
          });
          if (!that.editor.value?.getJSON() || !that.editor.value?.getHTML()) {
            throw new Error('cannot get editor content');
          }
          // 保存section article
          await that.sectionTreeService.saveSectionArticle({
            sectionId: that.sectionId,
            content: that.editor.value?.getJSON(),
            contentHtml: that.editor.value?.getHTML()
          });
          const sectionTreeService = new SectionTreeService();
          // 刷新一下section tree
          await sectionTreeService.getSectionTree(that.repositoryEntityId, that.sectionId);
        }
      },
      async onCancel() {
        const json = that.handleMentionFailed(params.range, {
          id: params.id,
          name: params.name
        });
        if (json && that.sectionId) {
          // 保存section article
          await that.sectionTreeService.saveSectionArticle({
            sectionId: that.sectionId,
            content: json,
            contentHtml: params.contentHtml
          });
        }
      },
    });
  }

  handleClickMentionItem(params: { id: string; name: string }): void {
    knowledgeDrawerState.type = 'published';
    knowledgeDrawerState.entityId = params.id;
    knowledgeDrawerState.isShow = true;
  }
}
