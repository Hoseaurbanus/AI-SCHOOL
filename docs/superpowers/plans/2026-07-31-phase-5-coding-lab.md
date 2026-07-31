# Phase 5: Coding Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the hardcoded CodingLab page into a working browser-based code sandbox supporting HTML/CSS/JS, Python (Pyodide), and Markdown preview.

**Architecture:** Monaco editor for code editing, Pyodide (WebAssembly) for Python execution, iframe sandbox for HTML preview, markdown-to-HTML converter for Markdown preview.

**Tech Stack:** React 19, @monaco-editor/react, Pyodide (CDN), Tailwind CSS v4

## Global Constraints

- React 19, Vite 8, TypeScript 5.7, Tailwind CSS v4
- Dark theme design system: `#060A12` background, `#0D1421` panels, `#F1F5F9` primary text
- New dependency: `@monaco-editor/react`
- Pyodide loaded via CDN

---

### Task 1: Install Monaco Editor and Extend Types

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `src/types.ts`

**Interfaces:**
- Produces: `CodeLanguage`, `CodeExercise`, `ExecutionResult` types

- [ ] **Step 1: Install @monaco-editor/react**

Run: `npm install @monaco-editor/react --legacy-peer-deps`

- [ ] **Step 2: Add new types to src/types.ts**

Append to end of file:

```typescript
export type CodeLanguage = 'html' | 'python' | 'markdown';

export interface CodeExercise {
  id: string;
  title: string;
  language: CodeLanguage;
  description: string;
  starterCode: string;
  solution?: string;
  testCases?: { input: string; expected: string }[];
}

export interface ExecutionResult {
  output: string;
  error?: string;
  status: 'success' | 'error';
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/types.ts
git commit -m "feat: install Monaco editor and add coding lab types"
```

---

### Task 2: Add Exercises Mock Data

**Files:**
- Modify: `src/data/mockData.ts`

**Interfaces:**
- Produces: `exercises` export

- [ ] **Step 1: Add CodeExercise import to mockData.ts**

Add `CodeExercise` to the import from `../types`:

```typescript
import type {
  // ... existing types ...
  CodeExercise,
} from '../types';
```

- [ ] **Step 2: Add exercises after resources export**

```typescript
export const exercises: CodeExercise[] = [
  {
    id: 'ex_001',
    title: 'Build a Hello World Page',
    language: 'html',
    description: 'Create an HTML page with a heading and a paragraph.',
    starterCode: `<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <!-- Add your content here -->\n</body>\n</html>`,
  },
  {
    id: 'ex_002',
    title: 'Style a Card Component',
    language: 'html',
    description: 'Create a styled card with image, title, and description.',
    starterCode: `<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    /* Add your styles here */\n  </style>\n</head>\n<body>\n  <div class="card">\n    <img src="https://via.placeholder.com/300" alt="Preview">\n    <h2>Card Title</h2>\n    <p>Card description goes here.</p>\n  </div>\n</body>\n</html>`,
  },
  {
    id: 'ex_003',
    title: 'Python Variables and Types',
    language: 'python',
    description: 'Practice declaring variables and working with different data types.',
    starterCode: `# Declare variables of different types\nname = "Alice"\nage = 25\nheight = 5.6\nis_student = True\n\n# Print them\nprint(f"Name: {name}")\nprint(f"Age: {age}")\nprint(f"Height: {height}")\nprint(f"Student: {is_student}")`,
  },
  {
    id: 'ex_004',
    title: 'Python List Operations',
    language: 'python',
    description: 'Practice working with lists: append, remove, sort, and slice.',
    starterCode: `# Create a list of numbers\nnumbers = [5, 2, 8, 1, 9]\n\n# Sort the list\nnumbers.sort()\nprint(f"Sorted: {numbers}")\n\n# Add a number\nnumbers.append(3)\nprint(f"After append: {numbers}")\n\n# Remove a number\nnumbers.remove(1)\nprint(f"After remove: {numbers}")\n\n# Slice: get first 3 elements\nprint(f"First 3: {numbers[:3]}")`,
  },
  {
    id: 'ex_005',
    title: 'Write a README',
    language: 'markdown',
    description: 'Create a professional README file for a project.',
    starterCode: `# My Project\n\n## Description\n\nWrite a brief description here.\n\n## Installation\n\n\`\`\`bash\nnpm install my-project\n\`\`\`\n\n## Usage\n\n\`\`\`javascript\nconst myProject = require('my-project');\nmyProject.doSomething();\n\`\`\`\n\n## License\n\nMIT`,
  },
  {
    id: 'ex_006',
    title: 'API Documentation',
    language: 'markdown',
    description: 'Document an API endpoint with parameters and examples.',
    starterCode: `# API Reference\n\n## GET /api/users\n\nReturns a list of all users.\n\n### Parameters\n\n| Name | Type | Description |\n|------|------|-------------|\n| limit | number | Max results |\n| offset | number | Pagination offset |\n\n### Response\n\n\`\`\`json\n{\n  "users": [\n    { "id": 1, "name": "Alice" }\n  ]\n}\n\`\`\``,
  },
];
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/data/mockData.ts
git commit -m "feat: add coding exercises mock data"
```

---

### Task 3: Create useCodeExecution Hook

**Files:**
- Create: `src/hooks/useCodeExecution.ts`

**Interfaces:**
- Produces: `useCodeExecution` hook

- [ ] **Step 1: Create the hook**

```typescript
import { useState, useCallback, useRef } from 'react';
import type { CodeLanguage, ExecutionResult } from '../types';

let pyodideInstance: any = null;
let pyodideLoading = false;
let pyodidePromise: Promise<any> | null = null;

async function loadPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (pyodidePromise) return pyodidePromise;

  pyodideLoading = true;
  pyodidePromise = new Promise(async (resolve, reject) => {
    try {
      // @ts-ignore
      const loadPyodide = (await import('https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.mjs')).loadPyodide;
      const pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full',
      });
      pyodideInstance = pyodide;
      pyodideLoading = false;
      resolve(pyodide);
    } catch (err) {
      pyodideLoading = false;
      reject(err);
    }
  });

  return pyodidePromise;
}

function captureConsoleOutput(pyodide: any): string {
  let output = '';
  pyodide.setStdout({ batched: (text: string) => { output += text; } });
  pyodide.setStderr({ batched: (text: string) => { output += text; } });
  return output;
}

export function useCodeExecution() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const executeHTML = useCallback((code: string): ExecutionResult => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = code;
    }
    return { output: 'Preview updated', status: 'success' };
  }, []);

  const executePython = useCallback(async (code: string): Promise<ExecutionResult> => {
    try {
      const pyodide = await loadPyodide();
      const output = captureConsoleOutput(pyodide);
      pyodide.runPython(code);
      return { output: output || 'Code executed successfully (no output)', status: 'success' };
    } catch (err: any) {
      return { output: '', error: err.message, status: 'error' };
    }
  }, []);

  const executeMarkdown = useCallback((code: string): ExecutionResult => {
    const html = code
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      .replace(/\n/g, '<br>');
    return { output: html, status: 'success' };
  }, []);

  const execute = useCallback(async (code: string, language: CodeLanguage): Promise<ExecutionResult> => {
    setIsRunning(true);
    setResult(null);

    let execResult: ExecutionResult;
    switch (language) {
      case 'html':
        execResult = executeHTML(code);
        break;
      case 'python':
        execResult = await executePython(code);
        break;
      case 'markdown':
        execResult = executeMarkdown(code);
        break;
      default:
        execResult = { output: '', error: 'Unsupported language', status: 'error' };
    }

    setResult(execResult);
    setIsRunning(false);
    return execResult;
  }, [executeHTML, executePython, executeMarkdown]);

  return { execute, isRunning, result, iframeRef };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useCodeExecution.ts
git commit -m "feat: add useCodeExecution hook with Pyodide and HTML sandbox"
```

---

### Task 4: Create CodeEditor Component

**Files:**
- Create: `src/components/coding/CodeEditor.tsx`

**Interfaces:**
- Consumes: `CodeLanguage` type from `src/types.ts`

- [ ] **Step 1: Create the component**

```tsx
import Editor from '@monaco-editor/react';
import type { CodeLanguage } from '../../types';

interface CodeEditorProps {
  code: string;
  language: CodeLanguage;
  onChange: (code: string) => void;
}

const languageMap: Record<CodeLanguage, string> = {
  html: 'html',
  python: 'python',
  markdown: 'markdown',
};

export default function CodeEditor({ code, language, onChange }: CodeEditorProps) {
  return (
    <div className="h-full">
      <Editor
        height="100%"
        language={languageMap[language]}
        value={code}
        onChange={(value) => onChange(value || '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          automaticLayout: true,
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/components/coding/CodeEditor.tsx
git commit -m "feat: add CodeEditor component with Monaco"
```

---

### Task 5: Create PreviewPanel and Terminal Components

**Files:**
- Create: `src/components/coding/PreviewPanel.tsx`
- Create: `src/components/coding/Terminal.tsx`

**Interfaces:**
- Consumes: `CodeLanguage`, `ExecutionResult` types

- [ ] **Step 1: Create PreviewPanel**

```tsx
import type { CodeLanguage } from '../../types';

interface PreviewPanelProps {
  code: string;
  language: CodeLanguage;
  markdownOutput?: string;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
}

export default function PreviewPanel({ code, language, markdownOutput, iframeRef }: PreviewPanelProps) {
  if (language === 'markdown') {
    return (
      <div
        className="h-full overflow-y-auto p-6 prose prose-invert max-w-none"
        style={{ background: '#FFFFFF', color: '#1a1a1a' }}
        dangerouslySetInnerHTML={{ __html: markdownOutput || '' }}
      />
    );
  }

  if (language === 'html') {
    return (
      <iframe
        ref={iframeRef}
        srcDoc={code}
        className="w-full h-full border-0"
        style={{ background: '#FFFFFF' }}
        title="Preview"
      />
    );
  }

  return (
    <div className="h-full flex items-center justify-center" style={{ background: '#060A12' }}>
      <p className="text-sm" style={{ color: '#64748B' }}>
        Run your code to see output in the terminal
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Create Terminal**

```tsx
import { Terminal as TerminalIcon, Trash2 } from 'lucide-react';
import type { ExecutionResult } from '../../types';

interface TerminalProps {
  result: ExecutionResult | null;
  onClear: () => void;
}

export default function Terminal({ result, onClear }: TerminalProps) {
  return (
    <div className="h-full flex flex-col" style={{ background: '#060A12' }}>
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ background: '#0D1421', borderBottom: '1px solid rgba(59,130,246,0.1)' }}
      >
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} style={{ color: '#3B82F6' }} />
          <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>Terminal</span>
        </div>
        <button
          onClick={onClear}
          className="p-1 rounded"
          style={{ color: '#475569' }}
        >
          <Trash2 size={12} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs" style={{ color: '#94A3B8' }}>
        {result ? (
          <>
            {result.output && (
              <pre className="whitespace-pre-wrap">{result.output}</pre>
            )}
            {result.error && (
              <pre className="whitespace-pre-wrap" style={{ color: '#EF4444' }}>{result.error}</pre>
            )}
            {!result.output && !result.error && (
              <p style={{ color: '#64748B' }}>No output</p>
            )}
          </>
        ) : (
          <p style={{ color: '#475569' }}>Click "Run" to execute your code</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/components/coding/PreviewPanel.tsx src/components/coding/Terminal.tsx
git commit -m "feat: add PreviewPanel and Terminal components"
```

---

### Task 6: Rewrite CodingLab Page

**Files:**
- Modify: `src/pages/CodingLab.tsx`

**Interfaces:**
- Consumes: All components from Tasks 3-5, `exercises` from mockData

- [ ] **Step 1: Replace entire src/pages/CodingLab.tsx**

```tsx
import { useState } from 'react';
import { Play, RotateCcw, BookOpen, Sparkles, Code2, FileText, Eye } from 'lucide-react';
import { exercises } from '../data/mockData';
import { useCodeExecution } from '../hooks/useCodeExecution';
import CodeEditor from '../components/coding/CodeEditor';
import PreviewPanel from '../components/coding/PreviewPanel';
import Terminal from '../components/coding/Terminal';
import type { CodeLanguage } from '../types';

export default function CodingLab() {
  const [selectedExercise, setSelectedExercise] = useState(exercises[0]);
  const [code, setCode] = useState(exercises[0].starterCode);
  const [language, setLanguage] = useState<CodeLanguage>(exercises[0].language);
  const { execute, isRunning, result, iframeRef } = useCodeExecution();

  const handleExerciseChange = (exerciseId: string) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    if (exercise) {
      setSelectedExercise(exercise);
      setCode(exercise.starterCode);
      setLanguage(exercise.language);
    }
  };

  const handleRun = async () => {
    await execute(code, language);
  };

  const handleReset = () => {
    setCode(selectedExercise.starterCode);
  };

  const languages: { id: CodeLanguage; label: string; icon: typeof Code2 }[] = [
    { id: 'html', label: 'HTML/CSS/JS', icon: Code2 },
    { id: 'python', label: 'Python', icon: Code2 },
    { id: 'markdown', label: 'Markdown', icon: FileText },
  ];

  return (
    <div className="flex flex-col h-screen" style={{ background: '#060A12' }}>
      {/* Toolbar */}
      <div
        className="flex items-center gap-4 px-4 py-3 flex-shrink-0"
        style={{ background: '#0D1421', borderBottom: '1px solid rgba(59,130,246,0.1)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(59,130,246,0.15)' }}
          >
            <Code2 size={16} style={{ color: '#3B82F6' }} />
          </div>
          <span className="font-bold text-sm" style={{ color: '#F1F5F9' }}>Coding Lab</span>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1">
          {languages.map(lang => {
            const Icon = lang.icon;
            return (
              <button
                key={lang.id}
                onClick={() => {
                  setLanguage(lang.id);
                  const ex = exercises.find(e => e.language === lang.id);
                  if (ex) handleExerciseChange(ex.id);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: language === lang.id ? 'rgba(59,130,246,0.15)' : 'transparent',
                  color: language === lang.id ? '#3B82F6' : '#64748B',
                  border: `1px solid ${language === lang.id ? 'rgba(59,130,246,0.3)' : 'transparent'}`,
                }}
              >
                <Icon size={12} />
                {lang.label}
              </button>
            );
          })}
        </div>

        {/* Exercise Selector */}
        <select
          value={selectedExercise.id}
          onChange={(e) => handleExerciseChange(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs"
          style={{ background: '#060A12', color: '#F1F5F9', border: '1px solid rgba(59,130,246,0.2)' }}
        >
          {exercises.filter(e => e.language === language).map(ex => (
            <option key={ex.id} value={ex.id}>{ex.title}</option>
          ))}
        </select>

        <div className="flex-1" />

        {/* Actions */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
          style={{ background: 'rgba(100,116,139,0.15)', color: '#94A3B8' }}
        >
          <RotateCcw size={12} />
          Reset
        </button>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
          style={{ background: '#3B82F6', color: '#FFFFFF' }}
        >
          <Play size={12} />
          {isRunning ? 'Running...' : 'Run'}
        </button>
      </div>

      {/* Exercise Description */}
      <div
        className="px-4 py-2 flex-shrink-0"
        style={{ background: '#0D1421', borderBottom: '1px solid rgba(59,130,246,0.1)' }}
      >
        <p className="text-xs" style={{ color: '#94A3B8' }}>{selectedExercise.description}</p>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Panel */}
        <div className="w-3/5 flex flex-col" style={{ borderRight: '1px solid rgba(59,130,246,0.1)' }}>
          <CodeEditor code={code} language={language} onChange={setCode} />
        </div>

        {/* Right Panel */}
        <div className="w-2/5 flex flex-col">
          {/* Preview */}
          <div className="h-1/2" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
            <PreviewPanel
              code={code}
              language={language}
              markdownOutput={result?.status === 'success' && language === 'markdown' ? result.output : undefined}
              iframeRef={iframeRef}
            />
          </div>
          {/* Terminal */}
          <div className="h-1/2">
            <Terminal result={result} onClear={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/pages/CodingLab.tsx
git commit -m "feat: rewrite CodingLab with Monaco editor, language selector, execution"
```

---

### Task 7: Final Verification

**Files:**
- None (read-only verification)

- [ ] **Step 1: TypeScript check**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Write report**

Write to: `docs/superpowers/plans/phase-5-verification-report.md`

- [ ] **Step 4: Push to remote**

```bash
git push
```
