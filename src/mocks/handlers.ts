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
