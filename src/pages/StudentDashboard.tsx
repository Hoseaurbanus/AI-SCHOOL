import {
  ArrowRight, Brain, Code2, TrendingUp, Award, Flame, BookOpen,
  Clock, Target, CheckCircle, Star, Zap,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { studentCourses, courses } from '../data/mockData'

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

export default function StudentDashboard() {
  const navigate = useNavigate()
  const activeCourses = studentCourses.filter(c => c.status === 'active')

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: '#F1F5F9' }}>
            Good morning, <span className="gradient-text">Emeka</span> 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>Wednesday, 30 July 2025 · You have 2 lessons to complete today</p>
        </div>
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl self-start"
          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
        >
          <Flame size={20} style={{ color: '#F59E0B' }} />
          <div>
            <p className="text-sm font-bold" style={{ color: '#F59E0B' }}>12-day streak!</p>
            <p className="text-xs" style={{ color: '#64748B' }}>Keep it up</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} value="3" label="Active Courses" color="#3B82F6" />
        <StatCard icon={TrendingUp} value="67%" label="Avg Progress" sub="+5% this week" color="#8B5CF6" />
        <StatCard icon={Award} value="2,840" label="XP Earned" sub="Level 4" color="#F59E0B" />
        <StatCard icon={Target} value="1" label="Certificates" color="#10B981" />
      </div>

      {/* AI Recommendation */}
      <div
        className="p-5 rounded-2xl flex items-start gap-4"
        style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.1),rgba(59,130,246,0.08))', border: '1px solid rgba(139,92,246,0.2)' }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(139,92,246,0.2)' }}>
          <Brain size={20} style={{ color: '#8B5CF6' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold" style={{ color: '#8B5CF6' }}>AI Tutor Insight</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6' }}>Personalized</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
            You have been spending extra time on <strong style={{ color: '#F1F5F9' }}>Python loops</strong>. I noticed you attempted the exercise 3 times — let me explain it differently. Also, you are 3 lessons away from unlocking the <strong style={{ color: '#F1F5F9' }}>NumPy module</strong>.
          </p>
          <button
            onClick={() => navigate('/ai-tutor')}
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold"
            style={{ color: '#8B5CF6' }}
          >
            Ask AI Tutor <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Active Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold font-display" style={{ color: '#F1F5F9' }}>Continue Learning</h2>
          <button onClick={() => navigate('/my-courses')} className="text-xs font-medium flex items-center gap-1" style={{ color: '#3B82F6' }}>
            All Courses <ArrowRight size={12} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCourses.map(c => (
            <button
              key={c.id}
              onClick={() => navigate('/courses/1/learn')}
              className="text-left p-4 rounded-2xl border transition-all hover:-translate-y-0.5 group"
              style={{ background: '#0D1421', borderColor: 'rgba(59,130,246,0.1)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.3)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.1)'}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate font-display" style={{ color: '#F1F5F9' }}>{c.title}</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>{c.instructor}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span style={{ color: '#64748B' }}>Progress</span>
                  <span style={{ color: '#3B82F6' }}>{c.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)' }}>
                  <div className="h-full rounded-full gradient-blue-purple transition-all" style={{ width: `${c.progress}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 text-xs" style={{ color: '#64748B' }}>
                <span className="flex items-center gap-1"><Clock size={11} /> {c.lastAccessed}</span>
                <span className="flex items-center gap-1 font-medium" style={{ color: '#3B82F6' }}>Continue <ArrowRight size={11} /></span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="rounded-2xl p-5" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
          <h2 className="text-base font-bold font-display mb-4" style={{ color: '#F1F5F9' }}>Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Brain, label: 'Ask AI Tutor', sub: 'Get instant help', path: '/ai-tutor', color: '#8B5CF6' },
              { icon: Code2, label: 'Coding Lab', sub: 'Practice coding', path: '/coding-lab', color: '#3B82F6' },
              { icon: Target, label: 'Assignments', sub: '1 due tomorrow', path: '/assignments', color: '#F59E0B' },
              { icon: Award, label: 'Certificates', sub: '1 earned', path: '/certificates', color: '#10B981' },
            ].map(({ icon: Icon, label, sub, path, color }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="flex flex-col items-start gap-2 p-3.5 rounded-xl transition-all hover:scale-105"
                style={{ background: `${color}0C`, border: `1px solid ${color}20` }}
              >
                <Icon size={18} style={{ color }} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#F1F5F9' }}>{label}</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>{sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="rounded-2xl p-5" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
          <h2 className="text-base font-bold font-display mb-4" style={{ color: '#F1F5F9' }}>Recent Achievements</h2>
          <div className="space-y-3">
            {[
              { emoji: '🔥', title: '12-Day Streak', desc: 'Learning every day for 12 days', earned: true },
              { emoji: '🤖', title: 'AI Power User', desc: 'Asked 50+ questions to AI tutor', earned: true },
              { emoji: '💻', title: 'Code Wizard', desc: 'Completed 10 coding exercises', earned: true },
              { emoji: '🏆', title: 'First Certificate', desc: 'Earned your first certificate', earned: false },
            ].map(({ emoji, title, desc, earned }) => (
              <div key={title} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: earned ? 'rgba(245,158,11,0.12)' : 'rgba(59,130,246,0.06)', filter: earned ? 'none' : 'grayscale(1) opacity(0.4)' }}
                >
                  {emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: earned ? '#F1F5F9' : '#64748B' }}>{title}</p>
                  <p className="text-xs" style={{ color: '#475569' }}>{desc}</p>
                </div>
                {earned && <CheckCircle size={14} style={{ color: '#10B981' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold font-display" style={{ color: '#F1F5F9' }}>
            <Zap size={16} className="inline mr-2" style={{ color: '#F59E0B' }} />
            Recommended for you
          </h2>
          <button onClick={() => navigate('/marketplace')} className="text-xs" style={{ color: '#3B82F6' }}>View all</button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.slice(1, 4).map(c => (
            <button
              key={c.id}
              onClick={() => navigate('/courses/1')}
              className="text-left flex gap-3 p-4 rounded-xl border transition-all"
              style={{ background: '#0D1421', borderColor: 'rgba(59,130,246,0.08)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.25)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.08)'}
            >
              <img src={c.image} alt={c.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate font-display" style={{ color: '#F1F5F9' }}>{c.title}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={10} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                  <span className="text-xs" style={{ color: '#F59E0B' }}>{c.rating}</span>
                  <span className="text-xs ml-1 font-bold gradient-text">₦{c.price.toLocaleString()}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
