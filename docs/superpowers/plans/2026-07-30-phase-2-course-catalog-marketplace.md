# Phase 2: Course Catalog & Marketplace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully functional course marketplace with search, filtering, cart, checkout, and enrollment — connecting the existing UI pages to real data flow via Zustand stores and React Query hooks.

**Architecture:** Create a course service layer with mock API handlers, Zustand stores for cart/enrollment state, React Query hooks for data fetching, and reusable course components. Enhance existing Marketplace and CourseDetails pages to use URL-based filtering and dynamic routing.

**Tech Stack:** React 19, React Router v6, Zustand, TanStack React Query, Axios, MSW (mock API), Tailwind CSS v4

---

## Global Constraints

- React 19, Vite 8, TypeScript 5.7, Tailwind CSS v4
- Use existing design system (dark theme, `#060A12` background, `#0D1421` cards, `rgba(59,130,246,0.x)` accents)
- No new dependencies — use only what's installed (zustand, @tanstack/react-query, axios, react-hook-form, zod, react-router-dom, lucide-react)
- Mock API with MSW for all data fetching
- All prices in NGN (₦)
- Export components as default exports
- Use double quotes for strings containing apostrophes

---

## File Structure

```
src/
├── types.ts                          # Add CourseModule, Lesson, CartItem, Enrollment types
├── data/
│   └── mockData.ts                   # Add curriculum data, enrolled courses, reviews
├── services/
│   ├── courseService.ts              # NEW: Course API service
│   └── paymentService.ts             # NEW: Payment API service
├── stores/
│   ├── authStore.ts                  # Existing
│   ├── courseStore.ts                # NEW: Course filters, selected course
│   └── cartStore.ts                  # NEW: Shopping cart state
├── hooks/
│   ├── useAuth.ts                    # Existing
│   ├── useCourses.ts                 # NEW: React Query hook for courses
│   └── useEnrollment.ts              # NEW: Enrollment & progress hook
├── mocks/
│   ├── handlers.ts                   # Add course & payment handlers
│   └── browser.ts                    # Existing
├── components/
│   ├── ui/
│   │   ├── Toast.tsx                 # Existing
│   │   ├── LoadingSpinner.tsx        # Existing
│   │   └── Badge.tsx                 # NEW: Reusable badge component
│   └── course/
│       ├── CourseCard.tsx             # NEW: Course card for marketplace
│       ├── CurriculumList.tsx         # NEW: Expandable curriculum accordion
│       ├── ProgressRing.tsx           # NEW: Circular progress indicator
│       └── ReviewCard.tsx             # NEW: Course review card
├── pages/
│   ├── Marketplace.tsx               # MODIFY: Use URL params, React Query
│   ├── CourseDetails.tsx             # MODIFY: Dynamic routing, React Query
│   ├── Checkout.tsx                  # MODIFY: Cart integration, dynamic course
│   └── MyCourses.tsx                 # MODIFY: Enrollment data, progress
```

---

### Task 1: Extend Types

**Files:**
- Modify: `src/types.ts`

**Interfaces:**
- Produces: `CourseModule`, `Lesson`, `CartItem`, `Enrollment`, `CourseReview`, `CourseFilter`

- [ ] **Step 1: Add new types to src/types.ts**

```typescript
// Add after existing Course interface

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'reading' | 'exercise' | 'quiz';
  completed?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  duration: string;
}

export interface CourseReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface CartItem {
  courseId: string;
  addedAt: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  status: 'active' | 'completed' | 'paused' | 'saved';
  progress: number;
  enrolledAt: string;
  completedAt?: string;
  lastAccessedAt: string;
  currentModule: number;
  currentLesson: number;
}

export interface CourseFilter {
  search: string;
  category: string;
  level: string;
  sortBy: string;
  priceRange: [number, number];
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat: add course, cart, and enrollment types"
```

---

### Task 2: Expand Mock Data

**Files:**
- Modify: `src/data/mockData.ts`

**Interfaces:**
- Consumes: `Course`, `CourseModule`, `CourseReview`, `Enrollment` from types.ts
- Produces: `curriculum` (CourseModule[]), `courseReviews` (CourseReview[]), `enrolledCourses` (Enrollment[])

- [ ] **Step 1: Add curriculum data**

Add after existing `courses` array in `src/data/mockData.ts`:

```typescript
export const curriculum: CourseModule[] = [
  {
    id: 'm1',
    title: 'Getting Started with Python',
    description: 'Set up your environment and write your first Python programs',
    duration: '2 hours',
    lessons: [
      { id: 'l1', title: 'Course Overview & Setup', duration: '15 min', type: 'video' },
      { id: 'l2', title: 'Installing Python & VS Code', duration: '20 min', type: 'video' },
      { id: 'l3', title: 'Your First Python Program', duration: '25 min', type: 'exercise' },
      { id: 'l4', title: 'Variables & Data Types', duration: '30 min', type: 'reading' },
      { id: 'l5', title: 'Module 1 Quiz', duration: '10 min', type: 'quiz' },
    ],
  },
  {
    id: 'm2',
    title: 'Control Flow & Functions',
    description: 'Master conditionals, loops, and function composition',
    duration: '3 hours',
    lessons: [
      { id: 'l6', title: 'If/Else Statements', duration: '25 min', type: 'video' },
      { id: 'l7', title: 'For & While Loops', duration: '30 min', type: 'video' },
      { id: 'l8', title: 'Defining Functions', duration: '35 min', type: 'exercise' },
      { id: 'l9', title: 'Lambda & Higher-Order Functions', duration: '30 min', type: 'reading' },
      { id: 'l10', title: 'Module 2 Challenge', duration: '20 min', type: 'exercise' },
    ],
  },
  {
    id: 'm3',
    title: 'Data Structures',
    description: 'Work with lists, dictionaries, sets, and tuples',
    duration: '4 hours',
    lessons: [
      { id: 'l11', title: 'Lists & List Comprehensions', duration: '35 min', type: 'video' },
      { id: 'l12', title: 'Dictionaries & JSON', duration: '40 min', type: 'video' },
      { id: 'l13', title: 'Sets & Tuples', duration: '25 min', type: 'reading' },
      { id: 'l14', title: 'Practice: Data Processing', duration: '45 min', type: 'exercise' },
      { id: 'l15', title: 'Module 3 Quiz', duration: '15 min', type: 'quiz' },
    ],
  },
  {
    id: 'm4',
    title: 'Introduction to AI',
    description: 'Understand AI concepts and build your first ML model',
    duration: '5 hours',
    lessons: [
      { id: 'l16', title: 'What is AI & Machine Learning?', duration: '30 min', type: 'video' },
      { id: 'l17', title: 'Setting Up Jupyter Notebook', duration: '20 min', type: 'video' },
      { id: 'l18', title: 'Your First ML Model', duration: '60 min', type: 'exercise' },
      { id: 'l19', title: 'Model Evaluation Metrics', duration: '35 min', type: 'reading' },
      { id: 'l20', title: 'Final Project: Image Classifier', duration: '90 min', type: 'exercise' },
    ],
  },
];

export const courseReviews: CourseReview[] = [
  {
    id: 'r1',
    userId: 'u1',
    userName: 'Adaeze Nwosu',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format',
    rating: 5,
    comment: 'The AI tutor is a game-changer. It explained complex Python concepts in a way that finally clicked for me. Completed the course in 8 weeks!',
    date: '2026-07-15',
    helpful: 42,
  },
  {
    id: 'r2',
    userId: 'u2',
    userName: 'Tunde Adebayo',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format',
    rating: 5,
    comment: 'Best investment in my career. The hands-on projects gave me real skills I use daily at work. The coding lab is fantastic.',
    date: '2026-07-10',
    helpful: 38,
  },
  {
    id: 'r3',
    userId: 'u3',
    userName: 'Chioma Obi',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format',
    rating: 4,
    comment: 'Great course content and structure. The AI tutor helped me debug code in real-time. Would love more advanced projects.',
    date: '2026-07-05',
    helpful: 25,
  },
];

export const enrolledCourses: Enrollment[] = [
  {
    id: 'e1',
    courseId: '1',
    userId: 'u1',
    status: 'active',
    progress: 68,
    enrolledAt: '2026-06-01',
    lastAccessedAt: '2026-07-29',
    currentModule: 2,
    currentLesson: 3,
  },
  {
    id: 'e2',
    courseId: '4',
    userId: 'u1',
    status: 'active',
    progress: 35,
    enrolledAt: '2026-06-15',
    lastAccessedAt: '2026-07-28',
    currentModule: 1,
    currentLesson: 5,
  },
  {
    id: 'e3',
    courseId: '2',
    userId: 'u1',
    status: 'completed',
    progress: 100,
    enrolledAt: '2026-04-01',
    completedAt: '2026-06-20',
    lastAccessedAt: '2026-06-20',
    currentModule: 3,
    currentLesson: 4,
  },
  {
    id: 'e4',
    courseId: '6',
    userId: 'u1',
    status: 'saved',
    progress: 0,
    enrolledAt: '2026-07-20',
    lastAccessedAt: '2026-07-20',
    currentModule: 0,
    currentLesson: 0,
  },
];

export const categories = [
  { name: 'Artificial Intelligence', icon: '🧠', count: 4 },
  { name: 'Programming', icon: '💻', count: 5 },
  { name: 'Data Analysis', icon: '📊', count: 3 },
  { name: 'Cybersecurity', icon: '🔒', count: 2 },
  { name: 'Business Skills', icon: '📈', count: 3 },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/data/mockData.ts
git commit -m "feat: add curriculum, reviews, and enrollment mock data"
```

---

### Task 3: Create Course Service

**Files:**
- Create: `src/services/courseService.ts`

**Interfaces:**
- Consumes: `Course`, `CourseModule`, `CourseReview`, `ApiResponse` from types.ts
- Produces: `getCourses`, `getCourseById`, `getCourseModules`, `getCourseReviews`, `searchCourses`

- [ ] **Step 1: Create src/services/courseService.ts**

```typescript
import api from '../lib/api';
import type { Course, CourseModule, CourseReview, ApiResponse } from '../types';

export const courseService = {
  getCourses: async (params?: {
    category?: string;
    level?: string;
    search?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Course[]>> => {
    const { data } = await api.get('/courses', { params });
    return data;
  },

  getCourseById: async (id: string): Promise<ApiResponse<Course>> => {
    const { data } = await api.get(`/courses/${id}`);
    return data;
  },

  getCourseModules: async (courseId: string): Promise<ApiResponse<CourseModule[]>> => {
    const { data } = await api.get(`/courses/${courseId}/modules`);
    return data;
  },

  getCourseReviews: async (courseId: string): Promise<ApiResponse<CourseReview[]>> => {
    const { data } = await api.get(`/courses/${courseId}/reviews`);
    return data;
  },

  searchCourses: async (query: string): Promise<ApiResponse<Course[]>> => {
    const { data } = await api.get('/courses/search', { params: { q: query } });
    return data;
  },

  getFeaturedCourses: async (): Promise<ApiResponse<Course[]>> => {
    const { data } = await api.get('/courses/featured');
    return data;
  },

  getEnrolledCourses: async (): Promise<ApiResponse<Enrollment[]>> => {
    const { data } = await api.get('/enrollments');
    return data;
  },

  enrollInCourse: async (courseId: string): Promise<ApiResponse<Enrollment>> => {
    const { data } = await api.post('/enrollments', { courseId });
    return data;
  },
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/services/courseService.ts
git commit -m "feat: add course service with API methods"
```

---

### Task 4: Create Cart Store

**Files:**
- Create: `src/stores/cartStore.ts`

**Interfaces:**
- Consumes: `CartItem` from types.ts
- Produces: `useCartStore` (Zustand store)

- [ ] **Step 1: Create src/stores/cartStore.ts**

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (courseId: string) => void;
  removeItem: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (courseId: string) => {
        if (!get().isInCart(courseId)) {
          set((state) => ({
            items: [...state.items, { courseId, addedAt: new Date().toISOString() }],
          }));
        }
      },

      removeItem: (courseId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.courseId !== courseId),
        }));
      },

      clearCart: () => set({ items: [] }),

      isInCart: (courseId: string) => {
        return get().items.some((item) => item.courseId === courseId);
      },

      getItemCount: () => get().items.length,
    }),
    {
      name: 'smugflex-cart',
    }
  )
);
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/stores/cartStore.ts
git commit -m "feat: add cart store with Zustand persist"
```

---

### Task 5: Create useCourses Hook

**Files:**
- Create: `src/hooks/useCourses.ts`

**Interfaces:**
- Consumes: `courseService` from services/courseService.ts
- Produces: `useCourses`, `useCourse`, `useCourseModules`, `useCourseReviews`, `useFeaturedCourses`

- [ ] **Step 1: Create src/hooks/useCourses.ts**

```typescript
import { useQuery } from '@tanstack/react-query';
import { courseService } from '../services/courseService';

export function useCourses(params?: {
  category?: string;
  level?: string;
  search?: string;
  sortBy?: string;
}) {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: () => courseService.getCourses(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => courseService.getCourseById(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCourseModules(courseId: string) {
  return useQuery({
    queryKey: ['courseModules', courseId],
    queryFn: () => courseService.getCourseModules(courseId),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCourseReviews(courseId: string) {
  return useQuery({
    queryKey: ['courseReviews', courseId],
    queryFn: () => courseService.getCourseReviews(courseId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedCourses() {
  return useQuery({
    queryKey: ['featuredCourses'],
    queryFn: () => courseService.getFeaturedCourses(),
    staleTime: 10 * 60 * 1000,
  });
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useCourses.ts
git commit -m "feat: add useCourses React Query hooks"
```

---

### Task 6: Create CourseCard Component

**Files:**
- Create: `src/components/course/CourseCard.tsx`

**Interfaces:**
- Consumes: `Course` from types.ts
- Produces: `CourseCard` component (default export)

- [ ] **Step 1: Create src/components/course/CourseCard.tsx**

```tsx
import { Star, Clock, Users, Brain, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../../types';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02]"
      style={{
        background: '#0D1421',
        border: '1px solid rgba(59,130,246,0.1)',
      }}
      onClick={() => navigate(`/courses/${course.id}`)}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{ background: 'rgba(6,10,18,0.8)', color: '#F1F5F9', backdropFilter: 'blur(8px)' }}
          >
            {course.level}
          </span>
          {course.aiTutor && (
            <span
              className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
              style={{ background: 'rgba(139,92,246,0.2)', color: '#A78BFA', backdropFilter: 'blur(8px)' }}
            >
              <Brain size={10} /> AI Tutor
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="text-xs font-medium mb-2" style={{ color: '#3B82F6' }}>
          {course.category}
        </div>
        <h3
          className="font-bold font-display text-lg mb-2 line-clamp-2"
          style={{ color: '#F1F5F9' }}
        >
          {course.title}
        </h3>
        <p className="text-sm mb-4 line-clamp-2" style={{ color: '#94A3B8' }}>
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-xs mb-4" style={{ color: '#64748B' }}>
          <div className="flex items-center gap-1">
            <Star size={12} fill="#F59E0B" style={{ color: '#F59E0B' }} />
            <span className="font-semibold" style={{ color: '#F59E0B' }}>{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{course.students.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}>
          <div>
            <span className="text-xl font-bold font-display gradient-text">
              ₦{course.price.toLocaleString()}
            </span>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: 'rgba(59,130,246,0.1)',
              color: '#3B82F6',
              border: '1px solid rgba(59,130,246,0.2)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/courses/${course.id}`);
            }}
          >
            View Course <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/course/CourseCard.tsx
git commit -m "feat: add CourseCard component for marketplace"
```

---

### Task 7: Create CurriculumList Component

**Files:**
- Create: `src/components/course/CurriculumList.tsx`

**Interfaces:**
- Consumes: `CourseModule` from types.ts
- Produces: `CurriculumList` component (default export)

- [ ] **Step 1: Create src/components/course/CurriculumList.tsx**

```tsx
import { useState } from 'react';
import { ChevronDown, Play, BookOpen, Code2, CheckCircle } from 'lucide-react';
import type { CourseModule } from '../../types';

interface CurriculumListProps {
  modules: CourseModule[];
  currentModule?: number;
  currentLesson?: number;
  onLessonClick?: (moduleId: number, lessonId: number) => void;
}

const lessonIcons = {
  video: Play,
  reading: BookOpen,
  exercise: Code2,
  quiz: CheckCircle,
};

export default function CurriculumList({
  modules,
  currentModule = 0,
  currentLesson = 0,
  onLessonClick,
}: CurriculumListProps) {
  const [openModule, setOpenModule] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {modules.map((module, moduleIdx) => {
        const isOpen = openModule === moduleIdx;
        const isCurrent = moduleIdx === currentModule;
        const completedLessons = module.lessons.filter((l) => l.completed).length;

        return (
          <div
            key={module.id}
            className="rounded-xl overflow-hidden"
            style={{
              background: '#0D1421',
              border: isCurrent
                ? '1px solid rgba(59,130,246,0.3)'
                : '1px solid rgba(59,130,246,0.1)',
            }}
          >
            <button
              onClick={() => setOpenModule(isOpen ? null : moduleIdx)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{
                    background: isCurrent ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.08)',
                    color: isCurrent ? '#3B82F6' : '#64748B',
                  }}
                >
                  {moduleIdx + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-sm" style={{ color: '#F1F5F9' }}>
                    {module.title}
                  </h4>
                  <p className="text-xs" style={{ color: '#64748B' }}>
                    {module.lessons.length} lessons · {module.duration} · {completedLessons}/{module.lessons.length} completed
                  </p>
                </div>
              </div>
              <ChevronDown
                size={18}
                style={{ color: '#64748B' }}
                className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isOpen && (
              <div style={{ borderTop: '1px solid rgba(59,130,246,0.08)' }}>
                {module.lessons.map((lesson, lessonIdx) => {
                  const Icon = lessonIcons[lesson.type];
                  const isActive = isCurrent && lessonIdx === currentLesson;
                  const isCompleted = lesson.completed;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => onLessonClick?.(moduleIdx, lessonIdx)}
                      className="w-full flex items-center gap-3 p-4 pl-16 text-left transition-all"
                      style={{
                        background: isActive ? 'rgba(59,130,246,0.08)' : 'transparent',
                        borderLeft: isActive ? '2px solid #3B82F6' : '2px solid transparent',
                      }}
                    >
                      <Icon
                        size={14}
                        style={{
                          color: isCompleted
                            ? '#10B981'
                            : isActive
                            ? '#3B82F6'
                            : '#64748B',
                          flexShrink: 0,
                        }}
                      />
                      <span
                        className="text-sm flex-1"
                        style={{
                          color: isActive ? '#F1F5F9' : isCompleted ? '#94A3B8' : '#64748B',
                        }}
                      >
                        {lesson.title}
                      </span>
                      <span className="text-xs" style={{ color: '#64748B' }}>
                        {lesson.duration}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/course/CurriculumList.tsx
git commit -m "feat: add CurriculumList component with expandable modules"
```

---

### Task 8: Create ProgressRing Component

**Files:**
- Create: `src/components/course/ProgressRing.tsx`

**Interfaces:**
- Produces: `ProgressRing` component (default export)

- [ ] **Step 1: Create src/components/course/ProgressRing.tsx**

```tsx
interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

export default function ProgressRing({
  progress,
  size = 60,
  strokeWidth = 4,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const getColor = () => {
    if (progress >= 80) return '#10B981';
    if (progress >= 50) return '#3B82F6';
    if (progress >= 25) return '#F59E0B';
    return '#64748B';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(59,130,246,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span
        className="absolute text-xs font-bold font-display"
        style={{ color: getColor() }}
      >
        {progress}%
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/course/ProgressRing.tsx
git commit -m "feat: add ProgressRing SVG component"
```

---

### Task 9: Create ReviewCard Component

**Files:**
- Create: `src/components/course/ReviewCard.tsx`

**Interfaces:**
- Consumes: `CourseReview` from types.ts
- Produces: `ReviewCard` component (default export)

- [ ] **Step 1: Create src/components/course/ReviewCard.tsx**

```tsx
import { Star, ThumbsUp } from 'lucide-react';
import type { CourseReview } from '../../types';

interface ReviewCardProps {
  review: CourseReview;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div
      className="p-5 rounded-xl"
      style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
    >
      <div className="flex items-start gap-3 mb-3">
        <img
          src={review.userAvatar}
          alt={review.userName}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm" style={{ color: '#F1F5F9' }}>
              {review.userName}
            </h4>
            <span className="text-xs" style={{ color: '#64748B' }}>
              {new Date(review.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={12}
                fill={star <= review.rating ? '#F59E0B' : 'transparent'}
                style={{ color: star <= review.rating ? '#F59E0B' : '#475569' }}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm leading-relaxed mb-3" style={{ color: '#94A3B8' }}>
        {review.comment}
      </p>

      <button
        className="flex items-center gap-2 text-xs transition-colors"
        style={{ color: '#64748B' }}
      >
        <ThumbsUp size={12} />
        <span>Helpful ({review.helpful})</span>
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/course/ReviewCard.tsx
git commit -m "feat: add ReviewCard component for course reviews"
```

---

### Task 10: Add MSW Course Handlers

**Files:**
- Modify: `src/mocks/handlers.ts`

**Interfaces:**
- Consumes: `courses`, `curriculum`, `courseReviews`, `enrolledCourses` from mockData.ts
- Produces: MSW request handlers for `/courses`, `/courses/:id`, `/enrollments`

- [ ] **Step 1: Add course handlers to src/mocks/handlers.ts**

Add after existing auth handlers:

```typescript
// Course handlers
http.get('/api/courses', ({ request }) => {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const level = url.searchParams.get('level');
  const search = url.searchParams.get('search');
  const sortBy = url.searchParams.get('sortBy');

  let filtered = [...courses];

  if (category && category !== 'All') {
    filtered = filtered.filter((c) => c.category === category);
  }
  if (level && level !== 'All Levels') {
    filtered = filtered.filter((c) => c.level === level);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'popular') {
    filtered.sort((a, b) => b.students - a.students);
  }

  return HttpResponse.json({
    success: true,
    data: filtered,
  });
}),

http.get('/api/courses/featured', () => {
  const featured = courses.filter((c) => c.featured);
  return HttpResponse.json({
    success: true,
    data: featured,
  });
}),

http.get('/api/courses/:id', ({ params }) => {
  const course = courses.find((c) => c.id === params.id);
  if (!course) {
    return HttpResponse.json(
      { success: false, message: 'Course not found' },
      { status: 404 }
    );
  }
  return HttpResponse.json({
    success: true,
    data: course,
  });
}),

http.get('/api/courses/:id/modules', () => {
  return HttpResponse.json({
    success: true,
    data: curriculum,
  });
}),

http.get('/api/courses/:id/reviews', () => {
  return HttpResponse.json({
    success: true,
    data: courseReviews,
  });
}),

http.get('/api/enrollments', () => {
  return HttpResponse.json({
    success: true,
    data: enrolledCourses,
  });
}),

http.post('/api/enrollments', async ({ request }) => {
  const { courseId } = await request.json();
  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    return HttpResponse.json(
      { success: false, message: 'Course not found' },
      { status: 404 }
    );
  }
  const enrollment = {
    id: `e${Date.now()}`,
    courseId,
    userId: 'u1',
    status: 'active',
    progress: 0,
    enrolledAt: new Date().toISOString(),
    lastAccessedAt: new Date().toISOString(),
    currentModule: 0,
    currentLesson: 0,
  };
  return HttpResponse.json({
    success: true,
    data: enrollment,
  });
}),
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/mocks/handlers.ts
git commit -m "feat: add MSW handlers for courses and enrollments"
```

---

### Task 11: Enhance Marketplace Page

**Files:**
- Modify: `src/pages/Marketplace.tsx`

**Interfaces:**
- Consumes: `useCourses` hook, `CourseCard` component, URL search params

- [ ] **Step 1: Rewrite src/pages/Marketplace.tsx**

Replace entire file with:

```tsx
import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useCourses } from '../hooks/useCourses';
import CourseCard from '../components/course/CourseCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const categories = ['All', 'Artificial Intelligence', 'Programming', 'Data Analysis', 'Cybersecurity', 'Business Skills'];
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [activeLevel, setActiveLevel] = useState(searchParams.get('level') || 'All Levels');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popular');
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useCourses({
    category: activeCategory !== 'All' ? activeCategory : undefined,
    level: activeLevel !== 'All Levels' ? activeLevel : undefined,
    search: search || undefined,
    sortBy,
  });

  const courses = data?.data || [];

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (activeCategory !== 'All') params.set('category', activeCategory);
    if (activeLevel !== 'All Levels') params.set('level', activeLevel);
    if (sortBy !== 'popular') params.set('sort', sortBy);
    setSearchParams(params, { replace: true });
  }, [search, activeCategory, activeLevel, sortBy, setSearchParams]);

  return (
    <div style={{ background: '#060A12', minHeight: '100vh' }}>
      {/* Header */}
      <div
        className="py-12 px-6 text-center"
        style={{
          background: 'linear-gradient(180deg, rgba(59,130,246,0.06) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(59,130,246,0.08)',
        }}
      >
        <h1 className="text-4xl lg:text-5xl font-bold font-display mb-3" style={{ color: '#F1F5F9' }}>
          Course <span className="gradient-text">Marketplace</span>
        </h1>
        <p className="text-lg mb-8" style={{ color: '#64748B' }}>
          {courses.length} expert-crafted courses across 5 categories
        </p>

        <div className="max-w-2xl mx-auto">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <Search size={18} style={{ color: '#475569', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search for courses, topics, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: '#F1F5F9' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-xs px-2 py-1 rounded-md"
                style={{ color: '#475569' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Category tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeCategory === cat ? 'rgba(59,130,246,0.15)' : '#0D1421',
                color: activeCategory === cat ? '#3B82F6' : '#94A3B8',
                border: activeCategory === cat ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(59,130,246,0.1)',
              }}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="ml-auto flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: showFilters ? 'rgba(59,130,246,0.15)' : '#0D1421',
              color: showFilters ? '#3B82F6' : '#94A3B8',
              border: showFilters ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(59,130,246,0.1)',
            }}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div
            className="p-4 rounded-xl mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
            style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
          >
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#64748B' }}>
                LEVEL
              </label>
              <div className="flex gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setActiveLevel(level)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: activeLevel === level ? 'rgba(59,130,246,0.15)' : 'transparent',
                      color: activeLevel === level ? '#3B82F6' : '#64748B',
                      border: activeLevel === level ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(59,130,246,0.1)',
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#64748B' }}>
                SORT BY
              </label>
              <div className="flex gap-2">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: sortBy === opt.value ? 'rgba(59,130,246,0.15)' : 'transparent',
                      color: sortBy === opt.value ? '#3B82F6' : '#64748B',
                      border: sortBy === opt.value ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(59,130,246,0.1)',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Course grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size={32} />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg" style={{ color: '#64748B' }}>
              No courses found matching your criteria
            </p>
            <button
              onClick={() => {
                setSearch('');
                setActiveCategory('All');
                setActiveLevel('All Levels');
              }}
              className="mt-4 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
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
git add src/pages/Marketplace.tsx
git commit -m "feat: enhance Marketplace with React Query, URL params, CourseCard"
```

---

### Task 12: Enhance CourseDetails Page

**Files:**
- Modify: `src/pages/CourseDetails.tsx`

**Interfaces:**
- Consumes: `useCourse`, `useCourseModules`, `useCourseReviews` hooks, `CurriculumList`, `ReviewCard`, `ProgressRing` components

- [ ] **Step 1: Rewrite src/pages/CourseDetails.tsx**

Replace entire file with:

```tsx
import { useState } from 'react';
import {
  Star, Clock, Users, Award, Brain, CheckCircle,
  BookOpen, Code2, Target, ArrowRight, ShoppingCart,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCourse, useCourseModules, useCourseReviews } from '../hooks/useCourses';
import { useCartStore } from '../stores/cartStore';
import CurriculumList from '../components/course/CurriculumList';
import ReviewCard from '../components/course/ReviewCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');

  const { data: courseData, isLoading: courseLoading } = useCourse(id || '');
  const { data: modulesData } = useCourseModules(id || '');
  const { data: reviewsData } = useCourseReviews(id || '');

  const course = courseData?.data;
  const modules = modulesData?.data || [];
  const reviews = reviewsData?.data || [];

  const addItem = useCartStore((s) => s.addItem);
  const isInCart = useCartStore((s) => s.isInCart(id || ''));

  if (courseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060A12' }}>
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060A12' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#F1F5F9' }}>Course not found</h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : course.rating.toString();

  return (
    <div style={{ background: '#060A12', minHeight: '100vh' }}>
      {/* Hero */}
      <div
        className="py-12 px-6"
        style={{
          background: 'linear-gradient(135deg,rgba(59,130,246,0.08) 0%,rgba(139,92,246,0.06) 100%)',
          borderBottom: '1px solid rgba(59,130,246,0.1)',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6' }}
                >
                  {course.category}
                </span>
                {course.aiTutor && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                    style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6' }}
                  >
                    <Brain size={10} /> AI Tutor Included
                  </span>
                )}
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}
                >
                  {course.level}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold font-display mb-4" style={{ color: '#F1F5F9' }}>
                {course.title}
              </h1>
              <p className="text-base leading-relaxed mb-6" style={{ color: '#94A3B8' }}>
                {course.description}
              </p>

              <div className="flex flex-wrap gap-5 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <Star size={16} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                  <span className="font-semibold" style={{ color: '#F59E0B' }}>{avgRating}</span>
                  <span style={{ color: '#64748B' }}>({reviews.length} reviews)</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: '#64748B' }}>
                  <Clock size={16} />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: '#64748B' }}>
                  <BookOpen size={16} />
                  <span>{course.lessons} lessons</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: '#64748B' }}>
                  <Code2 size={16} />
                  <span>{course.projects} projects</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: '#64748B' }}>
                  <Users size={16} />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor)}&background=1A2540&color=3B82F6&size=80`}
                  alt={course.instructor}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-xs" style={{ color: '#64748B' }}>Instructor</p>
                  <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{course.instructor}</p>
                </div>
              </div>
            </div>

            {/* Pricing card */}
            <div
              className="rounded-2xl overflow-hidden sticky top-20"
              style={{
                background: '#0D1421',
                border: '1px solid rgba(59,130,246,0.2)',
                boxShadow: '0 0 40px rgba(59,130,246,0.08)',
              }}
            >
              <div className="h-44 overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold font-display gradient-text">
                    ₦{course.price.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => navigate('/checkout', { state: { courseId: course.id } })}
                  className="w-full py-3 rounded-xl font-semibold text-sm mb-3 gradient-blue-purple text-white flex items-center justify-center gap-2"
                >
                  <ArrowRight size={16} />
                  Enroll Now
                </button>

                <button
                  onClick={() => addItem(course.id)}
                  disabled={isInCart}
                  className="w-full py-3 rounded-xl font-semibold text-sm mb-4 flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: isInCart ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)',
                    color: isInCart ? '#10B981' : '#3B82F6',
                    border: `1px solid ${isInCart ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.2)'}`,
                  }}
                >
                  {isInCart ? <CheckCircle size={16} /> : <ShoppingCart size={16} />}
                  {isInCart ? 'Added to Cart' : 'Add to Cart'}
                </button>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3" style={{ color: '#94A3B8' }}>
                    <Clock size={16} style={{ color: '#64748B' }} />
                    <span>{course.duration} of content</span>
                  </div>
                  <div className="flex items-center gap-3" style={{ color: '#94A3B8' }}>
                    <BookOpen size={16} style={{ color: '#64748B' }} />
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-3" style={{ color: '#94A3B8' }}>
                    <Code2 size={16} style={{ color: '#64748B' }} />
                    <span>{course.projects} hands-on projects</span>
                  </div>
                  <div className="flex items-center gap-3" style={{ color: '#94A3B8' }}>
                    <Award size={16} style={{ color: '#64748B' }} />
                    <span>Certificate of completion</span>
                  </div>
                  {course.aiTutor && (
                    <div className="flex items-center gap-3" style={{ color: '#94A3B8' }}>
                      <Brain size={16} style={{ color: '#8B5CF6' }} />
                      <span>AI Tutor access</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-1 p-1 rounded-xl w-fit mb-8" style={{ background: 'rgba(59,130,246,0.06)' }}>
          {(['overview', 'curriculum', 'reviews'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all capitalize"
              style={{
                background: tab === t ? '#1A2540' : 'transparent',
                color: tab === t ? '#3B82F6' : '#64748B',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'overview' && (
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold font-display mb-4" style={{ color: '#F1F5F9' }}>
              What You'll Learn
            </h2>
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {[
                'Build real-world projects from scratch',
                'Master industry-standard tools and frameworks',
                'Get personalized AI-powered guidance',
                'Earn a verified certificate',
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
                >
                  <CheckCircle size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: 2 }} />
                  <span className="text-sm" style={{ color: '#94A3B8' }}>{item}</span>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-bold font-display mb-4" style={{ color: '#F1F5F9' }}>
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ background: 'rgba(59,130,246,0.08)', color: '#3B82F6' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {tab === 'curriculum' && (
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold font-display mb-4" style={{ color: '#F1F5F9' }}>
              Course Curriculum
            </h2>
            <p className="text-sm mb-6" style={{ color: '#64748B' }}>
              {modules.length} modules · {course.lessons} lessons · {course.duration}
            </p>
            <CurriculumList modules={modules} />
          </div>
        )}

        {tab === 'reviews' && (
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold font-display gradient-text">{avgRating}</div>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      fill={s <= Math.round(parseFloat(avgRating)) ? '#F59E0B' : 'transparent'}
                      style={{ color: s <= Math.round(parseFloat(avgRating)) ? '#F59E0B' : '#475569' }}
                    />
                  ))}
                </div>
                <div className="text-xs mt-1" style={{ color: '#64748B' }}>
                  {reviews.length} reviews
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}
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
git add src/pages/CourseDetails.tsx
git commit -m "feat: enhance CourseDetails with dynamic routing, React Query, tabs"
```

---

### Task 13: Enhance Checkout Page

**Files:**
- Modify: `src/pages/Checkout.tsx`

**Interfaces:**
- Consumes: `useCourse` hook, `useCartStore`, React Router `useLocation` state

- [ ] **Step 1: Rewrite src/pages/Checkout.tsx**

Replace entire file with:

```tsx
import { useState } from 'react';
import { CheckCircle, Lock, CreditCard, ArrowRight, Zap, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCourse } from '../hooks/useCourses';
import { useCartStore } from '../stores/cartStore';

const methods = [
  { id: 'paystack', name: 'Paystack', desc: 'Pay with card via Paystack', icon: '💳' },
  { id: 'flutterwave', name: 'Flutterwave', desc: 'Pay with card via Flutterwave', icon: '⚡' },
  { id: 'bank', name: 'Bank Transfer', desc: 'Transfer to our bank account', icon: '🏦' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = (location.state as { courseId?: string })?.courseId;

  const [method, setMethod] = useState('paystack');
  const [loading, setLoading] = useState(false);

  const { data } = useCourse(courseId || '');
  const course = data?.data;
  const removeItem = useCartStore((s) => s.removeItem);

  const pay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      removeItem(courseId || '');
      navigate('/payment-success');
    }, 1500);
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060A12' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#F1F5F9' }}>No course selected</h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: '#060A12' }}>
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg gradient-blue-purple flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold font-display" style={{ color: '#F1F5F9' }}>
            Smugflex<span className="gradient-text"> AI</span>
          </span>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Payment form */}
          <div className="lg:col-span-3">
            <h1 className="text-2xl font-bold font-display mb-6" style={{ color: '#F1F5F9' }}>
              Complete Purchase
            </h1>

            <div className="space-y-3 mb-6">
              <h2 className="text-sm font-semibold" style={{ color: '#94A3B8' }}>PAYMENT METHOD</h2>
              {methods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border transition-all"
                  style={{
                    background: method === m.id ? 'rgba(59,130,246,0.08)' : '#0D1421',
                    borderColor: method === m.id ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.1)',
                  }}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-sm" style={{ color: '#F1F5F9' }}>{m.name}</div>
                    <div className="text-xs" style={{ color: '#64748B' }}>{m.desc}</div>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    style={{
                      borderColor: method === m.id ? '#3B82F6' : '#475569',
                      background: method === m.id ? '#3B82F6' : 'transparent',
                    }}
                  >
                    {method === m.id && <CheckCircle size={12} className="text-white" />}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={pay}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm gradient-blue-purple text-white flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Lock size={16} />
                  Pay ₦{course.price.toLocaleString()}
                </>
              )}
            </button>

            <p className="text-center text-xs mt-4" style={{ color: '#64748B' }}>
              🔒 Your payment information is encrypted and secure
            </p>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl p-5 sticky top-20"
              style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.15)' }}
            >
              <h3 className="font-semibold text-sm mb-4" style={{ color: '#F1F5F9' }}>ORDER SUMMARY</h3>

              <div className="flex gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm line-clamp-2" style={{ color: '#F1F5F9' }}>
                    {course.title}
                  </h4>
                  <p className="text-xs mt-1" style={{ color: '#64748B' }}>{course.instructor}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: '#94A3B8' }}>Course Price</span>
                  <span style={{ color: '#F1F5F9' }}>₦{course.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#94A3B8' }}>Processing Fee</span>
                  <span style={{ color: '#10B981' }}>Free</span>
                </div>
                <div
                  className="flex justify-between pt-3 font-semibold"
                  style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}
                >
                  <span style={{ color: '#F1F5F9' }}>Total</span>
                  <span className="gradient-text text-lg">₦{course.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
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
git add src/pages/Checkout.tsx
git commit -m "feat: enhance Checkout with dynamic course data and cart integration"
```

---

### Task 14: Enhance MyCourses Page

**Files:**
- Modify: `src/pages/MyCourses.tsx`

**Interfaces:**
- Consumes: `useCourses` hook, `ProgressRing` component, enrollment data

- [ ] **Step 1: Rewrite src/pages/MyCourses.tsx**

Replace entire file with:

```tsx
import { useState } from 'react';
import { ArrowRight, Clock, CheckCircle, BookOpen, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { enrolledCourses, courses } from '../data/mockData';
import ProgressRing from '../components/course/ProgressRing';

const tabs = ['All', 'Active', 'Completed', 'Saved'];

export default function MyCourses() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('All');

  const filtered = tab === 'All'
    ? enrolledCourses
    : tab === 'Active'
    ? enrolledCourses.filter((c) => c.status === 'active')
    : tab === 'Completed'
    ? enrolledCourses.filter((c) => c.status === 'completed')
    : enrolledCourses.filter((c) => c.status === 'saved');

  const activeCount = enrolledCourses.filter((c) => c.status === 'active').length;
  const completedCount = enrolledCourses.filter((c) => c.status === 'completed').length;
  const certCount = completedCount;

  return (
    <div className="p-4 sm:p-6 lg:p-8" style={{ background: '#060A12', minHeight: '100vh' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display" style={{ color: '#F1F5F9' }}>My Courses</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>Track and continue your learning</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: BookOpen, v: activeCount.toString(), l: 'Active', color: '#3B82F6' },
          { icon: CheckCircle, v: completedCount.toString(), l: 'Completed', color: '#10B981' },
          { icon: Award, v: certCount.toString(), l: 'Certificates', color: '#F59E0B' },
        ].map(({ icon: Icon, v, l, color }) => (
          <div
            key={l}
            className="p-4 rounded-xl text-center"
            style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
          >
            <Icon size={20} className="mx-auto mb-2" style={{ color }} />
            <div className="text-xl font-bold font-display gradient-text">{v}</div>
            <div className="text-xs" style={{ color: '#64748B' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: 'rgba(59,130,246,0.06)' }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t ? '#1A2540' : 'transparent',
              color: tab === t ? '#3B82F6' : '#64748B',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Course list */}
      <div className="space-y-4">
        {filtered.map((enrollment) => {
          const course = courses.find((c) => c.id === enrollment.courseId);
          if (!course) return null;

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
                      {course.instructor} · {course.category}
                    </p>
                  </div>
                  <ProgressRing progress={enrollment.progress} size={48} strokeWidth={3} />
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-xs" style={{ color: '#64748B' }}>
                    <Clock size={12} />
                    <span>
                      Module {enrollment.currentModule + 1}, Lesson {enrollment.currentLesson + 1}
                    </span>
                  </div>
                  <div
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background:
                        enrollment.status === 'active'
                          ? 'rgba(59,130,246,0.12)'
                          : enrollment.status === 'completed'
                          ? 'rgba(16,185,129,0.12)'
                          : 'rgba(245,158,11,0.12)',
                      color:
                        enrollment.status === 'active'
                          ? '#3B82F6'
                          : enrollment.status === 'completed'
                          ? '#10B981'
                          : '#F59E0B',
                    }}
                  >
                    {enrollment.status === 'active'
                      ? 'In Progress'
                      : enrollment.status === 'completed'
                      ? 'Completed'
                      : 'Saved'}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(59,130,246,0.1)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${enrollment.progress}%`,
                        background: enrollment.status === 'completed' ? '#10B981' : '#3B82F6',
                      }}
                    />
                  </div>
                </div>
              </div>

              <ArrowRight size={18} className="hidden sm:block self-center" style={{ color: '#475569' }} />
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={48} className="mx-auto mb-4" style={{ color: '#475569' }} />
            <p className="text-lg" style={{ color: '#64748B' }}>No courses in this category</p>
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
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/pages/MyCourses.tsx
git commit -m "feat: enhance MyCourses with progress tracking and enrollment data"
```

---

### Task 15: Update Landing Page Featured Courses

**Files:**
- Modify: `src/pages/Landing.tsx`

**Interfaces:**
- Consumes: `useFeaturedCourses` hook, `CourseCard` component

- [ ] **Step 1: Update Landing.tsx to use CourseCard for featured courses**

Find the featured courses section in `src/pages/Landing.tsx` and replace the manual course cards with `CourseCard`:

```tsx
// Find the section that renders featured courses and replace with:
import CourseCard from '../components/course/CourseCard';
import { useFeaturedCourses } from '../hooks/useCourses';

// In the component, replace the featured courses grid with:
const { data: featuredData } = useFeaturedCourses();
const featuredCourses = featuredData?.data || courses.slice(0, 3);

// Then in the JSX:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {featuredCourses.map((course) => (
    <CourseCard key={course.id} course={course} />
  ))}
</div>
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/pages/Landing.tsx
git commit -m "feat: use CourseCard and React Query for featured courses"
```

---

### Task 16: Final Verification

**Files:**
- All modified files

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No TypeScript errors

- [ ] **Step 3: Test dev server**

Run: `npm run dev`
Expected: Server starts, pages load correctly

- [ ] **Step 4: Commit any final fixes**

```bash
git add -A
git commit -m "chore: Phase 2 verification and final fixes"
```

- [ ] **Step 5: Push to remote**

```bash
git push
```

---

## Summary

After completing all tasks:
- Marketplace page uses React Query with URL-based filters (category, level, search, sort)
- CourseDetails page is fully dynamic with URL params, tabs (overview/curriculum/reviews), and cart integration
- Checkout page accepts course ID via React Router state
- MyCourses page shows enrollment progress with ProgressRing
- Landing page uses CourseCard and React Query for featured courses
- Cart state persists via Zustand with localStorage
- All data flows through mock API handlers (MSW)
- Reusable components: CourseCard, CurriculumList, ProgressRing, ReviewCard
