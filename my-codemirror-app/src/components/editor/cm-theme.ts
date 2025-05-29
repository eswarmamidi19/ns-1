import { Compartment, type Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import type { Theme, EditorSettings } from '@/types/editor';

export const darkTheme = EditorView.theme({}, { dark: true });
export const themeSelection = new Compartment();

export function getTheme(theme: Theme, settings: EditorSettings = {}): Extension {
  return [
    getEditorTheme(settings, theme),
    theme === 'dark' ? themeSelection.of([getDarkTheme()]) : themeSelection.of([getLightTheme()]),
  ];
}

export function reconfigureTheme(theme: Theme) {
  return themeSelection.reconfigure(theme === 'dark' ? getDarkTheme() : getLightTheme());
}

function getEditorTheme(settings: EditorSettings, theme: Theme) {
  return EditorView.theme({
    '&': {
      fontSize: settings.fontSize ?? '14px',
    },
    '&.cm-editor': {
      height: '100%',
      background: theme === 'dark' ? '#1e1e1e' : '#ffffff',
      color: theme === 'dark' ? '#d4d4d4' : '#333333',
    },
    '.cm-cursor': {
      borderLeft: `1px solid ${theme === 'dark' ? '#ffffff' : '#000000'}`,
    },
    '.cm-scroller': {
      lineHeight: '1.5',
      '&:focus-visible': {
        outline: 'none',
      },
    },
    '.cm-line': {
      padding: '0 0 0 4px',
    },
    '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground': {
      backgroundColor: theme === 'dark' ? '#3a3d41' : '#add6ff',
      opacity: '0.3',
    },
    '&:not(.cm-focused) > .cm-scroller > .cm-selectionLayer .cm-selectionBackground': {
      backgroundColor: theme === 'dark' ? '#3a3d41' : '#add6ff',
      opacity: '0.2',
    },
    '.cm-activeLine': {
      background: theme === 'dark' ? '#2a2d2e' : '#f5f5f5',
    },
    '.cm-gutters': {
      background: theme === 'dark' ? '#252526' : '#f8f8f8',
      borderRight: 0,
      color: theme === 'dark' ? '#858585' : '#666666',
    },
    '.cm-gutter': {
      '&.cm-lineNumbers': {
        fontFamily: 'Monaco, Menlo, Consolas, monospace',
        fontSize: settings.gutterFontSize ?? settings.fontSize ?? '14px',
        minWidth: '40px',
      },
      '& .cm-activeLineGutter': {
        background: 'transparent',
        color: theme === 'dark' ? '#c6c6c6' : '#333333',
      },
    },
    '.cm-panels': {
      borderColor: theme === 'dark' ? '#3c3c3c' : '#e1e1e1',
    },
    '.cm-panels-bottom': {
      borderTop: `1px solid ${theme === 'dark' ? '#3c3c3c' : '#e1e1e1'}`,
      backgroundColor: 'transparent',
    },
  });
}

function getLightTheme() {
  return vscodeLight;
}

function getDarkTheme() {
  return vscodeDark;
}
