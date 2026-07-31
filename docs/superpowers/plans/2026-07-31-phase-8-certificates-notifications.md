# Phase 8: Certificates & Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Certificate and Notifications pages into working systems with certificate generation/display and in-app notification management.

**Architecture:** Local state with localStorage for notifications persistence, React Query pattern for data fetching, modal for certificate preview.

**Tech Stack:** React 19, TanStack React Query, Zustand, Tailwind CSS v4

## Global Constraints

- React 19, Vite 8, TypeScript 5.7, Tailwind CSS v4
- Dark theme design system: `#060A12` background, `#0D1421` panels, `#F1F5F9` primary text
- Use existing components: `LoadingSpinner`

---

### Task 1: Extend Types and Mock Data for Certificates & Notifications

**Files:**
- Modify: `src/types.ts`
- Modify: `src/data/mockData.ts`

**Interfaces:**
- Produces: `CertificateData`, `NotificationType`, `Notification` types

- [ ] **Step 1: Add new types to src/types.ts**

Append to end of file:

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

- [ ] **Step 2: Add certificate and notification data to mockData.ts**

Add imports for new types and create:
- `certificates`: Array of 4 certificates with course names, scores, verification codes
- `notifications`: Array of 8 notifications with mixed types (course, achievement, system, reminder), read/unread states

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/types.ts src/data/mockData.ts
git commit -m "feat: add certificate and notification types with mock data"
```

---

### Task 2: Create Certificate Components

**Files:**
- Create: `src/components/certificate/CertificateCard.tsx`
- Create: `src/components/certificate/CertificatePreview.tsx`

**Interfaces:**
- Consumes: `CertificateData` type

- [ ] **Step 1: Create CertificateCard.tsx**

```tsx
import { Award, ExternalLink } from 'lucide-react';
import type { CertificateData } from '../../types';

interface CertificateCardProps {
  certificate: CertificateData;
  onView: () => void;
}

export default function CertificateCard({ certificate, onView }: CertificateCardProps) {
  return (
    <div
      className="p-5 rounded-2xl transition-all"
      style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(139,92,246,0.15)' }}
        >
          <Award size={24} style={{ color: '#8B5CF6' }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold truncate" style={{ color: '#F1F5F9' }}>
            {certificate.courseName}
          </h3>
          <p className="text-xs mt-1" style={{ color: '#64748B' }}>
            Issued {new Date(certificate.issuedAt).toLocaleDateString()}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <span
              className="px-2 py-1 rounded text-xs font-medium"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}
            >
              Score: {certificate.score}%
            </span>
            <span className="text-xs font-mono" style={{ color: '#475569' }}>
              {certificate.verificationCode}
            </span>
          </div>
        </div>
        <button
          onClick={onView}
          className="p-2 rounded-lg transition-all"
          style={{ color: '#3B82F6' }}
        >
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create CertificatePreview.tsx**

```tsx
import { X, Download } from 'lucide-react';
import type { CertificateData } from '../../types';

interface CertificatePreviewProps {
  certificate: CertificateData;
  onClose: () => void;
}

export default function CertificatePreview({ certificate, onClose }: CertificatePreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        className="relative w-full max-w-2xl mx-4 rounded-2xl overflow-hidden"
        style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.2)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
          <h3 className="text-lg font-bold" style={{ color: '#F1F5F9' }}>Certificate</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
              style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}
            >
              <Download size={12} />
              Print
            </button>
            <button onClick={onClose} style={{ color: '#64748B' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-8">
          <div
            className="p-8 rounded-xl text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(59,130,246,0.05) 100%)',
              border: '2px solid rgba(139,92,246,0.2)',
            }}
          >
            {/* Logo */}
            <div className="mb-6">
              <div
                className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
                style={{ background: 'rgba(139,92,246,0.15)' }}
              >
                <span className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>SA</span>
              </div>
            </div>

            <h1 className="text-2xl font-bold font-display mb-2" style={{ color: '#F1F5F9' }}>
              Certificate of Completion
            </h1>
            <p className="text-sm mb-6" style={{ color: '#64748B' }}>
              This certifies that
            </p>

            <h2 className="text-3xl font-bold font-display mb-2" style={{ color: '#8B5CF6' }}>
              {certificate.studentName}
            </h2>

            <p className="text-sm mb-6" style={{ color: '#64748B' }}>
              has successfully completed the course
            </p>

            <h3 className="text-xl font-bold mb-4" style={{ color: '#F1F5F9' }}>
              {certificate.courseName}
            </h3>

            <div className="flex items-center justify-center gap-8 mb-6">
              <div>
                <p className="text-2xl font-bold" style={{ color: '#10B981' }}>{certificate.score}%</p>
                <p className="text-xs" style={{ color: '#64748B' }}>Final Score</p>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>
                  {new Date(certificate.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-xs" style={{ color: '#64748B' }}>Date Issued</p>
              </div>
            </div>

            <div className="pt-4" style={{ borderTop: '1px solid rgba(139,92,246,0.2)' }}>
              <p className="text-xs" style={{ color: '#475569' }}>
                Verification Code: <span className="font-mono">{certificate.verificationCode}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/components/certificate/
git commit -m "feat: add CertificateCard and CertificatePreview components"
```

---

### Task 3: Create Notification Components and Hook

**Files:**
- Create: `src/components/notifications/NotificationItem.tsx`
- Create: `src/hooks/useNotifications.ts`

**Interfaces:**
- Consumes: `Notification`, `NotificationType` types

- [ ] **Step 1: Create NotificationItem.tsx**

```tsx
import { BookOpen, Award, Bell, Clock } from 'lucide-react';
import type { Notification, NotificationType } from '../../types';

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

const iconMap: Record<NotificationType, typeof BookOpen> = {
  course: BookOpen,
  achievement: Award,
  system: Bell,
  reminder: Clock,
};

const colorMap: Record<NotificationType, string> = {
  course: '#3B82F6',
  achievement: '#10B981',
  system: '#8B5CF6',
  reminder: '#F59E0B',
};

export default function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const Icon = iconMap[notification.type];
  const color = colorMap[notification.type];

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all"
      style={{
        background: notification.read ? 'transparent' : 'rgba(59,130,246,0.05)',
        borderBottom: '1px solid rgba(59,130,246,0.05)',
      }}
      onClick={() => !notification.read && onRead(notification.id)}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15` }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate" style={{ color: '#F1F5F9' }}>
            {notification.title}
          </p>
          {!notification.read && (
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#3B82F6' }} />
          )}
        </div>
        <p className="text-xs mt-0.5 line-clamp-2" style={{ color: '#94A3B8' }}>
          {notification.message}
        </p>
        <p className="text-xs mt-1" style={{ color: '#475569' }}>
          {new Date(notification.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create useNotifications.ts**

```typescript
import { useState, useEffect, useCallback } from 'react';
import { notifications as mockNotifications } from '../data/mockData';
import type { Notification } from '../types';

const STORAGE_KEY = 'smugflex_notifications';

function getStoredNotifications(): Notification[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : mockNotifications;
  } catch {
    return mockNotifications;
  }
}

function saveNotifications(notifications: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(() => getStoredNotifications());

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return { notifications, unreadCount, markAsRead, markAllAsRead, clearAll };
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/components/notifications/ src/hooks/useNotifications.ts
git commit -m "feat: add NotificationItem component and useNotifications hook"
```

---

### Task 4: Rewrite Certificate Page

**Files:**
- Modify: `src/pages/Certificate.tsx`

**Interfaces:**
- Consumes: CertificateCard, CertificatePreview, certificates

- [ ] **Step 1: Replace entire src/pages/Certificate.tsx**

```tsx
import { useState } from 'react';
import { Award, Download } from 'lucide-react';
import { certificates } from '../data/mockData';
import CertificateCard from '../components/certificate/CertificateCard';
import CertificatePreview from '../components/certificate/CertificatePreview';
import type { CertificateData } from '../types';

export default function Certificate() {
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  const avgScore = certificates.length > 0
    ? Math.round(certificates.reduce((sum, c) => sum + c.score, 0) / certificates.length)
    : 0;

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
              <Award size={20} style={{ color: '#8B5CF6' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display" style={{ color: '#F1F5F9' }}>Certificates</h1>
              <p className="text-xs" style={{ color: '#64748B' }}>Your earned certificates</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div
            className="p-4 rounded-xl"
            style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
          >
            <p className="text-2xl font-bold" style={{ color: '#F1F5F9' }}>{certificates.length}</p>
            <p className="text-xs" style={{ color: '#64748B' }}>Total Certificates</p>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
          >
            <p className="text-2xl font-bold" style={{ color: '#10B981' }}>{avgScore}%</p>
            <p className="text-xs" style={{ color: '#64748B' }}>Average Score</p>
          </div>
        </div>

        {/* Certificate List */}
        <div className="space-y-3">
          {certificates.map(cert => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onView={() => setSelectedCert(cert)}
            />
          ))}
        </div>

        {certificates.length === 0 && (
          <div
            className="p-12 rounded-2xl text-center"
            style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
          >
            <Award size={48} className="mx-auto mb-4" style={{ color: '#475569' }} />
            <p className="text-sm" style={{ color: '#64748B' }}>
              No certificates yet. Complete courses to earn certificates!
            </p>
          </div>
        )}
      </div>

      {selectedCert && (
        <CertificatePreview
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/pages/Certificate.tsx
git commit -m "feat: rewrite Certificate page with cards and preview modal"
```

---

### Task 5: Rewrite Notifications Page

**Files:**
- Modify: `src/pages/Notifications.tsx`

**Interfaces:**
- Consumes: useNotifications, NotificationItem

- [ ] **Step 1: Replace entire src/pages/Notifications.tsx**

```tsx
import { useState } from 'react';
import { Bell, CheckCheck, Trash2, Filter } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import NotificationItem from '../components/notifications/NotificationItem';
import type { NotificationType } from '../types';

type FilterType = 'all' | 'unread' | NotificationType;

export default function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'course', label: 'Courses' },
    { id: 'achievement', label: 'Achievements' },
    { id: 'system', label: 'System' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#060A12' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(59,130,246,0.15)' }}
            >
              <Bell size={20} style={{ color: '#3B82F6' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display" style={{ color: '#F1F5F9' }}>Notifications</h1>
              <p className="text-xs" style={{ color: '#64748B' }}>
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}
              >
                <CheckCheck size={12} />
                Mark all read
              </button>
            )}
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}
            >
              <Trash2 size={12} />
              Clear all
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all"
              style={{
                background: filter === f.id ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: filter === f.id ? '#3B82F6' : '#64748B',
                border: `1px solid ${filter === f.id ? 'rgba(59,130,246,0.3)' : 'transparent'}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
        >
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={markAsRead}
              />
            ))
          ) : (
            <div className="p-12 text-center">
              <Bell size={48} className="mx-auto mb-4" style={{ color: '#475569' }} />
              <p className="text-sm" style={{ color: '#64748B' }}>
                {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
              </p>
            </div>
          )}
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
git add src/pages/Notifications.tsx
git commit -m "feat: rewrite Notifications page with filters and mark as read"
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

Write to: `docs/superpowers/plans/phase-8-verification-report.md`

- [ ] **Step 4: Push to remote**

```bash
git push
```
