import { useState } from 'react'
import { CheckCircle, Lock, CreditCard, ArrowRight, Zap } from 'lucide-react'
import type { Page } from '../types'
import { courses } from '../data/mockData'

interface Props { navigate: (p: Page) => void }

const course = courses[0]
const methods = [
  { id: 'paystack', name: 'Paystack', desc: 'Pay with card via Paystack', icon: '💳' },
  { id: 'flutterwave', name: 'Flutterwave', desc: 'Pay with card via Flutterwave', icon: '⚡' },
  { id: 'bank', name: 'Bank Transfer', desc: 'Transfer to our bank account', icon: '🏦' },
]

export default function Checkout({ navigate }: Props) {
  const [method, setMethod] = useState('paystack')
  const [loading, setLoading] = useState(false)

  const pay = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('payment-success')
    }, 1500)
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg gradient-blue-purple flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold font-display" style={{ color: '#F1F5F9' }}>Smugflex<span className="gradient-text"> AI</span></span>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Payment form */}
          <div className="lg:col-span-3">
            <h1 className="text-2xl font-bold font-display mb-6" style={{ color: '#F1F5F9' }}>Complete Purchase</h1>

            <div className="space-y-3 mb-6">
              <h2 className="text-sm font-semibold" style={{ color: '#94A3B8' }}>PAYMENT METHOD</h2>
              {methods.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border transition-all"
                  style={{
                    background: method === m.id ? 'rgba(59,130,246,0.08)' : '#0D1421',
                    borderColor: method === m.id ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.1)',
                  }}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{m.name}</p>
                    <p className="text-xs" style={{ color: '#64748B' }}>{m.desc}</p>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center border-2 flex-shrink-0"
                    style={{ borderColor: method === m.id ? '#3B82F6' : '#475569' }}
                  >
                    {method === m.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#3B82F6' }} />}
                  </div>
                </button>
              ))}
            </div>

            {method === 'paystack' && (
              <div className="space-y-4 p-5 rounded-xl mb-6" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
                <h3 className="text-sm font-semibold" style={{ color: '#94A3B8' }}>CARD DETAILS</h3>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>Card Number</label>
                  <input type="text" placeholder="4242 4242 4242 4242" maxLength={19}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none font-mono"
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', color: '#F1F5F9' }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" maxLength={5}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none font-mono"
                      style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', color: '#F1F5F9' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748B' }}>CVV</label>
                    <input type="text" placeholder="•••" maxLength={4}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none font-mono"
                      style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', color: '#F1F5F9' }} />
                  </div>
                </div>
              </div>
            )}

            {method === 'bank' && (
              <div className="p-5 rounded-xl mb-6" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: '#94A3B8' }}>BANK DETAILS</h3>
                <div className="space-y-2 text-sm" style={{ color: '#94A3B8' }}>
                  <div className="flex justify-between"><span style={{ color: '#64748B' }}>Bank Name:</span><span>First Bank Nigeria</span></div>
                  <div className="flex justify-between"><span style={{ color: '#64748B' }}>Account Name:</span><span>Smugflex AI Academy Ltd</span></div>
                  <div className="flex justify-between"><span style={{ color: '#64748B' }}>Account Number:</span><span className="font-mono">3012345678</span></div>
                  <div className="flex justify-between"><span style={{ color: '#64748B' }}>Amount:</span><span className="gradient-text font-bold">₦{course.price.toLocaleString()}</span></div>
                </div>
                <p className="text-xs mt-3" style={{ color: '#475569' }}>After transfer, click "I've Paid" and upload proof. Access will be granted within 2 hours.</p>
              </div>
            )}

            <button
              onClick={pay}
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold gradient-blue-purple text-white flex items-center justify-center gap-2.5 hover:opacity-90 disabled:opacity-60 transition-all"
              style={{ boxShadow: '0 0 25px rgba(59,130,246,0.35)' }}
            >
              {loading
                ? <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Processing...</>
                : <><Lock size={16} /> Pay ₦{course.price.toLocaleString()} Securely <ArrowRight size={16} /></>
              }
            </button>

            <div className="flex items-center justify-center gap-2 mt-3 text-xs" style={{ color: '#475569' }}>
              <Lock size={12} />
              <span>256-bit SSL encryption · 7-day money-back guarantee</span>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 rounded-2xl overflow-hidden" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.15)' }}>
              <img src={course.image} alt={course.title} className="w-full h-36 object-cover" />
              <div className="p-5">
                <h3 className="font-semibold font-display mb-1" style={{ color: '#F1F5F9' }}>{course.title}</h3>
                <p className="text-xs mb-4" style={{ color: '#64748B' }}>{course.instructor} · {course.duration}</p>

                <div className="space-y-2 mb-4 text-sm" style={{ color: '#94A3B8' }}>
                  {['Lifetime course access', 'AI Tutor included', '6 projects', 'Verified certificate'].map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle size={13} style={{ color: '#10B981' }} />
                      {f}
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
                  <div className="flex justify-between text-sm mb-1.5" style={{ color: '#64748B' }}>
                    <span>Course price</span>
                    <span>₦{course.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3" style={{ color: '#10B981' }}>
                    <span>Discount (0%)</span>
                    <span>-₦0</span>
                  </div>
                  <div className="flex justify-between font-bold text-base">
                    <span style={{ color: '#F1F5F9' }}>Total</span>
                    <span className="gradient-text font-display">₦{course.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
