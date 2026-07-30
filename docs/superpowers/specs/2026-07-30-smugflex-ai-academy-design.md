# Smugflex AI Academy — Full-Stack Engineering Design Spec

**Version:** 1.0
**Date:** 2026-07-30
**Status:** Draft — Pending User Approval

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Current State Assessment](#2-current-state-assessment)
3. [Information Architecture](#3-information-architecture)
4. [User Roles & Permissions](#4-user-roles--permissions)
5. [Database Design](#5-database-design)
6. [API Design](#6-api-design)
7. [Frontend Architecture](#7-frontend-architecture)
8. [Backend Architecture](#8-backend-architecture)
9. [AI Architecture](#9-ai-architecture)
10. [Coding Lab Architecture](#10-coding-lab-architecture)
11. [Assessment Engine](#11-assessment-engine)
12. [Certificate System](#12-certificate-system)
13. [Payment System](#13-payment-system)
14. [Notification System](#14-notification-system)
15. [Analytics](#15-analytics)
16. [Performance Strategy](#16-performance-strategy)
17. [Security](#17-security)
18. [Testing Strategy](#18-testing-strategy)
19. [Deployment](#19-deployment)
20. [Roadmap](#20-roadmap)

---

## 1. Product Vision

### What It Is

Smugflex AI Academy is an AI-powered interactive learning platform where students purchase professional courses and learn through AI-guided practical experiences instead of video-based learning.

### What It Is NOT

- NOT another Udemy (video-focused)
- NOT another Coursera (instructor-led)
- NOT a MOOC platform

### Core Learning Loop

```
AI Explains → Student Practices → AI Reviews → Student Revises → AI Grades → Certificate Earned
```

### Major Feature Groups

| Group | Features |
|-------|----------|
| Student Learning | AI tutor, interactive lessons, coding lab, assignments, projects, assessments |
| Payment & Enrollment | Course purchase, subscriptions, Paystack/Flutterwave, bank transfer |
| Admin Management | Users, courses, payments, AI knowledge base, analytics |
| AI Subsystem | Course-aware tutoring, code review, grading, recommendations, hint generation |
| Certificate System | PDF generation, QR verification, anti-forgery |
| Analytics | Student, course, revenue, platform-wide |

### Missing Requirements Identified

| Gap | Impact | Recommendation |
|-----|--------|----------------|
| No cohort-based learning | Limits engagement | Add in V2 |
| No instructor dashboard | Cannot create courses | Add in V2 |
| No mobile app strategy | Limits reach | React Native in V3 |
| No offline learning | Limits accessibility | Add in V3 |
| No WCAG compliance | Legal risk | Implement in MVP |
| No multi-language | Limits market | Add in V2 |
| No course versioning | Content staleness | Add in V2 |
| No student forums | No peer learning | Add in V2 |

---

## 2. Current State Assessment

### What Exists

- React 19 + Vite 8 + Tailwind CSS v4 frontend prototype
- 30+ page shells with dark AI-themed design system
- Mocked data (no real backend)
- Custom `navigate()` function (not React Router)
- useState for all state (no global state management)
- CSS-only animations (no Framer Motion)

### Critical Gaps

| Area | Current State | Production Requirement |
|------|--------------|----------------------|
| Authentication | None | JWT + refresh tokens |
| Database | Mock data | PostgreSQL + Prisma |
| Backend API | None | REST API with auth |
| AI Integration | Hardcoded responses | OpenAI GPT-4 with streaming |
| Code Execution | Simulated | Browser sandbox (Pyodide/iframe) |
| Payments | None | Paystack + Flutterwave |
| Certificates | Static mockup | PDF generation + verification |
| State Management | useState | Zustand + React Query |
| Routing | Custom navigate | React Router v6 |

---

## 3. Information Architecture

### Complete Application Structure

```
PUBLIC
├── Landing Page (hero, features, how-it-works, testimonials, pricing, FAQ)
├── Marketplace (search, filter, sort, categories)
├── Course Details (overview, curriculum, pricing, reviews)
├── About
├── Contact
├── Certificate Verification (public URL: /verify/:code)
├── Login / Register / Forgot Password / Email Verify
└── Maintenance Page

STUDENT (authenticated)
├── Dashboard (welcome, stats, AI insight, active courses, achievements)
├── My Courses (active, completed, saved)
├── Course Learning
│   ├── Left Sidebar: Course curriculum (modules + lessons)
│   ├── Center: Lesson content (text, code examples, exercises)
│   └── Right Sidebar: AI Tutor (context-aware chat)
├── AI Tutor (standalone chat with full context)
├── Coding Lab
│   ├── File Explorer
│   ├── Code Editor (Monaco)
│   ├── Terminal / Output
│   ├── Live Preview (HTML/CSS/JS)
│   └── AI Code Review Panel
├── Assignment (description, submission area, deadline, status)
├── Assessment (quiz/challenge, timer, submission)
├── Results & Feedback (score, strengths, weaknesses, AI recommendations)
├── Portfolio (completed projects, screenshots, code links, AI review scores)
├── Certificates (list, download, share, verification)
├── Profile (personal info, learning stats, achievements, skills)
├── Settings (account, password, notifications, theme, privacy)
└── Notifications (in-app notification list)

ADMIN (authenticated + admin role)
├── Dashboard (overview metrics, charts, quick actions, recent transactions)
├── User Management (list, search, filter, view, edit, suspend)
├── Course Management (CRUD, modules, lessons, assignments)
├── Payment Management (transactions, revenue, refunds)
├── Certificate Management (generate, verify, manage)
├── AI Knowledge Management (upload course materials, set AI instructions)
├── Analytics (enrollment, revenue, performance, popularity)
└── AI Configuration (model settings, prompt templates, token limits)

MODALS
├── Enrollment Confirmation
├── Payment Processing (iframe overlay)
├── Course Rating (1-5 stars + review)
├── Assignment Submission (file upload / code paste)
├── AI Hint Request
├── Certificate Download (PDF preview)
├── User Impersonation (admin)
├── Confirmation Dialogs (delete, suspend, refund)
└── Course Preview (quick lesson preview)

SYSTEM
├── Onboarding (AI-guided: learning goal, skill level, path, career objective)
├── 404 Not Found
├── Server Error
└── Search Results
```

### Navigation Paths

```
Guest → Landing → Marketplace → Course Details → Register → Onboarding → Dashboard
                                                              ↓
Guest → Landing → Register → Onboarding → Dashboard → Course Learning → AI Tutor
                                                              ↓
Student → Dashboard → My Courses → Course Learning → Coding Lab → Submit
                                                              ↓
Student → Dashboard → Assignments → Assessment → Results → Certificate
                                                              ↓
Admin → Dashboard → Users / Courses / Payments / Analytics / AI Knowledge
```

---

## 4. User Roles & Permissions

### Role Definitions

| Role | Description |
|------|-------------|
| `guest` | Unauthenticated visitor |
| `student` | Registered user who has purchased/enrolled in courses |
| `instructor` | Course creator (Future — V2) |
| `admin` | Platform administrator with full access |
| `super_admin` | System owner with admin management (Future — V3) |

### Permission Matrix

| Action | Guest | Student | Instructor | Admin |
|--------|-------|---------|------------|-------|
| Browse marketplace | ✅ | ✅ | ✅ | ✅ |
| View course details | ✅ | ✅ | ✅ | ✅ |
| Register / Login | ✅ | — | — | — |
| Purchase courses | — | ✅ | ✅ | — |
| Access AI tutor | — | ✅ | ✅ | — |
| Use coding lab | — | ✅ | ✅ | — |
| Submit assignments | — | ✅ | ✅ | — |
| Take assessments | — | ✅ | ✅ | — |
| Earn certificates | — | ✅ | ✅ | — |
| View own analytics | — | ✅ | ✅ | — |
| Create courses | — | — | ✅ | ✅ |
| Manage users | — | — | — | ✅ |
| Manage all courses | — | — | — | ✅ |
| Manage payments | — | — | — | ✅ |
| Manage AI knowledge | — | — | — | ✅ |
| View platform analytics | — | — | — | ✅ |
| Configure AI settings | — | — | — | ✅ |
| Issue refunds | — | — | — | ✅ |
| Suspend users | — | — | — | ✅ |

### Missing Permission Scenarios

| Scenario | Decision |
|----------|----------|
| Admin suspends student mid-course | Student loses access immediately, progress preserved |
| Instructor views student AI conversations | No — instructor cannot see student AI chats |
| Students share certificates publicly | Yes — via public verification URL |
| Admin impersonates students | Yes — for support, logged in audit trail |

---

## 5. Database Design

### Entity Relationship Diagram

```
Users ─────────┬──────────── Enrollments ──────── Courses
               │                │                    │
               │          LessonProgress          Modules
               │                                    │
               │                              Lessons
               │
               ├──────── AIConversations
               │
               ├──────── CodeSubmissions
               │
               ├──────── AssignmentSubmissions ── Assignments
               │
               ├──────── AssessmentAttempts ──── Assessments
               │
               ├──────── ProjectSubmissions ──── Projects
               │
               ├──────── Certificates
               │
               ├──────── Transactions
               │
               ├──────── Notifications
               │
               └──────── Achievements
```

### Core Entities

#### Users
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
email           VARCHAR(255) UNIQUE NOT NULL
password_hash   VARCHAR(255) NOT NULL
name            VARCHAR(255) NOT NULL
phone           VARCHAR(20)
role            ENUM('student', 'instructor', 'admin') DEFAULT 'student'
avatar_url      TEXT
onboarding_completed BOOLEAN DEFAULT false
email_verified  BOOLEAN DEFAULT false
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

#### Courses
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
title           VARCHAR(255) NOT NULL
description     TEXT
category        ENUM('programming', 'ai', 'data_analysis', 'business', 'academic')
level           ENUM('beginner', 'intermediate', 'advanced')
duration_weeks  INTEGER
price           INTEGER NOT NULL  -- in kobo/cents
image_url       TEXT
instructor_id   UUID REFERENCES users(id)
ai_tutor_enabled BOOLEAN DEFAULT true
is_featured     BOOLEAN DEFAULT false
status          ENUM('draft', 'published', 'archived') DEFAULT 'draft'
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

#### Modules
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
course_id       UUID REFERENCES courses(id) ON DELETE CASCADE
title           VARCHAR(255) NOT NULL
sort_order      INTEGER NOT NULL
created_at      TIMESTAMP DEFAULT NOW()
```

#### Lessons
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
module_id       UUID REFERENCES modules(id) ON DELETE CASCADE
title           VARCHAR(255) NOT NULL
type            ENUM('video', 'text', 'exercise', 'project')
content         JSONB  -- structured lesson content
duration_minutes INTEGER
sort_order      INTEGER NOT NULL
created_at      TIMESTAMP DEFAULT NOW()
```

#### Enrollments
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID REFERENCES users(id)
course_id       UUID REFERENCES courses(id)
status          ENUM('active', 'completed', 'suspended', 'refunded') DEFAULT 'active'
enrolled_at     TIMESTAMP DEFAULT NOW()
completed_at    TIMESTAMP
progress_percent INTEGER DEFAULT 0
UNIQUE(user_id, course_id)
```

#### LessonProgress
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
enrollment_id   UUID REFERENCES enrollments(id)
lesson_id       UUID REFERENCES lessons(id)
completed       BOOLEAN DEFAULT false
completed_at    TIMESTAMP
UNIQUE(enrollment_id, lesson_id)
```

#### AIConversations
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID REFERENCES users(id)
course_id       UUID REFERENCES courses(id)
lesson_id       UUID REFERENCES lessons(id)
messages        JSONB  -- array of {role, content, timestamp}
context         JSONB  -- student memory snapshot
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

#### CodeSubmissions
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID REFERENCES users(id)
lesson_id       UUID REFERENCES lessons(id)
code            TEXT NOT NULL
language        VARCHAR(50)
output          TEXT
ai_review       JSONB
score           INTEGER
submitted_at    TIMESTAMP DEFAULT NOW()
```

#### Assignments
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
lesson_id       UUID REFERENCES lessons(id)
title           VARCHAR(255) NOT NULL
description     TEXT
type            ENUM('code', 'file', 'text')
due_date        TIMESTAMP
max_score       INTEGER DEFAULT 100
created_at      TIMESTAMP DEFAULT NOW()
```

#### AssignmentSubmissions
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
assignment_id   UUID REFERENCES assignments(id)
user_id         UUID REFERENCES users(id)
content         TEXT  -- text content or file URL
file_url        TEXT
ai_grade        JSONB
manual_grade    INTEGER
feedback        TEXT
submitted_at    TIMESTAMP DEFAULT NOW()
graded_at       TIMESTAMP
```

#### Assessments
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
course_id       UUID REFERENCES courses(id)
title           VARCHAR(255) NOT NULL
questions       JSONB  -- array of question objects
time_limit_minutes INTEGER
passing_score   INTEGER DEFAULT 70
created_at      TIMESTAMP DEFAULT NOW()
```

#### AssessmentAttempts
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
assessment_id   UUID REFERENCES assessments(id)
user_id         UUID REFERENCES users(id)
answers         JSONB
score           INTEGER
ai_feedback     JSONB
started_at      TIMESTAMP DEFAULT NOW()
completed_at    TIMESTAMP
```

#### Projects
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
course_id       UUID REFERENCES courses(id)
title           VARCHAR(255) NOT NULL
description     TEXT
requirements    JSONB
rubric          JSONB
created_at      TIMESTAMP DEFAULT NOW()
```

#### ProjectSubmissions
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
project_id      UUID REFERENCES projects(id)
user_id         UUID REFERENCES users(id)
code_url        TEXT
screenshot_url  TEXT
ai_review       JSONB
score           INTEGER
feedback        TEXT
submitted_at    TIMESTAMP DEFAULT NOW()
```

#### Certificates
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID REFERENCES users(id)
course_id       UUID REFERENCES courses(id)
unique_code     VARCHAR(255) UNIQUE NOT NULL
qr_code         TEXT  -- SVG or PNG data
issued_at       TIMESTAMP DEFAULT NOW()
verified        BOOLEAN DEFAULT true
```

#### Transactions
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID REFERENCES users(id)
course_id       UUID REFERENCES courses(id)
amount          INTEGER NOT NULL  -- in kobo/cents
currency        VARCHAR(3) DEFAULT 'NGN'
provider        ENUM('paystack', 'flutterwave', 'bank_transfer')
reference       VARCHAR(255) UNIQUE NOT NULL
status          ENUM('pending', 'success', 'failed', 'refunded') DEFAULT 'pending'
metadata        JSONB
created_at      TIMESTAMP DEFAULT NOW()
refunded_at     TIMESTAMP
```

#### Notifications
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID REFERENCES users(id)
type            ENUM('learning', 'payment', 'assignment', 'system')
title           VARCHAR(255) NOT NULL
body            TEXT
read            BOOLEAN DEFAULT false
data            JSONB  -- related entity IDs
created_at      TIMESTAMP DEFAULT NOW()
```

#### Achievements
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID REFERENCES users(id)
type            VARCHAR(100) NOT NULL  -- 'streak', 'code_wizard', etc.
earned_at       TIMESTAMP DEFAULT NOW()
metadata        JSONB
```

### Indexes

```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_user_course ON enrollments(user_id, course_id);
CREATE INDEX idx_lesson_progress_enrollment ON lesson_progress(enrollment_id);
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_course ON ai_conversations(course_id);
CREATE INDEX idx_code_submissions_user ON code_submissions(user_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_reference ON transactions(reference);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_certificates_unique_code ON certificates(unique_code);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_featured ON courses(is_featured);
```

### Normalization Notes

- Course content uses JSONB for flexible lesson structures while maintaining normalized relationships
- AI conversation messages stored as JSONB array (not separate table) for read performance
- Transaction metadata as JSONB for provider-specific data
- Consider table partitioning for `transactions` and `notifications` at scale (100k+ records)

---

## 6. API Design

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | None |
| POST | `/api/auth/login` | Login | None |
| POST | `/api/auth/logout` | Logout | Required |
| POST | `/api/auth/forgot-password` | Request password reset | None |
| POST | `/api/auth/reset-password` | Reset password with token | None |
| POST | `/api/auth/verify-email` | Verify email with token | None |
| GET | `/api/auth/me` | Get current user | Required |
| POST | `/api/auth/refresh` | Refresh JWT token | Refresh token |

### Courses

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/courses` | List courses (filter, search, paginate) | None |
| GET | `/api/courses/:id` | Get course details | None |
| GET | `/api/courses/:id/curriculum` | Get course curriculum | Required (enrolled) |
| POST | `/api/courses` | Create course | Admin |
| PUT | `/api/courses/:id` | Update course | Admin |
| DELETE | `/api/courses/:id` | Delete course | Admin |
| POST | `/api/courses/:id/enroll` | Enroll in course | Required |
| GET | `/api/courses/:id/enrolled-students` | List enrolled students | Admin |

### AI Tutor

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/ai/chat` | Send message to AI tutor | Required |
| GET | `/api/ai/conversations/:id` | Get conversation history | Required |
| GET | `/api/ai/memory/:courseId` | Get AI memory for course | Required |
| DELETE | `/api/ai/memory/:courseId/:memoryId` | Remove memory item | Required |
| POST | `/api/ai/hint` | Get hint for exercise | Required |
| POST | `/api/ai/review-code` | AI code review | Required |
| POST | `/api/ai/grade` | Grade a submission | Required |
| GET | `/api/ai/recommendations` | Get personalized recommendations | Required |

### Coding Lab

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/lab/run` | Execute code (returns output) | Required |
| POST | `/api/lab/submit` | Submit code for exercise | Required |
| GET | `/api/lab/submissions` | Get user's submissions | Required |

### Assignments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/assignments` | List assignments (filter by course) | Required |
| GET | `/api/assignments/:id` | Get assignment details | Required |
| POST | `/api/assignments/:id/submit` | Submit assignment | Required |
| GET | `/api/assignments/:id/submissions` | List submissions (all students) | Admin |

### Assessments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/assessments` | List assessments (filter by course) | Required |
| POST | `/api/assessments/:id/start` | Start assessment attempt | Required |
| POST | `/api/assessments/:id/submit` | Submit assessment | Required |
| GET | `/api/assessments/:id/results` | Get results | Required |

### Projects

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/projects` | List projects (filter by course) | Required |
| POST | `/api/projects/:id/submit` | Submit project | Required |
| GET | `/api/projects/:id/submissions` | List submissions | Admin |

### Certificates

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/certificates` | Get user's certificates | Required |
| GET | `/api/certificates/verify/:code` | Verify certificate (public) | None |
| POST | `/api/certificates/generate` | Generate certificate | System |

### Payments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/payments/initialize` | Initialize payment | Required |
| POST | `/api/payments/webhook/paystack` | Paystack webhook | None (signed) |
| POST | `/api/payments/webhook/flutterwave` | Flutterwave webhook | None (signed) |
| GET | `/api/payments/transactions` | List transactions | Admin |
| POST | `/api/payments/refund/:id` | Refund transaction | Admin |

### Notifications

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/notifications` | Get user notifications | Required |
| PUT | `/api/notifications/:id/read` | Mark as read | Required |
| PUT | `/api/notifications/read-all` | Mark all as read | Required |

### Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/stats` | Platform statistics | Admin |
| GET | `/api/admin/users` | List users (filter, search) | Admin |
| PUT | `/api/admin/users/:id/role` | Change user role | Admin |
| PUT | `/api/admin/users/:id/suspend` | Suspend user | Admin |
| GET | `/api/admin/analytics/enrollment` | Enrollment analytics | Admin |
| GET | `/api/admin/analytics/revenue` | Revenue analytics | Admin |
| GET | `/api/admin/analytics/performance` | Performance analytics | Admin |
| POST | `/api/admin/ai-knowledge` | Upload AI knowledge base | Admin |
| PUT | `/api/admin/ai-config` | Update AI configuration | Admin |

---

## 7. Frontend Architecture

### Folder Structure

```
src/
├── components/
│   ├── ui/                      # Reusable primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Tabs.tsx
│   │   ├── Skeleton.tsx
│   │   └── EmptyState.tsx
│   ├── layout/
│   │   ├── PublicLayout.tsx
│   │   ├── StudentLayout.tsx
│   │   ├── AdminLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── MobileNav.tsx
│   ├── course/
│   │   ├── CourseCard.tsx
│   │   ├── CurriculumList.tsx
│   │   ├── LessonContent.tsx
│   │   └── ProgressRing.tsx
│   ├── ai/
│   │   ├── ChatBubble.tsx
│   │   ├── TypingIndicator.tsx
│   │   ├── MemoryBadge.tsx
│   │   ├── CodeBlock.tsx
│   │   └── AIInsight.tsx
│   ├── lab/
│   │   ├── CodeEditor.tsx
│   │   ├── Terminal.tsx
│   │   ├── FileExplorer.tsx
│   │   └── AIReviewPanel.tsx
│   └── admin/
│       ├── DataTable.tsx
│       ├── StatCard.tsx
│       ├── ChartWrapper.tsx
│       └── RecentTransactions.tsx
├── pages/
│   ├── public/
│   │   ├── Landing.tsx
│   │   ├── Marketplace.tsx
│   │   ├── CourseDetails.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── EmailVerify.tsx
│   │   └── Onboarding.tsx
│   ├── student/
│   │   ├── Dashboard.tsx
│   │   ├── MyCourses.tsx
│   │   ├── CourseLearning.tsx
│   │   ├── AITutor.tsx
│   │   ├── CodingLab.tsx
│   │   ├── Assignment.tsx
│   │   ├── Assessment.tsx
│   │   ├── Results.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Certificate.tsx
│   │   ├── Profile.tsx
│   │   ├── Settings.tsx
│   │   └── Notifications.tsx
│   ├── admin/
│   │   ├── Dashboard.tsx
│   │   ├── Users.tsx
│   │   ├── Courses.tsx
│   │   ├── Payments.tsx
│   │   ├── Certificates.tsx
│   │   ├── Analytics.tsx
│   │   ├── AIKnowledge.tsx
│   │   └── AIConfig.tsx
│   └── system/
│       ├── NotFound.tsx
│       ├── Maintenance.tsx
│       └── CertificateVerify.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useCourses.ts
│   ├── useAI.ts
│   ├── usePayments.ts
│   ├── useNotifications.ts
│   └── useLocalStorage.ts
├── services/
│   ├── api.ts                   # Axios/fetch wrapper
│   ├── authService.ts
│   ├── courseService.ts
│   ├── aiService.ts
│   ├── paymentService.ts
│   ├── certificateService.ts
│   ├── notificationService.ts
│   └── labService.ts
├── stores/
│   ├── authStore.ts             # Zustand
│   ├── courseStore.ts
│   ├── cartStore.ts
│   └── uiStore.ts
├── lib/
│   ├── utils.ts
│   ├── constants.ts
│   ├── types.ts
│   └── validators.ts            # Zod schemas
├── styles/
│   ├── global.css
│   └── theme.ts
└── data/
    └── mockData.ts              # Dev only
```

### State Management

| Layer | Tool | Purpose |
|-------|------|---------|
| Server state | TanStack Query (React Query) | API data caching, revalidation, optimistic updates |
| Global UI state | Zustand | Auth, cart, theme, notifications |
| Local component state | useState/useReducer | Form inputs, UI toggles, page-specific state |
| Form state | React Hook Form + Zod | Form validation, submission handling |

### Routing

Replace custom `navigate()` with React Router v6:

```tsx
<Routes>
  <Route element={<PublicLayout />}>
    <Route path="/" element={<Landing />} />
    <Route path="/marketplace" element={<Marketplace />} />
    <Route path="/courses/:id" element={<CourseDetails />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/verify/:code" element={<CertificateVerify />} />
  </Route>

  <Route element={<AuthLayout />}>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/verify-email" element={<EmailVerify />} />
  </Route>

  <Route element={<ProtectedRoute />}>
    <Route element={<StudentLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/my-courses" element={<MyCourses />} />
      <Route path="/courses/:id/learn" element={<CourseLearning />} />
      <Route path="/ai-tutor" element={<AITutor />} />
      <Route path="/coding-lab" element={<CodingLab />} />
      <Route path="/assignments" element={<Assignment />} />
      <Route path="/assessments" element={<Assessment />} />
      <Route path="/results" element={<Results />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/certificates" element={<Certificate />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/onboarding" element={<Onboarding />} />
    </Route>
  </Route>

  <Route element={<ProtectedRoute requiredRole="admin" />}>
    <Route element={<AdminLayout />}>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/courses" element={<AdminCourses />} />
      <Route path="/admin/payments" element={<AdminPayments />} />
      <Route path="/admin/certificates" element={<AdminCertificates />} />
      <Route path="/admin/analytics" element={<AdminAnalytics />} />
      <Route path="/admin/ai-knowledge" element={<AdminAIKnowledge />} />
      <Route path="/admin/ai-config" element={<AdminAIConfig />} />
    </Route>
  </Route>

  <Route path="*" element={<NotFound />} />
</Routes>
```

### Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Routing | React Router v6 | Industry standard, nested routes, route guards |
| Server state | TanStack Query | Caching, background refetch, optimistic updates |
| Global state | Zustand | Simple, minimal boilerplate, TypeScript-first |
| Forms | React Hook Form + Zod | Performance, validation, type safety |
| Animations | Framer Motion | Declarative, accessible, performant |
| Code editor | Monaco Editor | VS Code experience, syntax highlighting |
| CSS | Tailwind CSS v4 | Utility-first, existing setup |

---

## 8. Backend Architecture

### Recommended Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Runtime | Node.js 20+ LTS | JavaScript ecosystem, async I/O |
| Framework | Next.js 14+ (App Router) | Full-stack, API routes, SSR, edge functions |
| ORM | Prisma | Type-safe, migrations, good DX |
| Database | PostgreSQL | Relational integrity, JSONB support, scalability |
| Cache | Redis | Sessions, rate limiting, hot data |
| Auth | NextAuth.js / Lucia | JWT management, session handling |
| Storage | Cloudflare R2 | S3-compatible, affordable, fast |
| Queue | BullMQ | Background jobs with Redis |
| AI | OpenAI API (GPT-4) | Streaming, function calling |
| Payments | Paystack SDK + Flutterwave SDK | Nigerian market leaders |
| Email | Resend | Developer-friendly, reliable |
| Monitoring | Sentry (errors) + PostHog (analytics) | Error tracking, product analytics |
| Deployment | Vercel (frontend) + Railway (backend) | Simple, scalable |

### Service Layer Architecture

```
HTTP Request
    ↓
Route Handler (Next.js API Route)
    ↓
Service Layer (business logic, validation)
    ↓
Repository Layer (database queries via Prisma)
    ↓
PostgreSQL Database
```

### Key Backend Services

| Service | Responsibility |
|---------|---------------|
| AuthService | Register, login, JWT management, email verification |
| CourseService | CRUD, enrollment, progress tracking |
| AIService | Chat, code review, grading, recommendations |
| PaymentService | Initialize, verify, webhooks, refunds |
| CertificateService | Generate, verify, anti-forgery |
| NotificationService | Email, in-app, push (future) |
| AnalyticsService | Aggregation, reporting |
| LabService | Code execution, output capture |
| QueueService | Background job processing |

### Background Jobs

| Job | Trigger | Description |
|-----|---------|-------------|
| Send welcome email | Registration | Welcome + verify email |
| Send payment confirmation | Successful payment | Receipt + enrollment |
| Generate certificate | Course completion | PDF generation + QR |
| Process AI grading | Assignment submission | Async AI evaluation |
| Send learning reminder | Cron (daily) | Inactivity reminder |
| Send assignment reminder | Cron (hourly) | Due date approaching |
| Aggregate analytics | Cron (hourly) | Update dashboard stats |
| Cleanup expired sessions | Cron (daily) | Redis cleanup |

---

## 9. AI Architecture

### Context Retrieval Pipeline

```
Student sends message
    ↓
1. Fetch student profile (learning history, preferences)
    ↓
2. Fetch enrolled courses + current lesson context
    ↓
3. Fetch conversation history (last 20 messages)
    ↓
4. Fetch AI memory (student patterns, weak areas)
    ↓
5. Retrieve relevant course materials (RAG with vector embeddings)
    ↓
6. Construct prompt with all context
    ↓
7. Call OpenAI API (GPT-4) with streaming
    ↓
8. Stream response to student
    ↓
9. Update student memory with new patterns
```

### Student Memory System

| Memory Type | Description | Example |
|-------------|-------------|---------|
| Learning pace | Speed on different topics | "Fast on loops, slow on recursion" |
| Common mistakes | Recurring errors | "Often forgets semicolons in JS" |
| Preferred style | Explanation preferences | "Prefers visual examples" |
| Strengths | Topics mastered | "Strong in Python basics" |
| Weak areas | Topics needing work | "Struggles with async/await" |
| Goals | Learning objectives | "Want to build ML models" |
| Streaks | Engagement patterns | "12-day learning streak" |

### Prompt Strategy

```typescript
const systemPrompt = `
You are a patient, encouraging AI tutor for Smugflex Academy.

RULES:
- Explain concepts clearly with real examples
- Adapt to the student's skill level
- Encourage practice over memorization
- Use code examples when relevant
- Be concise but thorough
- Never do the student's work for them

CONTEXT:
- Course: ${course.title}
- Current lesson: ${lesson.title}
- Student level: ${student.level}
- Student weak areas: ${memory.weakAreas}
- Student preferred style: ${memory.preferredStyle}
`;
```

### Token Optimization

| Strategy | Implementation |
|----------|---------------|
| Conversation summarization | Summarize older messages to fit context window |
| Response caching | Cache common responses (keyed by topic + level) |
| Function calling | Structured outputs for grades, hints, reviews |
| Streaming | Perceived performance improvement |
| Token budgets | Max 4000 tokens per response |

### Fallback Strategy

```
Primary: GPT-4 (full capability)
    ↓ fail
Fallback 1: GPT-3.5-turbo (reduced capability)
    ↓ fail
Fallback 2: Cached responses for common questions
    ↓ fail
Fallback 3: "I'm having trouble right now. Please try again or contact support."
```

### AI Grading System

| Component | Weight | Method |
|-----------|--------|--------|
| Code correctness | 40% | Test case pass/fail |
| Code quality | 20% | AI analysis (readability, patterns) |
| Efficiency | 20% | Time/space complexity analysis |
| Documentation | 10% | AI analysis (comments, naming) |
| Edge cases | 10% | Test case coverage |

---

## 10. Coding Lab Architecture

### Execution Strategy: Browser-First

| Language | Execution Method | Security |
|----------|-----------------|----------|
| HTML/CSS/JS | iframe with srcdoc + CSP | High — fully isolated |
| Python | Pyodide (WebAssembly in browser) | High — no server needed |
| SQL | sql.js (SQLite compiled to WASM) | High — no server needed |

### Why Browser-First?

- No server-side sandboxing infrastructure needed for MVP
- Zero server cost for code execution
- Instant execution (no network round-trip)
- Inherently secure (no server access)

### Code Execution Flow

```
Student writes code
    ↓
Click "Run"
    ↓
Code sent to execution engine (browser-side)
    ↓
iframe (HTML/CSS/JS) OR Pyodide (Python) OR sql.js (SQL)
    ↓
Output captured (stdout, stderr, render)
    ↓
Display in terminal/preview panel
    ↓
If exercise: auto-test against test cases
    ↓
AI review (optional): analyze code quality, suggest improvements
```

### Resource Limits

| Limit | Value | Rationale |
|-------|-------|-----------|
| Max code size | 100KB | Prevent abuse |
| Max execution time | 10 seconds | Prevent infinite loops |
| Max memory | 128MB | Browser tab limits |
| Network access | Blocked | Security |
| File system access | Blocked | Security |

### Output Capture

- Override `console.log`, `console.error`, `console.warn`
- Capture `stdout`/`stderr` for Python
- Capture DOM render for HTML
- Timeout detection via `AbortController`

---

## 11. Assessment Engine

### Question Types

| Type | Auto-Grade | AI-Grade | Manual |
|------|------------|----------|--------|
| Multiple Choice (single) | ✅ | — | — |
| Multiple Choice (multi) | ✅ | — | — |
| Code Challenge | ✅ (test cases) | ✅ (quality) | Optional |
| Fill in the Blank | ✅ | — | — |
| Short Answer | — | ✅ | Optional |
| Project Submission | — | ✅ | ✅ |

### Grading Rubric (Code Challenges)

| Criterion | Weight | Method |
|-----------|--------|--------|
| Test case pass rate | 40% | Automatic |
| Code correctness | 25% | AI analysis |
| Code quality | 20% | AI analysis (readability, patterns) |
| Efficiency | 15% | AI analysis (complexity) |

### Partial Credit

- Code challenges: points per test case passed
- Multi-select MCQ: partial credit for incomplete correct selections
- Short answer: AI evaluates completeness and accuracy

### Assessment Flow

```
Student starts assessment
    ↓
Questions loaded (shuffled if configured)
    ↓
Timer starts (if timed)
    ↓
Student answers questions
    ↓
Student submits
    ↓
Auto-grade MCQ + code challenges (instant)
    ↓
AI-grade short answers + code quality (async)
    ↓
Results displayed with detailed feedback
```

---

## 12. Certificate System

### Generation Flow

```
Course completed (all lessons + assessment passed)
    ↓
System triggers certificate generation
    ↓
1. Generate unique verification code (UUID)
    ↓
2. Generate QR code (encoding verification URL)
    ↓
3. Create PDF with HTML template + Puppeteer
    ↓
4. Store PDF in Cloudflare R2
    ↓
5. Save certificate record in database
    ↓
6. Notify student (email + in-app)
```

### PDF Template Elements

- Student name
- Course name
- Completion date
- Certificate ID (unique code)
- QR code (links to verification URL)
- Smugflex AI Academy branding
- Digital signature (server-side)

### Verification

- **Public URL:** `app.smugflex.ai/verify/:code`
- **No authentication required**
- Returns: student name, course name, completion date, issuer
- Status: valid / invalid / revoked

### Anti-Forgery

| Measure | Implementation |
|---------|---------------|
| Unique code | UUID-based, unguessable |
| Digital signature | Server-side PDF signing |
| Verification required | Cannot view certificate without server check |
| No client generation | PDF only generated server-side |
| Revocation | Admin can revoke certificates |

---

## 13. Payment System

### Payment Flow

```
1. Student clicks "Enroll Now"
    ↓
2. Redirect to /checkout
    ↓
3. Display course summary + price
    ↓
4. Student selects payment method
    ↓
5. POST /api/payments/initialize
    ↓
6. Server creates transaction record
    ↓
7. Server calls Paystack/Flutterwave API
    ↓
8. Redirect to provider payment page
    ↓
9. Student completes payment
    ↓
10. Provider redirects back to /payment-success or /payment-failed
    ↓
11. Provider sends webhook to /api/payments/webhook/:provider
    ↓
12. Server verifies webhook signature
    ↓
13. Server updates transaction status
    ↓
14. Server creates enrollment record
    ↓
15. Server sends confirmation email
```

### Provider Configuration

| Provider | Use Case | API |
|----------|----------|-----|
| Paystack | Primary (card, bank transfer) | Paystack SDK |
| Flutterwave | Secondary (card, mobile money) | Flutterwave SDK |
| Bank Transfer | Manual verification | Admin confirms |

### Webhook Security

```typescript
// Paystack webhook verification
const signature = req.headers['x-paystack-signature'];
const hash = crypto.createHmac('sha512', webhookSecret)
  .update(JSON.stringify(req.body))
  .digest('hex');
if (hash !== signature) {
  return res.status(400).json({ error: 'Invalid signature' });
}
```

### Refund Policy

- **7-day full refund** for any course
- **Prorated refund** for subscriptions
- Admin-initiated via `/api/payments/refund/:id`
- Refund creates negative transaction + updates enrollment status

### Subscription Plans

| Plan | Price | Features |
|------|-------|----------|
| Explorer | Free | 3 courses, basic AI (10 queries/day) |
| Scholar | ₦12,000/month | Unlimited courses, full AI, certificates |
| Professional | ₦35,000/month | Everything + priority AI, mentor sessions, career support |

---

## 14. Notification System

### Notification Types

| Type | Channel | Trigger | Template |
|------|---------|---------|----------|
| Welcome | Email + In-app | Registration | Welcome message + verify link |
| Payment confirmation | Email + In-app | Successful payment | Receipt + enrollment details |
| Course enrollment | In-app | Enrollment created | Course details + get started CTA |
| Learning reminder | Email + In-app | Inactivity (3 days) | Streak at risk + continue CTA |
| Assignment due | Email + In-app | 24h before deadline | Assignment details + submit CTA |
| Assignment graded | In-app | Grade posted | Score + feedback preview |
| Certificate earned | Email + In-app | Course completed | Certificate preview + download |
| New course published | In-app | Admin publishes | Course preview + enroll CTA |
| Platform announcement | Email + In-app | Admin broadcast | Custom message |

### Email Delivery

- Use Resend for transactional emails
- HTML email templates
- Unsubscribe link (required by law)
- Delivery tracking

### In-App Notifications

- Real-time via WebSocket (or polling as fallback)
- Badge count in header
- Notification dropdown
- Mark as read / mark all as read
- Notification preferences (user can disable types)

---

## 15. Analytics

### Student Analytics

| Metric | Source | Display |
|--------|--------|---------|
| Time spent per lesson | LessonProgress timestamps | Dashboard chart |
| Quiz scores over time | AssessmentAttempts.score | Progress chart |
| Coding exercise completion | CodeSubmissions.count | Dashboard stat |
| AI tutor usage | AIConversations.count | Usage stat |
| Learning streak | Achievements (streak type) | Dashboard badge |

### Course Analytics

| Metric | Source | Display |
|--------|--------|---------|
| Enrollment count | Enrollments.count | Admin dashboard |
| Completion rate | Enrollments(status=completed) / total | Admin dashboard |
| Average score | AssessmentAttempts.avg(score) | Admin dashboard |
| Drop-off points | LessonProgress gaps | Admin analytics |
| Student satisfaction | Course ratings | Admin dashboard |

### Revenue Analytics

| Metric | Source | Display |
|--------|--------|---------|
| Total revenue | SUM(transactions.amount) | Admin dashboard |
| Revenue by course | Group by course_id | Admin analytics |
| Revenue by method | Group by provider | Admin analytics |
| Refund rate | Refunded / total | Admin dashboard |
| MRR | Subscription revenue | Admin analytics |

### Platform Analytics

| Metric | Source | Display |
|--------|--------|---------|
| DAU / MAU | Login timestamps | Admin dashboard |
| Platform growth | User registration trend | Admin analytics |
| AI usage | AIConversations.count | Admin analytics |
| Top courses | Enrollment count | Admin analytics |

---

## 16. Performance Strategy

### Caching

| Layer | Tool | TTL | Scope |
|-------|------|-----|-------|
| CDN | Vercel Edge | 5-60 min | Course listings, static assets |
| Application | Redis | 1-60 min | User sessions, hot data |
| Browser | React Query | 1-5 min | API responses |
| Database | Materialized views | 1 hour | Analytics aggregations |

### Frontend Optimization

| Technique | Implementation |
|-----------|---------------|
| Code splitting | React.lazy per route |
| Image optimization | Next/Image, WebP, responsive srcsets |
| Virtual scrolling | react-window for long lists |
| Optimistic updates | React Query mutation callbacks |
| Prefetching | Link hover triggers prefetch |
| Bundle analysis | Next.js build analyzer |

### Database Optimization

| Technique | Implementation |
|-----------|---------------|
| Pagination | Cursor-based for infinite scroll |
| Select only needed columns | Prisma select |
| Eager loading | Prisma include |
| Connection pooling | Prisma connection pool |
| Read replicas | For analytics queries |
| Indexing | Strategic indexes on hot queries |

---

## 17. Security

### Threat Matrix

| Threat | Severity | Likelihood | Mitigation |
|--------|----------|------------|------------|
| SQL Injection | Critical | Low | Prisma ORM (parameterized queries) |
| XSS | High | Medium | React auto-escaping + CSP headers |
| CSRF | High | Medium | SameSite cookies + CSRF tokens |
| Authentication bypass | Critical | Low | JWT + short expiry + refresh tokens |
| Authorization bypass | Critical | Medium | RBAC middleware on every endpoint |
| Rate limiting | Medium | High | express-rate-limit on auth + AI endpoints |
| Prompt injection | High | Medium | Input sanitization + output filtering |
| AI abuse | High | High | Token limits + conversation limits + content moderation |
| File upload abuse | High | Medium | Type validation + size limits + virus scanning |
| Secrets exposure | Critical | Low | Environment variables + .gitignore |
| Payment fraud | High | Medium | Webhook signature verification + idempotency |
| Data privacy | High | Medium | Encryption at rest + GDPR compliance |

### Prompt Injection Prevention

1. Sanitize all user input before AI context
2. Use function calling to constrain AI outputs
3. Implement content filtering on AI responses
4. Log all AI interactions for audit
5. Rate limit AI queries per user (100/day free, unlimited paid)

### Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/auth/login` | 5 requests | 15 minutes |
| `/api/auth/register` | 3 requests | 1 hour |
| `/api/ai/chat` | 30 requests | 1 hour |
| `/api/lab/run` | 20 requests | 1 hour |
| General API | 100 requests | 1 minute |

---

## 18. Testing Strategy

### Test Types

| Type | Tools | Coverage Target |
|------|-------|----------------|
| Unit tests | Vitest + React Testing Library | 80% components, 100% utilities |
| Integration tests | Vitest + MSW | All API integrations |
| E2E tests | Playwright | Critical user journeys |
| Performance tests | k6 / Artillery | Load testing |
| Accessibility tests | axe-core + Playwright | WCAG 2.1 AA |

### Critical Test Scenarios

1. Registration → Onboarding → Dashboard
2. Browse → Checkout → Payment → Enrollment
3. Course Learning → AI Tutor → Coding Lab → Submit
4. Assessment → Grading → Results → Certificate
5. Admin user management (suspend, role change)
6. Payment webhook handling (idempotency)
7. Certificate verification (public URL)

---

## 19. Deployment

### Production Architecture

```
┌─────────────────────────────────────────────┐
│                  Vercel                       │
│           (Frontend + API Routes)            │
└────────────────────┬────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────┴───────┐         ┌──────┴──────┐
│   Supabase    │         │   Upstash   │
│  (PostgreSQL)  │         │   (Redis)   │
└───────────────┘         └─────────────┘

Storage: Cloudflare R2
AI: OpenAI API
Payments: Paystack + Flutterwave
Email: Resend
Monitoring: Sentry + PostHog
```

### CI/CD Pipeline

```
Push to main
    ↓
GitHub Actions
    ├── Lint (ESLint + Prettier)
    ├── Type check (TypeScript)
    ├── Unit tests (Vitest)
    ├── Integration tests (Vitest + MSW)
    └── Build check
    ↓
Vercel auto-deploy (preview → production)
    ↓
Database migration (Prisma Migrate)
    ↓
Post-deploy verification (health check)
```

### Environment Variables

| Variable | Environment | Description |
|----------|-------------|-------------|
| `DATABASE_URL` | All | PostgreSQL connection string |
| `REDIS_URL` | All | Redis connection string |
| `JWT_SECRET` | All | JWT signing secret |
| `OPENAI_API_KEY` | All | OpenAI API key |
| `PAYSTACK_SECRET_KEY` | All | Paystack secret key |
| `FLUTTERWAVE_SECRET_KEY` | All | Flutterwave secret key |
| `R2_BUCKET_URL` | All | Cloudflare R2 bucket URL |
| `RESEND_API_KEY` | All | Resend API key |
| `SENTRY_DSN` | Production | Sentry error tracking |
| `NEXT_PUBLIC_POSTHOG_KEY` | All | PostHog analytics key |

---

## 20. Roadmap

### MVP (Weeks 1-6)

| Week | Deliverables |
|------|-------------|
| 1-2 | Project setup, auth system, database schema, basic API |
| 3-4 | Course marketplace, student dashboard, course learning page |
| 5-6 | AI tutor integration, coding lab (browser-only), basic admin |

**MVP Scope:**
- Authentication (register, login, email verify)
- Course marketplace (browse, search, filter)
- Course details + enrollment
- Checkout + Paystack payment
- Student dashboard
- Course learning (text lessons)
- AI Tutor (basic chat with course context)
- Coding Lab (HTML/CSS/JS only, browser sandbox)
- Progress tracking
- Admin dashboard (basic stats)

### Beta (Weeks 7-12)

| Week | Deliverables |
|------|-------------|
| 7-8 | Python support (Pyodide), assignment system, assessment engine |
| 9-10 | AI grading, certificate generation, in-app notifications |
| 11-12 | Admin management (users, courses, payments), subscription plans |

**Beta Scope:**
- Python support in Coding Lab
- Assignment system (submit, grade)
- Assessment/Quiz system
- AI grading with rubrics
- Certificate generation + verification
- In-app notifications
- Admin user management
- Admin course management
- Email notifications
- Subscription plans (Scholar/Professional)

### Public Launch (Weeks 13-18)

| Week | Deliverables |
|------|-------------|
| 13-14 | Full analytics, refund workflow, bank transfer verification |
| 15-16 | Performance optimization, security audit, E2E tests |
| 17-18 | Mobile responsiveness polish, SEO, help center |

**Launch Scope:**
- Full analytics dashboard
- Refund workflow
- Bank transfer verification
- Performance optimization
- Security audit
- E2E test coverage
- Mobile responsiveness polish
- SEO optimization
- Help center / FAQ

### V2 (Months 5-6)

- Instructor dashboard (course creation)
- Project submission + review
- Portfolio page
- Student-to-student features (forums)
- Advanced analytics
- Push notifications
- Multi-language support

### V3 (Months 7-9)

- Mobile app (React Native)
- Offline learning
- Live sessions (video)
- Group learning
- Employer partnerships
- API for third-party integrations

---

## Appendix A: Existing Codebase Inventory

### Files Present

| File | Purpose | Production Ready |
|------|---------|-----------------|
| `src/App.tsx` | Main app with routing | No — needs React Router |
| `src/types.ts` | TypeScript types | Partial — needs expansion |
| `src/data/mockData.ts` | Mock data | No — replace with API |
| `src/pages/*.tsx` | 30+ page components | Partial — UI only, no real logic |
| `src/components/*.tsx` | Layout components | Partial — needs refinement |
| `src/index.css` | Global styles + theme | Yes — keep as base |
| `package.json` | Dependencies | Partial — needs backend deps |

### Dependencies to Add

**Frontend:**
- `react-router-dom` — routing
- `@tanstack/react-query` — server state
- `zustand` — global state
- `react-hook-form` + `zod` — forms
- `framer-motion` — animations
- `@monaco-editor/react` — code editor
- `axios` — HTTP client

**Backend (if separate):**
- `next` — framework
- `@prisma/client` — ORM
- `next-auth` — authentication
- `bullmq` — job queue
- `ioredis` — Redis client
- `paystack` — payment SDK
- `flutterwave-node-v3` — payment SDK
- `openai` — AI SDK
- `resend` — email
- `puppeteer` — PDF generation
- `qrcode` — QR code generation

---

## Appendix B: Risk Register

| ID | Risk | Impact | Likelihood | Mitigation | Owner |
|----|------|--------|------------|------------|-------|
| R1 | No backend exists | High | Certain | Build incrementally, MVP first | Engineering |
| R2 | AI costs at scale | High | High | Token budgets, caching, tiered access | Engineering |
| R3 | Code execution security | Critical | Medium | Browser-only execution | Security |
| R4 | Payment fraud | High | Medium | Webhook verification, idempotency | Engineering |
| R5 | Prompt injection | High | Medium | Input sanitization, output filtering | Security |
| R6 | Scope creep | High | High | Strict MVP definition, phased rollout | Product |
| R7 | Performance at scale | Medium | Medium | Caching, CDN, optimization from day 1 | Engineering |
| R8 | Data loss | Critical | Low | Automated backups, point-in-time recovery | DevOps |
| R9 | Vendor lock-in | Medium | Medium | Use abstractions, avoid proprietary APIs | Architecture |
| R10 | Team capacity | High | Medium | Clear priorities, phased delivery | Product |

---

**End of Design Spec**
