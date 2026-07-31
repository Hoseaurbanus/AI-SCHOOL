# Phase 7: Assessments & Results — Design Spec

**Version:** 1.0
**Date:** 2026-07-31
**Status:** Approved

---

## Goal

Transform the Assessment and Results pages into a working quiz/assessment system with question types, scoring, and results display.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/types.ts` | Add `Question`, `Assessment`, `AssessmentResult`, `QuestionType` types |
| `src/data/mockData.ts` | Add assessments and questions data |
| `src/pages/Assessment.tsx` | Rewrite with quiz engine |
| `src/pages/Results.tsx` | Rewrite with React Query |

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/assessment/QuestionCard.tsx` | Single question display |
| `src/components/assessment/QuizProgress.tsx` | Progress bar for quiz |
| `src/components/assessment/ResultSummary.tsx` | Score breakdown |
| `src/hooks/useAssessment.ts` | Assessment state management |

---

## Data Model

### New Types (add to `src/types.ts`)

```typescript
export type QuestionType = 'multiple-choice' | 'multiple-select' | 'true-false' | 'code-completion';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  code?: string;
  options: { id: string; text: string }[];
  correctAnswers: string[];
  explanation: string;
  points: number;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  moduleId?: string;
  timeLimit: number; // minutes
  passingScore: number; // percentage
  questions: Question[];
  attempts: number;
  maxAttempts: number;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  userId: string;
  answers: Record<string, string[]>;
  score: number;
  passed: boolean;
  timeTaken: number; // seconds
  completedAt: string;
}
```

### Mock Data Additions

- `assessments`: Array of 3+ assessments with questions
- 5-10 questions per assessment covering different types
- Sample results for demonstration

---

## Component Design

### QuestionCard (`src/components/assessment/QuestionCard.tsx`)

- Props: `{ question: Question; selectedAnswers: string[]; onAnswer: (ids: string[]) => void; showCorrect?: boolean }`
- Renders question text, code snippet (if any), and options
- Handles single-select, multi-select, true/false
- Visual feedback: green for correct, red for incorrect

### QuizProgress (`src/components/assessment/QuizProgress.tsx`)

- Props: `{ current: number; total: number; timeRemaining?: number }`
- Shows current question / total
- Optional countdown timer
- Progress bar

### ResultSummary (`src/components/assessment/ResultSummary.tsx`)

- Props: `{ result: AssessmentResult; assessment: Assessment }`
- Score display with pass/fail indicator
- Time taken
- Question-by-question breakdown
- Retry button (if attempts remaining)

### useAssessment (`src/hooks/useAssessment.ts`)

- Props: `{ assessment: Assessment }`
- Returns: `{ currentQuestion, answers, setAnswer, goNext, goPrev, submit, result, timeRemaining }`
- Manages quiz state: current question index, answers map, timer
- Calculates score on submit

---

## Page Behaviors

### Assessment Page

1. **Select assessment:** Dropdown to choose assessment
2. **Quiz mode:** Questions displayed one at a time
3. **Navigation:** Previous/Next buttons, question grid
4. **Timer:** Countdown (if time limit set)
5. **Submit:** Confirm dialog, then calculate score
6. **Results:** Show ResultSummary component

### Results Page

1. **History:** List of past assessment attempts
2. **Detail view:** Click to see question-by-question breakdown
3. **Stats:** Average score, pass rate, time trends

---

## Dark Theme Design System

| Element | Style |
|---------|-------|
| Page background | `#060A12` |
| Card background | `#0D1421` |
| Question background | `#0D1421` |
| Selected answer | `rgba(59,130,246,0.15)` with blue border |
| Correct answer | `rgba(16,185,129,0.15)` with green border |
| Incorrect answer | `rgba(239,68,68,0.15)` with red border |
| Primary text | `#F1F5F9` |
| Secondary text | `#94A3B8` |
| Muted text | `#64748B` |
| Accent blue | `#3B82F6` |
| Success green | `#10B981` |
| Error red | `#EF4444` |
