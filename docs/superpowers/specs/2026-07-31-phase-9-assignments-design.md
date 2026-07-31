# Phase 9: Assignments — Design Spec

## Overview
The assignment system allows students to submit code for instructor/AI review, receive feedback, and track their submission history. This builds on the existing Assignment page which has a basic submission flow.

## Scope

### New Types
```typescript
export type AssignmentStatus = 'pending' | 'submitted' | 'graded' | 'returned';

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  requirements: { text: string; points: number }[];
  dueDate: string;
  totalPoints: number;
  language: 'python' | 'html' | 'javascript';
  starterCode?: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  code: string;
  submittedAt: string;
  status: AssignmentStatus;
  score?: number;
  feedback?: string;
  gradedAt?: string;
}
```

### New Mock Data
- `assignments`: 3 assignments across different courses
- `assignmentSubmissions`: 2-3 past submissions with varied statuses

### New Components
1. **AssignmentCard** (`src/components/assignment/AssignmentCard.tsx`)
   - Compact card for assignment listing
   - Shows title, course, due date, status badge, points
   - Click to view/submit

2. **SubmissionForm** (`src/components/assignment/SubmissionForm.tsx`)
   - Code textarea with syntax highlighting hints
   - File upload drop zone
   - Submit button with loading state

3. **FeedbackPanel** (`src/components/assignment/FeedbackPanel.tsx`)
   - Displays AI/instructor feedback
   - Score breakdown by requirement
   - Return to revise button

### Page Rewrite
- **Assignment.tsx**: Two modes:
  1. **List mode** (no query params): Shows all assignments for enrolled courses with filters
  2. **Detail mode** (`?id=assignmentId`): Shows assignment details, submission form, and feedback

### MSW Handlers
- `GET /api/assignments` — List assignments
- `GET /api/assignments/:id` — Get assignment detail
- `POST /api/assignments/:id/submit` — Submit code

## Files to Create/Modify
1. `src/types.ts` — Add Assignment, AssignmentSubmission, AssignmentStatus
2. `src/data/mockData.ts` — Add assignments and assignmentSubmissions arrays
3. `src/components/assignment/AssignmentCard.tsx` — New
4. `src/components/assignment/SubmissionForm.tsx` — New
5. `src/components/assignment/FeedbackPanel.tsx` — New
6. `src/pages/Assignment.tsx` — Rewrite
7. `src/mocks/handlers.ts` — Add assignment handlers
