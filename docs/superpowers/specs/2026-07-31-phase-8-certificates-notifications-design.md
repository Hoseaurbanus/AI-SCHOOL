# Phase 8: Certificates & Notifications — Design Spec

**Version:** 1.0
**Date:** 2026-07-31
**Status:** Approved

---

## Goal

Transform the Certificate and Notifications pages into working systems with certificate generation/display and in-app notification management.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/types.ts` | Add `CertificateData`, `Notification`, `NotificationType` types |
| `src/data/mockData.ts` | Add certificates and notifications data |
| `src/pages/Certificate.tsx` | Rewrite with certificate display |
| `src/pages/Notifications.tsx` | Rewrite with notification management |

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/certificate/CertificateCard.tsx` | Certificate display card |
| `src/components/certificate/CertificatePreview.tsx` | Full certificate preview |
| `src/components/notifications/NotificationItem.tsx` | Single notification |
| `src/hooks/useNotifications.ts` | Notification state management |

---

## Data Model

### New Types (add to `src/types.ts`)

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

### Mock Data Additions

- `certificates`: Array of 4+ certificates
- `notifications`: Array of 8+ notifications with mixed types and read statuses

---

## Component Design

### CertificateCard (`src/components/certificate/CertificateCard.tsx`)

- Props: `{ certificate: CertificateData; onView: () => void }`
- Card showing course name, score, date, verification code
- View button to open preview

### CertificatePreview (`src/components/certificate/CertificatePreview.tsx`)

- Props: `{ certificate: CertificateData; onClose: () => void }`
- Full certificate display with border, logo, student name, course, score, date
- Print/download button (window.print())

### NotificationItem (`src/components/notifications/NotificationItem.tsx`)

- Props: `{ notification: Notification; onRead: (id: string) => void }`
- Icon based on type, title, message, timestamp
- Read/unread visual state
- Click to mark as read and navigate (if actionUrl)

### useNotifications (`src/hooks/useNotifications.ts`)

- Returns: `{ notifications, unreadCount, markAsRead, markAllAsRead }`
- Uses localStorage for persistence
- Manages read/unread state

---

## Page Behaviors

### Certificate Page

1. **Certificate list:** Grid of CertificateCard components
2. **Preview modal:** Click View to see full CertificatePreview
3. **Stats:** Total certificates, average score

### Notifications Page

1. **Notification list:** List of NotificationItem components
2. **Filter:** All, Unread, by type
3. **Actions:** Mark all as read, clear all
4. **Empty state:** When no notifications

---

## Dark Theme Design System

| Element | Style |
|---------|-------|
| Page background | `#060A12` |
| Card background | `#0D1421` |
| Certificate border | Gold gradient |
| Primary text | `#F1F5F9` |
| Secondary text | `#94A3B8` |
| Muted text | `#64748B` |
| Accent blue | `#3B82F6` |
| Accent purple | `#8B5CF6` |
| Success green | `#10B981` |
| Notification unread | `rgba(59,130,246,0.05)` |
