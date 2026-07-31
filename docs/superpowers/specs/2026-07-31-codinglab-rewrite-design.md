# Task 6: Rewrite CodingLab Page

## Overview

Replace the existing `src/pages/CodingLab.tsx` with a new implementation that integrates Monaco editor, language selector, and code execution using previously built components.

## Design

The new CodingLab component will:

1. **State Management**: Use React useState for selectedExercise, code, language.
2. **Exercise Selection**: Allow users to select exercises filtered by language.
3. **Language Selector**: Toggle between HTML/CSS/JS, Python, Markdown.
4. **Code Editor**: Use CodeEditor component (Monaco) with language-specific syntax highlighting.
5. **Execution**: Use useCodeExecution hook to run code and capture output.
6. **Preview & Terminal**: Display preview (for HTML/Markdown) and terminal output side by side.
7. **UI Layout**: Dark theme with toolbar, description, editor panel (60% width), and right panel (40% width) split between preview and terminal.

## Components

- **CodeEditor**: Monaco editor component accepting code, language, onChange.
- **PreviewPanel**: Renders HTML/Markdown preview with iframe or markdown output.
- **Terminal**: Displays execution results (output, errors).
- **useCodeExecution**: Hook that executes code in sandbox (Pyodide for Python, iframe for HTML).

## Data Flow

- User selects exercise → sets code and language.
- User edits code → updates state.
- User clicks Run → executes code via hook → result updates preview and terminal.
- User can reset code to starter code.

## Error Handling

- Execution errors are captured by useCodeExecution and displayed in terminal.
- Preview panel shows error messages if execution fails.

## Testing

- Manual testing: select exercises, edit code, run, verify preview/terminal output.
- Build verification: npm run build passes.

## Approval

I have reviewed this design and approve it.