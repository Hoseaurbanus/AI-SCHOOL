import { useState } from 'react'
import { Brain, ArrowRight, CheckCircle, Zap, Sparkles } from 'lucide-react'
import type { Page } from '../types'

interface Props { navigate: (p: Page) => void }

const steps = [
  {
    q: 'What is your main learning goal?',
    options: ['Get a tech job', 'Build a side project', 'Upskill in current role', 'Learn for fun / exploration'],
  },
  {
    q: 'What is your current skill level?',
    options: ['Complete beginner', 'Some basics (followed tutorials)', 'Intermediate (built small projects)', 'Advanced (professional experience)'],
  },
  {
    q: 'What learning path interests you most?',
    options: ['Artificial Intelligence & ML', 'Web Development', 'Data Science & Analytics', 'Not sure — recommend for me'],
  },
  {
    q: 'What is your career objective?',
    options: ['AI/ML Engineer', 'Full-Stack Developer', 'Data Scientist', 'Product Manager / Tech Lead'],
  },
]

export default function Onboarding({ navigate }: Props) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const next = () => {
    if (!selected) return
    const newAnswers = [...answers, selected]
    setAnswers(newAnswers)
    setSelected(null)
    if (step < steps.length - 1) setStep(s => s + 1)
    else setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}
          >
            <Brain size={28} style={{ color: '#8B5CF6' }} />
          </div>
          <h2 className="text-2xl font-bold font-display mb-3" style={{ color: '#F1F5F9' }}>
            Your personalized learning plan is ready!
          </h2>
          <p className="mb-8" style={{ color: '#64748B' }}>
            Based on your goals, we have curated the perfect learning path for you.
          </p>

          <div className="rounded-2xl p-5 mb-6 text-left space-y-3" style={{ background: '#0D1421', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} style={{ color: '#8B5CF6' }} />
              <span className="font-semibold text-sm" style={{ color: '#8B5CF6' }}>AI Recommended Plan</span>
            </div>
            {[
              { title: 'Python for AI', weeks: 'Weeks 1–12', reason: 'Foundation for your AI Engineer goal' },
              { title: 'Machine Learning Fundamentals', weeks: 'Weeks 13–28', reason: 'Core ML skills for your career path' },
              { title: 'Deep Learning & Neural Networks', weeks: 'Weeks 29–48', reason: 'Advanced skills to stand out' },
            ].map((course, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.06)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}>
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{course.title}</p>
                  <p className="text-xs" style={{ color: '#3B82F6' }}>{course.weeks}</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>{course.reason}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('student-dashboard')}
            className="w-full py-4 rounded-xl font-semibold gradient-blue-purple text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            style={{ boxShadow: '0 0 25px rgba(59,130,246,0.35)' }}
          >
            Start My Journey <ArrowRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  const current = steps[step]
  const progress = ((step) / steps.length) * 100

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg gradient-blue-purple flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold font-display" style={{ color: '#F1F5F9' }}>Smugflex<span className="gradient-text"> AI</span></span>
        </div>

        {/* Progress */}
        <div className="mb-2 flex justify-between text-xs" style={{ color: '#64748B' }}>
          <span>Setting up your learning profile</span>
          <span>{step + 1}/{steps.length}</span>
        </div>
        <div className="h-1 rounded-full mb-8" style={{ background: 'rgba(59,130,246,0.1)' }}>
          <div className="h-full rounded-full gradient-blue-purple transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* AI intro bubble */}
        <div className="flex items-start gap-3 mb-6 p-4 rounded-2xl" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(139,92,246,0.2)' }}>
            <Brain size={18} style={{ color: '#8B5CF6' }} />
          </div>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: '#8B5CF6' }}>Smugflex AI</p>
            <p className="text-sm" style={{ color: '#94A3B8' }}>
              Hi there! I am your personal AI tutor. Let me ask you a few quick questions to build your perfect learning path. This takes about 30 seconds.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold font-display mb-6" style={{ color: '#F1F5F9' }}>{current.q}</h2>

        <div className="space-y-3 mb-8">
          {current.options.map(opt => (
            <button
              key={opt}
              onClick={() => setSelected(opt)}
              className="w-full flex items-center justify-between px-4 py-4 rounded-xl text-sm font-medium text-left transition-all"
              style={{
                background: selected === opt ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.04)',
                border: selected === opt ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(59,130,246,0.12)',
                color: selected === opt ? '#3B82F6' : '#94A3B8',
              }}
            >
              <span>{opt}</span>
              {selected === opt && <CheckCircle size={16} style={{ color: '#3B82F6' }} />}
            </button>
          ))}
        </div>

        <button
          onClick={next}
          disabled={!selected}
          className="w-full py-4 rounded-xl font-semibold text-sm gradient-blue-purple text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-40"
        >
          {step === steps.length - 1 ? 'Generate My Learning Plan' : 'Continue'}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
