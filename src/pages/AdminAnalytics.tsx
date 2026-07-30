import type { Page } from '../types'

interface Props { navigate: (p: Page) => void }

function BarChart({ data, labels, color, height = 120 }: { data: number[]; labels: string[]; color: string; height?: number }) {
  const max = Math.max(...data)
  return (
    <div>
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end items-center gap-1">
            <span className="text-xs font-semibold" style={{ color, fontSize: '10px' }}>{v}</span>
            <div
              className="w-full rounded-sm transition-all"
              style={{ height: `${(v / max) * (height - 20)}px`, background: i === data.length - 1 ? color : `${color}50` }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        {labels.map((l, i) => (
          <span key={i} className="flex-1 text-center text-xs" style={{ color: '#475569', fontSize: '10px' }}>{l}</span>
        ))}
      </div>
    </div>
  )
}

function DonutChart({ value, total, color }: { value: number; total: number; color: string }) {
  const pct = (value / total) * 100
  const r = 40
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth="12" />
      <circle
        cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="12"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="50" textAnchor="middle" dy="0.35em" fill={color} fontSize="14" fontWeight="700" fontFamily="Outfit">
        {Math.round(pct)}%
      </text>
    </svg>
  )
}

export default function AdminAnalytics({ navigate }: Props) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display" style={{ color: '#F1F5F9' }}>Analytics</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>Platform performance overview</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '₦4.57M', sub: '+23% vs last month', color: '#10B981' },
          { label: 'New Enrollments', value: '847', sub: '+18% this month', color: '#3B82F6' },
          { label: 'Active Students', value: '3,421', sub: 'In last 30 days', color: '#8B5CF6' },
          { label: 'Completions', value: '234', sub: '78% completion rate', color: '#F59E0B' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="p-5 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(239,68,68,0.08)' }}>
            <div className="text-2xl font-bold font-display mb-1" style={{ color }}>{value}</div>
            <div className="text-sm font-medium mb-1" style={{ color: '#94A3B8' }}>{label}</div>
            <div className="text-xs" style={{ color: '#10B981' }}>{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Enrollment chart */}
        <div className="p-5 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(239,68,68,0.08)' }}>
          <h3 className="font-semibold font-display mb-4" style={{ color: '#F1F5F9' }}>Monthly Enrollments</h3>
          <BarChart
            data={[234, 312, 289, 421, 378, 534, 612, 489, 623, 734, 812, 847]}
            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
            color="#3B82F6"
            height={140}
          />
        </div>

        {/* Revenue chart */}
        <div className="p-5 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(239,68,68,0.08)' }}>
          <h3 className="font-semibold font-display mb-4" style={{ color: '#F1F5F9' }}>Revenue (₦K)</h3>
          <BarChart
            data={[1200, 1850, 1420, 2340, 1980, 2870, 3210, 2450, 3120, 3680, 4120, 4568]}
            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
            color="#10B981"
            height={140}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Completion rates by course */}
        <div className="lg:col-span-2 p-5 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(239,68,68,0.08)' }}>
          <h3 className="font-semibold font-display mb-4" style={{ color: '#F1F5F9' }}>Course Performance</h3>
          <div className="space-y-3">
            {[
              { name: 'Python for AI', students: 3241, completion: 82, revenue: '₦15.9M', color: '#8B5CF6' },
              { name: 'React & TypeScript', students: 1876, completion: 75, revenue: '₦14.1M', color: '#3B82F6' },
              { name: 'Data Science with Python', students: 4521, completion: 79, revenue: '₦24.9M', color: '#06B6D4' },
              { name: 'Machine Learning', students: 2187, completion: 68, revenue: '₦14.2M', color: '#F59E0B' },
              { name: 'Node.js Backend', students: 2334, completion: 84, revenue: '₦14.0M', color: '#10B981' },
            ].map(({ name, students, completion, revenue, color }) => (
              <div key={name} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="truncate" style={{ color: '#94A3B8' }}>{name}</span>
                    <span style={{ color }}>{completion}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'rgba(59,130,246,0.08)' }}>
                    <div className="h-full rounded-full" style={{ width: `${completion}%`, background: color }} />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-semibold" style={{ color: '#10B981' }}>{revenue}</div>
                  <div className="text-xs" style={{ color: '#475569' }}>{students.toLocaleString()} students</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donut charts */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(239,68,68,0.08)' }}>
            <h3 className="font-semibold font-display mb-3 text-sm" style={{ color: '#F1F5F9' }}>Completion Rate</h3>
            <div className="flex items-center gap-4">
              <DonutChart value={78} total={100} color="#10B981" />
              <div className="text-sm" style={{ color: '#64748B' }}>78% of students complete their courses</div>
            </div>
          </div>
          <div className="p-5 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(239,68,68,0.08)' }}>
            <h3 className="font-semibold font-display mb-3 text-sm" style={{ color: '#F1F5F9' }}>AI Tutor Usage</h3>
            <div className="flex items-center gap-4">
              <DonutChart value={64} total={100} color="#8B5CF6" />
              <div className="text-sm" style={{ color: '#64748B' }}>64% of students use AI tutor weekly</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
