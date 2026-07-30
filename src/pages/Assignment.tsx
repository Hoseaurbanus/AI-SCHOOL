import { useState } from 'react'
import { Clock, Upload, CheckCircle, Code2, FileText, AlertCircle } from 'lucide-react'
import type { Page } from '../types'

interface Props { navigate: (p: Page) => void }

export default function Assignment({ navigate }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [tab, setTab] = useState<'description' | 'submit'>('description')
  const [code, setCode] = useState('')

  if (submitted) {
    return (
      <div className="p-6 lg:p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(16,185,129,0.15)' }}>
          <CheckCircle size={32} style={{ color: '#10B981' }} />
        </div>
        <h2 className="text-2xl font-bold font-display mb-2" style={{ color: '#F1F5F9' }}>Assignment Submitted!</h2>
        <p className="mb-6 text-center" style={{ color: '#64748B' }}>Your AI tutor is reviewing your submission. You'll get feedback within a few minutes.</p>
        <button onClick={() => navigate('results')} className="px-6 py-3 rounded-xl font-semibold gradient-blue-purple text-white hover:opacity-90">
          View Results
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>Assignment 3</span>
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}>Python for AI</span>
            </div>
            <h1 className="text-2xl font-bold font-display" style={{ color: '#F1F5F9' }}>Build a Number Guessing Game with AI Hints</h1>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          {[
            { icon: Clock, label: 'Due Tomorrow, 11:59 PM', color: '#F59E0B' },
            { icon: AlertCircle, label: 'Not submitted', color: '#EF4444' },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-1.5 text-sm" style={{ color }}>
              <Icon size={14} />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: 'rgba(59,130,246,0.06)' }}>
          {(['description', 'submit'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all"
              style={{ background: tab === t ? '#1A2540' : 'transparent', color: tab === t ? '#3B82F6' : '#64748B' }}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'description' && (
          <div className="space-y-5">
            <div className="p-5 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
              <h3 className="font-semibold mb-3" style={{ color: '#F1F5F9' }}>Assignment Description</h3>
              <div className="text-sm leading-relaxed space-y-3" style={{ color: '#94A3B8' }}>
                <p>Build a number guessing game where:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The computer picks a random number between 1 and 100</li>
                  <li>The player has 7 attempts to guess it</li>
                  <li>After each guess, the AI gives contextual hints ("You're getting warmer!")</li>
                  <li>Track and display the number of attempts used</li>
                  <li>Allow the player to play multiple rounds</li>
                </ul>
              </div>
            </div>
            <div className="p-5 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
              <h3 className="font-semibold mb-3" style={{ color: '#F1F5F9' }}>Requirements</h3>
              {[
                { req: 'Use random module to generate the target number', pts: 10 },
                { req: 'Implement a loop for 7 guesses', pts: 20 },
                { req: 'Add contextual hints (cold, warm, hot, etc.)', pts: 30 },
                { req: 'Handle invalid inputs gracefully', pts: 20 },
                { req: 'Allow replay after game ends', pts: 20 },
              ].map(({ req, pts }) => (
                <div key={req} className="flex items-center justify-between py-2 border-b text-sm" style={{ borderColor: 'rgba(59,130,246,0.06)' }}>
                  <span style={{ color: '#94A3B8' }}>{req}</span>
                  <span className="font-semibold" style={{ color: '#3B82F6' }}>{pts} pts</span>
                </div>
              ))}
            </div>
            <button onClick={() => setTab('submit')} className="px-6 py-3 rounded-xl font-semibold gradient-blue-purple text-white hover:opacity-90">
              Submit Assignment →
            </button>
          </div>
        )}

        {tab === 'submit' && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>Paste your Python code</label>
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
                <div className="flex items-center gap-2 px-4 py-2" style={{ background: '#0A0F1A' }}>
                  <Code2 size={13} style={{ color: '#3B82F6' }} />
                  <span className="text-xs font-mono" style={{ color: '#475569' }}>main.py</span>
                </div>
                <textarea
                  rows={14}
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder={`import random\n\ndef guess_game():\n    # Your code here\n    pass\n\nguess_game()`}
                  className="w-full p-4 text-sm font-mono outline-none resize-none"
                  style={{ background: '#060A12', color: '#F1F5F9', lineHeight: 1.6 }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>Or upload file</label>
              <div
                className="flex flex-col items-center justify-center py-8 rounded-xl border-2 border-dashed cursor-pointer transition-all"
                style={{ borderColor: 'rgba(59,130,246,0.2)', background: 'rgba(59,130,246,0.03)' }}
              >
                <Upload size={24} className="mb-2" style={{ color: '#475569' }} />
                <p className="text-sm" style={{ color: '#64748B' }}>Drop .py file here or click to browse</p>
              </div>
            </div>

            <button
              onClick={() => setSubmitted(true)}
              disabled={!code.trim()}
              className="w-full py-3.5 rounded-xl font-semibold gradient-blue-purple text-white hover:opacity-90 disabled:opacity-40 transition-all"
              style={{ boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}
            >
              Submit for AI Review
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
