'use client';

import React, {
  memo,
  useEffect,
  useRef,
  useState,
  RefObject,
} from 'react';

import {
  EditorState,
  Compartment,
} from '@codemirror/state';
import {
  EditorView,
  keymap,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  lineNumbers,
  scrollPastEnd,
  tooltips,
} from '@codemirror/view';
import {
  defaultKeymap,
  history,
  historyKeymap,
} from '@codemirror/commands';
import { searchKeymap } from '@codemirror/search';
import {
  indentOnInput,
  indentUnit,
  foldGutter,
  bracketMatching,
} from '@codemirror/language';
import {
  autocompletion,
  closeBrackets,
  acceptCompletion,
} from '@codemirror/autocomplete';

import { debounce } from '@/utils/debounce';
import { classNames } from '@/utils/classNames';
import { getTheme, reconfigureTheme } from './cm-theme';
import { getLanguage } from './languages';
import { BinaryContent } from './BinaryContent';

import type {
  Theme,
  EditorDocument,
  EditorSettings,
  OnChangeCallback,
  OnScrollCallback,
  OnSaveCallback,
  EditorUpdate,
} from '@/types/editor';

interface CodeMirrorEditorProps {
  theme: Theme;
  doc?: EditorDocument;
  editable?: boolean;
  debounceChange?: number;
  debounceScroll?: number;
  autoFocusOnDocumentChange?: boolean;
  onChange?: OnChangeCallback;
  onScroll?: OnScrollCallback;
  onSave?: OnSaveCallback;
  className?: string;
  settings?: EditorSettings;
}

export const CodeMirrorEditor = memo<CodeMirrorEditorProps>(({
  theme,
  doc,
  editable = false,
  debounceChange = 150,
  debounceScroll = 100,
  autoFocusOnDocumentChange = false,
  onChange,
  onScroll,
  onSave,
  className = '',
  settings,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const themeRef = useRef(theme);
  const docRef = useRef(doc);
  const onChangeRef = useRef(onChange);
  const onScrollRef = useRef(onScroll);
  const onSaveRef = useRef(onSave);
  const [languageCompartment] = useState(() => new Compartment());

  useEffect(() => {
    themeRef.current = theme;
    docRef.current = doc;
    onChangeRef.current = onChange;
    onScrollRef.current = onScroll;
    onSaveRef.current = onSave;
  });

  useEffect(() => {
    const handleUpdate = debounce((update: EditorUpdate) => {
      onChangeRef.current?.(update);
    }, debounceChange);

    const view = new EditorView({
      parent: containerRef.current!,
      dispatchTransactions(transactions) {
        const state = view.state;
        view.update(transactions);

        const docChanged = transactions.some((tr) => tr.docChanged);
        if (docChanged || !state.selection.eq(view.state.selection)) {
          handleUpdate({
            content: view.state.doc.toString(),
            selection: view.state.selection,
          });
        }
      },
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [debounceChange]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    view.dispatch({
      effects: [reconfigureTheme(theme)],
    });
  }, [theme]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    if (!doc || doc.isBinary) {
      const newState = createEditorState(
        '',
        theme,
        settings,
        onScrollRef,
        debounceScroll,
        onSaveRef,
        [languageCompartment.of([])]
      );
      view.setState(newState);
      return;
    }

    const state = createEditorState(
      doc.value,
      theme,
      settings,
      onScrollRef,
      debounceScroll,
      onSaveRef,
      [languageCompartment.of([])]
    );
    view.setState(state);

    configureDocument(
      view,
      doc,
      theme,
      languageCompartment,
      editable,
      autoFocusOnDocumentChange
    );
  }, [doc?.value, doc?.filePath, theme, editable, settings, debounceScroll, autoFocusOnDocumentChange]);

  return (
    <div className={classNames('relative h-full', className)}>
      {doc?.isBinary ? <BinaryContent /> : <div className="h-full" ref={containerRef} />}
    </div>
  );
});

CodeMirrorEditor.displayName = 'CodeMirrorEditor';

function createEditorState(
  content: string,
  theme: Theme,
  settings: EditorSettings | undefined,
  onScrollRef: RefObject<OnScrollCallback | undefined>,
  debounceScroll: number,
  onSaveRef: RefObject<OnSaveCallback | undefined>,
  extensions: any[]
): EditorState {
  return EditorState.create({
    doc: content,
    extensions: [
      EditorView.domEventHandlers({
        scroll: debounce((event, view) => {
          if (event.target !== view.scrollDOM) return;
          onScrollRef.current?.({
            top: view.scrollDOM.scrollTop,
            left: view.scrollDOM.scrollLeft,
          });
        }, debounceScroll),
      }),
      getTheme(theme, settings),
      history(),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        ...searchKeymap,
        {
          key: 'Tab',
          run: acceptCompletion,
        },
        {
          key: 'Mod-s',
          preventDefault: true,
          run: () => {
            onSaveRef.current?.();
            return true;
          },
        },
      ]),
      indentUnit.of('  '),
      autocompletion({ closeOnBlur: false }),
      tooltips({ position: 'absolute', parent: document.body }),
      closeBrackets(),
      lineNumbers(),
      scrollPastEnd(),
      dropCursor(),
      drawSelection(),
      bracketMatching(),
      indentOnInput(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      foldGutter(),
      EditorState.tabSize.of(settings?.tabSize ?? 2),
      ...extensions,
    ],
  });
}

function configureDocument(
  view: EditorView,
  doc: EditorDocument,
  theme: Theme,
  languageCompartment: Compartment,
  editable: boolean,
  autoFocus: boolean
) {
  const currentContent = view.state.doc.toString();
  if (doc.value !== currentContent) {
    view.dispatch({
      changes: {
        from: 0,
        to: currentContent.length,
        insert: doc.value,
      },
    });
  }

  getLanguage(doc.filePath).then((languageSupport) => {
    if (!languageSupport) return;
    view.dispatch({
      effects: [
        languageCompartment.reconfigure([languageSupport]),
        reconfigureTheme(theme),
      ],
    });

    if (editable && autoFocus) {
      requestAnimationFrame(() => {
        view.focus();
      });
    }
  });
}
