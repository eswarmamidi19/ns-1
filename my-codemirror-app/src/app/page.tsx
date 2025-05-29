'use client';

import { useState } from 'react';
import { CodeMirrorEditor } from '@/components/editor/CodeMirrorEditor';
import type { EditorDocument, EditorUpdate, Theme } from '@/types/editor';

export default function Home() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [editorContent, setEditorContent] = useState(`// Welcome to CodeMirror!
// Start typing your code here...

const message = "Hello, World!";
console.log(message);

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`);

  const editorDoc: EditorDocument = {
    value: editorContent,
    isBinary: false,
    filePath: 'example.ts',
  };

  const handleEditorChange = (update: EditorUpdate) => {
    setEditorContent(update.content);
  };

  const handleSave = () => {
    console.log('File saved!', editorContent);
    alert('File saved successfully!');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-3`}>
        <div className="flex justify-between items-center">
          <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Next.js CodeMirror Editor
          </h1>
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Dark' : 'Light'}
            </button>
            <button
              onClick={() => setIsEditorOpen(!isEditorOpen)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isEditorOpen
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isEditorOpen ? 'Close Editor' : 'Open Text Editor'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Side - Main Content */}
         <div className={`flex-1 p-8 ${isEditorOpen ? 'pr-4' : ''}`}>
          <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-lg p-8`}>
            <h2 className="text-2xl font-bold mb-4">Test Code mirror</h2>
            
          </div>
        </div>

        {/* Right Side - Text Editor */}
        {isEditorOpen && (
          <div className="w-1/2 border-l border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'} border-b px-4 py-2 flex justify-between items-center`}>
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                📝 Code Editor - example.ts
              </span>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Save (Ctrl+S)
              </button>
            </div>
            <div className="h-[calc(100%-49px)]">
              <CodeMirrorEditor
                theme={theme}
                doc={editorDoc}
                editable={false}
                onChange={handleEditorChange}
                onSave={handleSave}
                autoFocusOnDocumentChange={true}
                settings={{
                  fontSize: '14px',
                  tabSize: 2,
                }}
                className="h-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}





//  <div className={`flex-1 p-8 ${isEditorOpen ? 'pr-4' : ''}`}>
//           <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-lg p-8`}>
//             <h2 className="text-2xl font-bold mb-4">Test Code mirror</h2>
//             {/* <p className="mb-4">
//               This is a Next.js application with CodeMirror text editor integration. 
//               Click the "Open Text Editor" button in the header to reveal the editor on the right side.
//             </p> */}
//             {/* <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-md mb-4`}>
//               <h3 className="font-semibold mb-2">Features:</h3>
//               <ul className="list-disc list-inside space-y-1 text-sm">
//                 <li>Syntax highlighting for multiple languages</li>
//                 <li>Auto-completion and bracket matching</li>
//                 <li>Search and replace functionality</li>
//                 <li>Line numbers and code folding</li>
//                 <li>Dark/Light theme support</li>
//                 <li>Keyboard shortcuts (Ctrl+S to save)</li>
//               </ul>
//             </div> */}
//             {/* <p className="text-sm text-gray-600 dark:text-gray-400">
//               The editor supports JavaScript, TypeScript, HTML, CSS, JSON, Markdown, and Python files.
//               Try changing the filename extension to see different syntax highlighting!
//             </p> */}
//           </div>
//         </div>