# Phase 4: Course Learning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the hardcoded CourseLearning page into a dynamic lesson viewer with rich text content, real progress tracking, and proper curriculum navigation.

**Architecture:** Dynamic routing via URL search params, React Query for data fetching, localStorage for notes and lesson progress, rich text renderer for lesson content.

**Tech Stack:** React 19, React Router v6, TanStack React Query, Zustand, localStorage, Tailwind CSS v4

## Global Constraints

- React 19, Vite 8, TypeScript 5.7, Tailwind CSS v4
- Dark theme design system: `#060A12` background, `#0D1421` panels, `#F1F5F9` primary text
- Use existing components: `CodeBlock`, `CurriculumList`, `ProgressRing`, `LoadingSpinner`
- No new dependencies

---

### Task 1: Extend Types for Course Learning

**Files:**
- Modify: `src/types.ts`

**Interfaces:**
- Produces: `LessonContent`, `Resource`, `Note` types

- [ ] **Step 1: Add new types to src/types.ts**

Append to end of file:

```typescript
export interface LessonContent {
  type: 'text' | 'code' | 'image' | 'heading';
  content: string;
  language?: string;
  caption?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'zip' | 'link';
  url: string;
  size?: string;
}

export interface Note {
  id: string;
  lessonId: string;
  userId: string;
  content: string;
  updatedAt: string;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat: add LessonContent, Resource, Note types"
```

---

### Task 2: Add Lesson Content Mock Data

**Files:**
- Modify: `src/data/mockData.ts`

**Interfaces:**
- Produces: `lessonContents`, `resources` exports

- [ ] **Step 1: Add imports to mockData.ts**

Add `LessonContent` and `Resource` to the import from `../types`:

```typescript
import type {
  // ... existing types ...
  LessonContent,
  Resource,
} from '../types';
```

- [ ] **Step 2: Add lessonContents after curriculum export**

```typescript
export const lessonContents: Record<string, LessonContent[]> = {
  'les_001': [
    { type: 'heading', content: 'What Are Loops?' },
    { type: 'text', content: 'Loops allow you to execute a block of code repeatedly. Python has two main loop types: `for` loops and `while` loops.' },
    { type: 'text', content: 'A `for` loop iterates over a sequence (like a list, string, or range). It\'s the most common loop type in Python.' },
    { type: 'heading', content: 'Your First For Loop' },
    { type: 'code', content: '# Loop through a list of fruits\nfruits = ["apple", "banana", "cherry"]\n\nfor fruit in fruits:\n    print(f"I like {fruit}")\n\n# Output:\n# I like apple\n# I like banana\n# I like cherry', language: 'python' },
    { type: 'text', content: 'The `for` keyword picks each item from the sequence and assigns it to the variable `fruit`. The loop body executes once per item.' },
    { type: 'heading', content: 'Using range()' },
    { type: 'text', content: 'The `range()` function generates a sequence of numbers, perfect for looping a specific number of times.' },
    { type: 'code', content: '# Loop 5 times\nfor i in range(5):\n    print(f"Iteration {i}")\n\n# Output:\n# Iteration 0\n# Iteration 1\n# Iteration 2\n# Iteration 3\n# Iteration 4', language: 'python' },
    { type: 'heading', content: 'Practice Task' },
    { type: 'text', content: 'Write a for loop that prints all even numbers from 1 to 20. Hint: use the `range()` function with a step parameter.' },
  ],
  'les_002': [
    { type: 'heading', content: 'While Loops' },
    { type: 'text', content: 'A `while` loop continues executing as long as its condition is `True`. Use it when you don\'t know how many iterations you need.' },
    { type: 'code', content: 'count = 0\nwhile count < 5:\n    print(f"Count: {count}")\n    count += 1\n\n# Output:\n# Count: 0\n# Count: 1\n# Count: 2\n# Count: 3\n# Count: 4', language: 'python' },
    { type: 'text', content: '⚠️ Be careful: if the condition never becomes `False`, you\'ll create an infinite loop. Always ensure the loop variable changes.' },
    { type: 'heading', content: 'break and continue' },
    { type: 'code', content: '# break: exit the loop early\nfor i in range(10):\n    if i == 5:\n        break\n    print(i)\n\n# continue: skip to next iteration\nfor i in range(5):\n    if i == 2:\n        continue\n    print(i)', language: 'python' },
    { type: 'heading', content: 'Practice Task' },
    { type: 'text', content: 'Write a while loop that asks the user for input until they type "quit". Print each input.' },
  ],
  'les_003': [
    { type: 'heading', content: 'Loop Patterns' },
    { type: 'text', content: 'Common patterns you\'ll use frequently in Python loops.' },
    { type: 'heading', content: 'Enumerate' },
    { type: 'code', content: 'fruits = ["apple", "banana", "cherry"]\n\nfor index, fruit in enumerate(fruits):\n    print(f"{index}: {fruit}")\n\n# Output:\n# 0: apple\n# 1: banana\n# 2: cherry', language: 'python' },
    { type: 'heading', content: 'Zip' },
    { type: 'code', content: 'names = ["Alice", "Bob", "Charlie"]\nages = [25, 30, 35]\n\nfor name, age in zip(names, ages):\n    print(f"{name} is {age} years old")', language: 'python' },
    { type: 'heading', content: 'List Comprehension' },
    { type: 'code', content: '# Traditional loop\nsquares = []\nfor x in range(10):\n    squares.append(x ** 2)\n\n# List comprehension (concise)\nsquares = [x ** 2 for x in range(10)]\n\n# With condition\neven_squares = [x ** 2 for x in range(10) if x % 2 == 0]', language: 'python' },
  ],
  'les_004': [
    { type: 'heading', content: 'Nested Loops' },
    { type: 'text', content: 'A nested loop is a loop inside another loop. The inner loop completes all its iterations before the outer loop moves to the next iteration.' },
    { type: 'code', content: '# Multiplication table\nfor i in range(1, 4):\n    for j in range(1, 4):\n        print(f"{i} x {j} = {i * j}")\n    print()  # Empty line between tables', language: 'python' },
    { type: 'heading', content: 'When to Use Nested Loops' },
    { type: 'text', content: '• Processing 2D data (matrices, tables)\n• Comparing every pair of items\n• Generating combinations' },
    { type: 'heading', content: 'Practice Task' },
    { type: 'text', content: 'Write nested loops to print a 5x5 grid of asterisks (*). Each row should be on a new line.' },
  ],
  'les_005': [
    { type: 'heading', content: 'Loop Performance' },
    { type: 'text', content: 'While loops are powerful, they can be slower than for loops in Python. Here\'s how to write efficient loops.' },
    { type: 'heading', content: 'Avoid Unnecessary Loops' },
    { type: 'code', content: '# Slow: loop to find sum\nresult = 0\nfor i in range(1000000):\n    result += i\n\n# Fast: built-in sum()\nresult = sum(range(1000000))', language: 'python' },
    { type: 'heading', content: 'Use Generators for Large Data' },
    { type: 'code', content: '# Memory efficient generator\ndef fibonacci():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\n# Get first 10 Fibonacci numbers\nfib = fibonacci()\nfor _ in range(10):\n    print(next(fib))', language: 'python' },
    { type: 'heading', content: 'Practice Task' },
    { type: 'text', content: 'Rewrite this slow code to be faster using Python built-ins:\n\n```python\nresult = []\nfor i in range(100):\n    if i % 2 == 0:\n        result.append(i * 2)\n```' },
  ],
};

export const resources: Record<string, Resource[]> = {
  'les_001': [
    { id: 'res_001', title: 'Python Loops Cheat Sheet', type: 'pdf', url: '#', size: '245 KB' },
    { id: 'res_002', title: 'Loop Exercises (ZIP)', type: 'zip', url: '#', size: '1.2 MB' },
    { id: 'res_003', title: 'Python Docs: Control Flow', type: 'link', url: 'https://docs.python.org/3/tutorial/controlflow.html' },
  ],
  'les_002': [
    { id: 'res_004', title: 'While Loops Guide', type: 'pdf', url: '#', size: '180 KB' },
    { id: 'res_005', title: 'Infinite Loop Debugger', type: 'zip', url: '#', size: '890 KB' },
  ],
};
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/data/mockData.ts
git commit -m "feat: add lesson content and resources mock data"
```

---

### Task 3: Create useLessonProgress Hook

**Files:**
- Create: `src/hooks/useLessonProgress.ts`

**Interfaces:**
- Produces: `useLessonProgress` hook

- [ ] **Step 1: Create the hook**

```typescript
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'smugflex_lesson_progress';

function getStoredProgress(): Record<string, string[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<string, string[]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useLessonProgress(courseId: string, totalLessons: number) {
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const progress = getStoredProgress();
    return progress[courseId] || [];
  });

  useEffect(() => {
    const progress = getStoredProgress();
    progress[courseId] = completedLessons;
    saveProgress(progress);
  }, [courseId, completedLessons]);

  const toggleLesson = useCallback((lessonId: string) => {
    setCompletedLessons(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  }, []);

  const isCompleted = useCallback((lessonId: string) => {
    return completedLessons.includes(lessonId);
  }, [completedLessons]);

  const progress = totalLessons > 0
    ? Math.round((completedLessons.length / totalLessons) * 100)
    : 0;

  return { completedLessons, toggleLesson, isCompleted, progress };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useLessonProgress.ts
git commit -m "feat: add useLessonProgress hook with localStorage"
```

---

### Task 4: Create LessonContent Component

**Files:**
- Create: `src/components/learning/LessonContent.tsx`

**Interfaces:**
- Consumes: `LessonContent` type from `src/types.ts`
- Consumes: `CodeBlock` from `src/components/ai/CodeBlock.tsx`

- [ ] **Step 1: Create the component**

```tsx
import type { LessonContent as LessonContentType } from '../../types';
import CodeBlock from '../ai/CodeBlock';

interface LessonContentProps {
  content: LessonContentType[];
}

export default function LessonContent({ content }: LessonContentProps) {
  return (
    <div className="space-y-6">
      {content.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2
                key={index}
                className="text-xl font-bold font-display"
                style={{ color: '#F1F5F9' }}
              >
                {block.content}
              </h2>
            );
          case 'text':
            return (
              <p
                key={index}
                className="text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: '#94A3B8' }}
              >
                {block.content}
              </p>
            );
          case 'code':
            return (
              <div key={index} className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
                <CodeBlock code={block.content} language={block.language || 'python'} />
              </div>
            );
          case 'image':
            return (
              <figure key={index}>
                <img
                  src={block.content}
                  alt={block.caption || ''}
                  className="w-full rounded-xl"
                  style={{ border: '1px solid rgba(59,130,246,0.1)' }}
                />
                {block.caption && (
                  <figcaption className="text-xs mt-2 text-center" style={{ color: '#64748B' }}>
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/components/learning/LessonContent.tsx
git commit -m "feat: add LessonContent component for rich text rendering"
```

---

### Task 5: Create NotesPanel Component

**Files:**
- Create: `src/components/learning/NotesPanel.tsx`

**Interfaces:**
- Produces: `NotesPanel` component

- [ ] **Step 1: Create the component**

```tsx
import { useState, useEffect, useCallback } from 'react';

const NOTES_STORAGE_KEY = 'smugflex_notes';

interface NotesPanelProps {
  lessonId: string;
  userId: string;
}

function getStoredNotes(): Record<string, string> {
  try {
    const stored = localStorage.getItem(NOTES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveNotes(notes: Record<string, string>) {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}

export default function NotesPanel({ lessonId, userId }: NotesPanelProps) {
  const noteKey = `${userId}_${lessonId}`;
  const [content, setContent] = useState(() => {
    const notes = getStoredNotes();
    return notes[noteKey] || '';
  });
  const [saved, setSaved] = useState(false);

  const saveNote = useCallback(() => {
    const notes = getStoredNotes();
    notes[noteKey] = content;
    saveNotes(notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [noteKey, content]);

  useEffect(() => {
    const timer = setTimeout(saveNote, 500);
    return () => clearTimeout(timer);
  }, [content, saveNote]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold" style={{ color: '#475569' }}>MY NOTES</p>
        {saved && (
          <p className="text-xs" style={{ color: '#10B981' }}>Saved</p>
        )}
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Take notes about this lesson..."
        className="w-full h-64 px-4 py-3 rounded-xl text-sm outline-none resize-none"
        style={{
          background: '#060A12',
          color: '#F1F5F9',
          border: '1px solid rgba(59,130,246,0.2)',
        }}
      />
      <p className="text-xs" style={{ color: '#475569' }}>
        {content.length} characters · Notes are auto-saved
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/components/learning/NotesPanel.tsx
git commit -m "feat: add NotesPanel component with localStorage persistence"
```

---

### Task 6: Create ResourcesList Component

**Files:**
- Create: `src/components/learning/ResourcesList.tsx`

**Interfaces:**
- Consumes: `Resource` type from `src/types.ts`

- [ ] **Step 1: Create the component**

```tsx
import { FileText, Archive, ExternalLink, Download } from 'lucide-react';
import type { Resource } from '../../types';

interface ResourcesListProps {
  resources: Resource[];
}

const iconMap = {
  pdf: FileText,
  zip: Archive,
  link: ExternalLink,
};

const colorMap = {
  pdf: '#EF4444',
  zip: '#F59E0B',
  link: '#3B82F6',
};

export default function ResourcesList({ resources }: ResourcesListProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm" style={{ color: '#64748B' }}>No resources available for this lesson.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {resources.map((resource) => {
        const Icon = iconMap[resource.type];
        const color = colorMap[resource.type];

        return (
          <div
            key={resource.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
            style={{ background: '#060A12', border: '1px solid rgba(59,130,246,0.1)' }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}15` }}
            >
              <Icon size={18} style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#F1F5F9' }}>
                {resource.title}
              </p>
              {resource.size && (
                <p className="text-xs" style={{ color: '#64748B' }}>{resource.size}</p>
              )}
            </div>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg transition-all"
              style={{ color: '#3B82F6' }}
            >
              <Download size={16} />
            </a>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/components/learning/ResourcesList.tsx
git commit -m "feat: add ResourcesList component"
```

---

### Task 7: Rewrite CourseLearning Page

**Files:**
- Modify: `src/pages/CourseLearning.tsx`

**Interfaces:**
- Consumes: All components from Tasks 4-6, `useLessonProgress` from Task 3, `CurriculumList`, `LoadingSpinner`, `courses`, `curriculum`, `lessonContents`, `resources` from mockData

- [ ] **Step 1: Replace entire src/pages/CourseLearning.tsx**

```tsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, FileText, MessageSquare, Wrench } from 'lucide-react';
import { courses, curriculum, lessonContents, resources } from '../data/mockData';
import { useLessonProgress } from '../hooks/useLessonProgress';
import CurriculumList from '../components/course/CurriculumList';
import LessonContent from '../components/learning/LessonContent';
import NotesPanel from '../components/learning/NotesPanel';
import ResourcesList from '../components/learning/ResourcesList';
import LoadingSpinner from '../components/ui/LoadingSpinner';

type Tab = 'lesson' | 'notes' | 'resources';

export default function CourseLearning() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const courseId = searchParams.get('courseId') || courses[0].id;
  const moduleIndex = parseInt(searchParams.get('module') || '0', 10);
  const lessonIndex = parseInt(searchParams.get('lesson') || '0', 10);

  const course = courses.find(c => c.id === courseId) || courses[0];
  const currentModule = curriculum[moduleIndex] || curriculum[0];
  const currentLesson = currentModule.lessons[lessonIndex] || currentModule.lessons[0];
  const totalLessons = curriculum.reduce((sum, m) => sum + m.lessons.length, 0);

  const { isCompleted, toggleLesson, progress } = useLessonProgress(courseId, totalLessons);
  const [activeTab, setActiveTab] = useState<Tab>('lesson');
  const [showNotes, setShowNotes] = useState(false);

  const lessonContent = lessonContents[currentLesson.id] || [];
  const lessonResources = resources[currentLesson.id] || [];

  const updateLesson = (newModule: number, newLesson: number) => {
    setSearchParams({ courseId, module: String(newModule), lesson: String(newLesson) });
  };

  const goNext = () => {
    if (lessonIndex < currentModule.lessons.length - 1) {
      updateLesson(moduleIndex, lessonIndex + 1);
    } else if (moduleIndex < curriculum.length - 1) {
      updateLesson(moduleIndex + 1, 0);
    }
  };

  const goPrev = () => {
    if (lessonIndex > 0) {
      updateLesson(moduleIndex, lessonIndex - 1);
    } else if (moduleIndex > 0) {
      const prevModule = curriculum[moduleIndex - 1];
      updateLesson(moduleIndex - 1, prevModule.lessons.length - 1);
    }
  };

  const handleLessonClick = (moduleIdx: number, lessonIdx: number) => {
    updateLesson(moduleIdx, lessonIdx);
  };

  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: 'lesson', label: 'Lesson', icon: BookOpen },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'resources', label: 'Resources', icon: Wrench },
  ];

  return (
    <div className="flex flex-col h-screen" style={{ background: '#060A12' }}>
      {/* Top Bar */}
      <div
        className="flex items-center gap-4 px-4 py-3 flex-shrink-0"
        style={{ background: '#0D1421', borderBottom: '1px solid rgba(59,130,246,0.1)' }}
      >
        <button
          onClick={() => navigate('/my-courses')}
          className="flex items-center gap-2 text-sm"
          style={{ color: '#64748B' }}
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">My Courses</span>
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: '#F1F5F9' }}>
            {course.title}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(59,130,246,0.1)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, background: '#3B82F6' }}
            />
          </div>
          <span className="text-xs font-medium" style={{ color: '#3B82F6' }}>{progress}%</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Curriculum */}
        <aside
          className="hidden lg:flex flex-col w-72 flex-shrink-0 overflow-y-auto"
          style={{ background: '#0D1421', borderRight: '1px solid rgba(59,130,246,0.1)' }}
        >
          <div className="p-4">
            <CurriculumList
              modules={curriculum}
              currentModuleIndex={moduleIndex}
              currentLessonIndex={lessonIndex}
              completedLessons={[]}
              onLessonClick={handleLessonClick}
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div
            className="flex items-center gap-1 px-4 py-2 flex-shrink-0"
            style={{ background: '#0D1421', borderBottom: '1px solid rgba(59,130,246,0.1)' }}
          >
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                  style={{
                    background: activeTab === tab.id ? 'rgba(59,130,246,0.1)' : 'transparent',
                    color: activeTab === tab.id ? '#3B82F6' : '#64748B',
                  }}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {activeTab === 'lesson' && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold font-display" style={{ color: '#F1F5F9' }}>
                    {currentLesson.title}
                  </h1>
                  <button
                    onClick={() => toggleLesson(currentLesson.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
                    style={{
                      background: isCompleted(currentLesson.id) ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)',
                      color: isCompleted(currentLesson.id) ? '#10B981' : '#3B82F6',
                      border: `1px solid ${isCompleted(currentLesson.id) ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.3)'}`,
                    }}
                  >
                    <CheckCircle2 size={16} />
                    {isCompleted(currentLesson.id) ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>

                {lessonContent.length > 0 ? (
                  <LessonContent content={lessonContent} />
                ) : (
                  <div
                    className="rounded-xl p-8 text-center"
                    style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
                  >
                    <BookOpen size={48} className="mx-auto mb-4" style={{ color: '#475569' }} />
                    <p className="text-sm" style={{ color: '#64748B' }}>
                      No content available for this lesson yet.
                    </p>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}>
                  <button
                    onClick={goPrev}
                    disabled={moduleIndex === 0 && lessonIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-40"
                    style={{ background: '#0D1421', color: '#94A3B8', border: '1px solid rgba(59,130,246,0.15)' }}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <button
                    onClick={goNext}
                    disabled={moduleIndex === curriculum.length - 1 && lessonIndex === currentModule.lessons.length - 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-40"
                    style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.3)' }}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="max-w-3xl mx-auto">
                <NotesPanel lessonId={currentLesson.id} userId="usr_001" />
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="max-w-3xl mx-auto">
                <ResourcesList resources={lessonResources} />
              </div>
            )}
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
git add src/pages/CourseLearning.tsx
git commit -m "feat: rewrite CourseLearning with dynamic routing, progress tracking, tabs"
```

---

### Task 8: Final Verification

**Files:**
- None (read-only verification)

- [ ] **Step 1: TypeScript check**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Write report**

Write to: `docs/superpowers/plans/phase-4-verification-report.md`

- [ ] **Step 4: Push to remote**

```bash
git push
```
