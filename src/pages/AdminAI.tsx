import { useState } from 'react'
import { Brain, Plus, Edit, Trash2, Upload, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const knowledgeBases = [
  { id: '1', name: 'Python for AI — Core Materials', course: 'Python for AI', docs: 24, updated: '2025-07-28', status: 'active' },
  { id: '2', name: 'Machine Learning Curriculum', course: 'Machine Learning Fundamentals', docs: 38, updated: '2025-07-25', status: 'active' },
  { id: '3', name: 'Data Science Reference Pack', course: 'Data Science with Python', docs: 19, updated: '2025-07-20', status: 'draft' },
  { id: '4', name: 'React & TypeScript Best Practices', course: 'React & TypeScript Mastery', docs: 31, updated: '2025-07-15', status: 'active' },
]

export default function AdminAI() {
  const navigate = useNavigate()
  const [instructions, setInstructions] = useState(
    `You are a helpful and encouraging AI tutor for Smugflex AI Academy. Your role is to:\n\n1. Explain concepts clearly using analogies and real-world examples\n2. Ask questions back to verify student understanding\n3. Provide hints rather than complete answers for exercises\n4. Celebrate progress and maintain a positive, motivating tone\n5. Always relate new concepts to what the student already knows\n\nTone: Professional but friendly. Encouraging without being patronizing.\nLanguage: English. Use simple vocabulary first, then introduce technical terms.`
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display" style={{ color: '#F1F5F9' }}>AI Knowledge Management</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>Manage AI tutor knowledge bases and instructions</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Knowledge Bases */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold font-display" style={{ color: '#F1F5F9' }}>Course Knowledge Bases</h2>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              <Plus size={13} /> New
            </button>
          </div>
          <div className="space-y-3">
            {knowledgeBases.map(kb => (
              <div key={kb.id} className="p-4 rounded-xl border" style={{ background: '#0D1421', borderColor: 'rgba(239,68,68,0.08)' }}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{kb.name}</p>
                    <p className="text-xs" style={{ color: '#64748B' }}>{kb.course}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full flex-shrink-0" style={{ background: kb.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: kb.status === 'active' ? '#10B981' : '#F59E0B' }}>
                    {kb.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs" style={{ color: '#475569' }}>
                    <span>{kb.docs} documents</span>
                    <span>Updated {kb.updated}</span>
                  </div>
                  <div className="flex gap-2">
                    <button style={{ color: '#F59E0B' }}><Edit size={13} /></button>
                    <button style={{ color: '#3B82F6' }}><Upload size={13} /></button>
                    <button style={{ color: '#EF4444' }}><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Instructions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold font-display" style={{ color: '#F1F5F9' }}>AI Tutor Instructions</h2>
            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(16,185,129,0.08)', color: '#10B981' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: '#10B981' }} />
              GPT-4 Active
            </div>
          </div>
          <div className="p-5 rounded-xl" style={{ background: '#0D1421', border: '1px solid rgba(239,68,68,0.08)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Brain size={15} style={{ color: '#8B5CF6' }} />
              <span className="text-xs font-semibold" style={{ color: '#8B5CF6' }}>System Prompt</span>
            </div>
            <textarea
              rows={14}
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              className="w-full text-sm outline-none resize-none font-mono"
              style={{ background: 'transparent', color: '#94A3B8', lineHeight: 1.6 }}
            />
            <div className="flex gap-3 mt-3 pt-3 border-t" style={{ borderColor: 'rgba(239,68,68,0.08)' }}>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                <Save size={13} /> Save Changes
              </button>
              <button className="text-xs" style={{ color: '#64748B' }}>Reset to Default</button>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#8B5CF6' }}>Learning Rules</p>
            <div className="space-y-2">
              {[
                { rule: 'Never give direct answers to exercises', on: true },
                { rule: 'Ask comprehension questions after each concept', on: true },
                { rule: 'Personalize responses based on student history', on: true },
                { rule: 'Use code examples for programming questions', on: true },
              ].map(({ rule, on }) => (
                <div key={rule} className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: on ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)' }}>
                    <span style={{ color: on ? '#10B981' : '#EF4444', fontSize: '10px' }}>{on ? '✓' : '✕'}</span>
                  </div>
                  <span style={{ color: '#94A3B8' }}>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
