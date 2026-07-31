# Phase 6: Admin Dashboard — Design Spec

**Version:** 1.0
**Date:** 2026-07-31
**Status:** Approved

---

## Goal

Enhance the 7 admin pages from static mockups to interactive pages with full CRUD operations, React Query data fetching, and modals for create/edit/delete.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/types.ts` | Add admin-specific types |
| `src/data/mockData.ts` | Expand admin data |
| `src/pages/AdminDashboard.tsx` | Enhanced with React Query |
| `src/pages/AdminCourses.tsx` | Full CRUD with modals |
| `src/pages/AdminUsers.tsx` | Full CRUD with modals |
| `src/pages/AdminPayments.tsx` | Enhanced with filters |
| `src/pages/AdminCertificates.tsx` | Enhanced with verification |
| `src/pages/AdminAnalytics.tsx` | Enhanced with date range |
| `src/pages/AdminAI.tsx` | Enhanced with knowledge base management |

## Files to Create

| File | Purpose |
|------|---------|
| `src/services/adminService.ts` | Admin API service |
| `src/hooks/useAdmin.ts` | React Query hooks for admin data |
| `src/components/admin/StatsCard.tsx` | Reusable stat card |
| `src/components/admin/DataTable.tsx` | Reusable data table with pagination |
| `src/components/admin/ConfirmDialog.tsx` | Delete confirmation modal |
| `src/components/admin/CourseForm.tsx` | Course create/edit form |
| `src/components/admin/UserForm.tsx` | User create/edit form |

---

## Data Model

### New Types (add to `src/types.ts`)

```typescript
export interface AdminStats {
  totalStudents: number;
  totalRevenue: number;
  totalCourses: number;
  completionRate: number;
  activeUsers: number;
  aiTutorQueries: number;
  avgRating: number;
  serverUptime: number;
}

export interface Transaction {
  id: string;
  studentName: string;
  courseName: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  date: string;
}

export interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  score: number;
  date: string;
  status: 'issued' | 'pending';
}

export interface KnowledgeBase {
  id: string;
  name: string;
  courseId: string;
  documents: number;
  lastUpdated: string;
}
```

### Mock Data Additions

- `adminStats`: Expanded stats object
- `transactions`: Array of 10+ transactions
- `certificates`: Array of 8+ certificates
- `knowledgeBases`: Array of 4+ knowledge bases

---

## Component Design

### StatsCard (`src/components/admin/StatsCard.tsx`)

- Props: `{ title: string; value: string | number; icon: LucideIcon; trend?: string; color: string }`
- Reusable card for dashboard stats
- Shows icon, value, title, and optional trend indicator

### DataTable (`src/components/admin/DataTable.tsx`)

- Props: `{ columns: Column[]; data: any[]; pageSize?: number }`
- Generic table with sorting, pagination
- Column definition: `{ key: string; label: string; render?: (value: any) => ReactNode }`

### ConfirmDialog (`src/components/admin/ConfirmDialog.tsx`)

- Props: `{ isOpen: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void }`
- Modal for delete confirmations
- Red-themed confirm button for destructive actions

### CourseForm (`src/components/admin/CourseForm.tsx`)

- Props: `{ course?: Course; onSubmit: (data: Partial<Course>) => void; onCancel: () => void }`
- Form for creating/editing courses
- Fields: title, category, level, price, description, instructor

### UserForm (`src/components/admin/UserForm.tsx`)

- Props: `{ user?: User; onSubmit: (data: Partial<User>) => void; onCancel: () => void }`
- Form for creating/editing users
- Fields: name, email, role, status

---

## Page Behaviors

### AdminDashboard

- 4 stat cards with React Query data
- Enrollment chart (simplified with CSS bars)
- Platform health metrics
- Recent transactions table
- Quick action links

### AdminCourses

- Course grid with search/filter
- "New Course" button opens CourseForm modal
- Edit/Delete buttons on each card
- Delete shows ConfirmDialog
- Toast notifications on CRUD operations

### AdminUsers

- User table with search/filter
- "Add User" button opens UserForm modal
- Edit/Suspend/Delete actions
- Pagination

### AdminPayments

- Summary cards
- Transaction table with status filter
- Search by student/course name

### AdminCertificates

- Summary stats
- Certificate table with status filter
- Verify button (shows verification result)

### AdminAnalytics

- 4 stat cards
- Monthly charts (CSS-based)
- Course performance bars
- Donut charts for completion/AI usage

### AdminAI

- Knowledge base list with CRUD
- AI instructions editor
- Learning rules toggles

---

## Dark Theme Design System

| Element | Style |
|---------|-------|
| Page background | `#060A12` |
| Card background | `#0D1421` |
| Table background | `#0D1421` |
| Modal background | `#0D1421` |
| Primary text | `#F1F5F9` |
| Secondary text | `#94A3B8` |
| Muted text | `#64748B` |
| Accent blue | `#3B82F6` |
| Accent purple | `#8B5CF6` |
| Success green | `#10B981` |
| Error red | `#EF4444` |
| Warning yellow | `#F59E0B` |
