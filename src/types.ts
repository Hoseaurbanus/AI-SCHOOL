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

export interface NavProps {
  navigate: (page: Page) => void;
  currentPage: Page;
}

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

export interface LessonContent {
  type: 'text' | 'code' | 'image' | 'heading';
  content: string;
  language?: string;
  caption?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'zip' | 'link';
  url: string;
  size?: string;
}

export interface Note {
  id: string;
  lessonId: string;
  userId: string;
  content: string;
  updatedAt: string;
}
