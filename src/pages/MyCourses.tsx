import { useState } from 'react'
import { ArrowRight, Clock, CheckCircle, BookOpen, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { studentCourses, courses } from '../data/mockData'

const tabs = ['All', 'Active', 'Completed', 'Saved']

export default function MyCourses() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('All')

  const displayed = tab === 'All'
    ? studentCourses
    : tab === 'Active'
    ? studentCourses.filter(c => c.status === 'active')
    : tab === 'Completed'
    ? studentCourses.filter(c => c.status === 'completed')
    : []

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display" style={{ color: '#F1F5F9' }}>My Courses</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>Track and continue your learning</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: BookOpen, v: '2', l: 'Active', color: '#3B82F6' },
          { icon: CheckCircle, v: '1', l: 'Completed', color: '#10B981' },
          { icon: Award, v: '1', l: 'Certificates', color: '#F59E0B' },
        ].map(({ icon: Icon, v, l, color }) => (
          <div key={l} className="p-4 rounded-xl text-center" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
            <Icon size={20} className="mx-auto mb-2" style={{ color }} />
            <div className="text-xl font-bold font-display gradient-text">{v}</div>
            <div className="text-xs" style={{ color: '#64748B' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: 'rgba(59,130,246,0.06)' }}>
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: tab === t ? '#1A2540' : 'transparent', color: tab === t ? '#3B82F6' : '#64748B' }}
          >
            {t}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen size={40} className="mx-auto mb-3" style={{ color: '#475569' }} />
          <p className="font-semibold" style={{ color: '#94A3B8' }}>No saved courses yet</p>
          <button onClick={() => navigate('/marketplace')} className="mt-3 text-sm font-medium" style={{ color: '#3B82F6' }}>
            Browse Courses →
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayed.map(c => (
            <button
              key={c.id}
              onClick={() => navigate('/courses/1/learn')}
              className="text-left rounded-2xl overflow-hidden border transition-all hover:-translate-y-1 group"
              style={{ background: '#0D1421', borderColor: 'rgba(59,130,246,0.1)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.3)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.1)'}
            >
              <div className="relative h-36 overflow-hidden">
                <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(13,20,33,0.8),transparent)' }} />
                {c.status === 'completed' && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold" style={{ background: 'rgba(16,185,129,0.85)', color: '#fff' }}>
                    <CheckCircle size={10} /> Completed
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1 font-display" style={{ color: '#F1F5F9' }}>{c.title}</h3>
                <p className="text-xs mb-3" style={{ color: '#64748B' }}>{c.instructor}</p>
                <div className="space-y-1.5 mb-3">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: '#64748B' }}>Progress</span>
                    <span style={{ color: c.progress === 100 ? '#10B981' : '#3B82F6' }}>{c.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${c.progress}%`, background: c.progress === 100 ? '#10B981' : 'linear-gradient(90deg,#3B82F6,#8B5CF6)' }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1" style={{ color: '#475569' }}>
                    <Clock size={11} /> Last: {c.lastAccessed}
                  </span>
                  <span className="font-medium flex items-center gap-1" style={{ color: '#3B82F6' }}>
                    {c.progress === 100 ? 'Review' : 'Continue'} <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
