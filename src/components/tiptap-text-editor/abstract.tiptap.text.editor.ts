/**
 * @author songxiwen
 * @date  2021/12/7 21:42
 */

import { IndexdbService } from '@/service/indexdb.service';
import { Range, Editor as CoreEditor } from '@tiptap/core';
import {
  EntityCompletelyListItemType,
  KnowledgeModelType,
  PublicEntityType
} from 'metagraph-constant';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import CharacterCount from '@tiptap/extension-character-count';
import Image from '@tiptap/extension-image';
import StarterKit from '@tiptap/starter-kit';
import { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';
import {
  Editor, JSONContent, useEditor, VueNodeViewRenderer, VueRenderer,
} from '@tiptap/vue-3';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import tippy, { Instance } from 'tippy.js';
import { Ref } from 'vue';
import { lowlight } from 'lowlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { tiptapInitData } from '@/store/constant';
import MentionList from '@/components/tiptap-text-editor/mention.list.vue';
import { debounce } from 'lodash';
import { CustomMention } from './tiptap.custom.mention';
import CodeBlockContainer from './code-block-container.vue';

export abstract class AbstractTiptapTextEditor {
  editor!: Ref<Editor | undefined>;

  timer?: number;

  mentionKnowledgeList!: EntityCompletelyListItemType[];

  // eslint-disable-next-line no-useless-constructor
  protected constructor(
    private readonly entityId: string,
    private readonly entityType: PublicEntityType,
  ) {
  }

  protected abstract limit?: number;

  protected abstract editable: boolean;

  /**
   * 保存文本
   * @param params
   * @protected
   */
  protected abstract save(params: {
    content: JSONContent,
    contentHtml: string
  }): Promise<boolean>;

  /**
   * 初始化数据
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
   * 点击mention 元素
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
  fail(range: Range, customCommandProps: {
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
   * 初始化编辑器
   * @param articleContent
   */
  initEditor(articleContent?: JSONContent): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;

    this.editor = useEditor({
      editable: this.editable,
      content: articleContent ?? tiptapInitData,
      onUpdate: debounce(({
        editor
      }) => {
        if (_this.entityType === 'Knowledge') {
          IndexdbService.getInstance()
            .update(
              'knowledge',
              _this.entityId,
              {
                description: editor.getHTML()
              }
            )
            .then((data: number) => {
              console.log(data, '----- update by key down');
            });
        }
      }, 1000),
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
        Image,
        CharacterCount.configure({
          limit: _this.limit ?? 30000,
        }),
        TaskList,
        TaskItem.extend({
          // content: 'inline*',
          nested: true,
        }),
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
        })
      ]
    });
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
