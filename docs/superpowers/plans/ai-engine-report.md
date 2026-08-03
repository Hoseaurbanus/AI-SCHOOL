# Smugflex AI Academy — AI Engine Architecture Report

**Date:** 2026-08-01
**Status:** Analysis Complete

---

## Table of Contents

1. [Current AI Implementation Status](#1-current-ai-implementation-status)
2. [Architecture Analysis](#2-architecture-analysis)
3. [Types and Interfaces](#3-types-and-interfaces)
4. [Services and Hooks Analysis](#4-services-and-hooks-analysis)
5. [Mock Data Analysis](#5-mock-data-analysis)
6. [Frontend AI Components](#6-frontend-ai-components)
7. [Gaps Between Design Spec and Implementation](#7-gaps-between-design-spec-and-implementation)
8. [Recommendations for Production AI Integration](#8-recommendations-for-production-ai-integration)

---

## 1. Current AI Implementation Status

### Summary

The current AI implementation is a **frontend prototype with mocked backend responses**. All AI features are fully wired on the frontend but rely on MSW (Mock Service Worker) handlers that return static or pattern-matched responses. No real AI model is connected.

### What Exists

| Feature | Status | Notes |
|---------|--------|-------|
| AI Chat Interface | Functional UI | Full chat UI with messages, typing indicator, course context |
| AI Chat Backend | Mocked | MSW handler returns pattern-matched responses |
| AI Insights | Mocked | Static array of 3 insights |
| Student Stats | Mocked | Static object with hardcoded values |
| Code Execution (HTML) | Real | iframe with srcdoc rendering |
| Code Execution (Python) | Real | Pyodide loaded via CDN, executes in browser |
| Code Execution (Markdown) | Real | Regex-based markdown-to-HTML conversion |
| Code Review | Mocked | Returns hardcoded feedback string |
| Assessment Engine | Functional UI | Full quiz engine with timer, scoring, navigation |
| Assessment Scoring | Real (client-side) | Score calculated from correct answers |
| AI Grading | Not implemented | Design spec calls for AI-graded short answers |
| AI Recommendations | Not implemented | Design spec calls for personalized recommendations |
| Student Memory System | Not implemented | Design spec calls for learning pattern tracking |
| Context Retrieval Pipeline | Not implemented | Design spec calls for RAG with vector embeddings |
| Streaming Responses | Not implemented | Design spec calls for OpenAI streaming |
| Fallback Strategy | Not implemented | Design spec calls for GPT-4 → GPT-3.5 → cache → error |

### What Is Simulated

| Feature | Simulation Method |
|---------|-------------------|
| AI Chat Responses | Pattern matching on keywords (list, recursion, loop) |
| AI Insights | Hardcoded 3-item array |
| Student Statistics | Hardcoded object |
| Chat History | Hardcoded 2-message conversation |
| Code Review | Hardcoded feedback string |
| Assessment Results | Client-side score calculation from static questions |

---

## 2. Architecture Analysis

### Component Connection Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  AITutor.tsx  │    │ CodingLab.tsx│    │Assessment.tsx│      │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘      │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  useChat.ts   │    │useCodeExec.ts│    │useAssess.ts  │      │
│  └──────┬───────┘    └──────────────┘    └──────────────┘      │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐    ┌──────────────┐                          │
│  │ chatStore.ts  │    │ useStudent   │                          │
│  │ (Zustand)     │    │ Stats.ts     │                          │
│  └──────┬───────┘    └──────┬───────┘                          │
│         │                   │                                   │
│         ▼                   ▼                                   │
│  ┌─────────────────────────────────────┐                        │
│  │          aiService.ts               │                        │
│  │  (API wrapper for /api/ai/*)        │                        │
│  └──────────────────┬──────────────────┘                        │
│                     │                                           │
└─────────────────────┼───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                  MSW Mock Handlers (handlers.ts)                 │
├─────────────────────────────────────────────────────────────────┤
│  POST /api/ai/chat         → Pattern-matched responses          │
│  GET  /api/ai/chat/history → Static chatHistory array           │
│  GET  /api/ai/insights     → Static aiInsights array            │
│  GET  /api/ai/stats        → Static studentStats object         │
│  POST /api/ai/code-review  → Hardcoded feedback string          │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **AI Chat:**
   - User types message → `useChat.sendMessage()` called
   - User message added to Zustand store immediately (optimistic)
   - `aiService.sendMessage()` sends POST to `/api/ai/chat`
   - MSW handler delays 1s, then returns pattern-matched response
   - Response added to store, typing indicator cleared

2. **Code Execution:**
   - User clicks Run → `useCodeExecution.execute()` called
   - HTML: iframe `srcdoc` updated directly
   - Python: Pyodide loaded (cached), `runPython()` called, stdout captured
   - Markdown: Regex conversion to HTML, returned as output
   - Result stored in component state

3. **Assessment:**
   - `useAssessment` hook manages quiz state locally
   - Timer runs via `setInterval`, auto-submits at 0
   - Score calculated client-side by comparing answers to `correctAnswers`
   - No server interaction; results stored in component state

---

## 3. Types and Interfaces

### AI-Specific Types (from `src/types.ts`)

```typescript
// Chat message exchanged between student and AI
interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  code?: string;           // Optional code snippet in response
  timestamp: string;
  courseId?: string;        // Context: which course
  lessonId?: string;       // Context: which lesson
}

// AI-generated insight for the student dashboard
interface AIInsight {
  id: string;
  type: 'recommendation' | 'warning' | 'achievement' | 'tip';
  title: string;
  description: string;
  action?: string;
  actionPath?: string;
  icon: string;
}

// Student learning statistics
interface StudentStats {
  totalCourses: number;
  activeCourses: number;
  completedCourses: number;
  totalHours: number;
  currentStreak: number;
  longestStreak: number;
  lessonsCompleted: number;
  totalLessons: number;
  avgScore: number;
  certificates: number;
}

// Knowledge base for AI context
interface KnowledgeBase {
  id: string;
  name: string;
  courseId: string;
  documents: number;
  lastUpdated: string;
}

// Code exercise definition
interface CodeExercise {
  id: string;
  title: string;
  language: CodeLanguage;
  description: string;
  starterCode: string;
  solution?: string;
  testCases?: { input: string; expected: string }[];
}

// Result of code execution
interface ExecutionResult {
  output: string;
  error?: string;
  status: 'success' | 'error';
}

// Assessment question
interface Question {
  id: string;
  type: QuestionType;
  text: string;
  code?: string;
  options: { id: string; text: string }[];
  correctAnswers: string[];
  explanation: string;
  points: number;
}

// Assessment definition
interface Assessment {
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

// Assessment result after submission
interface AssessmentResult {
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

### What's Missing from Design Spec

The design spec calls for these additional types that are not implemented:

| Missing Type | Purpose |
|-------------|---------|
| `AIMemory` | Student learning patterns (pace, mistakes, preferences) |
| `AIConversation` | Full conversation metadata (not just messages) |
| `CodeSubmission` | Submitted code with AI review results |
| `AIGradingResult` | Detailed grading breakdown (correctness, quality, efficiency) |
| `AIRecommendation` | Personalized learning path suggestions |
| `PromptTemplate` | Configurable system prompts per course |

---

## 4. Services and Hooks Analysis

### aiService.ts

**Purpose:** API wrapper for all AI-related backend calls.

**Methods:**
| Method | Endpoint | Real vs Mocked |
|--------|----------|----------------|
| `sendMessage(data)` | POST `/api/ai/chat` | Mocked |
| `getChatHistory(courseId?)` | GET `/api/ai/chat/history` | Mocked |
| `getInsights()` | GET `/api/ai/insights` | Mocked |
| `getStudentStats()` | GET `/api/ai/stats` | Mocked |
| `getCodeReview(code, language)` | POST `/api/ai/code-review` | Mocked |

**Assessment:** The service layer is well-structured and follows the API wrapper pattern. However, it's missing methods for:
- `getHint(exerciseId)` — AI hint generation
- `gradeSubmission(submissionId)` — AI grading
- `getRecommendations()` — Personalized recommendations
- `getAIMemory(courseId)` — Student memory retrieval
- `streamMessage(data)` — Streaming response support

### useChat.ts

**Purpose:** Manages AI chat state with optimistic updates.

**Implementation:**
- Uses `@tanstack/react-query` for server state (chat history)
- Uses Zustand store for local message state
- Optimistic: user message added immediately, AI response awaited
- Error handling: shows generic error message on failure

**Assessment:** Good foundation but missing:
- Conversation context (course/lesson not sent to backend properly)
- Message streaming support
- Code block detection and rendering in responses
- Conversation persistence across page navigations

### useCodeExecution.ts

**Purpose:** Executes code in the browser for HTML, Python, and Markdown.

**Implementation:**
- **HTML:** Sets iframe `srcdoc` — fully functional
- **Python:** Loads Pyodide via CDN, caches instance, captures stdout/stderr — functional
- **Markdown:** Regex-based conversion (heading, bold, italic, code, pre) — functional but basic

**Assessment:** This is the most complete AI-adjacent feature. However:
- No execution timeout (infinite loops will hang the browser)
- No resource limits enforced
- No test case runner for exercises
- Markdown parser is naive (doesn't handle nested elements, links, images)

### useAssessment.ts

**Purpose:** Manages quiz state, timing, and scoring.

**Implementation:**
- Manages current question index, answers map, timer
- Auto-submits when timer reaches 0
- Calculates score by comparing answers to `correctAnswers`
- Returns detailed result with score, time taken, pass/fail

**Assessment:** Functional for multiple-choice quizzes but missing:
- AI-graded question types (short answer, code challenges)
- Partial credit for multi-select
- Server-side submission and persistence
- Attempt tracking and limits enforcement

### useStudentStats.ts

**Purpose:** Fetches student statistics and AI insights.

**Implementation:**
- Two React Query hooks: `useStudentStats()` and `useAIInsights()`
- 5-minute and 10-minute stale times respectively
- Returns mocked data

**Assessment:** Structure is correct. Needs real backend data sources.

### useNotifications.ts

**Purpose:** Manages in-app notifications with localStorage persistence.

**Implementation:**
- Initializes from localStorage or falls back to mock data
- Persists changes to localStorage
- Provides markAsRead, markAllAsRead, clearAll

**Assessment:** Not AI-related but worth noting: this is localStorage-based, not server-synced. The design spec calls for WebSocket-based real-time notifications.

---

## 5. Mock Data Analysis

### AI-Related Mock Data (from `src/data/mockData.ts`)

| Data | Type | Count | Notes |
|------|------|-------|-------|
| `chatHistory` | `ChatMessage[]` | 2 messages | User asks about list comprehensions, AI responds with code |
| `aiInsights` | `AIInsight[]` | 3 items | Recommendation, achievement, tip |
| `studentStats` | `StudentStats` | 1 object | Hardcoded stats (4 courses, 87 hours, 12-day streak) |
| `knowledgeBases` | `KnowledgeBase[]` | 5 items | One per course, with document counts |
| `assessments` | `Assessment[]` | 3 assessments | Python Fundamentals, Data Structures, React & TypeScript |
| `exercises` | `CodeExercise[]` | 6 exercises | 2 HTML, 2 Python, 2 Markdown |

### MSW Handler AI Responses (from `src/mocks/handlers.ts`)

The `getAIResponse()` function uses pattern matching:

| Pattern | Response |
|---------|----------|
| `list` + `comprehension` | Explains list comprehension syntax with examples |
| `recursion` | Explains recursion with Russian nesting dolls analogy |
| `loop` / `for` / `while` | Explains for vs while loops, common mistakes |
| Default | Generic "I can help" response |

**Assessment:** The mock responses are educational and relevant, but:
- Only 4 response patterns (very limited)
- No code examples in most responses
- No course context used
- No student adaptation
- No streaming simulation

---

## 6. Frontend AI Components

### ChatBubble.tsx

**Purpose:** Renders a single chat message (user or AI).

**Features:**
- Different styling for user vs AI messages
- Brain icon for AI, "U" badge for user
- Timestamp display
- Optional code block rendering
- Max width 80% for readability

**Assessment:** Clean implementation. Missing:
- Markdown rendering in AI responses
- Code syntax highlighting (uses CodeBlock which is plain `<pre>`)
- Message actions (copy, retry, etc.)

### TypingIndicator.tsx

**Purpose:** Shows animated dots while AI is "thinking".

**Features:**
- Three pulsing dots with staggered animation
- "AI is thinking..." text
- Brain icon

**Assessment:** Good UX indicator. No issues.

### CodeBlock.tsx

**Purpose:** Renders a code snippet with copy functionality.

**Features:**
- Copy to clipboard button
- Language label
- Monospace font
- Dark theme styling

**Assessment:** Basic but functional. Missing:
- Syntax highlighting (uses plain `<code>` with no language detection)
- Line numbers
- Run code button
- Expand/collapse for long blocks

### CodeEditor.tsx

**Purpose:** Monaco-based code editor wrapper.

**Features:**
- Uses `@monaco-editor/react`
- Language mapping (html, python, markdown)
- Dark theme (`vs-dark`)
- Minimap disabled, word wrap enabled

**Assessment:** Good implementation. The Monaco editor provides full VS Code experience including syntax highlighting, autocomplete, and error indicators.

### PreviewPanel.tsx

**Purpose:** Shows live preview for HTML and rendered Markdown.

**Features:**
- HTML: iframe with srcdoc
- Markdown: dangerouslySetInnerHTML with rendered HTML
- Python: "Run to see output" placeholder

**Assessment:** Functional. The `dangerouslySetInnerHTML` for markdown is a potential XSS vector if markdown input is not sanitized.

### Terminal.tsx

**Purpose:** Displays code execution output.

**Features:**
- Shows stdout in default color
- Shows stderr in red
- "No output" and "Click Run" placeholder states
- Clear button

**Assessment:** Clean implementation. No issues.

### QuestionCard.tsx

**Purpose:** Renders a single quiz question with options.

**Features:**
- Supports single-select, multi-select, true/false
- Visual feedback for selected/correct/incorrect
- Points badge
- Optional code snippet
- Explanation display on review

**Assessment:** Well-implemented for the supported question types. Missing:
- Code completion input (design spec lists this as a type)
- Drag-and-drop ordering
- Short answer text input

### QuizProgress.tsx

**Purpose:** Shows quiz progress and timer.

**Features:**
- "Question X of Y" label
- Progress bar
- Countdown timer (red when < 60s)

**Assessment:** Clean implementation.

### ResultSummary.tsx

**Purpose:** Shows assessment results after submission.

**Features:**
- Score percentage with pass/fail indicator
- Time taken
- Question count
- Retry button (if failed and attempts remaining)

**Assessment:** Good for basic results. Missing:
- Question-by-question breakdown
- Strengths/weaknesses analysis
- AI-generated recommendations
- Comparison to class average

---

## 7. Gaps Between Design Spec and Implementation

### Critical Gaps

| Gap | Design Spec Requirement | Current State | Impact |
|-----|------------------------|---------------|--------|
| **Real AI Backend** | OpenAI GPT-4 integration with streaming | Pattern-matched mock responses | AI tutor provides canned responses, no real intelligence |
| **Context Retrieval Pipeline** | Student profile → conversation history → AI memory → RAG → prompt construction | Only sends content string | AI has no context about student, course, or learning history |
| **Student Memory System** | Track learning pace, mistakes, preferences, strengths, weak areas | Not implemented | AI cannot adapt to individual students |
| **RAG with Vector Embeddings** | Retrieve relevant course materials for context | Not implemented | AI cannot reference specific course content |
| **Streaming Responses** | Stream AI response tokens to UI | Full response returned after delay | Poor perceived performance |
| **AI Code Review** | Analyze code quality, suggest improvements | Hardcoded feedback string | No real code analysis |
| **AI Grading** | Grade short answers and code challenges with detailed rubric | Client-side MCQ scoring only | Cannot assess open-ended responses |
| **AI Recommendations** | Personalized learning path suggestions | Static insight array | Not personalized or dynamic |
| **Hint Generation** | Context-aware hints for exercises | Not implemented | Students cannot get AI help during coding |
| **Prompt Templates** | Configurable system prompts per course | Not implemented | Same generic behavior for all courses |

### Medium Gaps

| Gap | Design Spec Requirement | Current State |
|-----|------------------------|---------------|
| Conversation persistence | Store conversations in database | Only in-memory Zustand store |
| AI query rate limiting | 30 requests/hour for free users | No rate limiting |
| Fallback strategy | GPT-4 → GPT-3.5 → cache → error | Single mock response |
| Token optimization | Summarization, caching, function calling | Not implemented |
| Prompt injection prevention | Input sanitization, output filtering | Not implemented |
| AI usage analytics | Track queries per user | Not implemented |

### Minor Gaps

| Gap | Design Spec Requirement | Current State |
|-----|------------------------|---------------|
| MemoryBadge component | Show what AI remembers about student | Not built |
| AIInsight component | Rich insight card with actions | Basic rendering in StudentDashboard |
| AI Review Panel | Side panel in Coding Lab | Not built |
| File Explorer | Multi-file support in Coding Lab | Not built (single file only) |
| Markdown parser | Proper markdown rendering | Regex-based (fragile) |

---

## 8. Recommendations for Production AI Integration

### Phase 1: Backend AI Service (Priority: Critical)

**Goal:** Replace MSW mocks with real AI backend.

1. **Set up OpenAI integration:**
   - Create `/api/ai/chat` endpoint with GPT-4
   - Implement streaming with Server-Sent Events
   - Add system prompt with course context
   - Add conversation history to context window

2. **Implement context retrieval:**
   - Fetch student profile and learning history
   - Fetch current course and lesson context
   - Fetch last 20 conversation messages
   - Construct prompt with all context

3. **Add streaming support:**
   - Use OpenAI streaming API
   - Stream tokens to frontend via SSE
   - Update ChatBubble to render incrementally

### Phase 2: Student Memory System (Priority: High)

**Goal:** Enable AI to adapt to individual students.

1. **Create `ai_memories` database table:**
   - Student learning pace per topic
   - Common mistakes and patterns
   - Preferred explanation style
   - Strengths and weak areas

2. **Implement memory updates:**
   - After each conversation, analyze for patterns
   - Update student memory with new observations
   - Include memory in future prompts

3. **Add MemoryBadge component:**
   - Show students what the AI remembers
   - Allow students to view and clear memories

### Phase 3: RAG with Vector Embeddings (Priority: High)

**Goal:** Enable AI to reference specific course materials.

1. **Set up vector database:**
   - Use Pinecone, Weaviate, or pgvector
   - Embed course lessons, exercises, and resources

2. **Implement retrieval pipeline:**
   - On each query, search for relevant course materials
   - Include top-k results in AI context
   - Cite sources in AI responses

3. **Add Knowledge Base management:**
   - Admin upload course materials
   - Automatic embedding and indexing
   - Content versioning

### Phase 4: AI Code Review (Priority: Medium)

**Goal:** Provide real code analysis and feedback.

1. **Implement `/api/ai/code-review` endpoint:**
   - Send code to GPT-4 with code analysis prompt
   - Request structured feedback (correctness, quality, efficiency)
   - Return detailed review with line-specific comments

2. **Add AI Review Panel to Coding Lab:**
   - Toggleable side panel
   - Real-time review as student types (debounced)
   - Highlight issues inline in editor

### Phase 5: AI Grading (Priority: Medium)

**Goal:** Grade open-ended responses and code challenges.

1. **Implement grading rubric:**
   - Code correctness (40%): test case pass/fail
   - Code quality (20%): AI analysis
   - Efficiency (20%): complexity analysis
   - Documentation (10%): comments and naming
   - Edge cases (10%): test coverage

2. **Add async grading pipeline:**
   - Student submits → queued for grading
   - AI grades in background
   - Results pushed to student when ready

### Phase 6: AI Recommendations (Priority: Low)

**Goal:** Personalized learning path suggestions.

1. **Implement recommendation engine:**
   - Analyze student performance data
   - Identify weak areas and knowledge gaps
   - Suggest courses, lessons, and exercises
   - Adapt based on progress

2. **Add recommendation UI:**
   - Dashboard insights section
   - "Next step" suggestions in course learning
   - "You might also like" in marketplace

### Security Considerations

| Threat | Mitigation |
|--------|-----------|
| Prompt injection | Input sanitization, output filtering, function calling |
| AI abuse (token waste) | Rate limiting (30/hr free, unlimited paid), token budgets |
| Data privacy | Encrypt student memories, GDPR compliance |
| Content filtering | Moderate AI outputs for inappropriate content |
| Cost control | Token usage monitoring, budget alerts |

### Estimated Effort

| Phase | Effort | Dependencies |
|-------|--------|-------------|
| Phase 1: Backend AI Service | 2-3 weeks | Backend infrastructure, OpenAI API key |
| Phase 2: Student Memory | 1-2 weeks | Phase 1, database schema |
| Phase 3: RAG | 2-3 weeks | Phase 1, vector database |
| Phase 4: AI Code Review | 1-2 weeks | Phase 1 |
| Phase 5: AI Grading | 2-3 weeks | Phase 1, test runner |
| Phase 6: Recommendations | 1-2 weeks | Phase 2, analytics data |
| **Total** | **9-15 weeks** | |

---

## Appendix: File-by-File Analysis

### src/types.ts
- **AI types defined:** ChatMessage, AIInsight, StudentStats, LearningStreak, KnowledgeBase, CodeExercise, ExecutionResult, Question, Assessment, AssessmentResult
- **Missing types:** AIMemory, AIConversation, CodeSubmission, AIGradingResult, AIRecommendation, PromptTemplate

### src/services/aiService.ts
- **Methods:** sendMessage, getChatHistory, getInsights, getStudentStats, getCodeReview
- **All mocked:** No real backend calls
- **Missing methods:** getHint, gradeSubmission, getRecommendations, getAIMemory, streamMessage

### src/hooks/useChat.ts
- **State management:** Zustand store + React Query
- **Optimistic updates:** Yes (user message added immediately)
- **Streaming:** No
- **Error handling:** Generic error message

### src/hooks/useStudentStats.ts
- **Two hooks:** useStudentStats, useAIInsights
- **Data source:** Mocked via MSW
- **Caching:** 5min and 10min stale times

### src/hooks/useCodeExecution.ts
- **Languages:** HTML (iframe), Python (Pyodide), Markdown (regex)
- **Caching:** Pyodide instance cached globally
- **Missing:** Timeout enforcement, resource limits, test runner

### src/hooks/useAssessment.ts
- **State:** Current index, answers map, timer, result
- **Scoring:** Client-side calculation from correctAnswers
- **Missing:** Server persistence, AI grading, attempt tracking

### src/hooks/useNotifications.ts
- **Storage:** localStorage
- **Fallback:** Mock data
- **Missing:** Server sync, WebSocket real-time

### src/stores/chatStore.ts
- **State:** messages[], isTyping, activeCourseId
- **Actions:** addMessage, setTyping, setActiveCourse, clearMessages
- **Missing:** Conversation management, message editing/deletion

### src/pages/AITutor.tsx
- **Features:** Chat UI, course selector, suggestion chips, auto-scroll
- **Context:** Course ID sent but not used by mock handler
- **Missing:** Streaming, code highlighting, conversation history persistence

### src/pages/CodingLab.tsx
- **Features:** Monaco editor, language selector, exercise picker, run/reset
- **Layout:** 60/40 split (editor/preview+terminal)
- **Missing:** File explorer, AI review panel, test runner

### src/pages/Assessment.tsx
- **Features:** Quiz engine, timer, question grid, navigation, submit confirmation
- **State:** Local via useAssessment hook
- **Missing:** Server persistence, AI grading, attempt limits enforcement

### src/pages/StudentDashboard.tsx
- **Features:** Stats cards, AI insights, active courses, quick actions
- **Data:** Via useStudentStats and useAIInsights hooks
- **Missing:** Personalized recommendations, learning path

### src/pages/Results.tsx
- **Features:** Assessment history, score display, expandable details
- **Data:** Hardcoded mockResults array (2 items)
- **Missing:** Server data, detailed breakdown, AI analysis

### src/components/ai/ChatBubble.tsx
- **Renders:** User/AI messages with different styling
- **Supports:** Code blocks via CodeBlock component
- **Missing:** Markdown rendering, syntax highlighting, message actions

### src/components/ai/TypingIndicator.tsx
- **Animation:** Three pulsing dots
- **Text:** "AI is thinking..."
- **No issues**

### src/components/ai/CodeBlock.tsx
- **Features:** Copy button, language label
- **Missing:** Syntax highlighting, line numbers, run button

### src/components/coding/CodeEditor.tsx
- **Wrapper:** @monaco-editor/react
- **Theme:** vs-dark
- **No issues**

### src/components/coding/PreviewPanel.tsx
- **HTML:** iframe with srcdoc
- **Markdown:** dangerouslySetInnerHTML
- **Python:** Placeholder text
- **Security concern:** XSS via unsanitized markdown

### src/components/coding/Terminal.tsx
- **Features:** stdout/stderr display, clear button
- **No issues**

### src/components/assessment/QuestionCard.tsx
- **Types supported:** Multiple-choice, multi-select, true/false
- **Features:** Points badge, code snippet, explanation
- **Missing:** Code completion, drag-and-drop, short answer

### src/components/assessment/QuizProgress.tsx
- **Features:** Progress bar, timer, question count
- **No issues**

### src/components/assessment/ResultSummary.tsx
- **Features:** Score, pass/fail, time taken, retry button
- **Missing:** Question breakdown, AI analysis, recommendations

### src/data/mockData.ts (AI sections)
- **chatHistory:** 2 messages (user question + AI response with code)
- **aiInsights:** 3 items (recommendation, achievement, tip)
- **studentStats:** 1 hardcoded object
- **knowledgeBases:** 5 items (one per course)
- **assessments:** 3 assessments with 5-7 questions each
- **exercises:** 6 exercises (2 per language)

### src/mocks/handlers.ts (AI handlers)
- **POST /api/ai/chat:** Pattern-matched responses (4 patterns)
- **GET /api/ai/chat/history:** Static chatHistory
- **GET /api/ai/insights:** Static aiInsights
- **GET /api/ai/stats:** Static studentStats
- **POST /api/ai/code-review:** Hardcoded feedback
