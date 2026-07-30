import { Download, Share2, Award, CheckCircle, QrCode } from 'lucide-react'
import type { Page } from '../types'

interface Props { navigate: (p: Page) => void }

export default function Certificate({ navigate }: Props) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold font-display mb-6" style={{ color: '#F1F5F9' }}>My Certificates</h1>

        {/* Certificate preview */}
        <div
          className="relative rounded-2xl overflow-hidden mb-6 p-8 lg:p-12 text-center"
          style={{
            background: 'linear-gradient(135deg, #0A0F1A 0%, #141E30 50%, #0A0F1A 100%)',
            border: '1px solid rgba(99,102,241,0.3)',
            boxShadow: '0 0 60px rgba(99,102,241,0.1), inset 0 0 60px rgba(59,130,246,0.03)',
          }}
        >
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2" style={{ borderColor: 'rgba(99,102,241,0.4)' }} />
          <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2" style={{ borderColor: 'rgba(99,102,241,0.4)' }} />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2" style={{ borderColor: 'rgba(99,102,241,0.4)' }} />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2" style={{ borderColor: 'rgba(99,102,241,0.4)' }} />

          {/* Background glow */}
          <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.4), transparent)' }} />

          <div className="relative">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-blue-purple flex items-center justify-center">
                <Award size={20} className="text-white" />
              </div>
              <span className="text-lg font-bold font-display" style={{ color: '#F1F5F9' }}>Smugflex AI Academy</span>
            </div>

            <p className="text-sm uppercase tracking-[0.3em] mb-3" style={{ color: '#64748B' }}>Certificate of Completion</p>
            <p className="text-base mb-2" style={{ color: '#94A3B8' }}>This certifies that</p>
            <h2 className="text-4xl font-bold font-display mb-4 gradient-text">Emeka Okafor</h2>
            <p className="text-base mb-2" style={{ color: '#94A3B8' }}>has successfully completed</p>
            <h3 className="text-2xl font-bold font-display mb-2" style={{ color: '#F1F5F9' }}>Machine Learning Fundamentals</h3>
            <p className="text-sm mb-6" style={{ color: '#64748B' }}>with a final score of 94/100 · June 15, 2025</p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* QR code placeholder */}
              <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <QrCode size={32} style={{ color: '#3B82F6' }} />
              </div>
              <div className="text-left">
                <p className="text-xs" style={{ color: '#64748B' }}>Verification Code</p>
                <p className="text-sm font-mono font-semibold" style={{ color: '#3B82F6' }}>SFA-ML-2025-E0K-1847</p>
                <p className="text-xs" style={{ color: '#475569' }}>blockchain verified · scan to verify</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-6">
              <CheckCircle size={14} style={{ color: '#10B981' }} />
              <span className="text-xs" style={{ color: '#10B981' }}>Blockchain Verified · Issued by Smugflex AI Academy</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold gradient-blue-purple text-white hover:opacity-90 transition-all" style={{ boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}>
            <Download size={16} /> Download PDF
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all" style={{ borderColor: 'rgba(59,130,246,0.2)', color: '#94A3B8' }}>
            <Share2 size={16} /> Share on LinkedIn
          </button>
        </div>

        {/* All certificates */}
        <h2 className="text-base font-bold font-display mb-4" style={{ color: '#F1F5F9' }}>All Certificates (1)</h2>
        <div className="rounded-2xl p-4" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)' }}>
              <Award size={24} style={{ color: '#F59E0B' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold font-display" style={{ color: '#F1F5F9' }}>Machine Learning Fundamentals</p>
              <p className="text-xs" style={{ color: '#64748B' }}>Issued June 15, 2025 · Score: 94/100</p>
            </div>
            <button className="text-xs font-medium" style={{ color: '#3B82F6' }}>View</button>
          </div>
        </div>
      </div>
    </div>
  )
}
