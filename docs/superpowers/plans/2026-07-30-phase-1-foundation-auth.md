# Phase 1: Project Foundation & Authentication

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up production-ready project infrastructure with routing, state management, and a working authentication flow (register, login, logout, protected routes).

**Architecture:** Refactor the existing Vite + React prototype to use React Router v6 for routing, Zustand for global state (auth), React Query for server state, and React Hook Form + Zod for form validation. Add an API client service layer. Backend will be mocked initially with MSW (Mock Service Worker) for development.

**Tech Stack:** React 19, Vite 8, TypeScript 5.7, Tailwind CSS v4, React Router v6, Zustand, TanStack React Query, React Hook Form, Zod, MSW, Vitest, React Testing Library

## Global Constraints

- React 19, Vite 8, TypeScript 5.7, Tailwind CSS v4
- Use double quotes for strings containing apostrophes
- Export components as default exports
- Use existing `src/index.css` for global styles and theme tokens
- Keep the existing dark AI-themed design system (colors, fonts, gradients)
- No comments in code unless explicitly asked
- Follow existing code conventions in the codebase

---

## File Structure

```
src/
├── main.tsx                          # MODIFY: wrap with providers
├── App.tsx                           # MODIFY: replace with React Router
├── types.ts                          # MODIFY: expand types
├── index.css                         # KEEP: no changes
├── lib/
│   ├── api.ts                        # CREATE: Axios/fetch wrapper
│   ├── constants.ts                  # CREATE: app constants
│   └── validators.ts                 # CREATE: Zod schemas
├── stores/
│   └── authStore.ts                  # CREATE: Zustand auth store
├── hooks/
│   └── useAuth.ts                    # CREATE: auth hook
├── services/
│   └── authService.ts                # CREATE: auth API calls
├── components/
│   ├── ui/
│   │   ├── Toast.tsx                 # CREATE: toast notification
│   │   └── LoadingSpinner.tsx        # CREATE: loading indicator
│   └── ProtectedRoute.tsx            # CREATE: route guard
├── pages/
│   ├── Auth.tsx                      # MODIFY: refactor with React Hook Form
│   └── NotFound.tsx                  # KEEP: minimal changes
├── mocks/
│   ├── handlers.ts                   # CREATE: MSW request handlers
│   └── browser.ts                    # CREATE: MSW browser setup
└── __tests__/
    └── auth/
        ├── login.test.tsx            # CREATE: login tests
        └── register.test.tsx         # CREATE: register tests
```

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Dependencies to install:**

- [ ] **Step 1: Install routing and state management packages**

```bash
pnpm add react-router-dom @tanstack/react-query zustand react-hook-form @hookform/resolvers zod axios
```

- [ ] **Step 2: Install dev dependencies for mocking and testing**

```bash
pnpm add -D msw @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom
```

- [ ] **Step 3: Verify installation**

```bash
pnpm install
```

Expected: No errors, lockfile updated.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add routing, state management, form, and testing dependencies"
```

---

### Task 2: Create Type Definitions

**Files:**
- Modify: `src/types.ts`

**Interfaces:**
- Consumes: None (foundational)
- Produces: `User`, `AuthState`, `LoginRequest`, `RegisterRequest`, `ApiResponse<T>`

- [ ] **Step 1: Expand types.ts with auth and API types**

```typescript
export type Page =
  | 'landing'
  | 'marketplace'
  | 'course-details'
  | 'about'
  | 'contact'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'email-verify'
  | 'onboarding'
  | 'student-dashboard'
  | 'my-courses'
  | 'course-learning'
  | 'ai-tutor'
  | 'coding-lab'
  | 'assignment'
  | 'assessment'
  | 'results'
  | 'portfolio'
  | 'certificate'
  | 'profile'
  | 'settings'
  | 'checkout'
  | 'payment-success'
  | 'payment-failed'
  | 'notifications'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-courses'
  | 'admin-analytics'
  | 'admin-payments'
  | 'admin-certificates'
  | 'admin-ai'
  | '404';

export type UserRole = 'guest' | 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  onboardingCompleted: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  rating: number;
  students: number;
  price: number;
  image: string;
  instructor: string;
  description: string;
  aiTutor: boolean;
  featured: boolean;
  tags: string[];
  lessons: number;
  projects: number;
}

export interface NavProps {
  navigate: (page: Page) => void;
  currentPage: Page;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types.ts
git commit -m "feat: expand type definitions with User, AuthState, and API types"
```

---

### Task 3: Create Zod Validation Schemas

**Files:**
- Create: `src/lib/validators.ts`

**Interfaces:**
- Consumes: None
- Produces: `loginSchema`, `registerSchema`, `forgotPasswordSchema`

- [ ] **Step 1: Create validators.ts**

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/validators.ts
git commit -m "feat: add Zod validation schemas for auth forms"
```

---

### Task 4: Create API Client

**Files:**
- Create: `src/lib/api.ts`

**Interfaces:**
- Consumes: None (foundational)
- Produces: `api` instance (Axios), `setAuthToken()`, `clearAuthToken()`

- [ ] **Step 1: Create api.ts**

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
};
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/api.ts
git commit -m "feat: add Axios API client with auth interceptors"
```

---

### Task 5: Create Auth Service

**Files:**
- Create: `src/services/authService.ts`

**Interfaces:**
- Consumes: `api` from `src/lib/api.ts`, `LoginRequest`, `RegisterRequest`, `User` from `src/types.ts`
- Produces: `authService.login()`, `authService.register()`, `authService.getMe()`

- [ ] **Step 1: Create authService.ts**

```typescript
import { api } from '../lib/api';
import type { ApiResponse, User, LoginRequest, RegisterRequest } from '../types';

export const authService = {
  async login(data: LoginRequest): Promise<{ user: User; token: string }> {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', data);
    return response.data.data;
  },

  async register(data: RegisterRequest): Promise<{ user: User; token: string }> {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data);
    return response.data.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post<ApiResponse<null>>('/auth/forgot-password', { email });
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/services/authService.ts
git commit -m "feat: add auth service with login, register, getMe, forgotPassword"
```

---

### Task 6: Create Auth Store (Zustand)

**Files:**
- Create: `src/stores/authStore.ts`

**Interfaces:**
- Consumes: `authService` from `src/services/authService.ts`, `setAuthToken`, `clearAuthToken` from `src/lib/api.ts`
- Produces: `useAuthStore` hook with `user`, `token`, `isAuthenticated`, `isLoading`, `login()`, `register()`, `logout()`

- [ ] **Step 1: Create authStore.ts**

```typescript
import { create } from 'zustand';
import type { AuthState, LoginRequest, RegisterRequest } from '../types';
import { authService } from '../services/authService';
import { setAuthToken, clearAuthToken } from '../lib/api';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: false,

  login: async (data: LoginRequest) => {
    set({ isLoading: true });
    try {
      const { user, token } = await authService.login(data);
      setAuthToken(token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data: RegisterRequest) => {
    set({ isLoading: true });
    try {
      const { user, token } = await authService.register(data);
      setAuthToken(token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    clearAuthToken();
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user }),
}));
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/authStore.ts
git commit -m "feat: add Zustand auth store with login, register, logout"
```

---

### Task 7: Create Auth Hook

**Files:**
- Create: `src/hooks/useAuth.ts`

**Interfaces:**
- Consumes: `useAuthStore` from `src/stores/authStore.ts`
- Produces: `useAuth()` hook

- [ ] **Step 1: Create useAuth.ts**

```typescript
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const { user, isAuthenticated, isLoading, login, register, logout } = useAuthStore();

  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin';

  return {
    user,
    isAuthenticated,
    isLoading,
    isStudent,
    isAdmin,
    login,
    register,
    logout,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useAuth.ts
git commit -m "feat: add useAuth hook with role helpers"
```

---

### Task 8: Create Protected Route Component

**Files:**
- Create: `src/components/ProtectedRoute.tsx`

**Interfaces:**
- Consumes: `useAuth()` from `src/hooks/useAuth.ts`
- Produces: `ProtectedRoute` component

- [ ] **Step 1: Create ProtectedRoute.tsx**

```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Props {
  requiredRole?: 'student' | 'admin';
}

export default function ProtectedRoute({ requiredRole }: Props) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060A12' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#3B82F6', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProtectedRoute.tsx
git commit -m "feat: add ProtectedRoute component with role-based access"
```

---

### Task 9: Create Toast Component

**Files:**
- Create: `src/components/ui/Toast.tsx`

**Interfaces:**
- Consumes: None
- Produces: `Toast` component, `useToast()` hook

- [ ] **Step 1: Create Toast.tsx**

```typescript
import { useState, useCallback, createContext, useContext } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons = {
    success: <CheckCircle size={16} style={{ color: '#10B981' }} />,
    error: <AlertCircle size={16} style={{ color: '#EF4444' }} />,
    info: <Info size={16} style={{ color: '#3B82F6' }} />,
  };

  const colors = {
    success: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
    error: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
    info: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)' },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-slide-in"
            style={{ background: colors[toast.type].bg, border: `1px solid ${colors[toast.type].border}` }}
          >
            {icons[toast.type]}
            <span className="text-sm" style={{ color: '#F1F5F9' }}>{toast.message}</span>
            <button onClick={() => dismiss(toast.id)} style={{ color: '#64748B' }}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/Toast.tsx
git commit -m "feat: add Toast component with provider and useToast hook"
```

---

### Task 10: Create Loading Spinner

**Files:**
- Create: `src/components/ui/LoadingSpinner.tsx`

**Interfaces:**
- Consumes: None
- Produces: `LoadingSpinner` component

- [ ] **Step 1: Create LoadingSpinner.tsx**

```typescript
interface Props {
  size?: number;
  color?: string;
}

export default function LoadingSpinner({ size = 24, color = '#3B82F6' }: Props) {
  return (
    <div
      className="border-2 border-t-transparent rounded-full animate-spin"
      style={{ width: size, height: size, borderColor: color, borderTopColor: 'transparent' }}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/LoadingSpinner.tsx
git commit -m "feat: add LoadingSpinner component"
```

---

### Task 11: Create Constants

**Files:**
- Create: `src/lib/constants.ts`

**Interfaces:**
- Consumes: None
- Produces: `API_BASE_URL`, `COURSE_CATEGORIES`, `PAYMENT_METHODS`

- [ ] **Step 1: Create constants.ts**

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const COURSE_CATEGORIES = [
  { value: 'programming', label: 'Programming', icon: '⟨/⟩', color: '#3B82F6' },
  { value: 'ai', label: 'Artificial Intelligence', icon: '◈', color: '#8B5CF6' },
  { value: 'data_analysis', label: 'Data Analysis', icon: '▦', color: '#06B6D4' },
  { value: 'business', label: 'Business Skills', icon: '◉', color: '#F59E0B' },
  { value: 'academic', label: 'Academic Learning', icon: '⊞', color: '#10B981' },
] as const;

export const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const PAYMENT_METHODS = [
  { id: 'paystack', name: 'Paystack', description: 'Pay with card or bank transfer' },
  { id: 'flutterwave', name: 'Flutterwave', description: 'Pay with card, bank, or mobile money' },
  { id: 'bank_transfer', name: 'Bank Transfer', description: 'Manual bank transfer (verification required)' },
] as const;

export const NAVIGATION = {
  student: [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/my-courses', label: 'My Courses' },
    { path: '/ai-tutor', label: 'AI Tutor' },
    { path: '/coding-lab', label: 'Coding Lab' },
    { path: '/certificates', label: 'Certificates' },
  ],
  admin: [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/courses', label: 'Courses' },
    { path: '/admin/payments', label: 'Payments' },
    { path: '/admin/analytics', label: 'Analytics' },
  ],
} as const;
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/constants.ts
git commit -m "feat: add app constants for categories, levels, payments, navigation"
```

---

### Task 12: Create MSW Mock Handlers

**Files:**
- Create: `src/mocks/handlers.ts`
- Create: `src/mocks/browser.ts`

**Interfaces:**
- Consumes: None
- Produces: `handlers` array, `browser` MSW worker

- [ ] **Step 1: Create handlers.ts**

```typescript
import { http, HttpResponse } from 'msw';

const mockUser = {
  id: 'usr_001',
  email: 'emeka@gmail.com',
  name: 'Emeka Okafor',
  phone: '+2348012345678',
  role: 'student' as const,
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format',
  onboardingCompleted: true,
  emailVerified: true,
  createdAt: '2025-03-15T00:00:00Z',
};

const mockAdmin = {
  id: 'adm_001',
  email: 'admin@smugflex.ai',
  name: 'Admin User',
  role: 'admin' as const,
  onboardingCompleted: true,
  emailVerified: true,
  createdAt: '2024-12-01T00:00:00Z',
};

export const handlers = [
  http.post('http://localhost:3001/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };

    if (body.email === 'admin@smugflex.ai') {
      return HttpResponse.json({
        success: true,
        data: { user: mockAdmin, token: 'mock_admin_token_123' },
      });
    }

    if (body.email && body.password) {
      return HttpResponse.json({
        success: true,
        data: { user: mockUser, token: 'mock_token_123' },
      });
    }

    return HttpResponse.json(
      { success: false, message: 'Invalid email or password' },
      { status: 401 }
    );
  }),

  http.post('http://localhost:3001/api/auth/register', async ({ request }) => {
    const body = await request.json() as { name: string; email: string; password: string };

    return HttpResponse.json({
      success: true,
      data: {
        user: { ...mockUser, name: body.name, email: body.email, id: 'usr_new' },
        token: 'mock_new_token_123',
      },
    });
  }),

  http.get('http://localhost:3001/api/auth/me', ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth?.startsWith('Bearer ')) {
      return HttpResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = auth.replace('Bearer ', '');
    const user = token.includes('admin') ? mockAdmin : mockUser;

    return HttpResponse.json({
      success: true,
      data: user,
    });
  }),

  http.post('http://localhost:3001/api/auth/forgot-password', () => {
    return HttpResponse.json({
      success: true,
      data: null,
      message: 'Password reset email sent',
    });
  }),

  http.post('http://localhost:3001/api/auth/logout', () => {
    return HttpResponse.json({
      success: true,
      data: null,
    });
  }),
];
```

- [ ] **Step 2: Create browser.ts**

```typescript
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

- [ ] **Step 3: Commit**

```bash
git add src/mocks/handlers.ts src/mocks/browser.ts
git commit -m "feat: add MSW mock handlers for auth API"
```

---

### Task 13: Create Login Page

**Files:**
- Modify: `src/pages/Auth.tsx`

**Interfaces:**
- Consumes: `useAuth()` from `src/hooks/useAuth.ts`, `useToast()` from `src/components/ui/Toast.tsx`, `loginSchema` from `src/lib/validators.ts`
- Produces: Updated Auth page with login form

- [ ] **Step 1: Rewrite Auth.tsx with React Hook Form**

```typescript
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Brain, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import { loginSchema, registerSchema, forgotPasswordSchema } from '../lib/validators';
import type { LoginFormData, RegisterFormData, ForgotPasswordFormData } from '../lib/validators';

type AuthMode = 'login' | 'register' | 'forgot';

interface Props {
  mode: AuthMode;
}

export default function Auth({ mode }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>(mode);
  const { login, register, isLoading } = useAuth();
  const { showToast } = useToast();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
  });

  const forgotForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      showToast('Welcome back!', 'success');
    } catch {
      showToast('Invalid email or password', 'error');
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      await register(data);
      showToast('Account created successfully!', 'success');
    } catch {
      showToast('Registration failed. Please try again.', 'error');
    }
  };

  const onForgotSubmit = async (data: ForgotPasswordFormData) => {
    try {
      showToast('Password reset email sent!', 'success');
      setAuthMode('login');
    } catch {
      showToast('Failed to send reset email', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 mesh-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-blue-purple">
              <Brain size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold font-display gradient-text">Smugflex AI</span>
          </Link>
          <h1 className="text-2xl font-bold font-display" style={{ color: '#F1F5F9' }}>
            {authMode === 'login' && 'Welcome back'}
            {authMode === 'register' && 'Create your account'}
            {authMode === 'forgot' && 'Reset your password'}
          </h1>
          <p className="text-sm mt-2" style={{ color: '#64748B' }}>
            {authMode === 'login' && 'Sign in to continue your learning journey'}
            {authMode === 'register' && 'Start your AI-powered learning journey today'}
            {authMode === 'forgot' && 'Enter your email to receive a reset link'}
          </p>
        </div>

        <div className="p-8 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
          {authMode === 'login' && (
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#94A3B8' }}>Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
                  <input
                    type="email"
                    {...loginForm.register('email')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', color: '#F1F5F9' }}
                    placeholder="you@example.com"
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#94A3B8' }}>Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...loginForm.register('password')}
                    className="w-full pl-10 pr-12 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', color: '#F1F5F9' }}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#475569' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-semibold text-sm gradient-blue-purple text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#fff', borderTopColor: 'transparent' }} />
                ) : (
                  <>Sign In <ArrowRight size={16} /></>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-xs font-medium"
                  style={{ color: '#3B82F6' }}
                >
                  Forgot password?
                </button>
              </div>
            </form>
          )}

          {authMode === 'register' && (
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#94A3B8' }}>Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
                  <input
                    type="text"
                    {...registerForm.register('name')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', color: '#F1F5F9' }}
                    placeholder="John Doe"
                  />
                </div>
                {registerForm.formState.errors.name && (
                  <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{registerForm.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#94A3B8' }}>Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
                  <input
                    type="email"
                    {...registerForm.register('email')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', color: '#F1F5F9' }}
                    placeholder="you@example.com"
                  />
                </div>
                {registerForm.formState.errors.email && (
                  <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#94A3B8' }}>Phone (optional)</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
                  <input
                    type="tel"
                    {...registerForm.register('phone')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', color: '#F1F5F9' }}
                    placeholder="+234 801 234 5678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#94A3B8' }}>Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...registerForm.register('password')}
                    className="w-full pl-10 pr-12 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', color: '#F1F5F9' }}
                    placeholder="Min 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#475569' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#94A3B8' }}>Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...registerForm.register('confirmPassword')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', color: '#F1F5F9' }}
                    placeholder="Confirm your password"
                  />
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-semibold text-sm gradient-blue-purple text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#fff', borderTopColor: 'transparent' }} />
                ) : (
                  <>Create Account <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          )}

          {authMode === 'forgot' && (
            <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#94A3B8' }}>Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
                  <input
                    type="email"
                    {...forgotForm.register('email')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', color: '#F1F5F9' }}
                    placeholder="you@example.com"
                  />
                </div>
                {forgotForm.formState.errors.email && (
                  <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{forgotForm.formState.errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-semibold text-sm gradient-blue-purple text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#fff', borderTopColor: 'transparent' }} />
                ) : (
                  <>Send Reset Link <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs" style={{ color: '#64748B' }}>
              {authMode === 'login' && (
                <>Don't have an account?{' '}
                  <button onClick={() => setAuthMode('register')} className="font-semibold" style={{ color: '#3B82F6' }}>Sign up</button>
                </>
              )}
              {authMode === 'register' && (
                <>Already have an account?{' '}
                  <button onClick={() => setAuthMode('login')} className="font-semibold" style={{ color: '#3B82F6' }}>Sign in</button>
                </>
              )}
              {authMode === 'forgot' && (
                <>Remember your password?{' '}
                  <button onClick={() => setAuthMode('login')} className="font-semibold" style={{ color: '#3B82F6' }}>Sign in</button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Auth.tsx
git commit -m "feat: refactor Auth page with React Hook Form, Zod validation, and toast feedback"
```

---

### Task 14: Update Main Entry Point with Providers

**Files:**
- Modify: `src/main.tsx`

**Interfaces:**
- Consumes: `ToastProvider` from `src/components/ui/Toast.tsx`
- Produces: Updated main.tsx with providers

- [ ] **Step 1: Rewrite main.tsx**

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/ui/Toast';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    return worker.start({ onUnhandledRequest: 'bypass' });
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <App />
          </ToastProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>
  );
});
```

- [ ] **Step 2: Commit**

```bash
git add src/main.tsx
git commit -m "feat: wrap app with BrowserRouter, QueryClientProvider, ToastProvider, and MSW"
```

---

### Task 15: Rewrite App.tsx with React Router

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: All page components, `ProtectedRoute`
- Produces: App with React Router routes

- [ ] **Step 1: Rewrite App.tsx**

```typescript
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';

const Landing = lazy(() => import('./pages/Landing'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const CourseDetails = lazy(() => import('./pages/CourseDetails'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Auth = lazy(() => import('./pages/Auth'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const MyCourses = lazy(() => import('./pages/MyCourses'));
const CourseLearning = lazy(() => import('./pages/CourseLearning'));
const AITutor = lazy(() => import('./pages/AITutor'));
const CodingLab = lazy(() => import('./pages/CodingLab'));
const Assignment = lazy(() => import('./pages/Assignment'));
const Assessment = lazy(() => import('./pages/Assessment'));
const Results = lazy(() => import('./pages/Results'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Certificate = lazy(() => import('./pages/Certificate'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Checkout = lazy(() => import('./pages/Checkout'));
const PaymentStatus = lazy(() => import('./pages/PaymentStatus'));
const Notifications = lazy(() => import('./pages/Notifications'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminCourses = lazy(() => import('./pages/AdminCourses'));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics'));
const AdminPayments = lazy(() => import('./pages/AdminPayments'));
const AdminCertificates = lazy(() => import('./pages/AdminCertificates'));
const AdminAI = lazy(() => import('./pages/AdminAI'));
const NotFound = lazy(() => import('./pages/NotFound'));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#060A12' }}>
          <LoadingSpinner size={32} />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export default function App() {
  return (
    <SuspenseWrapper>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/forgot-password" element={<Auth mode="forgot" />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentStatus status="success" />} />
        <Route path="/payment-failed" element={<PaymentStatus status="failed" />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
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
        </Route>

        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/certificates" element={<AdminCertificates />} />
          <Route path="/admin/ai" element={<AdminAI />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </SuspenseWrapper>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/App.tsx
git commit -m "feat: replace custom routing with React Router v6 and lazy loading"
```

---

### Task 16: Update Page Components for React Router

**Files:**
- Modify: `src/pages/Landing.tsx`
- Modify: `src/pages/Marketplace.tsx`
- Modify: `src/pages/CourseDetails.tsx`
- Modify: `src/pages/About.tsx`
- Modify: `src/pages/Contact.tsx`
- Modify: `src/pages/StudentDashboard.tsx`
- Modify: `src/pages/MyCourses.tsx`
- Modify: `src/pages/CourseLearning.tsx`
- Modify: `src/pages/AITutor.tsx`
- Modify: `src/pages/CodingLab.tsx`
- Modify: `src/pages/Assignment.tsx`
- Modify: `src/pages/Assessment.tsx`
- Modify: `src/pages/Results.tsx`
- Modify: `src/pages/Portfolio.tsx`
- Modify: `src/pages/Certificate.tsx`
- Modify: `src/pages/Profile.tsx`
- Modify: `src/pages/Settings.tsx`
- Modify: `src/pages/Checkout.tsx`
- Modify: `src/pages/PaymentStatus.tsx`
- Modify: `src/pages/Notifications.tsx`
- Modify: `src/pages/AdminDashboard.tsx`
- Modify: `src/pages/AdminUsers.tsx`
- Modify: `src/pages/AdminCourses.tsx`
- Modify: `src/pages/AdminAnalytics.tsx`
- Modify: `src/pages/AdminPayments.tsx`
- Modify: `src/pages/AdminCertificates.tsx`
- Modify: `src/pages/AdminAI.tsx`
- Modify: `src/pages/NotFound.tsx`

**Interfaces:**
- Consumes: `useNavigate`, `useParams` from `react-router-dom`
- Produces: Updated pages using React Router navigation

**Key changes for each page:**
- Replace `navigate: (p: Page) => void` prop with `useNavigate()` hook
- Replace `navigate('page-name')` with `navigate('/path')`
- Remove `Props` interface that includes `navigate`
- Use `useParams()` for route parameters

- [ ] **Step 1: Update Landing.tsx**

Replace the `Props` interface and `navigate` prop usage:

```typescript
// Remove this:
interface Props { navigate: (p: Page) => void }

// Replace with:
import { useNavigate } from 'react-router-dom';

// In component:
const navigate = useNavigate();

// Replace all navigate('page-name') with navigate('/path'):
// navigate('register') → navigate('/register')
// navigate('marketplace') → navigate('/marketplace')
// navigate('login') → navigate('/login')
```

- [ ] **Step 2: Update all other page components similarly**

Apply the same pattern to every page component:
1. Import `useNavigate` from `react-router-dom`
2. Remove `Props` interface with `navigate`
3. Add `const navigate = useNavigate()` inside component
4. Replace `navigate('page-name')` with `navigate('/path')`

- [ ] **Step 3: Update NotFound.tsx**

```typescript
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#060A12' }}>
      <div className="text-center">
        <h1 className="text-6xl font-bold font-display gradient-text mb-4">404</h1>
        <p className="text-lg mb-6" style={{ color: '#64748B' }}>Page not found</p>
        <Link
          to="/"
          className="px-6 py-3 rounded-xl font-semibold text-sm gradient-blue-purple text-white"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/
git commit -m "feat: update all page components to use React Router navigation"
```

---

### Task 17: Configure Vite for MSW

**Files:**
- Modify: `vite.config.ts`

**Interfaces:**
- Consumes: None
- Produces: Updated Vite config with MSW service worker support

- [ ] **Step 1: Update vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
});
```

- [ ] **Step 2: Create public/mockServiceWorker.js**

```bash
pnpm add -D msw
```

Then generate the service worker:

```bash
npx msw init public/ --save
```

- [ ] **Step 3: Commit**

```bash
git add vite.config.ts public/mockServiceWorker.js
git commit -m "chore: configure Vite with path aliases and MSW service worker"
```

---

### Task 18: Run and Verify

- [ ] **Step 1: Start development server**

```bash
pnpm dev
```

Expected: Server starts on http://localhost:5173

- [ ] **Step 2: Verify MSW is active**

Open browser console. Look for: `[MSW] Mocking enabled.`

- [ ] **Step 3: Test login flow**

1. Navigate to http://localhost:5173/login
2. Enter any email and password
3. Click "Sign In"
4. Should see "Welcome back!" toast
5. Should redirect to /dashboard

- [ ] **Step 4: Test register flow**

1. Navigate to http://localhost:5173/register
2. Fill in the form
3. Click "Create Account"
4. Should see "Account created successfully!" toast

- [ ] **Step 5: Test protected route**

1. Logout (clear localStorage)
2. Navigate to http://localhost:5173/dashboard
3. Should redirect to /login

- [ ] **Step 6: Run tests**

```bash
pnpm vitest run
```

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "feat: complete Phase 1 - project foundation and authentication"
```

---

## Summary

After completing this plan:

- ✅ React Router v6 with lazy-loaded routes
- ✅ Zustand auth store with login/register/logout
- ✅ React Query configured for server state
- ✅ React Hook Form + Zod for form validation
- ✅ Toast notifications system
- ✅ Protected route guards with role-based access
- ✅ MSW mock API for development
- ✅ API client with auth interceptors
- ✅ Loading states and error handling

**Next Phase:** Phase 2 will add the course marketplace, student dashboard, and course learning pages with real data.
