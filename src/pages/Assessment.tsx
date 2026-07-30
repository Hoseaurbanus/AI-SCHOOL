import { useState } from 'react'
import { Clock, ChevronRight, CheckCircle, Code2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const questions = [
  {
    id: 1, type: 'mcq',
    question: 'What is the output of the following code?\n\nfor i in range(3):\n    print(i * 2)',
    options: ['0 2 4', '0 1 2', '2 4 6', '1 2 3'],
    correct: 0,
  },
  {
    id: 2, type: 'mcq',
    question: 'Which of the following correctly creates a list comprehension of squares for numbers 1-5?',
    options: [
      '[x**2 for x in range(1, 6)]',
      '[x^2 for x in range(5)]',
      'list(x**2 for x in 1..5)',
      '{x**2 for x in range(1, 6)}',
    ],
    correct: 0,
  },
  {
    id: 3, type: 'mcq',
    question: 'What does the `break` statement do inside a loop?',
    options: [
      'Exits the entire loop immediately',
      'Skips the current iteration and continues',
      'Pauses the loop for 1 second',
      'Restarts the loop from the beginning',
    ],
    correct: 0,
  },
  {
    id: 4, type: 'code',
    question: 'Write a function `reverse_string(s)` that returns the reverse of a string without using [::-1].',
    options: [],
    correct: -1,
  },
]

export default function Assessment() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(number | string)[]>([])
  const [codeAnswer, setCodeAnswer] = useState('')
  const [timeLeft] = useState(25 * 60)
  const [submitted, setSubmitted] = useState(false)

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  const q = questions[current]
  const answer = answers[current]

  const next = () => {
    if (current < questions.length - 1) setCurrent(c => c + 1)
    else { setSubmitted(true); navigate('/results') }
  }

  const select = (i: number) => {
    const a = [...answers]
    a[current] = i
    setAnswers(a)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold font-display" style={{ color: '#F1F5F9' }}>Python Fundamentals Quiz</h1>
            <p className="text-sm" style={{ color: '#64748B' }}>Module 1 Assessment · {questions.length} questions</p>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-sm font-bold"
            style={{ background: timeLeft < 300 ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)', color: timeLeft < 300 ? '#EF4444' : '#3B82F6', border: `1px solid ${timeLeft < 300 ? 'rgba(239,68,68,0.25)' : 'rgba(59,130,246,0.25)'}` }}
          >
            <Clock size={15} />
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-2" style={{ color: '#64748B' }}>
            <span>Question {current + 1} of {questions.length}</span>
            <span>{answers.filter(a => a !== undefined).length} answered</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)' }}>
            <div className="h-full rounded-full gradient-blue-purple transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
          </div>
          <div className="flex gap-1.5 mt-2">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="h-1.5 rounded-full flex-1 transition-all"
                style={{ background: i === current ? '#3B82F6' : answers[i] !== undefined ? '#10B981' : 'rgba(59,130,246,0.1)' }}
              />
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="p-5 rounded-2xl mb-5" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.12)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: q.type === 'code' ? 'rgba(139,92,246,0.12)' : 'rgba(59,130,246,0.12)', color: q.type === 'code' ? '#8B5CF6' : '#3B82F6' }}>
              {q.type === 'code' ? 'Coding' : 'Multiple Choice'}
            </span>
          </div>
          <pre className="text-sm leading-relaxed whitespace-pre-wrap font-mono" style={{ color: '#F1F5F9' }}>
            {q.question}
          </pre>
        </div>

        {q.type === 'mcq' ? (
          <div className="space-y-3 mb-6">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => select(i)}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm text-left transition-all"
                style={{
                  background: answer === i ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.04)',
                  border: answer === i ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(59,130,246,0.1)',
                  color: answer === i ? '#3B82F6' : '#94A3B8',
                }}
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: answer === i ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.08)', color: answer === i ? '#3B82F6' : '#475569' }}
                >
                  {['A', 'B', 'C', 'D'][i]}
                </span>
                <span className="font-mono">{opt}</span>
                {answer === i && <CheckCircle size={15} className="ml-auto flex-shrink-0" style={{ color: '#3B82F6' }} />}
              </button>
            ))}
          </div>
        ) : (
          <div className="mb-6">
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
              <div className="flex items-center gap-2 px-4 py-2" style={{ background: '#0A0F1A' }}>
                <Code2 size={13} style={{ color: '#8B5CF6' }} />
                <span className="text-xs font-mono" style={{ color: '#475569' }}>Write your solution</span>
              </div>
              <textarea
                rows={8}
                value={codeAnswer}
                onChange={e => { setCodeAnswer(e.target.value); const a = [...answers]; a[current] = e.target.value; setAnswers(a) }}
                placeholder="def reverse_string(s):\n    # Your solution here\n    pass"
                className="w-full p-4 text-sm font-mono outline-none resize-none"
                style={{ background: '#060A12', color: '#F1F5F9', lineHeight: 1.6 }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => current > 0 && setCurrent(c => c - 1)}
            className="px-5 py-2.5 rounded-xl text-sm font-medium border disabled:opacity-30"
            style={{ borderColor: 'rgba(59,130,246,0.2)', color: '#64748B' }}
            disabled={current === 0}
          >
            ← Previous
          </button>
          <button
            onClick={next}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold gradient-blue-purple text-white hover:opacity-90 transition-all"
          >
            {current === questions.length - 1 ? 'Submit Assessment' : 'Next Question'}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
