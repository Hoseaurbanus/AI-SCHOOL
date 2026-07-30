import { User, Mail, Phone, Edit3, Star, Award, BookOpen, TrendingUp } from 'lucide-react'
import type { Page } from '../types'

interface Props { navigate: (p: Page) => void }

export default function Profile({ navigate }: Props) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold font-display mb-6" style={{ color: '#F1F5F9' }}>My Profile</h1>

        {/* Profile card */}
        <div className="p-6 rounded-2xl mb-6" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format"
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
                style={{ border: '2px solid rgba(59,130,246,0.3)' }}
              />
              <button
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: '#3B82F6' }}
              >
                <Edit3 size={12} className="text-white" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold font-display" style={{ color: '#F1F5F9' }}>Emeka Okafor</h2>
                  <p className="text-sm" style={{ color: '#64748B' }}>Scholar Plan · Member since March 2025</p>
                </div>
                <button
                  onClick={() => navigate('settings')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                  style={{ borderColor: 'rgba(59,130,246,0.2)', color: '#94A3B8' }}
                >
                  Edit Profile
                </button>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm" style={{ color: '#64748B' }}>
                  <Mail size={14} />
                  <span>emeka@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#64748B' }}>
                  <Phone size={14} />
                  <span>+234 801 234 5678</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: BookOpen, v: '3', l: 'Courses', color: '#3B82F6' },
            { icon: Award, v: '1', l: 'Certificates', color: '#F59E0B' },
            { icon: Star, v: '2,840', l: 'XP Points', color: '#8B5CF6' },
            { icon: TrendingUp, v: '12', l: 'Day Streak', color: '#10B981' },
          ].map(({ icon: Icon, v, l, color }) => (
            <div key={l} className="p-4 rounded-xl text-center" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.08)' }}>
              <Icon size={18} className="mx-auto mb-2" style={{ color }} />
              <div className="font-bold font-display gradient-text">{v}</div>
              <div className="text-xs mt-0.5" style={{ color: '#64748B' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="p-5 rounded-2xl mb-5" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
          <h3 className="font-semibold mb-4 font-display" style={{ color: '#F1F5F9' }}>Skills</h3>
          <div className="space-y-3">
            {[
              { skill: 'Python Programming', level: 72 },
              { skill: 'Machine Learning', level: 45 },
              { skill: 'Data Analysis', level: 38 },
              { skill: 'Deep Learning', level: 15 },
            ].map(({ skill, level }) => (
              <div key={skill}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: '#94A3B8' }}>{skill}</span>
                  <span style={{ color: '#3B82F6' }}>{level}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(59,130,246,0.08)' }}>
                  <div className="h-full rounded-full gradient-blue-purple" style={{ width: `${level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="p-5 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
          <h3 className="font-semibold mb-4 font-display" style={{ color: '#F1F5F9' }}>Achievements</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {[
              { emoji: '🔥', name: '12-Day Streak', earned: true },
              { emoji: '🤖', name: 'AI Power User', earned: true },
              { emoji: '💻', name: 'Code Wizard', earned: true },
              { emoji: '🏆', name: 'First Certificate', earned: false },
              { emoji: '⭐', name: 'Top Learner', earned: false },
            ].map(({ emoji, name, earned }) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2 p-3 rounded-xl text-center"
                style={{ background: earned ? 'rgba(245,158,11,0.08)' : 'rgba(59,130,246,0.04)', filter: earned ? 'none' : 'grayscale(1) opacity(0.4)', border: `1px solid ${earned ? 'rgba(245,158,11,0.15)' : 'transparent'}` }}
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs leading-tight" style={{ color: earned ? '#94A3B8' : '#475569' }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
