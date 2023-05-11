import type { Editor } from '@tiptap/core';
import { ChainedCommands, Extension, UnionCommands } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    formatClear: {
      formatClear: () => ReturnType;
    };
  }
}

const FormatClear = Extension.create({
  name: 'formatClear',

  addCommands() {
    const commandsMap: Record<string, keyof UnionCommands> = {
      bold: 'unsetBold',
      italic: 'unsetItalic',
      a: 'unsetAllMarks',
      underline: 'unsetUnderline',
      strike: 'unsetStrike',
      link: 'unsetLink',
      fontFamily: 'unsetFontFamily',
      fontSize: 'unsetFontSize',
      color: 'unsetColor',
      highlight: 'unsetHighlight',
      textAlign: 'unsetTextAlign',
      lineHeight: 'unsetLineHeight',
    };

    return {
      formatClear:
        () =>
          ({ editor }) => {
            const chainedCommand: ChainedCommands = Object.entries(
              commandsMap,
            ).reduce<ChainedCommands>((chain, [name, command]) => {
              const extension = editor.extensionManager.extensions.find(
                (e) => e.name === name,
              );
              if (extension) {
                return chain[command]();
              }
              return chain;
            }, editor.chain());

            return chainedCommand.focus().run();
          },
    };
  },

  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          component: CommandButton,
          componentProps: {
            command: () => {
              editor.commands.formatClear();
            },
            icon: 'clear-format',
            tooltip: t('editor.extensions.FormatClear.tooltip'),
          },
        };
      },
    };
  },
});

export default FormatClear;
