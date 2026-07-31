# Phase 3: Student Dashboard & AI Tutor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the student dashboard with dynamic stats and the AI tutor with mock streaming chat, connecting the existing UI pages to real data flow.

**Architecture:** Create an AI service with mock streaming handlers, a chat store for conversation state, enhance the student dashboard with React Query hooks, and upgrade the AI tutor page with course-aware context and simulated streaming responses.

**Tech Stack:** React 19, React Router v6, Zustand, TanStack React Query, Axios, MSW (mock API), Tailwind CSS v4

---

## Global Constraints

- React 19, Vite 8, TypeScript 5.7, Tailwind CSS v4
- Use existing design system (dark theme, `#060A12` background, `#0D1421` cards, `rgba(59,130,246,0.x)` accents)
- No new dependencies — use only what's installed
- Mock API with MSW for all data fetching
- Export components as default exports
- Use double quotes for strings containing apostrophes

---

## File Structure

```
src/
├── types.ts                          # Add ChatMessage, AIInsight, StudentStats types
├── data/
│   └── mockData.ts                   # Add student stats, AI insights, chat history
├── services/
│   ├── aiService.ts                  # NEW: AI chat & insights service
│   └── courseService.ts              # Existing
├── stores/
│   ├── authStore.ts                  # Existing
│   ├── courseStore.ts                # Existing
│   ├── cartStore.ts                  # Existing
│   └── chatStore.ts                  # NEW: AI chat conversation state
├── hooks/
│   ├── useAuth.ts                    # Existing
│   ├── useCourses.ts                 # Existing
│   ├── useStudentStats.ts            # NEW: Dashboard stats hook
│   └── useChat.ts                    # NEW: AI chat hook with streaming
├── mocks/
│   ├── handlers.ts                   # Add AI chat & stats handlers
│   └── browser.ts                    # Existing
├── components/
│   ├── ui/                           # Existing
│   ├── course/                       # Existing
│   └── ai/
│       ├── ChatBubble.tsx             # NEW: Chat message bubble
│       ├── TypingIndicator.tsx        # NEW: AI typing animation
│       └── CodeBlock.tsx              # NEW: Syntax-highlighted code display
├── pages/
│   ├── StudentDashboard.tsx          # MODIFY: React Query, dynamic stats
│   ├── AITutor.tsx                   # MODIFY: Dynamic course context, streaming
│   └── CourseLearning.tsx            # MODIFY: Enhanced curriculum sidebar
```

---

### Task 1: Extend Types for AI & Dashboard

**Files:**
- Modify: `src/types.ts`

**Interfaces:**
- Produces: `ChatMessage`, `AIInsight`, `StudentStats`, `LearningStreak`

- [ ] **Step 1: Add new types to src/types.ts**

```typescript
// Add after existing interfaces

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  code?: string;
  timestamp: string;
  courseId?: string;
  lessonId?: string;
}

export interface AIInsight {
  id: string;
  type: 'recommendation' | 'warning' | 'achievement' | 'tip';
  title: string;
  description: string;
  action?: string;
  actionPath?: string;
  icon: string;
}

export interface StudentStats {
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

export interface LearningStreak {
  current: number;
  longest: number;
  lastActive: string;
  weeklyActivity: boolean[];
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat: add AI chat, insights, and dashboard stats types"
```

---

### Task 2: Expand Mock Data for Dashboard & AI

**Files:**
- Modify: `src/data/mockData.ts`

**Interfaces:**
- Consumes: `ChatMessage`, `AIInsight`, `StudentStats`, `LearningStreak` from types.ts
- Produces: `studentStats`, `aiInsights`, `chatHistory`, `learningStreak`

- [ ] **Step 1: Add dashboard and AI mock data**

Add to src/data/mockData.ts:

```typescript
export const studentStats: StudentStats = {
  totalCourses: 4,
  activeCourses: 2,
  completedCourses: 1,
  totalHours: 87,
  currentStreak: 12,
  longestStreak: 18,
  lessonsCompleted: 45,
  totalLessons: 120,
  avgScore: 82,
  certificates: 1,
};

export const learningStreak: LearningStreak = {
  current: 12,
  longest: 18,
  lastActive: '2026-07-30',
  weeklyActivity: [true, true, true, true, true, true, false],
};

export const aiInsights: AIInsight[] = [
  {
    id: 'ins1',
    type: 'recommendation',
    title: 'Continue Python Course',
    description: 'You\'re 68% through Python for AI. Complete Module 3 to unlock the next project.',
    action: 'Continue Learning',
    actionPath: '/courses/1/learn',
    icon: 'BookOpen',
  },
  {
    id: 'ins2',
    type: 'achievement',
    title: '12-Day Streak!',
    description: 'Amazing consistency! You\'ve been learning for 12 days straight.',
    icon: 'Flame',
  },
  {
    id: 'ins3',
    type: 'tip',
    title: 'Practice Makes Perfect',
    description: 'Try the coding lab to practice what you learned in today\'s lesson.',
    action: 'Open Coding Lab',
    actionPath: '/coding-lab',
    icon: 'Code2',
  },
];

export const chatHistory: ChatMessage[] = [
  {
    id: 'msg1',
    role: 'user',
    content: 'Can you explain how list comprehensions work in Python?',
    timestamp: '2026-07-30T10:24:00Z',
    courseId: '1',
  },
  {
    id: 'msg2',
    role: 'ai',
    content: 'List comprehensions are a concise way to create lists in Python. They follow the syntax: [expression for item in iterable if condition]. Let me show you some examples...',
    code: `# Basic list comprehension
squares = [x**2 for x in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# With condition
evens = [x for x in range(20) if x % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# With function
words = ['hello', 'world', 'python']
upper = [w.upper() for w in words]
print(upper)  # ['HELLO', 'WORLD', 'PYTHON']`,
    timestamp: '2026-07-30T10:24:30Z',
    courseId: '1',
  },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/data/mockData.ts
git commit -m "feat: add student stats, AI insights, and chat history mock data"
```

---

### Task 3: Create AI Service

**Files:**
- Create: `src/services/aiService.ts`

**Interfaces:**
- Consumes: `ChatMessage`, `AIInsight`, `StudentStats` from types.ts
- Produces: `sendMessage`, `getChatHistory`, `getInsights`, `getStudentStats`

- [ ] **Step 1: Create src/services/aiService.ts**

```typescript
import { api } from '../lib/api';
import type { ChatMessage, AIInsight, StudentStats, ApiResponse } from '../types';

export const aiService = {
  sendMessage: async (data: {
    content: string;
    courseId?: string;
    lessonId?: string;
  }): Promise<ApiResponse<ChatMessage>> => {
    const { data: response } = await api.post('/ai/chat', data);
    return response;
  },

  getChatHistory: async (courseId?: string): Promise<ApiResponse<ChatMessage[]>> => {
    const { data } = await api.get('/ai/chat/history', { params: { courseId } });
    return data;
  },

  getInsights: async (): Promise<ApiResponse<AIInsight[]>> => {
    const { data } = await api.get('/ai/insights');
    return data;
  },

  getStudentStats: async (): Promise<ApiResponse<StudentStats>> => {
    const { data } = await api.get('/ai/stats');
    return data;
  },

  getCodeReview: async (code: string, language: string): Promise<ApiResponse<string>> => {
    const { data } = await api.post('/ai/code-review', { code, language });
    return data;
  },
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/services/aiService.ts
git commit -m "feat: add AI service for chat, insights, and stats"
```

---

### Task 4: Create Chat Store

**Files:**
- Create: `src/stores/chatStore.ts`

**Interfaces:**
- Consumes: `ChatMessage` from types.ts
- Produces: `useChatStore` (Zustand store)

- [ ] **Step 1: Create src/stores/chatStore.ts**

```typescript
import { create } from 'zustand';
import type { ChatMessage } from '../types';

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  activeCourseId: string | null;
  addMessage: (message: ChatMessage) => void;
  setTyping: (typing: boolean) => void;
  setActiveCourse: (courseId: string | null) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isTyping: false,
  activeCourseId: null,

  addMessage: (message: ChatMessage) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  setTyping: (typing: boolean) => {
    set({ isTyping: typing });
  },

  setActiveCourse: (courseId: string | null) => {
    set({ activeCourseId: courseId });
  },

  clearMessages: () => {
    set({ messages: [] });
  },
}));
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/stores/chatStore.ts
git commit -m "feat: add chat store for AI tutor conversations"
```

---

### Task 5: Create useChat Hook

**Files:**
- Create: `src/hooks/useChat.ts`

**Interfaces:**
- Consumes: `aiService` from services/aiService.ts, `useChatStore` from stores/chatStore.ts
- Produces: `useChat` hook

- [ ] **Step 1: Create src/hooks/useChat.ts**

```typescript
import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiService } from '../services/aiService';
import { useChatStore } from '../stores/chatStore';
import type { ChatMessage } from '../types';

export function useChat(courseId?: string) {
  const { messages, addMessage, isTyping, setTyping } = useChatStore();
  const queryClient = useQueryClient();

  const { data: historyData } = useQuery({
    queryKey: ['chatHistory', courseId],
    queryFn: () => aiService.getChatHistory(courseId),
    staleTime: 5 * 60 * 1000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (data: { content: string; courseId?: string; lessonId?: string }) =>
      aiService.sendMessage(data),
    onMutate: () => {
      setTyping(true);
    },
    onSuccess: (response) => {
      addMessage(response.data);
      setTyping(false);
      queryClient.invalidateQueries({ queryKey: ['chatHistory', courseId] });
    },
    onError: () => {
      setTyping(false);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'ai',
        content: "I'm having trouble right now. Please try again or contact support.",
        timestamp: new Date().toISOString(),
      };
      addMessage(errorMessage);
    },
  });

  const sendMessage = useCallback(
    (content: string, lessonId?: string) => {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
        courseId,
        lessonId,
      };
      addMessage(userMessage);
      sendMessageMutation.mutate({ content, courseId, lessonId });
    },
    [addMessage, sendMessageMutation, courseId]
  );

  return {
    messages: historyData?.data ? [...historyData.data, ...messages] : messages,
    sendMessage,
    isTyping,
  };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useChat.ts
git commit -m "feat: add useChat hook for AI tutor"
```

---

### Task 6: Create useStudentStats Hook

**Files:**
- Create: `src/hooks/useStudentStats.ts`

**Interfaces:**
- Consumes: `aiService` from services/aiService.ts
- Produces: `useStudentStats` hook

- [ ] **Step 1: Create src/hooks/useStudentStats.ts**

```typescript
import { useQuery } from '@tanstack/react-query';
import { aiService } from '../services/aiService';

export function useStudentStats() {
  return useQuery({
    queryKey: ['studentStats'],
    queryFn: () => aiService.getStudentStats(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAIInsights() {
  return useQuery({
    queryKey: ['aiInsights'],
    queryFn: () => aiService.getInsights(),
    staleTime: 10 * 60 * 1000,
  });
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useStudentStats.ts
git commit -m "feat: add useStudentStats and useAIInsights hooks"
```

---

### Task 7: Create ChatBubble Component

**Files:**
- Create: `src/components/ai/ChatBubble.tsx`

**Interfaces:**
- Consumes: `ChatMessage` from types.ts
- Produces: `ChatBubble` component (default export)

- [ ] **Step 1: Create src/components/ai/ChatBubble.tsx**

```tsx
import { Brain } from 'lucide-react';
import type { ChatMessage } from '../../types';
import CodeBlock from './CodeBlock';

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(139,92,246,0.15)' }}
        >
          <Brain size={16} style={{ color: '#8B5CF6' }} />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser ? 'rounded-br-md' : 'rounded-bl-md'
        }`}
        style={{
          background: isUser ? 'rgba(59,130,246,0.15)' : '#0D1421',
          border: isUser ? '1px solid rgba(59,130,246,0.2)' : '1px solid rgba(59,130,246,0.1)',
        }}
      >
        <p
          className="text-sm leading-relaxed whitespace-pre-wrap"
          style={{ color: isUser ? '#E2E8F0' : '#94A3B8' }}
        >
          {message.content}
        </p>

        {message.code && (
          <div className="mt-3">
            <CodeBlock code={message.code} />
          </div>
        )}

        <p className="text-xs mt-2" style={{ color: '#475569' }}>
          {new Date(message.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {isUser && (
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(59,130,246,0.15)' }}
        >
          <span className="text-xs font-bold" style={{ color: '#3B82F6' }}>U</span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ai/ChatBubble.tsx
git commit -m "feat: add ChatBubble component for AI tutor"
```

---

### Task 8: Create TypingIndicator Component

**Files:**
- Create: `src/components/ai/TypingIndicator.tsx`

**Interfaces:**
- Produces: `TypingIndicator` component (default export)

- [ ] **Step 1: Create src/components/ai/TypingIndicator.tsx**

```tsx
import { Brain } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(139,92,246,0.15)' }}
      >
        <Brain size={16} style={{ color: '#8B5CF6' }} />
      </div>

      <div
        className="rounded-2xl rounded-bl-md px-4 py-3"
        style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
      >
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  background: '#8B5CF6',
                  animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          <span className="text-xs ml-2" style={{ color: '#64748B' }}>
            AI is thinking...
          </span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ai/TypingIndicator.tsx
git commit -m "feat: add TypingIndicator component for AI responses"
```

---

### Task 9: Create CodeBlock Component

**Files:**
- Create: `src/components/ai/CodeBlock.tsx`

**Interfaces:**
- Produces: `CodeBlock` component (default export)

- [ ] **Step 1: Create src/components/ai/CodeBlock.tsx**

```tsx
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = 'python' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: '#0A0F1A', border: '1px solid rgba(59,130,246,0.1)' }}
    >
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ background: 'rgba(59,130,246,0.05)', borderBottom: '1px solid rgba(59,130,246,0.1)' }}
      >
        <span className="text-xs font-medium" style={{ color: '#64748B' }}>
          {language}
        </span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 text-xs transition-colors"
          style={{ color: copied ? '#10B981' : '#64748B' }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm" style={{ color: '#E2E8F0', fontFamily: 'monospace' }}>
          {code}
        </code>
      </pre>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ai/CodeBlock.tsx
git commit -m "feat: add CodeBlock component with copy functionality"
```

---

### Task 10: Add MSW AI & Stats Handlers

**Files:**
- Modify: `src/mocks/handlers.ts`

**Interfaces:**
- Consumes: `studentStats`, `aiInsights`, `chatHistory` from mockData.ts
- Produces: MSW request handlers for `/ai/*`

- [ ] **Step 1: Add AI handlers to src/mocks/handlers.ts**

Add after existing handlers:

```typescript
// AI & Stats handlers
http.get('/api/ai/stats', () => {
  return HttpResponse.json({
    success: true,
    data: studentStats,
  });
}),

http.get('/api/ai/insights', () => {
  return HttpResponse.json({
    success: true,
    data: aiInsights,
  });
}),

http.get('/api/ai/chat/history', () => {
  return HttpResponse.json({
    success: true,
    data: chatHistory,
  });
}),

http.post('/api/ai/chat', async ({ request }) => {
  const { content } = await request.json();
  
  // Simulate AI response delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const aiResponse: ChatMessage = {
    id: `ai-${Date.now()}`,
    role: 'ai',
    content: getAIResponse(content),
    timestamp: new Date().toISOString(),
  };
  
  return HttpResponse.json({
    success: true,
    data: aiResponse,
  });
}),

http.post('/api/ai/code-review', async ({ request }) => {
  const { code } = await request.json();
  
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  return HttpResponse.json({
    success: true,
    data: `Code Review:\n\n✅ Good practices:\n- Clear variable naming\n- Proper function structure\n\n💡 Suggestions:\n- Consider adding error handling\n- Add docstrings for better documentation`,
  });
}),
```

Add helper function:

```typescript
function getAIResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  
  if (lower.includes('list') && lower.includes('comprehension')) {
    return "List comprehensions are a concise way to create lists in Python. They follow the syntax: [expression for item in iterable if condition].\n\nHere are some examples:\n1. Basic: [x**2 for x in range(10)]\n2. With condition: [x for x in range(20) if x % 2 == 0]\n3. With function: [w.upper() for w in words]\n\nWould you like me to explain any of these in more detail?";
  }
  
  if (lower.includes('recursion')) {
    return "Recursion is when a function calls itself to solve a smaller version of the same problem. Think of it like Russian nesting dolls — each doll contains a smaller version of itself.\n\nKey rule: every recursive function needs a base case that stops the recursion, otherwise it runs forever.";
  }
  
  if (lower.includes('loop') || lower.includes('for') || lower.includes('while')) {
    return "Loops are fundamental in programming! In Python:\n\n1. for loop: iterates over a sequence\n2. while loop: repeats while a condition is true\n\nCommon mistakes:\n- Off-by-one errors\n- Infinite loops (forgetting to update the condition)\n- Modifying a list while iterating over it\n\nWhat specific aspect would you like to explore?";
  }
  
  return "That's a great question! Let me help you understand this concept better.\n\nI can explain the theory, show you practical examples, or help you debug code. What would be most helpful for you right now?";
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/mocks/handlers.ts
git commit -m "feat: add MSW handlers for AI chat and student stats"
```

---

### Task 11: Enhance Student Dashboard

**Files:**
- Modify: `src/pages/StudentDashboard.tsx`

**Interfaces:**
- Consumes: `useStudentStats`, `useAIInsights` hooks, `ProgressRing` component

- [ ] **Step 1: Rewrite src/pages/StudentDashboard.tsx**

Replace entire file with:

```tsx
import {
  ArrowRight, Brain, Code2, TrendingUp, Award, Flame, BookOpen,
  Clock, Target, CheckCircle, Star, Zap,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStudentStats, useAIInsights } from '../hooks/useStudentStats'
import { enrolledCourses, courses } from '../data/mockData'
import ProgressRing from '../components/course/ProgressRing'
import LoadingSpinner from '../components/ui/LoadingSpinner'

function StatCard({ icon: Icon, value, label, sub, color }: { icon: React.ElementType; value: string; label: string; sub?: string; color: string }) {
  return (
    <div className="p-5 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {sub && <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>{sub}</span>}
      </div>
      <div className="text-2xl font-bold font-display gradient-text">{value}</div>
      <div className="text-sm mt-0.5" style={{ color: '#64748B' }}>{label}</div>
    </div>
  )
}

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Flame,
  Code2,
  TrendingUp,
  Award,
  Target,
}

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { data: statsData, isLoading: statsLoading } = useStudentStats()
  const { data: insightsData } = useAIInsights()

  const stats = statsData?.data
  const insights = insightsData?.data || []
  const activeEnrollments = enrolledCourses.filter(c => c.status === 'active')

  if (statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060A12' }}>
        <LoadingSpinner size={32} />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6" style={{ background: '#060A12', minHeight: '100vh' }}>
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: '#F1F5F9' }}>
            Good morning, <span className="gradient-text">Student</span> 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            You have {stats?.activeCourses || 0} active courses · {stats?.currentStreak || 0}-day streak
          </p>
        </div>
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl self-start"
          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
        >
          <Flame size={20} style={{ color: '#F59E0B' }} />
          <div>
            <p className="text-sm font-bold" style={{ color: '#F59E0B' }}>{stats?.currentStreak || 0}-day streak!</p>
            <p className="text-xs" style={{ color: '#64748B' }}>Keep it up</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} value={`${stats?.activeCourses || 0}`} label="Active Courses" sub="In Progress" color="#3B82F6" />
        <StatCard icon={Clock} value={`${stats?.totalHours || 0}h`} label="Learning Time" sub="Total" color="#8B5CF6" />
        <StatCard icon={Target} value={`${stats?.lessonsCompleted || 0}/${stats?.totalLessons || 0}`} label="Lessons Done" sub={`${Math.round(((stats?.lessonsCompleted || 0) / (stats?.totalLessons || 1)) * 100)}%`} color="#10B981" />
        <StatCard icon={Award} value={`${stats?.avgScore || 0}%`} label="Average Score" sub="Great!" color="#F59E0B" />
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div>
          <h2 className="text-lg font-bold font-display mb-4" style={{ color: '#F1F5F9' }}>
            <Brain size={18} className="inline mr-2" style={{ color: '#8B5CF6' }} />
            AI Insights
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight) => {
              const Icon = iconMap[insight.icon] || Brain
              return (
                <div
                  key={insight.id}
                  className="p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
                  style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
                  onClick={() => insight.actionPath && navigate(insight.actionPath)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: insight.type === 'achievement' ? 'rgba(245,158,11,0.12)' :
                          insight.type === 'recommendation' ? 'rgba(59,130,246,0.12)' :
                          insight.type === 'tip' ? 'rgba(16,185,129,0.12)' : 'rgba(139,92,246,0.12)',
                      }}
                    >
                      <Icon size={18} style={{
                        color: insight.type === 'achievement' ? '#F59E0B' :
                          insight.type === 'recommendation' ? '#3B82F6' :
                          insight.type === 'tip' ? '#10B981' : '#8B5CF6',
                      }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm" style={{ color: '#F1F5F9' }}>{insight.title}</h3>
                      <p className="text-xs mt-1" style={{ color: '#64748B' }}>{insight.description}</p>
                      {insight.action && (
                        <span className="text-xs font-medium mt-2 inline-flex items-center gap-1" style={{ color: '#3B82F6' }}>
                          {insight.action} <ArrowRight size={10} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Active Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-display" style={{ color: '#F1F5F9' }}>Continue Learning</h2>
          <button
            onClick={() => navigate('/my-courses')}
            className="text-sm font-medium flex items-center gap-1"
            style={{ color: '#3B82F6' }}
          >
            View All <ArrowRight size={14} />
          </button>
        </div>

        <div className="space-y-4">
          {activeEnrollments.map((enrollment) => {
            const course = courses.find(c => c.id === enrollment.courseId)
            if (!course) return null

            return (
              <div
                key={enrollment.id}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
                onClick={() => navigate(`/courses/${course.id}/learn`)}
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full sm:w-40 h-28 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold font-display" style={{ color: '#F1F5F9' }}>
                        {course.title}
                      </h3>
                      <p className="text-xs mt-1" style={{ color: '#64748B' }}>
                        {course.instructor} · Module {enrollment.currentModule + 1}, Lesson {enrollment.currentLesson + 1}
                      </p>
                    </div>
                    <ProgressRing progress={enrollment.progress} size={48} strokeWidth={3} />
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(59,130,246,0.1)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${enrollment.progress}%`, background: '#3B82F6' }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3">
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                      style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}
                    >
                      <Play size={14} /> Continue
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                      style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}
                      onClick={(e) => { e.stopPropagation(); navigate('/ai-tutor') }}
                    >
                      <Brain size={14} /> Ask AI
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {activeEnrollments.length === 0 && (
            <div
              className="text-center py-12 rounded-xl"
              style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
            >
              <BookOpen size={48} className="mx-auto mb-4" style={{ color: '#475569' }} />
              <p className="text-lg" style={{ color: '#64748B' }}>No active courses</p>
              <button
                onClick={() => navigate('/marketplace')}
                className="mt-4 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}
              >
                Browse Courses
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold font-display mb-4" style={{ color: '#F1F5F9' }}>Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Code2, label: 'Coding Lab', path: '/coding-lab', color: '#3B82F6' },
            { icon: Brain, label: 'AI Tutor', path: '/ai-tutor', color: '#8B5CF6' },
            { icon: Award, label: 'Certificates', path: '/certificates', color: '#F59E0B' },
            { icon: TrendingUp, label: 'Portfolio', path: '/portfolio', color: '#10B981' },
          ].map(({ icon: Icon, label, path, color }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-[1.02]"
              style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
            >
              <Icon size={24} style={{ color }} />
              <span className="text-sm font-medium" style={{ color: '#F1F5F9' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/pages/StudentDashboard.tsx
git commit -m "feat: enhance StudentDashboard with React Query, dynamic stats, AI insights"
```

---

### Task 12: Enhance AI Tutor Page

**Files:**
- Modify: `src/pages/AITutor.tsx`

**Interfaces:**
- Consumes: `useChat` hook, `ChatBubble`, `TypingIndicator` components

- [ ] **Step 1: Rewrite src/pages/AITutor.tsx**

Replace entire file with:

```tsx
import { useState, useRef, useEffect } from 'react'
import { Brain, Send, Sparkles, Code2, BookOpen, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useChat } from '../hooks/useChat'
import ChatBubble from '../components/ai/ChatBubble'
import TypingIndicator from '../components/ai/TypingIndicator'
import { courses } from '../data/mockData'

const suggestions = [
  'Explain recursion with a real example',
  'Why is my for loop infinite?',
  'Difference between list and tuple in Python',
  'How does gradient descent work?',
  'Explain overfitting vs underfitting',
]

export default function AITutor() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, sendMessage, isTyping } = useChat(selectedCourse || undefined)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const send = (text?: string) => {
    const msg = text || input.trim()
    if (!msg) return
    sendMessage(msg)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: '#060A12' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: '#0D1421', borderBottom: '1px solid rgba(59,130,246,0.1)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(139,92,246,0.15)' }}
          >
            <Brain size={20} style={{ color: '#8B5CF6' }} />
          </div>
          <div>
            <h1 className="font-bold font-display" style={{ color: '#F1F5F9' }}>AI Tutor</h1>
            <p className="text-xs" style={{ color: '#64748B' }}>Always here to help you learn</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCourse || ''}
            onChange={(e) => setSelectedCourse(e.target.value || null)}
            className="px-3 py-1.5 rounded-lg text-sm"
            style={{ background: '#060A12', color: '#F1F5F9', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <option value="">General</option>
            {courses.slice(0, 4).map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg"
            style={{ color: '#64748B' }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        
        {isTyping && <TypingIndicator />}

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(139,92,246,0.15)' }}
            >
              <Sparkles size={32} style={{ color: '#8B5CF6' }} />
            </div>
            <h2 className="text-xl font-bold font-display mb-2" style={{ color: '#F1F5F9' }}>
              How can I help you today?
            </h2>
            <p className="text-sm text-center max-w-md" style={{ color: '#64748B' }}>
              I can help you understand concepts, debug code, suggest next steps, and quiz you on topics.
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => send(s)}
                className="px-4 py-2 rounded-full text-sm transition-all"
                style={{ background: '#0D1421', color: '#94A3B8', border: '1px solid rgba(59,130,246,0.15)' }}
              >
                <Sparkles size={12} className="inline mr-1" style={{ color: '#8B5CF6' }} />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div
        className="px-4 py-3"
        style={{ background: '#0D1421', borderTop: '1px solid rgba(59,130,246,0.1)' }}
      >
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: '#060A12', border: '1px solid rgba(59,130,246,0.2)' }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about your course..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: '#F1F5F9' }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || isTyping}
            className="p-2 rounded-lg transition-all"
            style={{
              background: input.trim() ? 'rgba(59,130,246,0.2)' : 'transparent',
              color: input.trim() ? '#3B82F6' : '#475569',
            }}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-xs mt-2" style={{ color: '#475569' }}>
          AI can make mistakes. Verify important information from official docs.
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/pages/AITutor.tsx
git commit -m "feat: enhance AITutor with dynamic course context and streaming chat"
```

---

### Task 13: Final Verification

**Files:**
- All modified files

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No TypeScript errors

- [ ] **Step 3: Commit any final fixes**

```bash
git add -A
git commit -m "chore: Phase 3 verification and final fixes"
```

- [ ] **Step 4: Push to remote**

```bash
git push
```

---

## Summary

After completing all tasks:
- Student Dashboard uses React Query for dynamic stats and AI insights
- AI Tutor has course-aware context with mock streaming responses
- Chat history persists in Zustand store
- AI insights provide personalized recommendations
- Reusable AI components: ChatBubble, TypingIndicator, CodeBlock
- All data flows through mock API handlers (MSW)
