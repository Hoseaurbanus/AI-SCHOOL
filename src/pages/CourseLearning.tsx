import { useState } from 'react'
import {
  Play, CheckCircle, ChevronDown, Brain, Code2, FileText, BookOpen,
  Target, MessageSquare, ArrowRight, X, Maximize2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { curriculum, courses } from '../data/mockData'

export default function CourseLearning() {
  const navigate = useNavigate()
  const [openModule, setOpenModule] = useState<number | null>(0)
  const [tab, setTab] = useState<'lesson' | 'notes' | 'resources'>('lesson')
  const [aiMessage, setAiMessage] = useState('')
  const [aiOpen, setAiOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Hi! I am your AI tutor for this lesson. Ask me anything about Python loops or this lesson\'s content.' },
  ])

  const sendMessage = () => {
    if (!aiMessage.trim()) return
    const userMsg = aiMessage
    setAiMessage('')
    setChatMessages(p => [
      ...p,
      { role: 'user', text: userMsg },
      { role: 'ai', text: 'Great question! In Python, ' + (userMsg.toLowerCase().includes('for') ? 'for loops iterate over sequences — lists, ranges, strings, dicts. The syntax is: for item in iterable. The range() function is your best friend here.' : 'that is a fundamental concept. Let me break it down step by step with an example...') },
    ])
  }

  const course = courses[0]

  return (
    <div className="h-full flex flex-col" style={{ background: '#060A12' }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0 border-b"
        style={{ background: '#0D1421', borderColor: 'rgba(59,130,246,0.1)' }}
      >
        <div className="min-w-0 flex-1 mr-4">
          <p className="text-xs" style={{ color: '#64748B' }}>{course.title}</p>
          <p className="text-sm font-semibold truncate font-display" style={{ color: '#F1F5F9' }}>
            Loops: for and while
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-1.5 w-24 rounded-full" style={{ background: 'rgba(59,130,246,0.12)' }}>
              <div className="h-full rounded-full" style={{ width: '35%', background: '#3B82F6' }} />
            </div>
            <span className="text-xs" style={{ color: '#64748B' }}>35%</span>
          </div>
          <button
            onClick={() => setAiOpen(!aiOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6' }}
          >
            <Brain size={14} /> AI Tutor
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Sidebar curriculum */}
        <aside
          className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r overflow-y-auto"
          style={{ background: '#0D1421', borderColor: 'rgba(59,130,246,0.1)' }}
        >
          <div className="p-3">
            <p className="text-xs font-semibold uppercase tracking-wider px-2 py-2" style={{ color: '#475569' }}>Curriculum</p>
            {curriculum.map((mod, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenModule(openModule === i ? null : i)}
                  className="w-full flex items-center justify-between px-2 py-2.5 rounded-lg text-xs font-medium"
                  style={{ color: '#94A3B8' }}
                >
                  <span className="text-left truncate">{mod.module.replace('Module ', 'M')}</span>
                  <ChevronDown size={12} style={{ transform: openModule === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                </button>
                {openModule === i && (
                  <div className="ml-2">
                    {mod.lessons.map((lesson, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs cursor-pointer"
                        style={{
                          background: i === 0 && j === 3 ? 'rgba(59,130,246,0.1)' : 'transparent',
                          color: i === 0 && j === 3 ? '#3B82F6' : lesson.completed ? '#475569' : '#94A3B8',
                        }}
                      >
                        {lesson.completed
                          ? <CheckCircle size={12} style={{ color: '#10B981', flexShrink: 0 }} />
                          : lesson.type === 'video'
                          ? <Play size={12} style={{ color: '#64748B', flexShrink: 0 }} />
                          : lesson.type === 'exercise'
                          ? <Target size={12} style={{ color: '#F59E0B', flexShrink: 0 }} />
                          : <Code2 size={12} style={{ color: '#8B5CF6', flexShrink: 0 }} />
                        }
                        <span className="truncate">{lesson.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Video area */}
          <div
            className="relative flex-shrink-0"
            style={{ background: '#000', aspectRatio: '16/9', maxHeight: '50vh' }}
          >
            <img
              src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=675&fit=crop&auto=format"
              alt="Lesson"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(59,130,246,0.9)', boxShadow: '0 0 30px rgba(59,130,246,0.5)' }}
              >
                <Play size={24} className="text-white ml-1" />
              </button>
            </div>
            <div className="absolute bottom-3 left-3 text-xs px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,0.7)', color: '#94A3B8' }}>
              22:00 / 22:00
            </div>
            <button
              className="absolute top-3 right-3 p-1.5 rounded-lg"
              style={{ background: 'rgba(0,0,0,0.5)', color: '#94A3B8' }}
            >
              <Maximize2 size={14} />
            </button>
          </div>

          {/* Tabs + content */}
          <div className="flex-1 overflow-y-auto">
            <div className="border-b flex gap-4 px-5" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
              {(['lesson', 'notes', 'resources'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="py-3 text-xs font-medium capitalize border-b-2 transition-all"
                  style={{ borderColor: tab === t ? '#3B82F6' : 'transparent', color: tab === t ? '#3B82F6' : '#64748B' }}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="p-5">
              {tab === 'lesson' && (
                <div className="space-y-5 max-w-2xl">
                  <h2 className="text-xl font-bold font-display" style={{ color: '#F1F5F9' }}>Loops: for and while</h2>
                  <p style={{ color: '#94A3B8', lineHeight: 1.7 }}>
                    In this lesson, you will learn how to use Python's two loop constructs to iterate over data and repeat operations. Loops are fundamental to writing efficient, non-repetitive code.
                  </p>

                  <div className="rounded-xl overflow-hidden" style={{ background: '#0A0F1A', border: '1px solid rgba(59,130,246,0.15)' }}>
                    <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ background: '#0D1421', borderColor: 'rgba(59,130,246,0.1)' }}>
                      <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ background: '#EF4444' }} /><div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F59E0B' }} /><div className="w-2.5 h-2.5 rounded-full" style={{ background: '#10B981' }} /></div>
                      <span className="text-xs font-mono" style={{ color: '#475569' }}>example.py</span>
                    </div>
                    <pre className="p-4 text-sm overflow-x-auto font-mono" style={{ color: '#F1F5F9', lineHeight: 1.6 }}>
{`# for loop — iterating over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I love {fruit}!")

# for loop with range()
for i in range(5):
    print(f"Count: {i}")

# while loop
count = 0
while count < 5:
    print(f"Count is: {count}")
    count += 1  # always update to avoid infinite loops`}
                    </pre>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate('/coding-lab')}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold gradient-blue-purple text-white hover:opacity-90"
                    >
                      <Code2 size={16} /> Practice in Lab
                    </button>
                    <button
                      onClick={() => navigate('/ai-tutor')}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border"
                      style={{ borderColor: 'rgba(139,92,246,0.3)', color: '#8B5CF6' }}
                    >
                      <Brain size={16} /> Ask AI Tutor
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'rgba(59,130,246,0.08)' }}>
                    <button className="text-sm font-medium" style={{ color: '#64748B' }}>← Previous lesson</button>
                    <button
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold gradient-blue-purple text-white hover:opacity-90"
                    >
                      Next Lesson <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {tab === 'notes' && (
                <div className="max-w-2xl">
                  <textarea
                    className="w-full h-48 p-4 rounded-xl text-sm outline-none resize-none font-mono"
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', color: '#94A3B8' }}
                    placeholder="Take notes here... They will be saved automatically."
                  />
                  <p className="text-xs mt-2" style={{ color: '#475569' }}>Notes are auto-saved to your profile</p>
                </div>
              )}

              {tab === 'resources' && (
                <div className="max-w-2xl space-y-3">
                  {[
                    { name: 'Python Loops Cheat Sheet.pdf', size: '128 KB', type: 'PDF' },
                    { name: 'Exercise Files.zip', size: '2.4 MB', type: 'ZIP' },
                    { name: 'Python Docs: Control Flow', size: 'Link', type: 'URL' },
                  ].map(r => (
                    <div key={r.name} className="flex items-center gap-3 p-3.5 rounded-xl" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.08)' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.1)' }}>
                        <FileText size={14} style={{ color: '#3B82F6' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: '#F1F5F9' }}>{r.name}</p>
                        <p className="text-xs" style={{ color: '#475569' }}>{r.type} · {r.size}</p>
                      </div>
                      <button className="text-xs font-medium" style={{ color: '#3B82F6' }}>Download</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* AI Tutor sidebar */}
        {aiOpen && (
          <div
            className="hidden lg:flex flex-col w-72 flex-shrink-0 border-l"
            style={{ background: '#0D1421', borderColor: 'rgba(139,92,246,0.2)' }}
          >
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(139,92,246,0.15)' }}>
              <div className="flex items-center gap-2">
                <Brain size={16} style={{ color: '#8B5CF6' }} />
                <span className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>AI Tutor</span>
              </div>
              <button onClick={() => setAiOpen(false)} style={{ color: '#64748B' }}><X size={16} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'ai' && (
                    <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.2)' }}>
                      <Brain size={12} style={{ color: '#8B5CF6' }} />
                    </div>
                  )}
                  <div
                    className="max-w-[85%] p-2.5 rounded-xl text-xs leading-relaxed"
                    style={{
                      background: msg.role === 'ai' ? 'rgba(139,92,246,0.08)' : 'rgba(59,130,246,0.15)',
                      color: '#94A3B8',
                      border: msg.role === 'ai' ? '1px solid rgba(139,92,246,0.15)' : '1px solid rgba(59,130,246,0.2)',
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t" style={{ borderColor: 'rgba(139,92,246,0.15)' }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiMessage}
                  onChange={e => setAiMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about this lesson..."
                  className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
                  style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', color: '#F1F5F9' }}
                />
                <button
                  onClick={sendMessage}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(139,92,246,0.2)', color: '#8B5CF6' }}
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
