import { CheckCircle, XCircle, ArrowRight, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PaymentStatus({ status }: { status: 'success' | 'failed' }) {
  const navigate = useNavigate()
  const ok = status === 'success'

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: ok ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', border: `2px solid ${ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}
        >
          {ok
            ? <CheckCircle size={36} style={{ color: '#10B981' }} />
            : <XCircle size={36} style={{ color: '#EF4444' }} />
          }
        </div>

        <h1 className="text-3xl font-bold font-display mb-3" style={{ color: '#F1F5F9' }}>
          {ok ? 'Payment Successful!' : 'Payment Failed'}
        </h1>

        <p className="mb-6" style={{ color: '#64748B' }}>
          {ok
            ? 'Congratulations! Your enrollment is confirmed. Your AI tutor is ready for you.'
            : 'Something went wrong with your payment. Please try again or use a different payment method.'
          }
        </p>

        {ok && (
          <div className="p-4 rounded-xl mb-6 text-left space-y-2" style={{ background: '#0D1421', border: '1px solid rgba(16,185,129,0.15)' }}>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#64748B' }}>Course</span>
              <span style={{ color: '#F1F5F9' }}>Python for AI</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#64748B' }}>Amount Paid</span>
              <span className="gradient-text font-semibold">₦49,000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#64748B' }}>Transaction ID</span>
              <span className="font-mono text-xs" style={{ color: '#3B82F6' }}>TXN-001847-2025</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate(ok ? '/dashboard' : '/checkout')}
            className="w-full py-4 rounded-xl font-semibold gradient-blue-purple text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            style={{ boxShadow: '0 0 25px rgba(59,130,246,0.3)' }}
          >
            {ok ? <>Go to Dashboard <ArrowRight size={18} /></> : <><RefreshCw size={18} /> Try Again</>}
          </button>
          <button
            onClick={() => navigate('/marketplace')}
            className="w-full py-3 rounded-xl font-semibold text-sm border"
            style={{ borderColor: 'rgba(59,130,246,0.2)', color: '#94A3B8' }}
          >
            Browse More Courses
          </button>
        </div>
      </div>
    </div>
  )
}
