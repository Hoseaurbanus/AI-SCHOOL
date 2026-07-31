# Phase 4: Course Learning — Design Spec

**Version:** 1.0
**Date:** 2026-07-31
**Status:** Approved

---

## Goal

Transform the hardcoded `CourseLearning.tsx` page into a dynamic lesson viewer with rich text content, real progress tracking, and proper curriculum navigation.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/types.ts` | Add `LessonContent`, `Note`, `Resource` types |
| `src/data/mockData.ts` | Add lesson content data, resources, notes |
| `src/pages/CourseLearning.tsx` | Rewrite to use dynamic routing, React Query, real progress |

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/learning/LessonContent.tsx` | Rich text renderer (markdown-like → JSX) |
| `src/components/learning/NotesPanel.tsx` | Notes with localStorage persistence |
| `src/components/learning/ResourcesList.tsx` | Downloadable resources list |
| `src/hooks/useLessonProgress.ts` | Track lesson completion per enrollment |

---

## Data Model

### New Types (add to `src/types.ts`)

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

### Mock Data Additions (add to `src/data/mockData.ts`)

- `lessonContents`: `Record<string, LessonContent[]>` — maps lesson IDs to content arrays
- 3-5 sample lessons with rich text: headings, paragraphs, code blocks
- `resources`: `Record<string, Resource[]>` — maps lesson IDs to resource arrays
- Sample resources: PDF guide, ZIP exercise files, external link

---

## Component Design

### LessonContent (`src/components/learning/LessonContent.tsx`)

- Props: `{ content: LessonContent[] }`
- Renders each content block based on `type`:
  - `heading` → `<h2>` or `<h3>` with appropriate styling
  - `text` → `<p>` with prose styling
  - `code` → `<CodeBlock>` component (already exists at `src/components/ai/CodeBlock.tsx`)
  - `image` → `<img>` with caption
- Uses the dark theme design system (`#060A12` background, `#F1F5F9` text)

### NotesPanel (`src/components/learning/NotesPanel.tsx`)

- Props: `{ lessonId: string; userId: string }`
- Uses `localStorage` key: `notes_${userId}_${lessonId}`
- Auto-saves on change (debounced 500ms)
- Textarea with "Notes are auto-saved" label
- Character count display

### ResourcesList (`src/components/learning/ResourcesList.tsx`)

- Props: `{ resources: Resource[] }`
- Lists resources with icon (PDF/ZIP/link), title, size
- Download button (opens URL in new tab for links, no-op for files since no real hosting)

### useLessonProgress (`src/hooks/useLessonProgress.ts`)

- Props: `{ enrollmentId: string; courseId: string }`
- Uses Zustand or localStorage to track completed lessons
- Returns: `{ completedLessons: string[], toggleLesson: (lessonId: string) => void, progress: number }`
- Progress = completedLessons / totalLessons * 100

---

## Page Behavior

### Route

`/courses/:id/learn?module=0&lesson=0`

- `:id` — course ID
- `module` — module index (0-based)
- `lesson` — lesson index within module (0-based)

### Layout (3-column)

1. **Left sidebar (280px):** Curriculum list with expandable modules, lesson checkmarks, click to navigate
2. **Main content (flex-1):** Lesson viewer with content, notes, resources tabs
3. **Right sidebar (optional, toggleable):** Quick links to AI Tutor and Coding Lab

### Main Content Tabs

1. **Lesson tab:** Rich text content rendered by `LessonContent`, "Mark as Complete" button, Previous/Next navigation
2. **Notes tab:** `NotesPanel` component
3. **Resources tab:** `ResourcesList` component

### Top Bar

- Course title
- Progress bar (percentage from `useLessonProgress`)
- "Back to My Courses" link

---

## What We're NOT Building (YAGNI)

- Real video player (keep placeholder image)
- Real file downloads (just UI with URLs)
- AI tutor integration in lesson view (already on `/ai-tutor`)
- Real-time collaboration or comments
- Lesson quizzes (covered in Phase 5/6 assessments)

---

## Dark Theme Design System

| Element | Style |
|---------|-------|
| Page background | `#060A12` |
| Sidebar background | `#0D1421` |
| Card/panel background | `#0D1421` with `border: 1px solid rgba(59,130,246,0.1)` |
| Primary text | `#F1F5F9` |
| Secondary text | `#94A3B8` |
| Muted text | `#64748B` |
| Accent blue | `#3B82F6` |
| Accent purple | `#8B5CF6` |
| Success green | `#10B981` |
| Code background | `#060A12` |
