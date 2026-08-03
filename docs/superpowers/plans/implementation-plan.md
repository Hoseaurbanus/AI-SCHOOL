# Smugflex AI Academy — Complete Implementation Plan

**Date:** 2026-08-01
**Version:** 1.0
**Status:** Ready for Execution

---

## Table of Contents

1. [Plan Overview](#1-plan-overview)
2. [Architecture Decisions](#2-architecture-decisions)
3. [Phase 0: Foundations (Weeks 1-3)](#3-phase-0-foundations)
4. [Phase 1: Core Platform (Weeks 4-8)](#4-phase-1-core-platform)
5. [Phase 2: AI Engine (Weeks 9-14)](#5-phase-2-ai-engine)
6. [Phase 3: Learning Experience (Weeks 15-20)](#6-phase-3-learning-experience)
7. [Phase 4: Assessment & Credentials (Weeks 21-25)](#7-phase-4-assessment-credentials)
8. [Phase 5: Scale & Optimize (Weeks 26-32)](#8-phase-5-scale-optimize)
9. [Phase 6: Platform Features (Weeks 33-40)](#9-phase-6-platform-features)
10. [Phase 7: Enterprise & Multi-Tenant (Weeks 41-48)](#10-phase-7-enterprise)
11. [Risk Mitigation Schedule](#11-risk-mitigation-schedule)
12. [Cost Projections](#12-cost-projections)
13. [Success Metrics](#13-success-metrics)

---

# 1. Plan Overview

## 1.1 Scope

This plan covers the complete implementation of Smugflex AI Academy from MVP to enterprise-scale platform. It is organized into 8 phases spanning 48 weeks (12 months) with a team of 2-3 developers.

## 1.2 Team Assumptions

| Role | Count | Responsibility |
|------|-------|---------------|
| **Full Stack Developer (Lead)** | 1 | Architecture, backend, AI integration |
| **Frontend Developer** | 1 | UI/UX, React components, editor |
| **Backend/DevOps Developer** | 1 | Infrastructure, databases, deployment |

## 1.3 Technology Stack (Final)

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | React 19, Vite 8, TypeScript, Tailwind CSS v4 | Already built, proven |
| **Backend** | Node.js, Fastify, TypeScript | Shared types with frontend |
| **Database** | PostgreSQL 16 + pgvector | Proven, extensions available |
| **Cache** | Redis 7 | Speed, queues, pub/sub |
| **Vector DB** | Qdrant (self-hosted) → Pinecone (managed) | Open source, scales well |
| **Search** | Meilisearch | Fast, typo-tolerant |
| **Auth** | Clerk | Managed, multi-tenant support |
| **Payments** | Stripe | Industry standard |
| **AI Primary** | GPT-4o-mini (default) + GPT-4o (complex) | Cost/quality balance |
| **AI Fallback** | Claude 3.5 Sonnet, Gemini 1.5 Pro | Provider independence |
| **Embeddings** | text-embedding-3-large | Best quality |
| **Code Editor** | Monaco Editor | VS Code experience |
| **Code Execution** | Pyodide (Python), iframe (HTML/JS), sql.js (SQL) | Browser-side |
| **File Storage** | Cloudflare R2 | S3-compatible, no egress fees |
| **Monitoring** | OpenTelemetry + Grafana + Sentry | Comprehensive |
| **Deployment** | Vercel (frontend) + Railway (backend) | Simple, cost-effective |
| **CI/CD** | GitHub Actions | Already in use |

## 1.4 Phase Summary

| Phase | Name | Duration | Focus |
|-------|------|----------|-------|
| 0 | Foundations | Weeks 1-3 | Infrastructure, schemas, auth |
| 1 | Core Platform | Weeks 4-8 | Courses, marketplace, payments |
| 2 | AI Engine | Weeks 9-14 | AI orchestration, RAG, memory |
| 3 | Learning Experience | Weeks 15-20 | Tutor, coding lab, assessments |
| 4 | Assessment & Credentials | Weeks 21-25 | Grading, certificates, analytics |
| 5 | Scale & Optimize | Weeks 26-32 | Performance, caching, cost optimization |
| 6 | Platform Features | Weeks 33-40 | Plugins, collaboration, mobile |
| 7 | Enterprise | Weeks 41-48 | Multi-tenant, SSO, compliance |

---

# 2. Architecture Decisions

## 2.1 Layered Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  LAYER 4: SAAS PLATFORM                                      │
│  Billing · Organizations · Analytics · Security · Admin       │
├──────────────────────────────────────────────────────────────┤
│  LAYER 3: DEVELOPER PLATFORM                                 │
│  APIs · Plugins · Integrations · Webhooks                     │
├──────────────────────────────────────────────────────────────┤
│  LAYER 2: AI PLATFORM                                        │
│  Gateway · Orchestrator · Prompts · Memory · RAG · Agents    │
├──────────────────────────────────────────────────────────────┤
│  LAYER 1: LEARNING PLATFORM                                  │
│  Courses · Assessments · Projects · Certificates · Progress   │
└──────────────────────────────────────────────────────────────┘
```

## 2.2 Database Schema Design

### Core Tables (with tenant_id for future multi-tenancy)

```sql
-- Tenant/Organization
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Users (extends Clerk user)
CREATE TABLE users (
  id UUID PRIMARY KEY,  -- Clerk user ID
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'student',  -- student, instructor, admin
  tenant_id UUID REFERENCES tenants(id),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  instructor_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER,  -- cents
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'draft',  -- draft, published, archived
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Modules
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,  -- markdown
  content_type TEXT DEFAULT 'lesson',  -- lesson, exercise, project
  sort_order INTEGER,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enrollments
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  status TEXT DEFAULT 'active',  -- active, completed, dropped
  progress JSONB DEFAULT '{}',
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Lesson Progress
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  lesson_id UUID REFERENCES lessons(id),
  status TEXT DEFAULT 'not_started',  -- not_started, in_progress, completed
  score INTEGER,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- Assessments
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  module_id UUID REFERENCES modules(id),
  title TEXT NOT NULL,
  description TEXT,
  time_limit INTEGER,  -- minutes
  passing_score INTEGER,
  questions JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Assessment Results
CREATE TABLE assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessments(id),
  user_id UUID REFERENCES users(id),
  answers JSONB,
  score INTEGER,
  passed BOOLEAN,
  time_taken INTEGER,
  ai_confidence DECIMAL,
  human_reviewed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- Submissions (code, assignments, projects)
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  lesson_id UUID REFERENCES lessons(id),
  type TEXT,  -- code, assignment, project
  content TEXT,
  language TEXT,
  status TEXT DEFAULT 'submitted',  -- submitted, graded, returned
  score INTEGER,
  feedback TEXT,
  ai_confidence DECIMAL,
  human_reviewed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Certificates
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  issued_at TIMESTAMPTZ DEFAULT now(),
  hash TEXT UNIQUE NOT NULL,
  verification_url TEXT
);

-- Conversations (AI chat)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  lesson_id UUID REFERENCES lessons(id),
  agent_type TEXT,  -- tutor, mentor, coder, assessor
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT,  -- user, assistant, system
  content TEXT,
  tokens_used INTEGER,
  model TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Student Memory
CREATE TABLE student_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  category TEXT,  -- session, lesson, course, profile, history
  key TEXT,
  value JSONB,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, category, key)
);

-- Knowledge Base (course content for RAG)
CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  lesson_id UUID REFERENCES lessons(id),
  content TEXT,
  metadata JSONB,
  embedding_id TEXT,  -- reference to vector DB
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Prompt Templates
CREATE TABLE prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  template TEXT NOT NULL,
  variables JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit Log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Analytics Events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  event_type TEXT NOT NULL,
  properties JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Subscriptions/Billing
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  stripe_subscription_id TEXT,
  plan TEXT,
  status TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Indexes

```sql
-- Performance-critical indexes
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_assessment_results_user ON assessment_results(user_id);
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_student_memory_user ON student_memory(user_id);
CREATE INDEX idx_knowledge_chunks_course ON knowledge_chunks(course_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at);
```

## 2.3 API Design

### REST Endpoints

```
/api/v1/
├── auth/
│   ├── POST /register
│   ├── POST /login
│   └── POST /logout
├── users/
│   ├── GET /me
│   ├── PUT /me
│   └── GET /me/progress
├── courses/
│   ├── GET /                    # List courses
│   ├── GET /:id                 # Get course
│   ├── GET /:id/modules         # Get modules
│   ├── GET /:id/modules/:moduleId/lessons  # Get lessons
│   └── GET /:id/reviews         # Get reviews
├── enrollments/
│   ├── POST /                   # Enroll in course
│   ├── GET /me                  # My enrollments
│   └── PUT /:id/progress        # Update progress
├── lessons/
│   ├── GET /:id                 # Get lesson content
│   ├── GET /:id/content         # Get lesson content (rich)
│   └── GET /:id/resources       # Get resources
├── submissions/
│   ├── POST /                   # Submit code/assignment
│   ├── GET /:id                 # Get submission
│   └── GET /me                  # My submissions
├── assessments/
│   ├── GET /:id                 # Get assessment
│   ├── POST /:id/start          # Start assessment
│   ├── POST /:id/submit         # Submit assessment
│   └── GET /me/results          # My results
├── certificates/
│   ├── GET /me                  # My certificates
│   └── GET /:id/verify          # Verify certificate
├── ai/
│   ├── POST /chat               # Send message to AI
│   ├── GET /chat/history/:conversationId  # Chat history
│   ├── POST /code/review        # AI code review
│   ├── POST /code/hint          # Get hint
│   ├── POST /grade              # Grade submission
│   ├── GET /recommendations     # Get recommendations
│   ├── GET /memory              # Get student memory
│   └── GET /stats               # Get learning stats
├── search/
│   ├── GET /courses             # Search courses
│   └── GET /content             # Search content
└── webhooks/
    ├── POST /stripe             # Stripe webhooks
    └── POST /clerk              # Clerk webhooks
```

### WebSocket Events

```
/ws/
├── ai/stream                    # AI response streaming
├── collaboration/code-sync      # Real-time code sync
├── collaboration/cursor-share   # Cursor positions
├── notifications                # Real-time notifications
└── analytics/events             # Analytics event stream
```

## 2.4 AI Abstraction Layer

```typescript
// Provider interface (implemented by each AI provider)
interface AIProvider {
  chat(params: ChatParams): AsyncGenerator<ChatChunk>;
  embed(text: string): Promise<number[]>;
  moderate(content: string): Promise<ModerationResult>;
  getModelInfo(): ModelInfo;
}

// Orchestrator (routes tasks to providers)
interface AIOrchestrator {
  // High-level operations
  tutorChat(studentId: string, message: string, context: LearningContext): AsyncGenerator<string>;
  reviewCode(studentId: string, code: string, language: string): Promise<CodeReview>;
  gradeSubmission(studentId: string, submission: Submission, rubric: Rubric): Promise<GradeResult>;
  generateQuiz(studentId: string, lessonId: string, difficulty: number): Promise<Quiz>;
  getHint(studentId: string, exerciseId: string, attempt: number): Promise<Hint>;
  getRecommendations(studentId: string): Promise<Recommendation[]>;
}

// Model router (selects optimal model per task)
interface ModelRouter {
  route(task: TaskType, requirements: TaskRequirements): ModelSelection;
}

// Fallback chain
interface FallbackChain {
  execute<T>(task: () => Promise<T>, fallbacks: (() => Promise<T>)[]): Promise<T>;
}
```

---

# 3. Phase 0: Foundations (Weeks 1-3)

## 3.1 Objectives
- Set up development infrastructure
- Implement database schema
- Set up authentication
- Create base API framework
- Establish CI/CD pipeline

## 3.2 Tasks

### Week 1: Infrastructure

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 0.1.1 | DevOps | 2h | Set up GitHub repositories (frontend + backend) |
| 0.1.2 | DevOps | 4h | Configure Vercel deployment for frontend |
| 0.1.3 | DevOps | 4h | Set up Railway deployment for backend |
| 0.1.4 | DevOps | 4h | Provision PostgreSQL (Supabase/Neon) |
| 0.1.5 | DevOps | 2h | Provision Redis (Upstash) |
| 0.1.6 | DevOps | 4h | Set up Cloudflare R2 for file storage |
| 0.1.7 | DevOps | 2h | Configure GitHub Actions CI/CD |
| 0.1.8 | DevOps | 2h | Set up Sentry for error tracking |
| 0.1.9 | Lead | 4h | Set up development environment documentation |

### Week 2: Database & Auth

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 0.2.1 | Lead | 8h | Create database migration system (Drizzle ORM) |
| 0.2.2 | Lead | 8h | Implement core schema (users, courses, modules, lessons) |
| 0.2.3 | Lead | 4h | Implement enrollment and progress schema |
| 0.2.4 | Lead | 4h | Implement assessment and submission schema |
| 0.2.5 | Lead | 4h | Implement conversation and message schema |
| 0.2.6 | Lead | 4h | Implement student memory schema |
| 0.2.7 | Frontend | 6h | Set up Clerk authentication |
| 0.2.8 | Frontend | 4h | Create ProtectedRoute component |
| 0.2.9 | Frontend | 4h | Create auth store (Zustand) |

### Week 3: API Framework

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 0.3.1 | Lead | 4h | Set up Fastify server with TypeScript |
| 0.3.2 | Lead | 4h | Implement API middleware (auth, rate limiting, logging) |
| 0.3.3 | Lead | 4h | Create base route handlers |
| 0.3.4 | Lead | 4h | Implement audit logging middleware |
| 0.3.5 | Lead | 4h | Set up API versioning (v1/) |
| 0.3.6 | Frontend | 4h | Set up API client (Axios with interceptors) |
| 0.3.7 | Frontend | 4h | Create React Query provider and hooks |
| 0.3.8 | All | 4h | Write Phase 0 integration tests |

## 3.3 Deliverables
- ✅ Working development environment
- ✅ Database schema with migrations
- ✅ Authentication flow (register, login, logout)
- ✅ Base API framework with middleware
- ✅ CI/CD pipeline (lint, test, deploy)
- ✅ Error tracking (Sentry)

## 3.4 Acceptance Criteria
- [ ] New developer can set up environment in < 30 minutes
- [ ] Database migrations run cleanly
- [ ] Auth flow works end-to-end
- [ ] API returns 200 for health check
- [ ] Frontend deploys to Vercel on push to main
- [ ] Backend deploys to Railway on push to main

---

# 4. Phase 1: Core Platform (Weeks 4-8)

## 4.1 Objectives
- Implement course marketplace
- Build student dashboard
- Implement payment system
- Create course learning experience
- Build admin dashboard (basic)

## 4.2 Tasks

### Week 4: Course System

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 1.4.1 | Lead | 8h | Course CRUD API endpoints |
| 1.4.2 | Lead | 4h | Module and lesson CRUD API |
| 1.4.3 | Lead | 4h | Course search endpoint (Meilisearch) |
| 1.4.4 | Frontend | 8h | Marketplace page with course cards |
| 1.4.5 | Frontend | 6h | Course detail page |
| 1.4.6 | Frontend | 4h | Course curriculum component |
| 1.4.7 | Frontend | 4h | Instructor dashboard (basic) |

### Week 5: Enrollment & Payments

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 1.5.1 | Lead | 8h | Stripe integration (checkout, webhooks) |
| 1.5.2 | Lead | 4h | Enrollment API endpoints |
| 1.5.3 | Lead | 4h | Payment status handling |
| 1.5.4 | Frontend | 6h | Checkout page |
| 1.5.5 | Frontend | 4h | Payment success/failure pages |
| 1.5.6 | Frontend | 4h | My Courses page |
| 1.5.7 | Frontend | 4h | Enrollment confirmation flow |

### Week 6: Course Learning

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 1.6.1 | Lead | 6h | Lesson content API |
| 1.6.2 | Lead | 4h | Progress tracking API |
| 1.6.3 | Frontend | 8h | Course learning page (lesson viewer) |
| 1.6.4 | Frontend | 6h | Lesson navigation (prev/next) |
| 1.6.5 | Frontend | 4h | Progress tracking UI |
| 1.6.6 | Frontend | 4h | Notes panel component |
| 1.6.7 | Frontend | 4h | Resources list component |

### Week 7: Student Dashboard

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 1.7.1 | Lead | 4h | Student stats API |
| 1.7.2 | Lead | 4h | Activity feed API |
| 1.7.3 | Frontend | 8h | Student dashboard page |
| 1.7.4 | Frontend | 6h | Stats cards component |
| 1.7.5 | Frontend | 4h | Active courses component |
| 1.7.6 | Frontend | 4h | Quick actions component |
| 1.7.7 | Frontend | 4h | Recent activity component |

### Week 8: Admin Dashboard

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 1.8.1 | Lead | 4h | Admin API endpoints (users, courses) |
| 1.8.2 | Lead | 4h | Admin analytics API |
| 1.8.3 | Frontend | 6h | Admin dashboard page |
| 1.8.4 | Frontend | 4h | User management page |
| 1.8.5 | Frontend | 4h | Course management page |
| 1.8.6 | Frontend | 4h | Payment overview page |
| 1.8.7 | All | 4h | Phase 1 integration tests |

## 4.3 Deliverables
- ✅ Course marketplace with search
- ✅ Course purchase flow (Stripe)
- ✅ Course learning experience
- ✅ Student dashboard
- ✅ Admin dashboard (basic)

## 4.4 Acceptance Criteria
- [ ] Student can browse and purchase courses
- [ ] Student can access course content after purchase
- [ ] Progress is tracked and displayed
- [ ] Admin can manage courses and users
- [ ] Payments are processed correctly
- [ ] All pages load in < 2 seconds

---

# 5. Phase 2: AI Engine (Weeks 9-14)

## 5.1 Objectives
- Build AI orchestration layer
- Implement RAG with vector embeddings
- Create student memory system
- Build prompt management system
- Implement AI streaming

## 5.2 Tasks

### Week 9: AI Infrastructure

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 2.9.1 | Lead | 8h | AI provider abstraction layer |
| 2.9.2 | Lead | 6h | OpenAI provider implementation |
| 2.9.3 | Lead | 4h | Anthropic provider implementation |
| 2.9.4 | Lead | 4h | Model router (task → model mapping) |
| 2.9.5 | Lead | 4h | Fallback chain implementation |
| 2.9.6 | Lead | 4h | Token budgeting and cost tracking |
| 2.9.7 | Lead | 4h | Rate limiting per student |

### Week 10: RAG System

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 2.10.1 | Lead | 6h | Set up Qdrant vector database |
| 2.10.2 | Lead | 6h | Content ingestion pipeline |
| 2.10.3 | Lead | 4h | Chunking strategy implementation |
| 2.10.4 | Lead | 4h | Embedding generation (OpenAI) |
| 2.10.5 | Lead | 4h | Hybrid search (vector + BM25) |
| 2.10.6 | Lead | 4h | Reranking implementation |
| 2.10.7 | Lead | 4h | Citation and source tracking |
| 2.10.8 | Frontend | 4h | Knowledge base admin UI |

### Week 11: Student Memory

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 2.11.1 | Lead | 6h | Memory write pipeline (async) |
| 2.11.2 | Lead | 6h | Memory read pipeline (sync) |
| 2.11.3 | Lead | 4h | Session memory (Redis) |
| 2.11.4 | Lead | 4h | Lesson/course memory (PostgreSQL) |
| 2.11.5 | Lead | 4h | Student profile memory |
| 2.11.6 | Lead | 4h | Memory summarization (7-day) |
| 2.11.7 | Lead | 4h | Memory privacy controls |
| 2.11.8 | Frontend | 4h | MemoryBadge component |

### Week 12: Prompt Management

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 2.12.1 | Lead | 6h | Prompt template system |
| 2.12.2 | Lead | 4h | Prompt versioning |
| 2.12.3 | Lead | 4h | Prompt A/B testing framework |
| 2.12.4 | Lead | 4h | Prompt performance tracking |
| 2.12.5 | Lead | 4h | System prompt composition |
| 2.12.6 | Frontend | 6h | Prompt management admin UI |
| 2.12.7 | Frontend | 4h | Prompt editor component |

### Week 13: AI Chat

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 2.13.1 | Lead | 6h | AI chat API with streaming (SSE) |
| 2.13.2 | Lead | 4h | Conversation management API |
| 2.13.3 | Lead | 4h | Context assembly (memory + RAG) |
| 2.13.4 | Lead | 4h | Input sanitization (prompt injection) |
| 2.13.5 | Lead | 4h | Output validation |
| 2.13.6 | Frontend | 8h | Streaming chat UI |
| 2.13.7 | Frontend | 4h | Chat history component |
| 2.13.8 | Frontend | 4h | Suggestion chips component |

### Week 14: AI Agents

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 2.14.1 | Lead | 6h | Agent orchestrator |
| 2.14.2 | Lead | 6h | Tutor agent implementation |
| 2.14.3 | Lead | 4h | Coding agent implementation |
| 2.14.4 | Lead | 4h | Assessment agent implementation |
| 2.14.5 | Lead | 4h | Agent handoff protocol |
| 2.14.6 | Lead | 4h | Agent performance tracking |
| 2.14.7 | All | 4h | Phase 2 integration tests |

## 5.3 Deliverables
- ✅ AI orchestration layer (multi-provider)
- ✅ RAG system with vector embeddings
- ✅ Student memory system (5 levels)
- ✅ Prompt management system
- ✅ AI chat with streaming
- ✅ Specialized AI agents (tutor, coder, assessor)

## 5.4 Acceptance Criteria
- [ ] AI responds to student questions in < 3 seconds
- [ ] AI responses are grounded in course content (RAG)
- [ ] AI remembers student context across sessions
- [ ] Streaming works smoothly (token-by-token)
- [ ] Fallback chain works when primary provider fails
- [ ] Prompt injection attempts are blocked
- [ ] Cost tracking shows accurate token usage

---

# 6. Phase 3: Learning Experience (Weeks 15-20)

## 6.1 Objectives
- Enhance AI tutor with course context
- Build interactive coding lab
- Implement code execution (HTML, Python, JS)
- Create assessment engine
- Build recommendation system

## 6.2 Tasks

### Week 15: Enhanced AI Tutor

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 3.15.1 | Lead | 6h | Lesson-aware tutoring |
| 3.15.2 | Lead | 4h | Socratic questioning mode |
| 3.15.3 | Lead | 4h | Code example generation |
| 3.15.4 | Lead | 4h | Analogy generation |
| 3.15.5 | Frontend | 6h | Enhanced chat UI (code blocks, markdown) |
| 3.15.6 | Frontend | 4h | Lesson context display |
| 3.15.7 | Frontend | 4h | Code snippet copy/run |

### Week 16: Coding Lab (HTML/CSS/JS)

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 3.16.1 | Lead | 4h | Code execution API |
| 3.16.2 | Lead | 6h | HTML/CSS/JS execution (iframe sandbox) |
| 3.16.3 | Lead | 4h | Execution timeout enforcement |
| 3.16.4 | Lead | 4h | Output capture (stdout, stderr) |
| 3.16.5 | Frontend | 8h | Monaco editor integration |
| 3.16.6 | Frontend | 6h | Preview panel (iframe) |
| 3.16.7 | Frontend | 4h | Terminal component |
| 3.16.8 | Frontend | 4h | Run/Reset buttons |

### Week 17: Coding Lab (Python)

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 3.17.1 | Lead | 6h | Pyodide integration |
| 3.17.2 | Lead | 4h | Python execution in Web Worker |
| 3.17.3 | Lead | 4h | Python stdout/stderr capture |
| 3.17.4 | Lead | 4h | Pyodide instance caching |
| 3.17.5 | Frontend | 4h | Python language support in editor |
| 3.17.6 | Frontend | 4h | Python output display |

### Week 18: AI Code Review

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 3.18.1 | Lead | 6h | Code review API |
| 3.18.2 | Lead | 6h | Static analysis integration (ESLint, Pylint) |
| 3.18.3 | Lead | 4h | AI code review prompt |
| 3.18.4 | Lead | 4h | Review result formatting |
| 3.18.5 | Frontend | 6h | AI review panel |
| 3.18.6 | Frontend | 4h | Inline issue highlighting |
| 3.18.7 | Frontend | 4h | Review history |

### Week 19: Assessment Engine

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 3.19.1 | Lead | 6h | Assessment API (CRUD) |
| 3.19.2 | Lead | 4h | Quiz generation API |
| 3.19.3 | Lead | 4h | Quiz submission and grading |
| 3.19.4 | Lead | 4h | Timer and auto-submit |
| 3.19.5 | Frontend | 8h | Assessment page (quiz engine) |
| 3.19.6 | Frontend | 4h | Question card component |
| 3.19.7 | Frontend | 4h | Quiz progress component |
| 3.19.8 | Frontend | 4h | Result summary component |

### Week 20: Recommendations

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 3.20.1 | Lead | 6h | Recommendation engine |
| 3.20.2 | Lead | 4h | Skill gap analysis |
| 3.20.3 | Lead | 4h | Course recommendations |
| 3.20.4 | Lead | 4h | Next lesson recommendations |
| 3.20.5 | Frontend | 6h | Recommendations UI |
| 3.20.6 | Frontend | 4h | Skill gap visualization |
| 3.20.7 | All | 4h | Phase 3 integration tests |

## 6.3 Deliverables
- ✅ Enhanced AI tutor with course context
- ✅ Interactive coding lab (HTML, CSS, JS, Python)
- ✅ AI code review
- ✅ Assessment engine (quizzes)
- ✅ Recommendation system

## 6.4 Acceptance Criteria
- [ ] Student can write and run code in browser
- [ ] Python code executes in < 5 seconds
- [ ] AI code review provides actionable feedback
- [ ] Quizzes can be taken and graded
- [ ] Recommendations are personalized to student
- [ ] All code execution is sandboxed

---

# 7. Phase 4: Assessment & Credentials (Weeks 21-25)

## 7.1 Objectives
- Implement AI grading for code
- Build project assessment system
- Create certificate system
- Implement learning analytics
- Build study planner

## 7.2 Tasks

### Week 21: AI Grading

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 4.21.1 | Lead | 6h | Grading rubric system |
| 4.21.2 | Lead | 6h | Test case runner for code |
| 4.21.3 | Lead | 4h | AI grading prompt |
| 4.21.4 | Lead | 4h | Confidence scoring |
| 4.21.5 | Lead | 4h | Human review queue |
| 4.21.6 | Frontend | 4h | Grading results UI |
| 4.21.7 | Frontend | 4h | Human review admin UI |

### Week 22: Project Assessment

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 4.22.1 | Lead | 6h | Project submission API |
| 4.22.2 | Lead | 6h | Project evaluation (AI) |
| 4.22.3 | Lead | 4h | Project rubric system |
| 4.22.4 | Lead | 4h | Plagiarism detection (basic) |
| 4.22.5 | Frontend | 6h | Project submission UI |
| 4.22.6 | Frontend | 4h | Project review UI |

### Week 23: Certificates

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 4.23.1 | Lead | 4h | Certificate generation API |
| 4.23.2 | Lead | 4h | PDF generation (Puppeteer) |
| 4.23.3 | Lead | 4h | Certificate hashing |
| 4.23.4 | Lead | 4h | Verification endpoint |
| 4.23.5 | Frontend | 6h | Certificate page |
| 4.23.6 | Frontend | 4h | Certificate preview modal |
| 4.23.7 | Frontend | 4h | Certificate download |

### Week 24: Analytics

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 4.24.1 | Lead | 6h | Analytics event pipeline |
| 4.24.2 | Lead | 6h | Analytics aggregation |
| 4.24.3 | Lead | 4h | Student analytics API |
| 4.24.4 | Lead | 4h | Course analytics API |
| 4.24.5 | Frontend | 6h | Student analytics dashboard |
| 4.24.6 | Frontend | 4h | Course analytics dashboard |
| 4.24.7 | Frontend | 4h | Charts and visualizations |

### Week 25: Study Planner

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 4.25.1 | Lead | 6h | Study plan generation API |
| 4.25.2 | Lead | 4h | Schedule optimization |
| 4.25.3 | Lead | 4h | Reminder system |
| 4.25.4 | Lead | 4h | Progress tracking |
| 4.25.5 | Frontend | 6h | Study planner page |
| 4.25.6 | Frontend | 4h | Calendar view |
| 4.25.7 | All | 4h | Phase 4 integration tests |

## 7.3 Deliverables
- ✅ AI grading with confidence scores
- ✅ Project assessment system
- ✅ Certificate generation and verification
- ✅ Learning analytics
- ✅ Study planner

## 7.4 Acceptance Criteria
- [ ] Code is graded by AI with test cases
- [ ] Projects receive detailed feedback
- [ ] Certificates can be verified via URL
- [ ] Analytics show student progress
- [ ] Study plans are personalized
- [ ] Human review is available for all grading

---

# 8. Phase 5: Scale & Optimize (Weeks 26-32)

## 8.1 Objectives
- Optimize AI costs
- Implement caching
- Add monitoring
- Performance optimization
- Security hardening

## 8.2 Tasks

### Week 26-27: Cost Optimization

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 5.26.1 | Lead | 6h | Response caching (Redis) |
| 5.26.2 | Lead | 6h | Prompt compression |
| 5.26.3 | Lead | 4h | Embedding reuse |
| 5.26.4 | Lead | 4h | Batch processing |
| 5.26.5 | Lead | 4h | Cost dashboard |
| 5.26.6 | Lead | 4h | Budget alerts |

### Week 28-29: Monitoring

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 5.28.1 | DevOps | 6h | OpenTelemetry setup |
| 5.28.2 | DevOps | 6h | Grafana dashboards |
| 5.28.3 | DevOps | 4h | Loki logging |
| 5.28.4 | DevOps | 4h | Alert rules |
| 5.28.5 | DevOps | 4h | AI quality dashboard |
| 5.28.6 | DevOps | 4h | Student metrics dashboard |

### Week 30-31: Performance

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 5.30.1 | Lead | 6h | Database query optimization |
| 5.30.2 | Lead | 4h | API response compression |
| 5.30.3 | Lead | 4h | Frontend code splitting |
| 5.30.4 | Lead | 4h | Image optimization |
| 5.30.5 | Frontend | 4h | Lazy loading |
| 5.30.6 | Frontend | 4h | Service worker |

### Week 32: Security

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 5.32.1 | Lead | 4h | Input validation audit |
| 5.32.2 | Lead | 4h | SQL injection prevention |
| 5.32.3 | Lead | 4h | XSS prevention |
| 5.32.4 | Lead | 4h | CSRF protection |
| 5.32.5 | Lead | 4h | Rate limiting audit |
| 5.32.6 | Lead | 4h | Penetration testing |
| 5.32.7 | All | 4h | Phase 5 integration tests |

## 8.3 Deliverables
- ✅ Response caching (30-40% cost reduction)
- ✅ Comprehensive monitoring
- ✅ Performance optimization (50%+ improvement)
- ✅ Security hardening

## 8.4 Acceptance Criteria
- [ ] AI costs reduced by 30%+ through caching
- [ ] All critical metrics are monitored
- [ ] API response time < 500ms (p95)
- [ ] Frontend loads in < 2 seconds
- [ ] No critical security vulnerabilities
- [ ] Security audit passes

---

# 9. Phase 6: Platform Features (Weeks 33-40)

## 9.1 Objectives
- Implement plugin system
- Add real-time collaboration
- Build notification system
- Create mobile-responsive improvements
- Add multi-language support (i18n)

## 9.2 Tasks

### Week 33-34: Plugin System

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 6.33.1 | Lead | 8h | Plugin API design |
| 6.33.2 | Lead | 6h | Plugin registry |
| 6.33.3 | Lead | 4h | Plugin permissions |
| 6.33.4 | Lead | 4h | Plugin sandbox |
| 6.33.5 | Frontend | 6h | Plugin management UI |
| 6.33.6 | Frontend | 4h | GitHub plugin |
| 6.33.7 | Frontend | 4h | Google Drive plugin |

### Week 35-36: Collaboration

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 6.35.1 | Lead | 8h | WebSocket server |
| 6.35.2 | Lead | 6h | Real-time code sync (CRDT) |
| 6.35.3 | Lead | 4h | Cursor sharing |
| 6.35.4 | Lead | 4h | Live session management |
| 6.35.5 | Frontend | 6h | Collaboration UI |
| 6.35.6 | Frontend | 4h | Participant list |
| 6.35.7 | Frontend | 4h | Chat sidebar |

### Week 37-38: Notifications

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 6.37.1 | Lead | 6h | Notification service |
| 6.37.2 | Lead | 4h | Email notifications (Resend) |
| 6.37.3 | Lead | 4h | Push notifications |
| 6.37.4 | Lead | 4h | In-app notifications |
| 6.37.5 | Lead | 4h | Notification preferences |
| 6.37.6 | Frontend | 6h | Notification center |
| 6.37.7 | Frontend | 4h | Notification settings |

### Week 39-40: i18n & Mobile

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 6.39.1 | Lead | 6h | i18n framework (react-i18next) |
| 6.39.2 | Lead | 4h | English translation |
| 6.39.3 | Lead | 4h | French translation |
| 6.39.4 | Frontend | 6h | Mobile responsiveness audit |
| 6.39.5 | Frontend | 6h | Mobile UI improvements |
| 6.39.6 | Frontend | 4h | Touch-friendly interactions |
| 6.39.7 | All | 4h | Phase 6 integration tests |

## 9.3 Deliverables
- ✅ Plugin system with GitHub and Google Drive
- ✅ Real-time collaboration (pair programming)
- ✅ Notification system (email, push, in-app)
- ✅ Multi-language support (English, French)
- ✅ Mobile-responsive improvements

## 9.4 Acceptance Criteria
- [ ] Plugins can be installed and configured
- [ ] Two students can code together in real-time
- [ ] Notifications are delivered via all channels
- [ ] UI works well on mobile devices
- [ ] i18n works for English and French

---

# 10. Phase 7: Enterprise & Multi-Tenant (Weeks 41-48)

## 10.1 Objectives
- Implement multi-tenancy
- Add SSO support
- Build enterprise admin features
- Compliance (GDPR, SOC 2)
- Final polish and launch preparation

## 10.2 Tasks

### Week 41-42: Multi-Tenancy

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 7.41.1 | Lead | 8h | Tenant isolation (row-level security) |
| 7.41.2 | Lead | 6h | Tenant management API |
| 7.41.3 | Lead | 4h | Custom branding per tenant |
| 7.41.4 | Lead | 4h | Tenant-scoped AI prompts |
| 7.41.5 | Frontend | 6h | Tenant admin dashboard |
| 7.41.6 | Frontend | 4h | Branding customization UI |

### Week 43-44: SSO & Enterprise

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 7.43.1 | Lead | 6h | SAML SSO integration |
| 7.43.2 | Lead | 4h | SCIM provisioning |
| 7.43.3 | Lead | 4h | Bulk enrollment |
| 7.43.4 | Lead | 4h | Enterprise reporting |
| 7.43.5 | Frontend | 6h | Enterprise admin UI |
| 7.43.6 | Frontend | 4h | SSO configuration |

### Week 45-46: Compliance

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 7.45.1 | Lead | 6h | GDPR data export |
| 7.45.2 | Lead | 4h | GDPR data deletion |
| 7.45.3 | Lead | 4h | Consent management |
| 7.45.4 | Lead | 4h | Audit log compliance |
| 7.45.5 | Lead | 4h | Data retention policies |
| 7.45.6 | Lead | 4h | Privacy policy implementation |

### Week 47-48: Launch Preparation

| Task | Owner | Effort | Description |
|------|-------|--------|-------------|
| 7.47.1 | All | 8h | End-to-end testing |
| 7.47.2 | All | 4h | Load testing |
| 7.47.3 | All | 4h | Security audit |
| 7.47.4 | All | 4h | Documentation |
| 7.47.5 | All | 4h | Deployment runbook |
| 7.47.6 | All | 4h | Monitoring setup |
| 7.47.7 | All | 4h | Launch checklist |

## 10.3 Deliverables
- ✅ Multi-tenant architecture
- ✅ SSO support (SAML)
- ✅ Enterprise admin features
- ✅ GDPR compliance
- ✅ Production deployment

## 10.4 Acceptance Criteria
- [ ] Multiple tenants can coexist with isolation
- [ ] SSO works with major identity providers
- [ ] GDPR data export/deletion works
- [ ] Audit logs capture all actions
- [ ] Load test passes (1000 concurrent users)
- [ ] Security audit passes
- [ ] Documentation is complete

---

# 11. Risk Mitigation Schedule

| Risk | Mitigation | Phase | Week |
|------|-----------|-------|------|
| **AI grading inaccuracy** | Confidence scores + human review queue | 4 | 21 |
| **AI hallucination** | RAG grounding + citation + output validation | 2 | 10, 13 |
| **Prompt injection** | Input sanitization + output filtering | 2 | 13 |
| **API cost overrun** | Caching + model routing + budget alerts | 5 | 26-27 |
| **OpenAI outage** | Multi-provider fallback chain | 2 | 9 |
| **Data breach** | Encryption + access control + audit logging | 7 | 45-46 |
| **Student cheating** | Proctoring + plagiarism detection + human review | 4 | 21-22 |
| **Vendor lock-in** | Provider-agnostic abstraction layer | 2 | 9 |
| **Slow AI responses** | Streaming + caching + model selection | 5 | 26-31 |
| **Content quality** | Human review + student feedback + A/B testing | 2 | 12 |

---

# 12. Cost Projections

## 12.1 Development Cost

| Phase | Duration | Team Cost (@ $50/hr) |
|-------|----------|----------------------|
| Phase 0 | 3 weeks | $12,000 |
| Phase 1 | 5 weeks | $30,000 |
| Phase 2 | 6 weeks | $36,000 |
| Phase 3 | 6 weeks | $36,000 |
| Phase 4 | 5 weeks | $30,000 |
| Phase 5 | 7 weeks | $42,000 |
| Phase 6 | 8 weeks | $48,000 |
| Phase 7 | 8 weeks | $48,000 |
| **Total** | **48 weeks** | **$282,000** |

## 12.2 Infrastructure Cost (Monthly)

| Scale | Compute | Database | AI API | Other | Total |
|-------|---------|----------|--------|-------|-------|
| MVP (100 students) | $100 | $50 | $200 | $100 | **$450** |
| Growth (1K students) | $300 | $200 | $1,500 | $300 | **$2,300** |
| Scale (10K students) | $1,000 | $500 | $8,000 | $1,000 | **$10,500** |
| Enterprise (100K students) | $5,000 | $3,000 | $40,000 | $5,000 | **$53,000** |

## 12.3 Revenue Breakpoint

| Scenario | Price | Students Needed |
|----------|-------|-----------------|
| MVP ($450/mo) | $50 | 9 students |
| Growth ($2,300/mo) | $50 | 46 students |
| Scale ($10,500/mo) | $50 | 210 students |
| Enterprise ($53,000/mo) | $50 | 1,060 students |

---

# 13. Success Metrics

## 13.1 Technical Metrics

| Metric | Target (MVP) | Target (Year 1) | Target (Year 2) |
|--------|-------------|-----------------|-----------------|
| **Uptime** | 99% | 99.9% | 99.99% |
| **API latency (p95)** | < 2s | < 1s | < 500ms |
| **AI response time** | < 5s | < 3s | < 2s |
| **Error rate** | < 5% | < 1% | < 0.1% |
| **AI accuracy** | > 80% | > 90% | > 95% |

## 13.2 Business Metrics

| Metric | Target (MVP) | Target (Year 1) | Target (Year 2) |
|--------|-------------|-----------------|-----------------|
| **Students** | 100 | 1,000 | 10,000 |
| **Courses** | 5 | 20 | 100 |
| **MRR** | $5,000 | $50,000 | $500,000 |
| **Completion rate** | 30% | 50% | 70% |
| **NPS** | > 30 | > 50 | > 70 |

## 13.3 Learning Metrics

| Metric | Target (MVP) | Target (Year 1) | Target (Year 2) |
|--------|-------------|-----------------|-----------------|
| **Quiz pass rate** | > 60% | > 70% | > 80% |
| **Student satisfaction** | > 70% | > 80% | > 90% |
| **Skill improvement** | > 20% | > 30% | > 40% |
| **Certificate employment rate** | N/A | > 50% | > 70% |

---

## Summary

This plan provides a complete roadmap from MVP to enterprise-scale platform. The key principles are:

1. **Build foundation first** (Phase 0-1) — prove the model works
2. **Add AI capabilities incrementally** (Phase 2-4) — don't over-engineer
3. **Optimize for scale** (Phase 5) — reduce costs, improve performance
4. **Expand platform features** (Phase 6) — plugins, collaboration
5. **Enterprise readiness** (Phase 7) — multi-tenant, compliance

**Total timeline:** 48 weeks (12 months)
**Total development cost:** ~$282,000
**Break-even point:** 46 students at $50/course (growth phase)

The plan is aggressive but achievable with a focused team of 3 developers. The critical path is Phase 2 (AI Engine) — this is where the most risk and complexity reside.

---

**Plan prepared by:** Independent Architecture Consulting Firm
**Classification:** Confidential — For Internal Use Only
**Date:** 2026-08-01
