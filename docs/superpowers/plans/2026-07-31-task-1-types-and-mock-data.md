# Task 1: Extend Types and Mock Data for Certificates & Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add new TypeScript interfaces (`CertificateData`, `NotificationType`, `Notification`) and corresponding mock data arrays (`certificates`, `notifications`) to the existing codebase, ensuring TypeScript compilation and no regressions.

**Architecture:** Append new types to `src/types.ts`. Rename existing `certificates` export to `adminCertificates` in `src/data/mockData.ts` and update all imports. Add new `certificates` array of type `CertificateData[]` and `notifications` array of type `Notification[]`. Verify TypeScript compiles.

**Tech Stack:** TypeScript, React, Vite, Tailwind CSS v4.

## Global Constraints
- Follow existing code conventions (double quotes for strings with apostrophes, proper JSX closing).
- Use Tailwind utility classes in JSX.
- Keep CSS imports in `src/index.css`.
- No new dependencies.
- Commit with conventional commit format.

---

### Task 1: Add new types to `src/types.ts`

**Files:**
- Modify: `src/types.ts`

**Interfaces:**
- Consumes: None
- Produces: `CertificateData`, `NotificationType`, `Notification` (exported)

- [ ] **Step 1: Append new interfaces to end of file**

Open `src/types.ts` and append after the last line (line 318):

```typescript
export interface CertificateData {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  studentName: string;
  score: number;
  issuedAt: string;
  verificationCode: string;
}

export type NotificationType = 'course' | 'achievement' | 'system' | 'reminder';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
```

- [ ] **Step 2: Verify no syntax errors**

Run: `npx tsc --noEmit`
Expected: 0 errors (or errors unrelated to new types)

---

### Task 2: Update existing mock data imports and rename `certificates`

**Files:**
- Modify: `src/data/mockData.ts`
- Modify: `src/hooks/useAdmin.ts`
- Modify: `src/mocks/handlers.ts`

**Interfaces:**
- Consumes: `Certificate` from `../types`
- Produces: Renamed `adminCertificates` export, updated imports

- [ ] **Step 1: Rename `certificates` export in `src/data/mockData.ts`**

In `src/data/mockData.ts`, change line 623 from:
```typescript
export const certificates: Certificate[] = [
```
to:
```typescript
export const adminCertificates: Certificate[] = [
```

- [ ] **Step 2: Update import in `src/hooks/useAdmin.ts`**

In `src/hooks/useAdmin.ts`, line 3:
```typescript
import { courses, users, adminStats, recentTransactions, certificates, knowledgeBases } from '../data/mockData';
```
Change to:
```typescript
import { courses, users, adminStats, recentTransactions, adminCertificates, knowledgeBases } from '../data/mockData';
```

Then update usage in queryFn (line 36):
```typescript
queryFn: () => Promise.resolve(certificates),
```
to:
```typescript
queryFn: () => Promise.resolve(adminCertificates),
```

- [ ] **Step 3: Update import in `src/mocks/handlers.ts`**

In `src/mocks/handlers.ts`, line 2:
```typescript
import { courses, curriculum, courseReviews, enrolledCourses, studentStats, aiInsights, chatHistory, adminStats, recentTransactions, users, certificates, knowledgeBases } from '../data/mockData';
```
Change to:
```typescript
import { courses, curriculum, courseReviews, enrolledCourses, studentStats, aiInsights, chatHistory, adminStats, recentTransactions, users, adminCertificates, knowledgeBases } from '../data/mockData';
```

Then update usage in handler (line 393):
```typescript
data: certificates,
```
to:
```typescript
data: adminCertificates,
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

---

### Task 3: Add new mock data arrays to `src/data/mockData.ts`

**Files:**
- Modify: `src/data/mockData.ts`

**Interfaces:**
- Consumes: `CertificateData`, `Notification` from `../types`
- Produces: `certificates` (new), `notifications` (new)

- [ ] **Step 1: Import new types**

Add `CertificateData` and `Notification` to the import statement at line 1:
```typescript
import type { Course, CourseModule, CourseReview, Enrollment, ChatMessage, AIInsight, StudentStats, LearningStreak, LessonContent, Resource, CodeExercise, AdminStats, Transaction, Certificate, KnowledgeBase, Assessment, CertificateData, Notification } from '../types';
```

- [ ] **Step 2: Add `certificates` array**

After the `adminCertificates` array (around line 630), add:

```typescript
export const certificates: CertificateData[] = [
  {
    id: 'CERT-DATA-001',
    userId: 'STU-001',
    courseId: '2',
    courseName: 'Machine Learning Fundamentals',
    studentName: 'Emeka Okafor',
    score: 92,
    issuedAt: '2026-06-20',
    verificationCode: 'VRF-ML-2026-EMK-001',
  },
  {
    id: 'CERT-DATA-002',
    userId: 'STU-002',
    courseId: '4',
    courseName: 'React & TypeScript Mastery',
    studentName: 'Adaeze Williams',
    score: 88,
    issuedAt: '2026-07-15',
    verificationCode: 'VRF-RT-2026-ADA-002',
  },
  {
    id: 'CERT-DATA-003',
    userId: 'STU-003',
    courseId: '1',
    courseName: 'Python for AI',
    studentName: 'Chukwuemeka Eze',
    score: 76,
    issuedAt: '2026-07-28',
    verificationCode: 'VRF-PA-2026-CHU-003',
  },
  {
    id: 'CERT-DATA-004',
    userId: 'STU-004',
    courseId: '3',
    courseName: 'Data Science with Python',
    studentName: 'Yetunde Akinola',
    score: 95,
    issuedAt: '2026-07-10',
    verificationCode: 'VRF-DS-2026-YET-004',
  },
];
```

- [ ] **Step 3: Add `notifications` array**

After the new `certificates` array, add:

```typescript
export const notifications: Notification[] = [
  {
    id: 'NOTIF-001',
    type: 'course',
    title: 'New Lesson Available',
    message: 'Module 2 Lesson 5: Advanced List Comprehensions is now available in Python for AI.',
    timestamp: '2026-07-31T08:00:00Z',
    read: false,
    actionUrl: '/courses/1/learn',
  },
  {
    id: 'NOTIF-002',
    type: 'achievement',
    title: 'Achievement Unlocked!',
    message: 'You earned the "12-Day Streak" badge. Your consistency is paying off!',
    timestamp: '2026-07-30T18:30:00Z',
    read: false,
  },
  {
    id: 'NOTIF-003',
    type: 'system',
    title: 'Scheduled Maintenance',
    message: 'The platform will be down for maintenance on August 1st from 2:00 AM to 4:00 AM WAT.',
    timestamp: '2026-07-30T10:00:00Z',
    read: true,
  },
  {
    id: 'NOTIF-004',
    type: 'reminder',
    title: 'Assignment Due Tomorrow',
    message: 'Assignment 3: Build a Number Guessing Game is due July 31st at 11:59 PM.',
    timestamp: '2026-07-30T09:00:00Z',
    read: true,
    actionUrl: '/assignments/3',
  },
  {
    id: 'NOTIF-005',
    type: 'course',
    title: 'Course Update',
    message: 'React & TypeScript Mastery has been updated with new TypeScript 5.3 features.',
    timestamp: '2026-07-29T14:00:00Z',
    read: true,
    actionUrl: '/courses/4',
  },
  {
    id: 'NOTIF-006',
    type: 'achievement',
    title: 'Top Performer',
    message: 'You scored 95% on the Data Science with Python final assessment. Congratulations!',
    timestamp: '2026-07-28T16:00:00Z',
    read: true,
  },
  {
    id: 'NOTIF-007',
    type: 'system',
    title: 'New Feature: AI Code Review',
    message: 'Our AI tutor now provides real-time code review suggestions in the coding lab.',
    timestamp: '2026-07-27T12:00:00Z',
    read: true,
  },
  {
    id: 'NOTIF-008',
    type: 'reminder',
    title: 'Course Enrollment Closing',
    message: 'Enrollment for Deep Learning & Neural Networks closes in 3 days. Don\'t miss out!',
    timestamp: '2026-07-26T08:00:00Z',
    read: true,
    actionUrl: '/courses/7',
  },
];
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

---

### Task 4: Commit changes

**Files:**
- Modify: `src/types.ts`
- Modify: `src/data/mockData.ts`
- Modify: `src/hooks/useAdmin.ts`
- Modify: `src/mocks/handlers.ts`

**Interfaces:**
- Consumes: None
- Produces: Committed changes

- [ ] **Step 1: Stage modified files**

Run:
```bash
git add src/types.ts src/data/mockData.ts src/hooks/useAdmin.ts src/mocks/handlers.ts
```

- [ ] **Step 2: Commit with message**

Run:
```bash
git commit -m "feat: add certificate and notification types with mock data"
```

- [ ] **Step 3: Verify commit succeeded**

Run: `git log --oneline -1`
Expected: shows new commit with above message

---

### Task 5: Write report

**Files:**
- Create: `.superpowers/sdd/task-1-report.md`

**Interfaces:**
- Consumes: None
- Produces: Report file

- [ ] **Step 1: Create report file**

Write to `.superpowers/sdd/task-1-report.md`:

```markdown
# Task 1 Report: Extend Types and Mock Data for Certificates & Notifications

## Status: DONE

## Commit SHA
<SHA from git log>

## Test Summary
- TypeScript compilation: PASSED (0 errors)
- No runtime errors detected
- Existing admin functionality preserved (renamed import)

## Files Modified
- `src/types.ts` - Added `CertificateData`, `NotificationType`, `Notification` interfaces
- `src/data/mockData.ts` - Renamed `certificates` to `adminCertificates`, added new `certificates` (CertificateData[]) and `notifications` (Notification[]) arrays
- `src/hooks/useAdmin.ts` - Updated import to use `adminCertificates`
- `src/mocks/handlers.ts` - Updated import to use `adminCertificates`

## Notes
- Existing `Certificate` interface and `adminCertificates` array preserved for admin functionality
- New `certificates` array uses `CertificateData` interface with additional fields (userId, courseId, verificationCode)
- Notifications include mixed types (course, achievement, system, reminder) with read/unread states
- All mock data uses realistic values referencing existing user and course IDs
```

- [ ] **Step 2: Update report with actual commit SHA**

After commit, get SHA with `git log --oneline -1 --format="%H"` and replace `<SHA from git log>` in the report.

---

**End of Plan**