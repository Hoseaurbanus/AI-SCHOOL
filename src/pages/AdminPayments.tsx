import { useState } from 'react'
import { Search, Download, DollarSign } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { recentTransactions } from '../data/mockData'

export default function AdminPayments() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = recentTransactions.filter(tx => {
    const matchSearch = tx.studentName.toLowerCase().includes(search.toLowerCase()) || tx.id.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || tx.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: '#F1F5F9' }}>Payment Management</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>Track transactions and revenue</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.15)' }}>
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Revenue', value: '₦4.57M', color: '#10B981' },
          { label: 'This Month', value: '₦2.3M', color: '#3B82F6' },
          { label: 'Pending', value: '₦85K', color: '#F59E0B' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 rounded-xl text-center" style={{ background: '#0D1421', border: '1px solid rgba(239,68,68,0.08)' }}>
            <DollarSign size={18} className="mx-auto mb-2" style={{ color }} />
            <div className="font-bold font-display" style={{ color }}>{value}</div>
            <div className="text-xs mt-0.5" style={{ color: '#64748B' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: '#0D1421', border: '1px solid rgba(239,68,68,0.1)', width: '240px' }}>
          <Search size={15} style={{ color: '#475569' }} />
          <input type="text" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm outline-none flex-1" style={{ color: '#F1F5F9' }} />
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(239,68,68,0.05)' }}>
          {['all', 'success', 'pending', 'failed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all" style={{ background: filter === f ? 'rgba(239,68,68,0.15)' : 'transparent', color: filter === f ? '#EF4444' : '#64748B' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#0D1421', border: '1px solid rgba(239,68,68,0.08)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs" style={{ borderColor: 'rgba(239,68,68,0.08)' }}>
                {['Transaction ID', 'Student', 'Course', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-semibold" style={{ color: '#475569' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(tx => (
                <tr key={tx.id} className="border-b" style={{ borderColor: 'rgba(239,68,68,0.04)' }}>
                  <td className="px-5 py-3.5 text-xs font-mono" style={{ color: '#3B82F6' }}>{tx.id}</td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: '#F1F5F9' }}>{tx.studentName}</td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: '#94A3B8' }}>{tx.courseName}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: '#10B981' }}>₦{tx.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: tx.status === 'success' ? 'rgba(16,185,129,0.1)' : tx.status === 'pending' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', color: tx.status === 'success' ? '#10B981' : tx.status === 'pending' ? '#F59E0B' : '#EF4444' }}>
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
