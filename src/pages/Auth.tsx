import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Brain, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';
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

  const onForgotSubmit = async (_data: ForgotPasswordFormData) => {
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
                <>Don&apos;t have an account?{' '}
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
