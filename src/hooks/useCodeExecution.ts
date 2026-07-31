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
