import { Award, CheckCircle, Search, Download } from 'lucide-react'
import type { Page } from '../types'

interface Props { navigate: (p: Page) => void }

const certs = [
  { id: 'SFA-ML-2025-E0K-1847', student: 'Emeka Okafor', course: 'Machine Learning Fundamentals', date: '2025-06-15', score: 94, status: 'issued' },
  { id: 'SFA-PY-2025-A1W-2034', student: 'Adaeze Williams', course: 'React & TypeScript Mastery', date: '2025-07-01', score: 88, status: 'issued' },
  { id: 'SFA-DS-2025-B2A-3012', student: 'Babatunde Adewale', course: 'Data Science with Python', date: '2025-07-10', score: 91, status: 'issued' },
  { id: 'SFA-CY-2025-Y3A-4501', student: 'Yetunde Akinola', course: 'Cybersecurity Essentials', date: '2025-07-20', score: 79, status: 'pending' },
]

export default function AdminCertificates({ navigate }: Props) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: '#F1F5F9' }}>Certificate Management</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>{certs.length} certificates issued</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Issued', value: '1,247', color: '#F59E0B' },
          { label: 'This Month', value: '84', color: '#3B82F6' },
          { label: 'Pending', value: '12', color: '#F59E0B' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 rounded-xl text-center" style={{ background: '#0D1421', border: '1px solid rgba(239,68,68,0.08)' }}>
            <Award size={18} className="mx-auto mb-2" style={{ color }} />
            <div className="font-bold font-display" style={{ color }}>{value}</div>
            <div className="text-xs mt-0.5" style={{ color: '#64748B' }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#0D1421', border: '1px solid rgba(239,68,68,0.08)' }}>
        <table className="w-full">
          <thead>
            <tr className="border-b text-xs" style={{ borderColor: 'rgba(239,68,68,0.08)' }}>
              {['Certificate ID', 'Student', 'Course', 'Score', 'Date', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3 font-semibold" style={{ color: '#475569' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {certs.map(cert => (
              <tr key={cert.id} className="border-b" style={{ borderColor: 'rgba(239,68,68,0.04)' }}>
                <td className="px-5 py-4 text-xs font-mono" style={{ color: '#3B82F6' }}>{cert.id}</td>
                <td className="px-5 py-4 text-sm" style={{ color: '#F1F5F9' }}>{cert.student}</td>
                <td className="px-5 py-4 text-xs" style={{ color: '#94A3B8' }}>{cert.course}</td>
                <td className="px-5 py-4 text-sm font-semibold" style={{ color: cert.score >= 90 ? '#10B981' : cert.score >= 70 ? '#F59E0B' : '#EF4444' }}>{cert.score}/100</td>
                <td className="px-5 py-4 text-xs" style={{ color: '#64748B' }}>{cert.date}</td>
                <td className="px-5 py-4">
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: cert.status === 'issued' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: cert.status === 'issued' ? '#10B981' : '#F59E0B' }}>
                    {cert.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 text-xs" style={{ color: '#3B82F6' }}><CheckCircle size={12} /> Verify</button>
                    <button className="flex items-center gap-1 text-xs" style={{ color: '#64748B' }}><Download size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
