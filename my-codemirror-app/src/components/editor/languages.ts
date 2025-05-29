import { LanguageDescription } from '@codemirror/language';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { python } from '@codemirror/lang-python';

export const supportedLanguages = [
  LanguageDescription.of({
    name: 'JavaScript',
    extensions: ['js', 'mjs', 'cjs'],
    load() {
      return Promise.resolve(javascript());
    },
  }),
  LanguageDescription.of({
    name: 'TypeScript',
    extensions: ['ts'],
    load() {
      return Promise.resolve(javascript({ typescript: true }));
    },
  }),
  LanguageDescription.of({
    name: 'JSX',
    extensions: ['jsx'],
    load() {
      return Promise.resolve(javascript({ jsx: true }));
    },
  }),
  LanguageDescription.of({
    name: 'TSX',
    extensions: ['tsx'],
    load() {
      return Promise.resolve(javascript({ jsx: true, typescript: true }));
    },
  }),
  LanguageDescription.of({
    name: 'HTML',
    extensions: ['html'],
    load() {
      return Promise.resolve(html());
    },
  }),
  LanguageDescription.of({
    name: 'CSS',
    extensions: ['css'],
    load() {
      return Promise.resolve(css());
    },
  }),
  LanguageDescription.of({
    name: 'JSON',
    extensions: ['json'],
    load() {
      return Promise.resolve(json());
    },
  }),
  LanguageDescription.of({
    name: 'Markdown',
    extensions: ['md'],
    load() {
      return Promise.resolve(markdown());
    },
  }),
  LanguageDescription.of({
    name: 'Python',
    extensions: ['py'],
    load() {
      return Promise.resolve(python());
    },
  }),
];

export async function getLanguage(fileName: string) {
  const languageDescription = LanguageDescription.matchFilename(supportedLanguages, fileName);
  if (languageDescription) {
    return await languageDescription.load();
  }
  return undefined;
}

