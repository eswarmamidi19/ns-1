import { File } from "@/components/file-explorer";

export const sampleSteps = [
  {
    id: "step-1",
    title: "Setup project",
    description:
      "Initialize a new Next.js project with the required dependencies",
    command: "npx create-next-app@latest my-website --typescript --tailwind",
    status: "completed",
    details: [
      "This creates a new Next.js project with TypeScript and Tailwind CSS",
      "The project structure includes app directory for the App Router",
      "All necessary dependencies are automatically installed",
    ],
  },
  {
    id: "step-2",
    title: "Create page components",
    description: "Implement the main pages of your website",
    status: "running",
    details: [
      "Create Home page with hero section and features",
      "Implement About page with team information",
      "Add Contact page with form and map",
      "Set up dynamic routing for blog posts",
    ],
  },
  {
    id: "step-3",
    title: "Add styling",
    description: "Style your components using Tailwind CSS",
    status: "pending",
    details: [
      "Customize the Tailwind configuration",
      "Create responsive designs for all screen sizes",
      "Implement dark mode toggle",
      "Add animations and transitions",
    ],
  },
  {
    id: "step-4",
    title: "Deploy your website",
    description: "Deploy your website to Vercel or Netlify",
    command: "npm run build && npm run export",
    status: "pending",
    details: [
      "Build your project for production",
      "Create a Vercel or Netlify account if you don't have one",
      "Connect your repository to the platform",
      "Configure build settings and deploy",
    ],
  },
];

export const sampleFiles: File[] =  [
  {
    id: 'package.json',
    name: 'package.json',
    path: 'package.json',
    type: 'file',
    content: `
{
  "name": "react-todo-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^4.0.4",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
`.trim(),
  },
  {
    id: 'vite.config.js',
    name: 'vite.config.js',
    path: 'vite.config.js',
    type: 'file',
    content: `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()]
});
`.trim(),
  },
  {
    id: 'index.html',
    name: 'index.html',
    path: 'index.html',
    type: 'file',
    content: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>React ToDo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`.trim(),
  },
  {
    id: 'src',
    name: 'src',
    path: 'src',
    type: 'folder',
    children: [
      {
        id: 'src/main.jsx',
        name: 'main.jsx',
        path: 'src/main.jsx',
        type: 'file',
        content: `
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
`.trim(),
      },
      {
        id: 'src/App.jsx',
        name: 'App.jsx',
        path: 'src/App.jsx',
        type: 'file',
        content: `
import React, { useState } from 'react';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  const addTodo = () => {
    if (text.trim()) {
      setTodos([...todos, text.trim()]);
      setText('');
    }
  };

  const removeTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📝 React ToDo App</h1>
      <div style={styles.inputRow}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          style={styles.input}
        />
        <button onClick={addTodo} style={styles.addButton}>Add</button>
      </div>
      <ul style={styles.list}>
        {todos.map((todo, i) => (
          <li key={i} style={styles.listItem}>
            <span>{todo}</span>
            <button onClick={() => removeTodo(i)} style={styles.deleteButton}>✖</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'sans-serif',
    padding: '40px 20px',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    height: '100vh',
  },
  heading: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333'
  },
  inputRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  addButton: {
    padding: '10px 16px',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '10px',
    marginBottom: '8px',
    borderRadius: '4px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
  },
  deleteButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ff4d4f',
    fontSize: '1.2rem',
    cursor: 'pointer'
  }
};
`.trim(),
      },
    ],
  },
];
