import { Users, BookOpen, TrendingUp, DollarSign, Award, Brain, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { adminStats, recentTransactions } from '../data/mockData'

function StatCard({ icon: Icon, label, value, sub, color, trend }: {
  icon: React.ElementType; label: string; value: string; sub?: string; color: string; trend?: string
}) {
  return (
    <div className="p-5 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(239,68,68,0.08)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#10B981' }}>
            <ArrowUpRight size={12} /> {trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold font-display" style={{ color: '#F1F5F9' }}>{value}</div>
      <div className="text-sm mt-0.5" style={{ color: '#64748B' }}>{label}</div>
      {sub && <div className="text-xs mt-1" style={{ color: '#475569' }}>{sub}</div>}
    </div>
  )
}

function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all"
          style={{ height: `${(v / max) * 100}%`, background: i === data.length - 1 ? color : `${color}40` }}
        />
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold font-display" style={{ color: '#F1F5F9' }}>
          Platform Overview
        </h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>Wednesday, 30 July 2025 — Real-time metrics</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Students" value={adminStats.totalStudents.toLocaleString()} sub="Active learners" color="#3B82F6" trend="+12%" />
        <StatCard icon={DollarSign} label="Total Revenue" value={`₦${(adminStats.totalRevenue / 1000000).toFixed(1)}M`} sub="All time" color="#10B981" trend="+23%" />
        <StatCard icon={BookOpen} label="Total Courses" value={String(adminStats.totalCourses)} sub="4 pending review" color="#8B5CF6" />
        <StatCard icon={TrendingUp} label="Completion Rate" value={`${adminStats.completionRate}%`} sub="Platform average" color="#F59E0B" trend="+5%" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Enrollment chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(239,68,68,0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold font-display" style={{ color: '#F1F5F9' }}>Enrollments (Last 7 Days)</h3>
            <button onClick={() => navigate('/admin/analytics')} className="text-xs flex items-center gap-1" style={{ color: '#EF4444' }}>
              Full Report <ArrowRight size={12} />
            </button>
          </div>
          <div className="mb-4">
            <MiniBarChart data={[45, 62, 38, 71, 55, 83, 94]} color="#3B82F6" />
            <div className="flex justify-between text-xs mt-2" style={{ color: '#475569' }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'This Week', value: '448', trend: '+18%', color: '#3B82F6' },
              { label: 'Avg/Day', value: '64', trend: '+12%', color: '#8B5CF6' },
              { label: 'Revenue', value: '₦2.3M', trend: '+23%', color: '#10B981' },
            ].map(({ label, value, trend, color }) => (
              <div key={label} className="p-3 rounded-xl text-center" style={{ background: 'rgba(59,130,246,0.04)' }}>
                <div className="font-bold font-display" style={{ color }}>{value}</div>
                <div className="text-xs" style={{ color: '#64748B' }}>{label}</div>
                <div className="text-xs" style={{ color: '#10B981' }}>{trend}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(239,68,68,0.08)' }}>
            <h3 className="font-semibold font-display mb-3" style={{ color: '#F1F5F9' }}>Platform Health</h3>
            <div className="space-y-3">
              {[
                { label: 'Active Users (24h)', v: '3,421', bar: 68, color: '#3B82F6' },
                { label: 'AI Tutor Queries', v: '12,847', bar: 85, color: '#8B5CF6' },
                { label: 'Avg Rating', v: '4.8/5.0', bar: 96, color: '#F59E0B' },
                { label: 'Server Uptime', v: '99.9%', bar: 100, color: '#10B981' },
              ].map(({ label, v, bar, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: '#64748B' }}>{label}</span>
                    <span style={{ color }}>{v}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(59,130,246,0.08)' }}>
                    <div className="h-full rounded-full" style={{ width: `${bar}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(239,68,68,0.08)' }}>
            <h3 className="font-semibold font-display mb-3 text-sm" style={{ color: '#F1F5F9' }}>Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Add New Course', path: '/admin/courses', icon: BookOpen },
                { label: 'Manage Users', path: '/admin/users', icon: Users },
                { label: 'View Analytics', path: '/admin/analytics', icon: TrendingUp },
                { label: 'AI Knowledge', path: '/admin/ai', icon: Brain },
              ].map(({ label, path, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                  style={{ color: '#94A3B8', background: 'transparent' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)'; (e.currentTarget as HTMLElement).style.color = '#EF4444' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#94A3B8' }}
                >
                  <Icon size={14} />
                  {label}
                  <ArrowRight size={12} className="ml-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0D1421', border: '1px solid rgba(239,68,68,0.08)' }}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(239,68,68,0.08)' }}>
          <h3 className="font-semibold font-display" style={{ color: '#F1F5F9' }}>Recent Transactions</h3>
          <button onClick={() => navigate('/admin/payments')} className="text-xs flex items-center gap-1" style={{ color: '#EF4444' }}>
            View All <ArrowRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs border-b" style={{ borderColor: 'rgba(239,68,68,0.06)' }}>
                {['ID', 'Student', 'Course', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-semibold" style={{ color: '#475569' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map(tx => (
                <tr key={tx.id} className="border-b transition-colors hover:bg-white/2" style={{ borderColor: 'rgba(239,68,68,0.04)' }}>
                  <td className="px-5 py-3.5 text-xs font-mono" style={{ color: '#3B82F6' }}>{tx.id}</td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: '#F1F5F9' }}>{tx.studentName}</td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: '#94A3B8' }}>{tx.courseName.slice(0, 20)}...</td>
                  <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: '#10B981' }}>₦{tx.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        background: tx.status === 'success' ? 'rgba(16,185,129,0.1)' : tx.status === 'pending' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                        color: tx.status === 'success' ? '#10B981' : tx.status === 'pending' ? '#F59E0B' : '#EF4444',
                      }}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: '#475569' }}>{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
