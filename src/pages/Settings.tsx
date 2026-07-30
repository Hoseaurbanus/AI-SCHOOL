import { useState } from 'react'
import { User, Lock, Bell, Palette, Shield, ChevronRight } from 'lucide-react'
import type { Page } from '../types'

interface Props { navigate: (p: Page) => void }

const sections = [
  { icon: User, label: 'Account', id: 'account' },
  { icon: Lock, label: 'Password', id: 'password' },
  { icon: Bell, label: 'Notifications', id: 'notifications' },
  { icon: Palette, label: 'Theme', id: 'theme' },
  { icon: Shield, label: 'Privacy', id: 'privacy' },
]

export default function Settings({ navigate }: Props) {
  const [active, setActive] = useState('account')
  const [notifications, setNotifications] = useState({
    email: true, push: true, assignments: true, ai: false, marketing: false,
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold font-display mb-6" style={{ color: '#F1F5F9' }}>Settings</h1>

      <div className="flex flex-col sm:flex-row gap-5">
        {/* Sidebar */}
        <div className="sm:w-48 flex-shrink-0 space-y-1">
          {sections.map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: active === id ? 'rgba(59,130,246,0.1)' : 'transparent', color: active === id ? '#3B82F6' : '#94A3B8' }}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={16} />
                {label}
              </div>
              <ChevronRight size={14} style={{ opacity: active === id ? 1 : 0 }} />
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
          {active === 'account' && (
            <div className="space-y-5">
              <h2 className="font-semibold font-display" style={{ color: '#F1F5F9' }}>Account Settings</h2>
              {[
                { label: 'Full Name', value: 'Emeka Okafor', type: 'text' },
                { label: 'Email Address', value: 'emeka@gmail.com', type: 'email' },
                { label: 'Phone Number', value: '+234 801 234 5678', type: 'tel' },
              ].map(({ label, value, type }) => (
                <div key={label}>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>{label}</label>
                  <input
                    type={type}
                    defaultValue={value}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', color: '#F1F5F9' }}
                  />
                </div>
              ))}
              <button className="px-6 py-2.5 rounded-xl text-sm font-semibold gradient-blue-purple text-white hover:opacity-90">
                Save Changes
              </button>
            </div>
          )}

          {active === 'password' && (
            <div className="space-y-5">
              <h2 className="font-semibold font-display" style={{ color: '#F1F5F9' }}>Change Password</h2>
              {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                <div key={label}>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>{label}</label>
                  <input type="password" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', color: '#F1F5F9' }} />
                </div>
              ))}
              <button className="px-6 py-2.5 rounded-xl text-sm font-semibold gradient-blue-purple text-white hover:opacity-90">
                Update Password
              </button>
            </div>
          )}

          {active === 'notifications' && (
            <div className="space-y-5">
              <h2 className="font-semibold font-display" style={{ color: '#F1F5F9' }}>Notification Preferences</h2>
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
                { key: 'assignments', label: 'Assignment Reminders', desc: 'Reminders for upcoming deadlines' },
                { key: 'ai', label: 'AI Learning Tips', desc: 'Daily tips from your AI tutor' },
                { key: 'marketing', label: 'Promotional Emails', desc: 'New courses and offers' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                    className="relative flex-shrink-0 w-11 h-6 rounded-full transition-all"
                    style={{ background: notifications[key as keyof typeof notifications] ? 'rgba(59,130,246,0.7)' : 'rgba(59,130,246,0.15)' }}
                  >
                    <div
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                      style={{ left: notifications[key as keyof typeof notifications] ? '22px' : '2px' }}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {active === 'theme' && (
            <div className="space-y-4">
              <h2 className="font-semibold font-display" style={{ color: '#F1F5F9' }}>Theme Settings</h2>
              <p className="text-sm" style={{ color: '#64748B' }}>Choose your preferred appearance</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Dark (Current)', bg: '#060A12', active: true },
                  { name: 'Light', bg: '#F8FAFC', active: false },
                ].map(t => (
                  <div
                    key={t.name}
                    className="p-4 rounded-xl cursor-pointer border-2 transition-all"
                    style={{ background: 'rgba(59,130,246,0.05)', borderColor: t.active ? '#3B82F6' : 'rgba(59,130,246,0.1)' }}
                  >
                    <div className="w-full h-12 rounded-lg mb-2" style={{ background: t.bg }} />
                    <p className="text-sm font-medium text-center" style={{ color: '#94A3B8' }}>{t.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === 'privacy' && (
            <div className="space-y-5">
              <h2 className="font-semibold font-display" style={{ color: '#F1F5F9' }}>Privacy Settings</h2>
              {[
                { label: 'Show profile in leaderboard', desc: 'Your name appears in course rankings', on: true },
                { label: 'Share learning progress', desc: 'Allow instructors to see your progress', on: true },
                { label: 'Public portfolio', desc: 'Anyone with link can view your projects', on: false },
              ].map(({ label, desc, on }) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{desc}</p>
                  </div>
                  <button
                    className="relative flex-shrink-0 w-11 h-6 rounded-full"
                    style={{ background: on ? 'rgba(59,130,246,0.7)' : 'rgba(59,130,246,0.15)' }}
                  >
                    <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white" style={{ left: on ? '22px' : '2px' }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
