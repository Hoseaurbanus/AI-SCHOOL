import { CheckCircle, XCircle, Brain, ArrowRight, TrendingUp, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const breakdown = [
  { topic: 'Python Loops', score: 100, total: 30 },
  { topic: 'List Comprehensions', score: 30, total: 30 },
  { topic: 'Break / Continue', score: 20, total: 20 },
  { topic: 'Coding Challenge', score: 12, total: 20 },
]

export default function Results() {
  const navigate = useNavigate()
  const totalScore = breakdown.reduce((a, b) => a + b.score, 0)
  const maxScore = breakdown.reduce((a, b) => a + b.total, 0)
  const pct = Math.round((totalScore / maxScore) * 100)
  const passed = pct >= 70

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold font-display mb-6" style={{ color: '#F1F5F9' }}>Assessment Results</h1>

        {/* Score card */}
        <div
          className="p-6 rounded-2xl text-center mb-6"
          style={{ background: passed ? 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(59,130,246,0.06))' : 'rgba(239,68,68,0.06)', border: `1px solid ${passed ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: passed ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', border: `2px solid ${passed ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
            {passed
              ? <CheckCircle size={36} style={{ color: '#10B981' }} />
              : <XCircle size={36} style={{ color: '#EF4444' }} />
            }
          </div>
          <div className="text-5xl font-bold font-display gradient-text mb-1">{pct}%</div>
          <p className="text-sm font-semibold mb-1" style={{ color: passed ? '#10B981' : '#EF4444' }}>{passed ? 'Passed' : 'Not Passed'}</p>
          <p className="text-sm" style={{ color: '#64748B' }}>{totalScore}/{maxScore} points · Python Fundamentals Quiz</p>
        </div>

        {/* Breakdown */}
        <div className="p-5 rounded-2xl mb-5" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
          <h2 className="font-semibold mb-4" style={{ color: '#F1F5F9' }}>Score Breakdown</h2>
          <div className="space-y-3">
            {breakdown.map(({ topic, score, total }) => {
              const p = Math.round((score / total) * 100)
              return (
                <div key={topic}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: '#94A3B8' }}>{topic}</span>
                    <span style={{ color: p === 100 ? '#10B981' : p >= 60 ? '#F59E0B' : '#EF4444' }}>{score}/{total}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'rgba(59,130,246,0.08)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${p}%`, background: p === 100 ? '#10B981' : p >= 60 ? '#F59E0B' : '#EF4444' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="p-5 rounded-2xl mb-5" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Brain size={16} style={{ color: '#8B5CF6' }} />
            <span className="font-semibold text-sm" style={{ color: '#8B5CF6' }}>AI Recommendations</span>
          </div>
          <div className="space-y-2 text-sm" style={{ color: '#94A3B8' }}>
            <p>✅ <strong style={{ color: '#F1F5F9' }}>Strength:</strong> Excellent understanding of loops and control flow. Keep it up!</p>
            <p>⚠️ <strong style={{ color: '#F1F5F9' }}>Improve:</strong> Your coding challenge solution works but could be more Pythonic. Review string methods.</p>
            <p>📚 <strong style={{ color: '#F1F5F9' }}>Next steps:</strong> You are ready for Module 2 — Functions & OOP. I recommend starting with the functions lesson before tackling OOP.</p>
          </div>
          <button onClick={() => navigate('/ai-tutor')} className="mt-3 flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#8B5CF6' }}>
            Ask AI to explain mistakes <ArrowRight size={12} />
          </button>
        </div>

        <div className="flex gap-3">
          <button onClick={() => navigate('/courses/1/learn')} className="flex-1 py-3 rounded-xl font-semibold text-sm border transition-all" style={{ borderColor: 'rgba(59,130,246,0.2)', color: '#94A3B8' }}>
            Continue Course
          </button>
          {passed && (
            <button onClick={() => navigate('/certificates')} className="flex-1 py-3 rounded-xl font-semibold text-sm gradient-blue-purple text-white flex items-center justify-center gap-2 hover:opacity-90">
              <Award size={16} /> View Certificate
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
