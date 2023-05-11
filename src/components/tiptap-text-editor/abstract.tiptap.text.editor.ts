/**
 * @author songxiwen
 * @date  2021/12/7 21:42
 */

import { Editor as CoreEditor, Range } from '@tiptap/core';
import { EntityCompletelyListItemType, KnowledgeModelType, } from '@metagraph/constant';
import { Node as ProsemirrorNode } from '@tiptap/pm/model';
import { EditorView } from '@tiptap/pm/view';
import CharacterCount from '@tiptap/extension-character-count';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';
import { Editor, JSONContent, useEditor, VueNodeViewRenderer, VueRenderer, } from '@tiptap/vue-3';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import tippy, { Instance } from 'tippy.js';
import { Ref } from 'vue';
import { debounce } from 'lodash';
import { lowlight } from 'lowlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { FontSize } from '@/components/tiptap-text-editor/controls/font.size.extension';
import { Transaction } from '@tiptap/pm/state';
import MentionList from './components/mention-list.vue';
import { CustomMention } from './components/tiptap.custom.mention';
import CodeBlockContainer from './components/code-block-container.vue';
import TableOfContent from './components/table.of.content';
import Indent from './extensions/indent';
import LineHeight from './extensions/line-height';

export abstract class AbstractTiptapTextEditor {
  editor!: Ref<Editor | undefined>;

  // 可引用知识点列表
  mentionKnowledgeList!: EntityCompletelyListItemType[];

  // 字数限制
  protected abstract limit?: number;

  // 是否可编辑
  protected abstract editable: boolean;

  /**
   * 保存文本
   * @param params
   * @protected
   */
  protected abstract saveToIndexDB(params: {
    content: JSONContent,
    contentHtml: string
  }): Promise<void>;

  /**
   * 初始化异步数据
   */
  abstract initData(params?: { [key: string]: any }): void;

  /**
   * 引用知识点
   * @param params
   */
  abstract handleMention(params: {
    name: string,
    id: string,
    content: JSONContent,
    contentHtml: string,
    range: Range
  }): void;

  /**
   * 点击mention元素
   * @param params
   */
  abstract handleClickMentionItem(params: {
    id: string;
    name: string
  }): void;

  /**
   * 更新数据
   * @param content
   */
  setContent(content?: JSONContent): void {
    if (!this.editor?.value) {
      return;
    }
    if (content) {
      this.editor.value?.commands.setContent(content);
    } else {
      this.editor.value?.commands.setContent(null);
    }
  }

  /**
   * 创建引用
   * @param range
   * @param customCommandProps
   */
  handleMentionedSuccess(range: Range, customCommandProps: {
    id: string,
    name: string
  }): undefined | JSONContent {
    if (!this.editor?.value) {
      return undefined;
    }
    this.editor?.value
      .chain()
      .focus()
      .insertContentAt(range, [
        {
          type: 'mention',
          attrs: {
            name: customCommandProps.name,
            id: customCommandProps.id,
            count: 12,
            label: customCommandProps.name
          }
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
  handleMentionFailed(range: Range, customCommandProps: {
    id: string,
    name: string
  }): undefined | JSONContent {
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
   * 设置可引用实体数组
   * @param entityList
   */
  setMentionKnowledgeList(entityList: EntityCompletelyListItemType[]): void {
    this.mentionKnowledgeList = entityList;
  }

  /**
   * 初始化编辑器对象
   */
  initEditorInstance(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    this.editor = useEditor({
      editable: this.editable,
      onUpdate: debounce((params: {
        editor: CoreEditor;
        transaction: Transaction
      }) => {
        // 当内容更新后，持久化数据到本地
        if (params.editor.getHTML() && params.editor.getJSON()) {
          _this.saveToIndexDB({
            content: params.editor.getJSON(),
            contentHtml: params.editor.getHTML()
          }).then();
        }
      }, 1000),
      onTransaction(params: { editor: CoreEditor, transaction: Transaction }) {
        // todo
      },
      editorProps: {
        handleClickOn(
          view: EditorView,
          pos: number,
          node: ProsemirrorNode
        ) {
          if (node.type.name === 'mention') {
            _this.handleClickMentionItem({
              ...node.attrs
            } as {
              id: string, name: string
            });
          }
          return true;
        },
      },
      extensions: [

        StarterKit,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        TextStyle,
        Image,
        CharacterCount.configure({
          limit: _this.limit ?? 30000,
        }),
        Placeholder.configure({
          placeholder: ({ node }) => {
            if (node.type.name === 'heading') {
              return '请输入标题...';
            }
            return '请输入内容...';
          },
        }),
        TaskList,
        TaskItem.extend({
          // content: 'inline*',
          nested: true,
        }),
        TableOfContent,
        FontSize,
        CodeBlockLowlight
          .extend({
            addNodeView() {
              return VueNodeViewRenderer(CodeBlockContainer);
            },
          })
          .configure({ lowlight }),
        CustomMention.configure({
          HTMLAttributes: {
            class: 'mention',
          },
          suggestion: {
            items: (params: { query: string }) => _this.mentionKnowledgeList
              .filter(
                (item: EntityCompletelyListItemType) => (item.content as KnowledgeModelType)
                  .name.includes(params.query)
              ) || [],
            render: () => {
              let component: VueRenderer;
              let popup: Instance[];
              return {
                onStart: (suggestionProps: SuggestionProps) => {
                  if (_this.editor?.value) {
                    component = new VueRenderer(MentionList, {
                      editor: suggestionProps.editor,
                      props: suggestionProps,
                    });
                  }
                  if (!suggestionProps.clientRect) {
                    return;
                  }
                  popup = tippy('body', {
                    getReferenceClientRect: suggestionProps.clientRect as () => DOMRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                  });
                },
                onUpdate(suggestionProps: SuggestionProps) {
                  if (!suggestionProps.clientRect) {
                    return;
                  }
                  component.updateProps(suggestionProps);
                  popup[0].setProps({
                    getReferenceClientRect: suggestionProps.clientRect as () => DOMRect,
                  });
                },
                onKeyDown(suggestionProps: SuggestionKeyDownProps) {
                  return component.ref?.onKeyDown(suggestionProps) as boolean;
                },
                onExit() {
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
        }),
        Indent,
        LineHeight
      ]
    });
  }

  /**
   * 销毁编辑器对象
   */
  destroy(): void {
    this.editor.value?.destroy();
  }
}
