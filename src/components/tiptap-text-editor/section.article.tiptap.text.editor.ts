/**
 * @author songxiwen
 * @date  2022/1/11 10:38
 */

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Range } from '@tiptap/core';
import { JSONContent } from '@tiptap/vue-3';
import { message, Modal } from 'ant-design-vue';
import { EntityCompletelyListItemType } from 'metagraph-constant';
import { EditorView } from 'prosemirror-view';
import { createVNode } from 'vue';
import { SectionTreeService } from '@/views/repository-editor/section-tree/section.tree';
import { AbstractTiptapTextEditor } from '@/components/tiptap-text-editor/abstract.tiptap.text.editor';
import {
  RepositoryNoAuthApiService, SectionApiService, SectionNoAuthApiService
} from '@/api.service';

export class SectionArticleTiptapTextEditor extends AbstractTiptapTextEditor {
  limit = 1000;

  private sectionId?: string;

  constructor(
    private readonly repositoryEntityId: string,
    protected readonly editable: boolean
  ) {
    super(repositoryEntityId, 'Repository');
  }

  private repositoryEntityList?: EntityCompletelyListItemType[];

  handleClick(view: EditorView, pos: number, event: MouseEvent): void {
    // todo
  }

  /**
   * 改变section节点
   * @param sectionId
   */
  async updateSection(sectionId: string, isEditable: boolean): Promise<void> {
    // editable 的情况下更新section 之前先保存之前的section
    if (isEditable && this.editor.value?.getJSON() && this.editor.value?.getHTML()) {
      await this.save({
        content: this.editor.value?.getJSON(),
        contentHtml: this.editor.value?.getHTML()
      });
    }
    // 更新section id
    this.sectionId = sectionId;
    // 更新section 内容
    await this.getContent(sectionId);
  }

  private async getContent(sectionId: string): Promise<void> {
    const result = await SectionNoAuthApiService.getSectionArticle({ sectionId });
    if (result.data) {
      this.setContent(JSON.parse(result.data.article.content));
    }
  }

  protected async save(params: {
    content: JSONContent,
    contentHtml: string
  }): Promise<boolean> {
    // eslint-disable-next-line no-return-await
    return await this.handleSaveSectionArticle(params);
  }

  async saveContent(params: {
    content: JSONContent,
    contentHtml: string
  }): Promise<boolean> {
    // eslint-disable-next-line no-return-await
    return await this.save(params);
  }

  private async getRepositoryBindList(): Promise<void> {
    const result = await RepositoryNoAuthApiService
      .getRepositoryBindEntityList(this.repositoryEntityId);
    if (result.data) {
      this.repositoryEntityList = result.data;
    }
  }

  async initData(params: { sectionId: string }): Promise<void> {
    this.sectionId = params.sectionId;
    await this.getRepositoryBindList();
    this.setMentionKnowledgeList(this.repositoryEntityList ?? []);
  }

  private async handleSaveSectionArticle(params: {
    content: JSONContent,
    contentHtml: string
  }): Promise<boolean> {
    if (!this.sectionId) {
      return false;
    }
    const result = await SectionApiService.saveSectionArticle({
      ...params,
      sectionId: this.sectionId
    });
    if (result.code !== 0) {
      message.error('文章保存失败！');
      return false;
    }
    return true;
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
        that.success(params.range, {
          id: params.id,
          name: params.name
        });
        if (that.sectionId) {
          await SectionApiService.bindSectionEntity({
            entityId: params.id,
            entityType: 'Knowledge',
            repositoryEntityId: that.repositoryEntityId,
            sectionId: that.sectionId
          });
          if (!that.editor.value?.getJSON() || !that.editor.value?.getHTML()) {
            throw new Error('cannot get editor content');
          }
          await that.save({
            content: that.editor.value?.getJSON(),
            contentHtml: that.editor.value?.getHTML()
          });
          const sectionTreeService = new SectionTreeService();
          // 刷新一下section tree
          await sectionTreeService.getSectionTree(that.repositoryEntityId, that.sectionId);
        }
      },
      async onCancel() {
        const json = that.fail(params.range, {
          id: params.id,
          name: params.name
        });
        if (json) {
          await that.save({
            content: json,
            contentHtml: params.contentHtml
          });
        }
      },
    });
  }
}
