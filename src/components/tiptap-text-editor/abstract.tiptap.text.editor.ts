/**
 * @author songxiwen
 * @date  2021/12/7 21:42
 */

import { Range, Editor as CoreEditor } from '@tiptap/core';
import { EntityCompletelyListItemType, KnowledgeModelType } from 'metagraph-constant';
import { EditorView } from 'prosemirror-view';
import CharacterCount from '@tiptap/extension-character-count';
import Document from '@tiptap/extension-document';
import Image from '@tiptap/extension-image';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import StarterKit from '@tiptap/starter-kit';
import { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';
import {
  Editor, JSONContent, useEditor, VueRenderer
} from '@tiptap/vue-3';
import tippy, { Instance } from 'tippy.js';
import { Ref } from 'vue';
import { tiptapInitData } from '@/store/constant';
import MentionList from '@/views/repository-editor/tiptap/mention.list.vue';
import { CustomMention } from './tiptap.custom.mention';
import VueComponent from '@/test.components/tiptap-demo/custom-tiptap-node/extention';

export abstract class AbstractTiptapTextEditor {
  editor!: Ref<Editor | undefined>;

  timer?: number;

  mentionKnowledgeList!: EntityCompletelyListItemType[];

  protected abstract limit?: number;

  /**
   * 保存文本
   * @param params
   * @protected
   */
  protected abstract save(params: {
    content: any,
    contentHtml: string
  }): void;

  /**
   * 响应点击事件
   * @param view
   * @param pos
   * @param event
   */
  abstract handleClick(view: EditorView, pos: number, event: MouseEvent): void;

  /**
   * 初始化数据
   */
  abstract initData(): void;

  /**
   * 引用知识点
   * @param params
   */
  abstract handleMention(params: {
    name: string,
    id: string,
    content: any,
    contentHtml: string,
    range: Range
  }): void;

  /**
   * 更新数据
   * @param content
   */
  setContent(content: JSONContent): void {
    if (!this.editor?.value) {
      return;
    }
    this.editor.value?.commands.setContent(content);
  }

  /**
   * 创建引用
   * @param range
   * @param customCommandProps
   */
  success(range: Range, customCommandProps: {
    id: string,
    name: string
  }): undefined | Record<string, any> {
    if (!this.editor?.value) {
      return undefined;
    }
    this.editor?.value
      .chain()
      .focus()
      .insertContentAt(range, [
        {
          type: 'mention',
          attrs: { name: customCommandProps.name, id: customCommandProps.id }
        },
        {
          type: 'text',
          text: ' ',
        },
      ])
      .run();
    return this.editor.value.getJSON();
  }

  /**
   * 不创建引用，只创建普通字符串
   * @param range
   * @param customCommandProps
   */
  fail(range: Range, customCommandProps: {
    id: string,
    name: string
  }): undefined | Record<string, any> {
    if (!this.editor?.value) {
      return undefined;
    }
    this.editor?.value
      .chain()
      .focus()
      .insertContentAt(range, [
        {
          type: 'text',
          text: customCommandProps.name,
        },
      ])
      .run();
    return this.editor?.value.getJSON();
  }

  /**
   * 可引用字符串
   * @param entityList
   */
  setMentionKnowledgeList(entityList: EntityCompletelyListItemType[]): void {
    this.mentionKnowledgeList = entityList;
  }

  /**
   * 初始化编辑器
   * @param articleContent
   */
  initEditor(articleContent?: JSONContent): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;

    this.editor = useEditor({
      editable: true,
      content: articleContent ?? tiptapInitData,
      editorProps: {
        handleClick: (view: EditorView, pos: number, event: MouseEvent) => {
          console.log(view, pos, event);
          _this.handleClick(view, pos, event);
          return true;
        }
      },
      extensions: [
        Document,
        Paragraph,
        StarterKit,
        Image,
        Text,
        VueComponent,
        CharacterCount.configure({
          limit: _this.limit ?? 30000,
        }),
        CustomMention.configure({
          HTMLAttributes: {
            class: 'mention',
          },
          suggestion: {
            items: (params: { query: string }) => {
              console.log(params.query);
              return _this.mentionKnowledgeList
                .filter(
                  (item: EntityCompletelyListItemType) => (item.content as KnowledgeModelType)
                    .name.includes(params.query)
                ) || [];
            },
            render: () => {
              let component: VueRenderer;
              let popup: Instance[];
              return {
                onStart: (suggestionProps: SuggestionProps) => {
                  if (_this.editor?.value) {
                    component = new VueRenderer(MentionList, {
                      editor: _this.editor?.value,
                      props: suggestionProps,
                    });
                  }
                  popup = tippy('body', {
                    getReferenceClientRect: suggestionProps.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                  });
                },
                onUpdate(suggestionProps: SuggestionProps) {
                  component.updateProps(suggestionProps);
                  popup[0].setProps({
                    getReferenceClientRect: suggestionProps.clientRect,
                  });
                },
                onKeyDown(suggestionProps: SuggestionKeyDownProps) {
                  return component.ref?.onKeyDown(suggestionProps) as boolean;
                },
                onExit(suggestionProps: SuggestionProps) {
                  console.log('exits ------- ', suggestionProps);
                  popup[0].destroy();
                  component.destroy();
                },
              };
            },
            command: (commandProps: {
              props: { id: string, name: string },
              range: Range,
              editor: CoreEditor,
            }) => {
              console.log(commandProps);
              const { range } = commandProps;
              const customCommandProps = commandProps.props;
              const coreEditor = commandProps.editor;
              _this.handleMention({
                name: customCommandProps.name,
                id: customCommandProps.id,
                content: coreEditor.getJSON(),
                contentHtml: coreEditor.getHTML(),
                range
              });
            },
          },
        })
      ]
    });
    this.timer = setInterval(() => {
      if (this.editor.value?.getHTML()) {
        this.save({
          content: this.editor.value?.getJSON(),
          contentHtml: this.editor.value?.getHTML()
        });
      }
    }, 10000);
  }

  /**
   * 销毁编辑器
   */
  destroy(): void {
    this.editor.value?.destroy();
    if (this.timer) {
      window.clearInterval(this.timer);
    }
  }
}
