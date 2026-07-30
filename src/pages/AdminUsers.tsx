import { useState } from 'react'
import { Search, UserCheck, UserX, Edit, Eye, ArrowUpDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { users } from '../data/mockData'

export default function AdminUsers() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || u.status === filter || u.role === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: '#F1F5F9' }}>User Management</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>{users.length} registered users</p>
        </div>
        <button className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
          + Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl flex-1 sm:flex-none sm:w-64" style={{ background: '#0D1421', border: '1px solid rgba(239,68,68,0.1)' }}>
          <Search size={15} style={{ color: '#475569' }} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1"
            style={{ color: '#F1F5F9' }}
          />
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(239,68,68,0.05)' }}>
          {['all', 'student', 'instructor', 'active', 'suspended'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
              style={{ background: filter === f ? 'rgba(239,68,68,0.15)' : 'transparent', color: filter === f ? '#EF4444' : '#64748B' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0D1421', border: '1px solid rgba(239,68,68,0.08)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs" style={{ borderColor: 'rgba(239,68,68,0.08)' }}>
                {['Student', 'Email', 'Courses', 'Progress', 'Joined', 'Role', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-semibold" style={{ color: '#475569' }}>
                    <div className="flex items-center gap-1">
                      {h}
                      {['Student', 'Joined'].includes(h) && <ArrowUpDown size={11} style={{ opacity: 0.5 }} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="border-b transition-colors" style={{ borderColor: 'rgba(239,68,68,0.04)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}>
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>{user.name}</p>
                        <p className="text-xs font-mono" style={{ color: '#475569' }}>{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs" style={{ color: '#94A3B8' }}>{user.email}</td>
                  <td className="px-5 py-4 text-sm" style={{ color: '#94A3B8' }}>{user.courses}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)' }}>
                        <div className="h-full rounded-full" style={{ width: `${user.progress}%`, background: user.progress > 80 ? '#10B981' : '#3B82F6' }} />
                      </div>
                      <span className="text-xs" style={{ color: '#64748B' }}>{user.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs" style={{ color: '#64748B' }}>{user.joined}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ background: user.role === 'instructor' ? 'rgba(139,92,246,0.1)' : 'rgba(59,130,246,0.1)', color: user.role === 'instructor' ? '#8B5CF6' : '#3B82F6' }}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: user.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: user.status === 'active' ? '#10B981' : '#EF4444' }}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-lg transition-colors" style={{ color: '#475569' }} onMouseEnter={e => (e.currentTarget.style.color = '#3B82F6')} onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg transition-colors" style={{ color: '#475569' }} onMouseEnter={e => (e.currentTarget.style.color = '#F59E0B')} onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
                        <Edit size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg transition-colors" style={{ color: '#475569' }} onMouseEnter={e => (e.currentTarget.style.color = user.status === 'active' ? '#EF4444' : '#10B981')} onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
                        {user.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t text-xs" style={{ borderColor: 'rgba(239,68,68,0.08)', color: '#475569' }}>
          <span>Showing {filtered.length} of {users.length} users</span>
          <div className="flex gap-1">
            {[1, 2, 3].map(n => (
              <button key={n} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: n === 1 ? 'rgba(239,68,68,0.15)' : 'transparent', color: n === 1 ? '#EF4444' : '#64748B' }}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
