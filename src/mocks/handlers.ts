import { http, HttpResponse } from 'msw';
import { courses, curriculum, courseReviews, enrolledCourses, studentStats, aiInsights, chatHistory } from '../data/mockData';
import type { ChatMessage } from '../types';

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
    const { courseId } = await request.json() as { courseId: string };
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
    const { content } = await request.json() as { content: string };

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
    const { code } = await request.json() as { code: string };

    await new Promise((resolve) => setTimeout(resolve, 1500));

    return HttpResponse.json({
      success: true,
      data: `Code Review:\n\n✅ Good practices:\n- Clear variable naming\n- Proper function structure\n\n💡 Suggestions:\n- Consider adding error handling\n- Add docstrings for better documentation`,
    });
  }),
];

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
