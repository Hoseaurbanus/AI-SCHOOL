# Phase 7: Assessments & Results Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Assessment and Results pages into a working quiz/assessment system with question types, scoring, and results display.

**Architecture:** Local state management for quiz flow, React Query for results history, timer with useEffect, score calculation on submit.

**Tech Stack:** React 19, TanStack React Query, Zustand, Tailwind CSS v4

## Global Constraints

- React 19, Vite 8, TypeScript 5.7, Tailwind CSS v4
- Dark theme design system: `#060A12` background, `#0D1421` panels, `#F1F5F9` primary text
- Use existing components: `LoadingSpinner`, `ConfirmDialog`

---

### Task 1: Extend Types and Mock Data for Assessments

**Files:**
- Modify: `src/types.ts`
- Modify: `src/data/mockData.ts`

**Interfaces:**
- Produces: `QuestionType`, `Question`, `Assessment`, `AssessmentResult` types

- [ ] **Step 1: Add new types to src/types.ts**

Append to end of file:

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
  timeLimit: number;
  passingScore: number;
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
  timeTaken: number;
  completedAt: string;
}
```

- [ ] **Step 2: Add assessment data to mockData.ts**

Add imports for new types and create assessments array with 3 assessments, each with 5-10 questions covering multiple-choice, true-false, and code-completion types.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/types.ts src/data/mockData.ts
git commit -m "feat: add assessment types and mock data"
```

---

### Task 2: Create useAssessment Hook

**Files:**
- Create: `src/hooks/useAssessment.ts`

**Interfaces:**
- Produces: `useAssessment` hook

- [ ] **Step 1: Create the hook**

```typescript
import { useState, useEffect, useCallback } from 'react';
import type { Assessment, AssessmentResult, Question } from '../types';

interface UseAssessmentReturn {
  currentQuestion: Question;
  currentIndex: number;
  answers: Record<string, string[]>;
  setAnswer: (questionId: string, answerIds: string[]) => void;
  goNext: () => void;
  goPrev: () => void;
  goToQuestion: (index: number) => void;
  submit: () => AssessmentResult;
  result: AssessmentResult | null;
  timeRemaining: number;
  isSubmitted: boolean;
  totalQuestions: number;
}

export function useAssessment(assessment: Assessment): UseAssessmentReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(assessment.timeLimit * 60);

  const currentQuestion = assessment.questions[currentIndex];

  useEffect(() => {
    if (result) return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [result]);

  useEffect(() => {
    if (timeRemaining === 0 && !result) {
      submit();
    }
  }, [timeRemaining, result]);

  const setAnswer = useCallback((questionId: string, answerIds: string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIds }));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(prev + 1, assessment.questions.length - 1));
  }, [assessment.questions.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const goToQuestion = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const calculateScore = useCallback(() => {
    let totalPoints = 0;
    let earnedPoints = 0;

    assessment.questions.forEach(question => {
      totalPoints += question.points;
      const selected = answers[question.id] || [];
      const correct = question.correctAnswers;
      const isCorrect = selected.length === correct.length && selected.every(s => correct.includes(s));
      if (isCorrect) earnedPoints += question.points;
    });

    return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  }, [assessment.questions, answers]);

  const submit = useCallback((): AssessmentResult => {
    const score = calculateScore();
    const assessmentResult: AssessmentResult = {
      id: `result_${Date.now()}`,
      assessmentId: assessment.id,
      userId: 'usr_001',
      answers,
      score,
      passed: score >= assessment.passingScore,
      timeTaken: (assessment.timeLimit * 60) - timeRemaining,
      completedAt: new Date().toISOString(),
    };
    setResult(assessmentResult);
    return assessmentResult;
  }, [assessment, answers, timeRemaining, calculateScore]);

  return {
    currentQuestion,
    currentIndex,
    answers,
    setAnswer,
    goNext,
    goPrev,
    goToQuestion,
    submit,
    result,
    timeRemaining,
    isSubmitted: result !== null,
    totalQuestions: assessment.questions.length,
  };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useAssessment.ts
git commit -m "feat: add useAssessment hook with timer and scoring"
```

---

### Task 3: Create Assessment Components

**Files:**
- Create: `src/components/assessment/QuestionCard.tsx`
- Create: `src/components/assessment/QuizProgress.tsx`
- Create: `src/components/assessment/ResultSummary.tsx`

**Interfaces:**
- Consumes: `Question`, `AssessmentResult` types

- [ ] **Step 1: Create QuestionCard.tsx**

```tsx
import { CheckCircle2, XCircle } from 'lucide-react';
import type { Question } from '../../types';

interface QuestionCardProps {
  question: Question;
  selectedAnswers: string[];
  onAnswer: (ids: string[]) => void;
  showCorrect?: boolean;
}

export default function QuestionCard({ question, selectedAnswers, onAnswer, showCorrect }: QuestionCardProps) {
  const handleSelect = (optionId: string) => {
    if (showCorrect) return;

    if (question.type === 'multiple-select') {
      const newSelection = selectedAnswers.includes(optionId)
        ? selectedAnswers.filter(id => id !== optionId)
        : [...selectedAnswers, optionId];
      onAnswer(newSelection);
    } else {
      onAnswer([optionId]);
    }
  };

  const isCorrect = (optionId: string) => question.correctAnswers.includes(optionId);
  const isSelected = (optionId: string) => selectedAnswers.includes(optionId);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span
          className="px-2 py-1 rounded text-xs font-medium"
          style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}
        >
          {question.points} pts
        </span>
        <p className="text-sm leading-relaxed" style={{ color: '#F1F5F9' }}>
          {question.text}
        </p>
      </div>

      {question.code && (
        <pre
          className="p-4 rounded-xl text-xs font-mono overflow-x-auto"
          style={{ background: '#060A12', color: '#94A3B8', border: '1px solid rgba(59,130,246,0.1)' }}
        >
          {question.code}
        </pre>
      )}

      <div className="space-y-2">
        {question.options.map(option => {
          const selected = isSelected(option.id);
          const correct = isCorrect(option.id);

          let borderColor = 'rgba(59,130,246,0.1)';
          let bgColor = 'transparent';

          if (showCorrect) {
            if (correct) {
              borderColor = 'rgba(16,185,129,0.5)';
              bgColor = 'rgba(16,185,129,0.1)';
            } else if (selected && !correct) {
              borderColor = 'rgba(239,68,68,0.5)';
              bgColor = 'rgba(239,68,68,0.1)';
            }
          } else if (selected) {
            borderColor = 'rgba(59,130,246,0.5)';
            bgColor = 'rgba(59,130,246,0.1)';
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
              style={{ background: bgColor, border: `1px solid ${borderColor}` }}
            >
              <div
                className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{
                  border: `2px solid ${selected ? '#3B82F6' : '#475569'}`,
                  background: selected ? '#3B82F6' : 'transparent',
                }}
              >
                {selected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className="text-sm" style={{ color: '#94A3B8' }}>{option.text}</span>
              {showCorrect && correct && (
                <CheckCircle2 size={16} className="ml-auto" style={{ color: '#10B981' }} />
              )}
              {showCorrect && selected && !correct && (
                <XCircle size={16} className="ml-auto" style={{ color: '#EF4444' }} />
              )}
            </button>
          );
        })}
      </div>

      {showCorrect && (
        <div
          className="p-3 rounded-xl text-xs"
          style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)' }}
        >
          <p style={{ color: '#94A3B8' }}>{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create QuizProgress.tsx**

```tsx
import { Clock } from 'lucide-react';

interface QuizProgressProps {
  current: number;
  total: number;
  timeRemaining?: number;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function QuizProgress({ current, total, timeRemaining }: QuizProgressProps) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs" style={{ color: '#64748B' }}>
            Question {current + 1} of {total}
          </span>
          <span className="text-xs font-medium" style={{ color: '#3B82F6' }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(59,130,246,0.1)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, background: '#3B82F6' }}
          />
        </div>
      </div>
      {timeRemaining !== undefined && (
        <div className="flex items-center gap-1.5">
          <Clock size={14} style={{ color: timeRemaining < 60 ? '#EF4444' : '#64748B' }} />
          <span
            className="text-sm font-mono font-medium"
            style={{ color: timeRemaining < 60 ? '#EF4444' : '#94A3B8' }}
          >
            {formatTime(timeRemaining)}
          </span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create ResultSummary.tsx**

```tsx
import { CheckCircle2, XCircle, Clock, Award, RotateCcw } from 'lucide-react';
import type { Assessment, AssessmentResult } from '../../types';

interface ResultSummaryProps {
  result: AssessmentResult;
  assessment: Assessment;
  onRetry?: () => void;
}

export default function ResultSummary({ result, assessment, onRetry }: ResultSummaryProps) {
  const passed = result.passed;

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div
        className="p-6 rounded-2xl text-center"
        style={{ background: '#0D1421', border: `1px solid ${passed ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}
      >
        <div
          className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: passed ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }}
        >
          {passed ? (
            <Award size={32} style={{ color: '#10B981' }} />
          ) : (
            <XCircle size={32} style={{ color: '#EF4444' }} />
          )}
        </div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: '#F1F5F9' }}>
          {result.score}%
        </h2>
        <p className="text-sm mb-1" style={{ color: passed ? '#10B981' : '#EF4444' }}>
          {passed ? 'Congratulations! You passed!' : 'Keep practicing! You can retry.'}
        </p>
        <p className="text-xs" style={{ color: '#64748B' }}>
          Passing score: {assessment.passingScore}%
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="p-4 rounded-xl"
          style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} style={{ color: '#3B82F6' }} />
            <span className="text-xs" style={{ color: '#64748B' }}>Time Taken</span>
          </div>
          <p className="text-lg font-bold" style={{ color: '#F1F5F9' }}>
            {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
          </p>
        </div>
        <div
          className="p-4 rounded-xl"
          style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} style={{ color: '#10B981' }} />
            <span className="text-xs" style={{ color: '#64748B' }}>Questions</span>
          </div>
          <p className="text-lg font-bold" style={{ color: '#F1F5F9' }}>
            {assessment.questions.length}
          </p>
        </div>
      </div>

      {/* Retry Button */}
      {onRetry && !passed && (
        <button
          onClick={onRetry}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
          style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.3)' }}
        >
          <RotateCcw size={16} />
          Retry Assessment
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 5: Commit**

```bash
git add src/components/assessment/
git commit -m "feat: add QuestionCard, QuizProgress, ResultSummary components"
```

---

### Task 4: Rewrite Assessment Page

**Files:**
- Modify: `src/pages/Assessment.tsx`

**Interfaces:**
- Consumes: useAssessment, QuestionCard, QuizProgress, ResultSummary, assessments, ConfirmDialog

- [ ] **Step 1: Replace entire src/pages/Assessment.tsx**

```tsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Send, BookOpen } from 'lucide-react';
import { assessments } from '../data/mockData';
import { useAssessment } from '../hooks/useAssessment';
import QuestionCard from '../components/assessment/QuestionCard';
import QuizProgress from '../components/assessment/QuizProgress';
import ResultSummary from '../components/assessment/ResultSummary';
import ConfirmDialog from '../components/admin/ConfirmDialog';
import type { Assessment } from '../types';

export default function Assessment() {
  const [selectedAssessment, setSelectedAssessment] = useState(assessments[0]);
  const [quizKey, setQuizKey] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const assessment = selectedAssessment;
  const {
    currentQuestion,
    currentIndex,
    answers,
    setAnswer,
    goNext,
    goPrev,
    goToQuestion,
    submit,
    result,
    timeRemaining,
    isSubmitted,
    totalQuestions,
  } = useAssessment(assessment);

  const handleSubmit = () => {
    setShowSubmitConfirm(true);
  };

  const confirmSubmit = () => {
    submit();
    setShowSubmitConfirm(false);
  };

  const handleRetry = () => {
    setQuizKey(prev => prev + 1);
  };

  const handleAssessmentChange = (id: string) => {
    const found = assessments.find(a => a.id === id);
    if (found) {
      setSelectedAssessment(found);
      setQuizKey(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#060A12' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.15)' }}
            >
              <BookOpen size={20} style={{ color: '#8B5CF6' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display" style={{ color: '#F1F5F9' }}>Assessments</h1>
              <p className="text-xs" style={{ color: '#64748B' }}>Test your knowledge</p>
            </div>
          </div>

          {!isSubmitted && (
            <select
              value={selectedAssessment.id}
              onChange={(e) => handleAssessmentChange(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ background: '#0D1421', color: '#F1F5F9', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              {assessments.map(a => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
          )}
        </div>

        {isSubmitted && result ? (
          <ResultSummary result={result} assessment={assessment} onRetry={handleRetry} />
        ) : (
          <div className="space-y-6">
            {/* Progress */}
            <QuizProgress
              current={currentIndex}
              total={totalQuestions}
              timeRemaining={timeRemaining}
            />

            {/* Question */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
            >
              <QuestionCard
                key={`${quizKey}-${currentIndex}`}
                question={currentQuestion}
                selectedAnswers={answers[currentQuestion.id] || []}
                onAnswer={(ids) => setAnswer(currentQuestion.id, ids)}
              />
            </div>

            {/* Question Grid */}
            <div className="flex flex-wrap gap-2">
              {assessment.questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => goToQuestion(i)}
                  className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: i === currentIndex ? '#3B82F6' : answers[q.id]?.length ? 'rgba(59,130,246,0.15)' : '#0D1421',
                    color: i === currentIndex ? '#FFFFFF' : answers[q.id]?.length ? '#3B82F6' : '#64748B',
                    border: `1px solid ${i === currentIndex ? '#3B82F6' : 'rgba(59,130,246,0.1)'}`,
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm disabled:opacity-40"
                style={{ background: '#0D1421', color: '#94A3B8', border: '1px solid rgba(59,130,246,0.1)' }}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              {currentIndex === totalQuestions - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium"
                  style={{ background: '#3B82F6', color: '#FFFFFF' }}
                >
                  <Send size={16} />
                  Submit
                </button>
              ) : (
                <button
                  onClick={goNext}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.3)' }}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showSubmitConfirm}
        title="Submit Assessment"
        message="Are you sure you want to submit? You cannot change your answers after submission."
        onConfirm={confirmSubmit}
        onCancel={() => setShowSubmitConfirm(false)}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/pages/Assessment.tsx
git commit -m "feat: rewrite Assessment page with quiz engine"
```

---

### Task 5: Rewrite Results Page

**Files:**
- Modify: `src/pages/Results.tsx`

**Interfaces:**
- Consumes: assessments, AssessmentResult

- [ ] **Step 1: Replace entire src/pages/Results.tsx**

```tsx
import { useState } from 'react';
import { Award, Clock, CheckCircle2, XCircle, BarChart3 } from 'lucide-react';
import { assessments } from '../data/mockData';
import type { AssessmentResult } from '../types';

const mockResults: AssessmentResult[] = [
  {
    id: 'res_001',
    assessmentId: 'assess_001',
    userId: 'usr_001',
    answers: {},
    score: 85,
    passed: true,
    timeTaken: 420,
    completedAt: '2026-07-28T14:30:00Z',
  },
  {
    id: 'res_002',
    assessmentId: 'assess_002',
    userId: 'usr_001',
    answers: {},
    score: 65,
    passed: false,
    timeTaken: 540,
    completedAt: '2026-07-29T10:15:00Z',
  },
];

export default function Results() {
  const [selectedResult, setSelectedResult] = useState<AssessmentResult | null>(null);

  const getAssessmentTitle = (id: string) => {
    return assessments.find(a => a.id === id)?.title || 'Unknown Assessment';
  };

  return (
    <div className="min-h-screen" style={{ background: '#060A12' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(59,130,246,0.15)' }}
          >
            <BarChart3 size={20} style={{ color: '#3B82F6' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display" style={{ color: '#F1F5F9' }}>Results</h1>
            <p className="text-xs" style={{ color: '#64748B' }}>Your assessment history</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div
            className="p-4 rounded-xl"
            style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
          >
            <p className="text-2xl font-bold" style={{ color: '#F1F5F9' }}>{mockResults.length}</p>
            <p className="text-xs" style={{ color: '#64748B' }}>Total Attempts</p>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
          >
            <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
              {mockResults.filter(r => r.passed).length}
            </p>
            <p className="text-xs" style={{ color: '#64748B' }}>Passed</p>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
          >
            <p className="text-2xl font-bold" style={{ color: '#3B82F6' }}>
              {Math.round(mockResults.reduce((sum, r) => sum + r.score, 0) / mockResults.length)}%
            </p>
            <p className="text-xs" style={{ color: '#64748B' }}>Avg Score</p>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-3">
          {mockResults.map(result => (
            <div
              key={result.id}
              className="p-4 rounded-xl cursor-pointer transition-all"
              style={{
                background: '#0D1421',
                border: `1px solid ${selectedResult?.id === result.id ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.1)'}`,
              }}
              onClick={() => setSelectedResult(selectedResult?.id === result.id ? null : result)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: result.passed ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }}
                  >
                    {result.passed ? (
                      <Award size={18} style={{ color: '#10B981' }} />
                    ) : (
                      <XCircle size={18} style={{ color: '#EF4444' }} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>
                      {getAssessmentTitle(result.assessmentId)}
                    </p>
                    <p className="text-xs" style={{ color: '#64748B' }}>
                      {new Date(result.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: result.passed ? '#10B981' : '#EF4444' }}>
                      {result.score}%
                    </p>
                    <p className="text-xs" style={{ color: '#64748B' }}>
                      {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
                    </p>
                  </div>
                </div>
              </div>

              {selectedResult?.id === result.id && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#64748B' }}>Status</p>
                      <p className="text-sm font-medium" style={{ color: result.passed ? '#10B981' : '#EF4444' }}>
                        {result.passed ? 'Passed' : 'Failed'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#64748B' }}>Time</p>
                      <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>
                        {Math.floor(result.timeTaken / 60)} minutes {result.timeTaken % 60} seconds
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
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
git add src/pages/Results.tsx
git commit -m "feat: rewrite Results page with assessment history"
```

---

### Task 6: Final Verification

**Files:**
- None (read-only verification)

- [ ] **Step 1: TypeScript check**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Write report**

Write to: `docs/superpowers/plans/phase-7-verification-report.md`

- [ ] **Step 4: Push to remote**

```bash
git push
```
