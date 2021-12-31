/**
 * @author songxiwen
 * @date  2021/12/8 15:12
 */

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { EntityCompletelyListItemType } from 'metagraph-constant';
import { EditorView } from 'prosemirror-view';
import { Range } from '@tiptap/core';
import { message, Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { edges } from '@/views/knowledge-edit/model/knowledge.edit';
import {
  EdgeApiService,
  KnowledgeApiService,
  KnowledgeNoAuthApiService,
  RepositoryNoAuthApiService
} from '@/api.service';
import { AbstractTiptapTextEditor } from './abstract.tiptap.text.editor';

export class KnowledgeTiptapTextEditor extends AbstractTiptapTextEditor {
  limit = 300;

  constructor(
    private readonly repositoryEntityId: string,
    private readonly knowledgeEntityId: string,
  ) {
    super();
  }

  private repositoryEntityList?: EntityCompletelyListItemType[];

  handleClick(view: EditorView, pos: number, event: MouseEvent): void {
    console.log('click', view, pos, event);
  }

  protected async save(params: {
    content: Record<string, any>,
    contentHtml: any
  }): Promise<void> {
    await this.handleSaveSectionArticle(params);
  }

  private async createEdge(params: {
    id: string,
    name: string
  }): Promise<void> {
    const result = await EdgeApiService.create({
      originKnowledgeEntityId: params.id,
      knowledgeEntityId: this.knowledgeEntityId,
      targetKnowledgeEntityId: this.knowledgeEntityId,
      edgeRepositoryEntityId: this.repositoryEntityId,
      description: `From ${params.name}`
    });
    if (!result.message) {
      console.log('success');
    }
    if (result.message) {
      message.warn(result.message);
    }
  }

  private async getRepositoryBindList(): Promise<void> {
    const result = await RepositoryNoAuthApiService
      .getRepositoryBindEntityList(this.repositoryEntityId);
    if (result.data) {
      this.repositoryEntityList = result.data;
    }
  }

  async initData(): Promise<void> {
    await this.getRepositoryBindList();
    this.setMentionKnowledgeList(this.repositoryEntityList ?? []);
  }

  private async findEdgesByKnowledgeEntityId(): Promise<void> {
    const result = await KnowledgeNoAuthApiService.findEdgesByKnowledgeEntityId({
      knowledgeEntityId: this.knowledgeEntityId,
      repositoryEntityId: this.repositoryEntityId
    });
    if (result.data) {
      edges.target = result.data;
    }
  }

  private async handleSaveSectionArticle(params: {
    content: Record<string, any>,
    contentHtml: any
  }): Promise<void> {
    const result = await KnowledgeApiService.saveDescription({
      description: JSON.stringify(params.content),
      descriptionHTML: params.contentHtml,
      entityId: this.knowledgeEntityId
    });
    if (!result.message) {
      console.log('save article success');
    }
  }

  handleMention(params: {
    name: string;
    id: string;
    content: any;
    contentHtml: string;
    range: Range
  }): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const entity = edges.target?.preInnerList?.find((item) => item.entity.id === params.id);
    console.log(entity, '-------- entity', params.id);
    if (entity) {
      that.success(params.range, {
        id: params.id,
        name: params.name
      });
      return;
    }
    Modal.confirm({
      zIndex: 100000,
      title: `是否设置知识点${params.name}为前置知识点?`,
      icon: createVNode(ExclamationCircleOutlined),
      content: '',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        that.success(params.range, {
          id: params.id,
          name: params.name
        });
        const result = await that.createEdge({
          id: params.id,
          // 这个参数应该取消
          name: ''
        });
        await that.findEdgesByKnowledgeEntityId();
        await that.handleSaveSectionArticle({
          content: params.content,
          contentHtml: params.contentHtml
        });
      },
      async onCancel() {
        that.fail(params.range, {
          id: params.id,
          name: params.name
        });
        await that.handleSaveSectionArticle({
          content: params.content,
          contentHtml: params.contentHtml
        });
      },
    });
  }
}
