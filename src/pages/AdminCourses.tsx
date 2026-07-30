import { useState } from 'react'
import { Plus, Edit, Eye, Trash2, Search, Star, Users, Brain } from 'lucide-react'
import type { Page } from '../types'
import { courses } from '../data/mockData'

interface Props { navigate: (p: Page) => void }

export default function AdminCourses({ navigate }: Props) {
  const [search, setSearch] = useState('')

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: '#F1F5F9' }}>Course Management</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>{courses.length} courses on platform</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
          <Plus size={16} /> New Course
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl flex-1 max-w-xs" style={{ background: '#0D1421', border: '1px solid rgba(239,68,68,0.1)' }}>
          <Search size={15} style={{ color: '#475569' }} />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1"
            style={{ color: '#F1F5F9' }}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(course => (
          <div
            key={course.id}
            className="rounded-2xl overflow-hidden border"
            style={{ background: '#0D1421', borderColor: 'rgba(239,68,68,0.08)' }}
          >
            <div className="relative h-32 overflow-hidden">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(13,20,33,0.9),transparent)' }} />
              {course.aiTutor && (
                <div className="absolute top-2 right-2 p-1.5 rounded-lg" style={{ background: 'rgba(139,92,246,0.8)' }}>
                  <Brain size={12} className="text-white" />
                </div>
              )}
              <div className="absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-md" style={{ background: 'rgba(6,10,18,0.8)', color: course.level === 'Beginner' ? '#10B981' : course.level === 'Intermediate' ? '#F59E0B' : '#EF4444' }}>
                {course.level}
              </div>
            </div>
            <div className="p-3.5">
              <p className="text-xs mb-1" style={{ color: '#64748B' }}>{course.category}</p>
              <h3 className="text-sm font-semibold mb-2 font-display line-clamp-2" style={{ color: '#F1F5F9' }}>{course.title}</h3>
              <div className="flex items-center gap-3 text-xs mb-3" style={{ color: '#475569' }}>
                <span className="flex items-center gap-1"><Star size={10} fill="#F59E0B" style={{ color: '#F59E0B' }} /> {course.rating}</span>
                <span className="flex items-center gap-1"><Users size={10} /> {course.students.toLocaleString()}</span>
                <span className="font-semibold" style={{ color: '#10B981' }}>₦{(course.price / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex gap-2 pt-2 border-t" style={{ borderColor: 'rgba(239,68,68,0.06)' }}>
                <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ color: '#3B82F6' }} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.08)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <Eye size={12} /> View
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ color: '#F59E0B' }} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.08)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <Edit size={12} /> Edit
                </button>
                <button className="flex items-center justify-center p-1.5 rounded-lg text-xs transition-all" style={{ color: '#EF4444' }} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
