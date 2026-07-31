# Phase 6: Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance the 7 admin pages from static mockups to interactive pages with full CRUD operations, React Query data fetching, and modals for create/edit/delete.

**Architecture:** React Query for data fetching, Zustand for local state, reusable admin components (StatsCard, DataTable, ConfirmDialog, forms), MSW handlers for mock API.

**Tech Stack:** React 19, TanStack React Query, Zustand, React Hook Form + Zod, Tailwind CSS v4

## Global Constraints

- React 19, Vite 8, TypeScript 5.7, Tailwind CSS v4
- Dark theme design system: `#060A12` background, `#0D1421` panels, `#F1F5F9` primary text
- Use existing components: `LoadingSpinner`, `Toast`
- Reuse existing hooks pattern from Phase 3

---

### Task 1: Extend Types and Mock Data for Admin

**Files:**
- Modify: `src/types.ts`
- Modify: `src/data/mockData.ts`

**Interfaces:**
- Produces: `AdminStats`, `Transaction`, `Certificate`, `KnowledgeBase` types

- [ ] **Step 1: Add new types to src/types.ts**

Append to end of file:

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

- [ ] **Step 2: Add admin data to mockData.ts**

Add imports for new types and expand existing admin data objects (adminStats, recentTransactions) and add new exports (certificates, knowledgeBases).

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/types.ts src/data/mockData.ts
git commit -m "feat: add admin types and expand mock data"
```

---

### Task 2: Create Admin Service and React Query Hooks

**Files:**
- Create: `src/services/adminService.ts`
- Create: `src/hooks/useAdmin.ts`

**Interfaces:**
- Produces: adminService, useAdminStats, useAdminCourses, useAdminUsers, useAdminTransactions, useAdminCertificates, useKnowledgeBases

- [ ] **Step 1: Create adminService.ts**

```typescript
import api from '../lib/api';
import type { AdminStats, Transaction, Certificate, KnowledgeBase, Course, User } from '../types';

export const adminService = {
  getStats: async () => {
    const { data } = await api.get('/admin/stats');
    return data.data;
  },

  getCourses: async () => {
    const { data } = await api.get('/admin/courses');
    return data.data;
  },

  createCourse: async (course: Partial<Course>) => {
    const { data } = await api.post('/admin/courses', course);
    return data.data;
  },

  updateCourse: async (id: string, course: Partial<Course>) => {
    const { data } = await api.put(`/admin/courses/${id}`, course);
    return data.data;
  },

  deleteCourse: async (id: string) => {
    await api.delete(`/admin/courses/${id}`);
  },

  getUsers: async () => {
    const { data } = await api.get('/admin/users');
    return data.data;
  },

  createUser: async (user: Partial<User>) => {
    const { data } = await api.post('/admin/users', user);
    return data.data;
  },

  updateUser: async (id: string, user: Partial<User>) => {
    const { data } = await api.put(`/admin/users/${id}`, user);
    return data.data;
  },

  deleteUser: async (id: string) => {
    await api.delete(`/admin/users/${id}`);
  },

  getTransactions: async () => {
    const { data } = await api.get('/admin/transactions');
    return data.data;
  },

  getCertificates: async () => {
    const { data } = await api.get('/admin/certificates');
    return data.data;
  },

  verifyCertificate: async (id: string) => {
    const { data } = await api.get(`/admin/certificates/${id}/verify`);
    return data.data;
  },

  getKnowledgeBases: async () => {
    const { data } = await api.get('/admin/knowledge-bases');
    return data.data;
  },

  createKnowledgeBase: async (kb: Partial<KnowledgeBase>) => {
    const { data } = await api.post('/admin/knowledge-bases', kb);
    return data.data;
  },

  deleteKnowledgeBase: async (id: string) => {
    await api.delete(`/admin/knowledge-bases/${id}`);
  },
};
```

- [ ] **Step 2: Create useAdmin.ts**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import { courses, users, adminStats, recentTransactions, certificates, knowledgeBases } from '../data/mockData';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => Promise.resolve(adminStats),
  });
}

export function useAdminCourses() {
  return useQuery({
    queryKey: ['admin', 'courses'],
    queryFn: () => Promise.resolve(courses),
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => Promise.resolve(users),
  });
}

export function useAdminTransactions() {
  return useQuery({
    queryKey: ['admin', 'transactions'],
    queryFn: () => Promise.resolve(recentTransactions),
  });
}

export function useAdminCertificates() {
  return useQuery({
    queryKey: ['admin', 'certificates'],
    queryFn: () => Promise.resolve(certificates),
  });
}

export function useKnowledgeBases() {
  return useQuery({
    queryKey: ['admin', 'knowledgeBases'],
    queryFn: () => Promise.resolve(knowledgeBases),
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/services/adminService.ts src/hooks/useAdmin.ts
git commit -m "feat: add admin service and React Query hooks"
```

---

### Task 3: Create Reusable Admin Components

**Files:**
- Create: `src/components/admin/StatsCard.tsx`
- Create: `src/components/admin/DataTable.tsx`
- Create: `src/components/admin/ConfirmDialog.tsx`

**Interfaces:**
- Produces: StatsCard, DataTable, ConfirmDialog

- [ ] **Step 1: Create StatsCard.tsx**

```tsx
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: string;
}

export default function StatsCard({ title, value, icon: Icon, trend, color }: StatsCardProps) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-bold" style={{ color: '#F1F5F9' }}>{value}</p>
          <p className="text-xs" style={{ color: '#64748B' }}>{title}</p>
        </div>
      </div>
      {trend && (
        <p className="text-xs mt-2" style={{ color: '#10B981' }}>{trend}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create DataTable.tsx**

```tsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
}

export default function DataTable<T extends { id: string }>({ columns, data, pageSize = 5 }: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 text-xs font-semibold"
                  style={{ color: '#64748B' }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map(item => (
              <tr
                key={item.id}
                style={{ borderBottom: '1px solid rgba(59,130,246,0.05)' }}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 text-sm" style={{ color: '#94A3B8' }}>
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-xs" style={{ color: '#64748B' }}>
            Page {page + 1} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1 rounded disabled:opacity-40"
              style={{ color: '#64748B' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-1 rounded disabled:opacity-40"
              style={{ color: '#64748B' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create ConfirmDialog.tsx**

```tsx
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div
        className="relative w-full max-w-md mx-4 p-6 rounded-2xl"
        style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.2)' }}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4"
          style={{ color: '#64748B' }}
        >
          <X size={18} />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(239,68,68,0.15)' }}
          >
            <AlertTriangle size={20} style={{ color: '#EF4444' }} />
          </div>
          <h3 className="text-lg font-bold" style={{ color: '#F1F5F9' }}>{title}</h3>
        </div>
        <p className="text-sm mb-6" style={{ color: '#94A3B8' }}>{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ background: 'rgba(100,116,139,0.15)', color: '#94A3B8' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: '#EF4444', color: '#FFFFFF' }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/
git commit -m "feat: add reusable StatsCard, DataTable, ConfirmDialog components"
```

---

### Task 4: Enhance AdminDashboard Page

**Files:**
- Modify: `src/pages/AdminDashboard.tsx`

**Interfaces:**
- Consumes: useAdminStats, useAdminTransactions, StatsCard

- [ ] **Step 1: Rewrite AdminDashboard with React Query and StatsCard**

Replace the page to use `useAdminStats` and `useAdminTransactions` hooks, render `StatsCard` components for the 4 top stats, and display recent transactions in a simple table.

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/pages/AdminDashboard.tsx
git commit -m "feat: enhance AdminDashboard with React Query and StatsCard"
```

---

### Task 5: Enhance AdminCourses Page with CRUD

**Files:**
- Modify: `src/pages/AdminCourses.tsx`

**Interfaces:**
- Consumes: useAdminCourses, useDeleteCourse, ConfirmDialog

- [ ] **Step 1: Rewrite AdminCourses with CRUD operations**

Replace the page to use `useAdminCourses` hook, add search/filter, add "New Course" button, add Edit/Delete buttons with ConfirmDialog for delete confirmation, show toast on operations.

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/pages/AdminCourses.tsx
git commit -m "feat: enhance AdminCourses with search, CRUD, and confirm dialog"
```

---

### Task 6: Enhance AdminUsers Page with CRUD

**Files:**
- Modify: `src/pages/AdminUsers.tsx`

**Interfaces:**
- Consumes: useAdminUsers, useDeleteUser, DataTable, ConfirmDialog

- [ ] **Step 1: Rewrite AdminUsers with CRUD operations**

Replace the page to use `useAdminUsers` hook, use `DataTable` component, add "Add User" button, add Edit/Suspend/Delete actions with ConfirmDialog, show toast on operations.

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/pages/AdminUsers.tsx
git commit -m "feat: enhance AdminUsers with DataTable, search, CRUD actions"
```

---

### Task 7: Enhance Remaining Admin Pages

**Files:**
- Modify: `src/pages/AdminPayments.tsx`
- Modify: `src/pages/AdminCertificates.tsx`
- Modify: `src/pages/AdminAnalytics.tsx`
- Modify: `src/pages/AdminAI.tsx`

**Interfaces:**
- Consumes: useAdminTransactions, useAdminCertificates, useKnowledgeBases, StatsCard

- [ ] **Step 1: Enhance AdminPayments with React Query**

Replace to use `useAdminTransactions` hook, add search and status filter, show summary cards with StatsCard.

- [ ] **Step 2: Enhance AdminCertificates with React Query**

Replace to use `useAdminCertificates` hook, add status filter, add verify button functionality.

- [ ] **Step 3: Enhance AdminAnalytics with React Query**

Replace to use `useAdminStats` hook, show charts with CSS-based bars, add donut charts for completion/AI usage.

- [ ] **Step 4: Enhance AdminAI with React Query**

Replace to use `useKnowledgeBases` hook, add create/delete functionality for knowledge bases.

- [ ] **Step 5: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 6: Commit**

```bash
git add src/pages/Admin*.tsx
git commit -m "feat: enhance remaining admin pages with React Query"
```

---

### Task 8: Add MSW Handlers for Admin

**Files:**
- Modify: `src/mocks/handlers.ts`

**Interfaces:**
- Consumes: adminStats, courses, users, recentTransactions, certificates, knowledgeBases

- [ ] **Step 1: Add admin handlers to handlers.ts**

Add handlers for:
- GET /admin/stats
- GET /admin/courses
- POST /admin/courses
- PUT /admin/courses/:id
- DELETE /admin/courses/:id
- GET /admin/users
- POST /admin/users
- PUT /admin/users/:id
- DELETE /admin/users/:id
- GET /admin/transactions
- GET /admin/certificates
- GET /admin/certificates/:id/verify
- GET /admin/knowledge-bases
- POST /admin/knowledge-bases
- DELETE /admin/knowledge-bases/:id

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/mocks/handlers.ts
git commit -m "feat: add MSW handlers for admin CRUD operations"
```

---

### Task 9: Final Verification

**Files:**
- None (read-only verification)

- [ ] **Step 1: TypeScript check**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Write report**

Write to: `docs/superpowers/plans/phase-6-verification-report.md`

- [ ] **Step 4: Push to remote**

```bash
git push
```
