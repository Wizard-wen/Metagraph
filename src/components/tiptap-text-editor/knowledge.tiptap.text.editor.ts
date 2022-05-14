/**
 * @author songxiwen
 * @date  2021/12/8 15:12
 */

import { knowledgeDrawerState } from '@/business';
import { IndexdbService } from '@/service/indexdb.service';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { JSONContent } from '@tiptap/vue-3';
import { EditorView } from 'prosemirror-view';
import { Range } from '@tiptap/core';
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import {
  KnowledgeEdit,
  mentionedKnowledge, repositoryEntityList
} from '@/views/knowledge-edit/model/knowledge.edit';
import { AbstractTiptapTextEditor } from './abstract.tiptap.text.editor';

export class KnowledgeTiptapTextEditor extends AbstractTiptapTextEditor {
  limit = 600;

  editable = true;

  private knowledgeEdit = new KnowledgeEdit();

  constructor(
    private readonly params: {
      repositoryEntityId: string,
      // 只有正式发布后才有entity id
      knowledgeEntityId: string,
      hasPublished: boolean
    }
  ) {
    super(params.knowledgeEntityId, 'Knowledge');
  }

  handleClick(view: EditorView, pos: number, event: MouseEvent): void {
    console.log('click', view, pos, event);
  }

  protected async save(params: {
    content: JSONContent,
    contentHtml: string
  }): Promise<boolean> {
    console.log('do save---');
    const result = await IndexdbService.getInstance()
      .update(
        'knowledge',
        this.params.knowledgeEntityId,
        {
          description: params.contentHtml
        }
      );
    return !!result;
  }

  async initData(): Promise<void> {
    this.setMentionKnowledgeList(repositoryEntityList.value ?? []);
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
    const entity = mentionedKnowledge.list.find((item) => item.entity.id === params.id);
    if (entity) {
      // 如果已经绑定了知识点，就
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
        await that.knowledgeEdit.createDraftKnowledgeMention({
          id: params.id,
          repositoryEntityId: that.params.repositoryEntityId,
          knowledgeEntityId: that.params.knowledgeEntityId
        });
        await that.knowledgeEdit.getMentionedList(that.params.knowledgeEntityId);
        if (that.params.hasPublished) {
          await that.knowledgeEdit.findEdgesByKnowledgeEntityId({
            knowledgeEntityId: that.params.knowledgeEntityId,
            repositoryEntityId: that.params.repositoryEntityId
          });
        }
        await that.knowledgeEdit.handleSaveSectionArticle({
          content: params.content,
          contentHtml: params.contentHtml,
          knowledgeEntityId: that.params.knowledgeEntityId
        });
      },
      async onCancel() {
        that.fail(params.range, {
          id: params.id,
          name: params.name
        });
        await that.knowledgeEdit.handleSaveSectionArticle({
          content: params.content,
          contentHtml: params.contentHtml,
          knowledgeEntityId: that.params.knowledgeEntityId
        });
      },
    });
  }

  handleClickMentionItem(params: { id: string; name: string }): void {
    knowledgeDrawerState.type = 'published';
    knowledgeDrawerState.entityId = params.id;
    knowledgeDrawerState.isShow = true;
  }
}
