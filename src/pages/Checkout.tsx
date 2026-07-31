import { useState } from 'react';
import { CheckCircle, Lock, CreditCard, ArrowRight, Zap, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCourse } from '../hooks/useCourses';
import { useCartStore } from '../stores/cartStore';

const methods = [
  { id: 'paystack', name: 'Paystack', desc: 'Pay with card via Paystack', icon: '💳' },
  { id: 'flutterwave', name: 'Flutterwave', desc: 'Pay with card via Flutterwave', icon: '⚡' },
  { id: 'bank', name: 'Bank Transfer', desc: 'Transfer to our bank account', icon: '🏦' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = (location.state as { courseId?: string })?.courseId;

  const [method, setMethod] = useState('paystack');
  const [loading, setLoading] = useState(false);

  const { data } = useCourse(courseId || '');
  const course = data?.data;
  const removeItem = useCartStore((s) => s.removeItem);

  const pay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      removeItem(courseId || '');
      navigate('/payment-success');
    }, 1500);
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060A12' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#F1F5F9' }}>No course selected</h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: '#060A12' }}>
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg gradient-blue-purple flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold font-display" style={{ color: '#F1F5F9' }}>
            Smugflex<span className="gradient-text"> AI</span>
          </span>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Payment form */}
          <div className="lg:col-span-3">
            <h1 className="text-2xl font-bold font-display mb-6" style={{ color: '#F1F5F9' }}>
              Complete Purchase
            </h1>

            <div className="space-y-3 mb-6">
              <h2 className="text-sm font-semibold" style={{ color: '#94A3B8' }}>PAYMENT METHOD</h2>
              {methods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border transition-all"
                  style={{
                    background: method === m.id ? 'rgba(59,130,246,0.08)' : '#0D1421',
                    borderColor: method === m.id ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.1)',
                  }}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-sm" style={{ color: '#F1F5F9' }}>{m.name}</div>
                    <div className="text-xs" style={{ color: '#64748B' }}>{m.desc}</div>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    style={{
                      borderColor: method === m.id ? '#3B82F6' : '#475569',
                      background: method === m.id ? '#3B82F6' : 'transparent',
                    }}
                  >
                    {method === m.id && <CheckCircle size={12} className="text-white" />}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={pay}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm gradient-blue-purple text-white flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Lock size={16} />
                  Pay ₦{course.price.toLocaleString()}
                </>
              )}
            </button>

            <p className="text-center text-xs mt-4" style={{ color: '#64748B' }}>
              🔒 Your payment information is encrypted and secure
            </p>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl p-5 sticky top-20"
              style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.15)' }}
            >
              <h3 className="font-semibold text-sm mb-4" style={{ color: '#F1F5F9' }}>ORDER SUMMARY</h3>

              <div className="flex gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm line-clamp-2" style={{ color: '#F1F5F9' }}>
                    {course.title}
                  </h4>
                  <p className="text-xs mt-1" style={{ color: '#64748B' }}>{course.instructor}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: '#94A3B8' }}>Course Price</span>
                  <span style={{ color: '#F1F5F9' }}>₦{course.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#94A3B8' }}>Processing Fee</span>
                  <span style={{ color: '#10B981' }}>Free</span>
                </div>
                <div
                  className="flex justify-between pt-3 font-semibold"
                  style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}
                >
                  <span style={{ color: '#F1F5F9' }}>Total</span>
                  <span className="gradient-text text-lg">₦{course.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
