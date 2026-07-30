import { Brain, Award, BookOpen, AlertCircle, CheckCircle, Bell } from 'lucide-react'
import type { Page } from '../types'

interface Props { navigate: (p: Page) => void }

const notifications = [
  { id: '1', type: 'ai', icon: Brain, title: 'AI Tutor Insight', message: "You've been consistent! Your loop comprehension improved by 34% this week. Ready for Module 2?", time: '2 hours ago', read: false, color: '#8B5CF6' },
  { id: '2', type: 'course', icon: BookOpen, title: 'New Lesson Available', message: 'Module 1 Lesson 4: Loops — for and while is now available in Python for AI.', time: '5 hours ago', read: false, color: '#3B82F6' },
  { id: '3', type: 'achievement', icon: Award, title: 'Achievement Unlocked! 🎉', message: 'You earned the "12-Day Streak" badge. Your consistency is paying off!', time: '1 day ago', read: true, color: '#F59E0B' },
  { id: '4', type: 'alert', icon: AlertCircle, title: 'Assignment Due Tomorrow', message: 'Assignment 3: Build a Number Guessing Game is due July 31st at 11:59 PM.', time: '1 day ago', read: true, color: '#EF4444' },
  { id: '5', type: 'success', icon: CheckCircle, title: 'Payment Confirmed', message: 'Your enrollment in Python for AI has been confirmed. Start learning now!', time: '3 days ago', read: true, color: '#10B981' },
  { id: '6', type: 'ai', icon: Brain, title: 'Learning Suggestion', message: "Based on your progress, I recommend spending 20 minutes on list comprehensions before your next session.", time: '4 days ago', read: true, color: '#8B5CF6' },
]

export default function Notifications({ navigate }: Props) {
  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold font-display" style={{ color: '#F1F5F9' }}>Notifications</h1>
            {unread > 0 && <p className="text-sm mt-1" style={{ color: '#3B82F6' }}>{unread} unread notifications</p>}
          </div>
          <button className="text-xs font-medium" style={{ color: '#64748B' }}>Mark all read</button>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={40} className="mx-auto mb-3" style={{ color: '#475569' }} />
            <p style={{ color: '#64748B' }}>No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div
                key={n.id}
                className="flex gap-4 p-4 rounded-xl border transition-all"
                style={{
                  background: n.read ? '#0D1421' : 'rgba(59,130,246,0.05)',
                  borderColor: n.read ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.2)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${n.color}15` }}
                >
                  <n.icon size={18} style={{ color: n.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{n.title}</p>
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: '#3B82F6' }} />
                    )}
                  </div>
                  <p className="text-xs leading-relaxed mt-1" style={{ color: '#64748B' }}>{n.message}</p>
                  <p className="text-xs mt-2" style={{ color: '#475569' }}>{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
