# Phase 5: Coding Lab — Design Spec

**Version:** 1.0
**Date:** 2026-07-31
**Status:** Approved

---

## Goal

Transform the hardcoded `CodingLab.tsx` page into a working browser-based code sandbox supporting HTML/CSS/JS, Python (Pyodide), and Markdown preview.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/types.ts` | Add `CodeExercise`, `CodeLanguage`, `ExecutionResult` types |
| `src/data/mockData.ts` | Add exercises data |
| `src/pages/CodingLab.tsx` | Rewrite with Monaco editor, language selector, execution |

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/coding/CodeEditor.tsx` | Monaco-based code editor wrapper |
| `src/components/coding/PreviewPanel.tsx` | Live preview (iframe for HTML, markdown render) |
| `src/components/coding/Terminal.tsx` | Console output display |
| `src/hooks/useCodeExecution.ts` | Language-specific execution logic |

---

## Data Model

### New Types (add to `src/types.ts`)

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

### Mock Data Additions (add to `src/data/mockData.ts`)

- `exercises`: `CodeExercise[]` — 6 sample exercises (2 per language)
- Starter code for HTML/CSS/JS, Python, and Markdown exercises

---

## Component Design

### CodeEditor (`src/components/coding/CodeEditor.tsx`)

- Props: `{ code: string; language: CodeLanguage; onChange: (code: string) => void }`
- Uses `@monaco-editor/react` for syntax highlighting
- Language mapping: html→html, python→python, markdown→markdown
- Dark theme matching the app design system

### PreviewPanel (`src/components/coding/PreviewPanel.tsx`)

- Props: `{ code: string; language: CodeLanguage }`
- HTML: Renders via iframe with srcdoc
- Python: Shows execution output (from useCodeExecution)
- Markdown: Renders HTML from markdown conversion

### Terminal (`src/components/coding/Terminal.tsx`)

- Props: `{ output: string; error?: string; status: 'success' | 'error' }`
- Displays stdout/stderr
- Color-coded: green for success, red for errors
- Clear button to reset output

### useCodeExecution (`src/hooks/useCodeExecution.ts`)

- Props: `{ code: string; language: CodeLanguage }`
- Returns: `{ execute: () => Promise<ExecutionResult>, isRunning: boolean, result: ExecutionResult | null }`
- HTML: Returns code as-is (iframe handles rendering)
- Python: Uses Pyodide (loaded via CDN) to execute
- Markdown: Converts markdown to HTML using simple regex parser

---

## Page Behavior

### Layout

1. **Top toolbar:** Language selector, exercise dropdown, Run button, AI Review toggle
2. **Left panel (60%):** Code editor (Monaco)
3. **Right panel (40%):** Split between Preview (top) and Terminal (bottom)
4. **Right sidebar (toggleable):** AI Review panel

### Languages

1. **HTML/CSS/JS:**
   - Editor: html syntax
   - Preview: iframe with srcdoc
   - Terminal: console.log output captured via patching

2. **Python:**
   - Editor: python syntax
   - Preview: output from Pyodide
   - Terminal: stdout/stderr from Pyodide

3. **Markdown:**
   - Editor: markdown syntax
   - Preview: rendered HTML
   - Terminal: not used

### Run Flow

1. User clicks "Run" button
2. `useCodeExecution.execute()` is called
3. For Python: Pyodide loads (cached after first use), executes code, captures output
4. For HTML: iframe srcdoc is updated
5. For Markdown: HTML is rendered
6. Results shown in Terminal/Preview

---

## Dependencies

**New dependency:** `@monaco-editor/react` — Monaco editor wrapper for React
**External:** Pyodide loaded via CDN (https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js)

---

## What We're NOT Building (YAGNI)

- Real AI code review (hardcoded response for MVP)
- Multi-file editing (single file only)
- File system simulation
- Server-side execution
- Unit test runner
- Collaborative editing

---

## Dark Theme Design System

| Element | Style |
|---------|-------|
| Page background | `#060A12` |
| Editor background | `#0D1421` |
| Terminal background | `#060A12` |
| Preview background | `#FFFFFF` (for HTML) |
| Primary text | `#F1F5F9` |
| Secondary text | `#94A3B8` |
| Muted text | `#64748B` |
| Accent blue | `#3B82F6` |
| Accent purple | `#8B5CF6` |
| Success green | `#10B981` |
| Error red | `#EF4444` |
