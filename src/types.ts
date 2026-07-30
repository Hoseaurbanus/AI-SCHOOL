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
