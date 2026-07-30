import { useState, useRef, useEffect } from 'react'
import { Brain, Send, Upload, Sparkles, Code2, BookOpen, X, Paperclip } from 'lucide-react'
import type { Page } from '../types'

interface Props { navigate: (p: Page) => void }

type Message = { role: 'user' | 'ai'; text: string; code?: string; time: string }

const suggestions = [
  'Explain recursion with a real example',
  'Why is my for loop infinite?',
  'Difference between list and tuple in Python',
  'How does gradient descent work?',
  'Explain overfitting vs underfitting',
]

const aiResponses: Record<string, { text: string; code?: string }> = {
  default: {
    text: "That's a great question! Let me break this down clearly for you. I'll explain the core concept, then give you a practical example you can run right away.",
    code: `# Here's a working example:\ndef example_function(x):\n    """Demonstrates the concept clearly"""\n    result = x * 2  # simple operation\n    return result\n\n# Test it:\nprint(example_function(5))  # Output: 10`,
  },
  recursion: {
    text: "Recursion is when a function calls itself to solve a smaller version of the same problem. Think of it like Russian nesting dolls — each doll contains a smaller version of itself.\n\nKey rule: every recursive function needs a **base case** that stops the recursion, otherwise it runs forever.",
    code: `def factorial(n):\n    # Base case: factorial of 0 or 1 is 1\n    if n <= 1:\n        return 1\n    # Recursive case: n! = n × (n-1)!\n    return n * factorial(n - 1)\n\nprint(factorial(5))   # 5×4×3×2×1 = 120\nprint(factorial(10))  # 3628800`,
  },
  gradient: {
    text: "Gradient descent is the core optimization algorithm behind most machine learning models. It works like finding the bottom of a valley while blindfolded — you feel the slope beneath your feet and take a small step downhill.\n\nMathematically: we compute the **gradient** (direction of steepest increase) of the loss function, then move in the **opposite** direction by a small amount (the learning rate).",
    code: `import numpy as np\n\ndef gradient_descent(X, y, lr=0.01, epochs=100):\n    m, n = X.shape\n    theta = np.zeros(n)  # Initialize weights\n    \n    for epoch in range(epochs):\n        predictions = X @ theta\n        errors = predictions - y\n        \n        # Compute gradient\n        gradient = (1/m) * X.T @ errors\n        \n        # Update weights\n        theta -= lr * gradient\n    \n    return theta`,
  },
}

export default function AITutor({ navigate }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: "Hello! I'm your personal AI tutor for Smugflex Academy. I know your entire course curriculum, your progress, and your learning style.\n\nI can help you understand concepts, debug code, suggest next steps, and quiz you on topics. What would you like to explore today?",
      time: '10:24',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [memory, setMemory] = useState(['Python for AI — Module 1', 'Struggled with loops', '12-day learning streak'])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = (text?: string) => {
    const msg = text || input.trim()
    if (!msg) return

    const now = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
    setMessages(p => [...p, { role: 'user', text: msg, time: now }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const key = msg.toLowerCase().includes('recursion') ? 'recursion'
        : msg.toLowerCase().includes('gradient') ? 'gradient'
        : 'default'
      const resp = aiResponses[key]
      setMessages(p => [...p, { role: 'ai', text: resp.text, code: resp.code, time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }) }])
      setIsTyping(false)
    }, 1400)
  }

  return (
    <div className="h-full flex" style={{ background: '#060A12' }}>
      {/* Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r"
        style={{ background: '#0D1421', borderColor: 'rgba(139,92,246,0.15)' }}
      >
        <div className="p-4 border-b" style={{ borderColor: 'rgba(139,92,246,0.15)' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
              <Brain size={18} style={{ color: '#8B5CF6' }} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: '#F1F5F9' }}>AI Tutor</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: '#10B981' }} />
                <span className="text-xs" style={{ color: '#10B981' }}>Online</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-b" style={{ borderColor: 'rgba(139,92,246,0.1)' }}>
          <p className="text-xs font-semibold mb-2" style={{ color: '#475569' }}>AI MEMORY</p>
          <div className="space-y-1.5">
            {memory.map((m, i) => (
              <div key={i} className="flex items-center justify-between px-2.5 py-2 rounded-lg text-xs" style={{ background: 'rgba(139,92,246,0.06)' }}>
                <span style={{ color: '#94A3B8' }}>{m}</span>
                <button onClick={() => setMemory(prev => prev.filter((_, j) => j !== i))} style={{ color: '#475569' }}><X size={10} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs font-semibold mb-2" style={{ color: '#475569' }}>QUICK TOPICS</p>
          <div className="space-y-1.5">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className="w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all"
                style={{ color: '#64748B', background: 'transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.08)'; (e.currentTarget as HTMLElement).style.color = '#94A3B8' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#64748B' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-b flex-shrink-0"
          style={{ background: '#0D1421', borderColor: 'rgba(139,92,246,0.15)' }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
            <Brain size={18} style={{ color: '#8B5CF6' }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: '#F1F5F9' }}>Smugflex AI Tutor</p>
            <p className="text-xs" style={{ color: '#64748B' }}>Powered by GPT-4 · Trained on your course curriculum</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: '#10B981' }} />
              Context-aware
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-in`}>
              {msg.role === 'ai' && (
                <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
                  <Brain size={16} style={{ color: '#8B5CF6' }} />
                </div>
              )}
              {msg.role === 'user' && (
                <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format" alt="You" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="max-w-[78%]">
                <div
                  className="px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                  style={{
                    background: msg.role === 'ai' ? '#0D1421' : 'rgba(59,130,246,0.15)',
                    border: msg.role === 'ai' ? '1px solid rgba(139,92,246,0.15)' : '1px solid rgba(59,130,246,0.25)',
                    color: '#94A3B8',
                  }}
                >
                  {msg.text}
                </div>
                {msg.code && (
                  <div className="mt-2 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
                    <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#0A0F1A' }}>
                      <Code2 size={12} style={{ color: '#3B82F6' }} />
                      <span className="text-xs font-mono" style={{ color: '#475569' }}>Python</span>
                      <button className="ml-auto text-xs" style={{ color: '#3B82F6' }}>Copy</button>
                    </div>
                    <pre className="p-3 text-xs font-mono overflow-x-auto" style={{ background: '#060A12', color: '#F1F5F9', lineHeight: 1.6 }}>
                      {msg.code}
                    </pre>
                  </div>
                )}
                <p className="text-xs mt-1 px-1" style={{ color: '#475569' }}>{msg.time}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
                <Brain size={16} style={{ color: '#8B5CF6' }} />
              </div>
              <div className="px-4 py-3 rounded-2xl flex items-center gap-1" style={{ background: '#0D1421', border: '1px solid rgba(139,92,246,0.15)' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} className={`w-2 h-2 rounded-full typing-dot`} style={{ background: '#8B5CF6' }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion chips */}
        <div className="px-4 sm:px-6 pb-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {suggestions.slice(0, 3).map(s => (
            <button
              key={s}
              onClick={() => send(s)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{ background: 'rgba(139,92,246,0.08)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.2)' }}
            >
              <Sparkles size={10} /> {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div
          className="px-4 sm:px-6 py-4 border-t flex-shrink-0"
          style={{ background: '#0D1421', borderColor: 'rgba(139,92,246,0.15)' }}
        >
          <div
            className="flex items-end gap-3 px-4 py-3 rounded-2xl"
            style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)' }}
          >
            <button className="mb-0.5 flex-shrink-0" style={{ color: '#475569' }}>
              <Paperclip size={18} />
            </button>
            <textarea
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Ask anything about your course..."
              className="flex-1 bg-transparent text-sm outline-none resize-none"
              style={{ color: '#F1F5F9', maxHeight: '120px' }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 hover:opacity-90"
              style={{ background: 'rgba(139,92,246,0.8)', color: '#fff', boxShadow: '0 0 15px rgba(139,92,246,0.3)' }}
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-xs text-center mt-2" style={{ color: '#475569' }}>
            AI can make mistakes. Verify important information from official docs.
          </p>
        </div>
      </div>
    </div>
  )
}
