import { useState } from 'react'
import {
  Play, ChevronRight, Brain, X, Plus, FolderOpen, Terminal, Globe,
  CheckCircle, AlertCircle, RefreshCw,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const files = [
  { name: 'main.py', active: true },
  { name: 'utils.py', active: false },
  { name: 'test_main.py', active: false },
]

const defaultCode = `# Python Loops Exercise
# Task: Write a function that finds all prime numbers up to n

def find_primes(n):
    """Return a list of all prime numbers up to and including n"""
    primes = []

    for num in range(2, n + 1):
        is_prime = True

        for i in range(2, int(num ** 0.5) + 1):
            if num % i == 0:
                is_prime = False
                break

        if is_prime:
            primes.append(num)

    return primes

# Test your function:
result = find_primes(50)
print(f"Primes up to 50: {result}")
print(f"Count: {len(result)} primes found")
`

const outputLines = [
  { type: 'info', text: '$ python main.py' },
  { type: 'output', text: 'Primes up to 50: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]' },
  { type: 'output', text: 'Count: 15 primes found' },
  { type: 'success', text: '✓ Process finished with exit code 0 in 0.042s' },
]

const aiReview = `Your solution is correct and well-structured! Here are a few observations:

✅ **Correctness**: Your algorithm correctly identifies all 15 primes up to 50.

✅ **Efficiency**: Using √n as the upper bound for the inner loop is a great optimization — this is O(n√n) instead of O(n²).

💡 **Improvement**: You could use the Sieve of Eratosthenes for even better performance on large inputs:

\`\`\`python
def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, n+1, i):
                is_prime[j] = False
    return [i for i in range(2, n+1) if is_prime[i]]
\`\`\`

**Score: 92/100** — Excellent work!`

export default function CodingLab() {
  const navigate = useNavigate()
  const [code, setCode] = useState(defaultCode)
  const [ran, setRan] = useState(false)
  const [running, setRunning] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [activeFile, setActiveFile] = useState('main.py')
  const [tab, setTab] = useState<'terminal' | 'preview'>('terminal')

  const run = () => {
    setRunning(true)
    setRan(false)
    setTimeout(() => { setRunning(false); setRan(true) }, 1200)
  }

  return (
    <div className="h-full flex flex-col" style={{ background: '#060A12' }}>
      {/* Toolbar */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 flex-shrink-0 border-b"
        style={{ background: '#0A0F1A', borderColor: 'rgba(59,130,246,0.12)' }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: '#EF4444' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#F59E0B' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#10B981' }} />
        </div>
        <span className="text-xs font-semibold font-display" style={{ color: '#94A3B8' }}>Smugflex Coding Lab</span>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAI(!showAI)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ background: showAI ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.08)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.2)' }}
          >
            <Brain size={13} /> AI Review
          </button>
          <button
            onClick={run}
            disabled={running}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold gradient-blue-purple text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ boxShadow: '0 0 15px rgba(59,130,246,0.25)' }}
          >
            {running ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} />}
            {running ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* File explorer */}
        <div
          className="hidden sm:flex flex-col w-44 flex-shrink-0 border-r"
          style={{ background: '#0A0F1A', borderColor: 'rgba(59,130,246,0.08)' }}
        >
          <div className="px-3 py-2.5 border-b flex items-center gap-2" style={{ borderColor: 'rgba(59,130,246,0.08)' }}>
            <FolderOpen size={13} style={{ color: '#475569' }} />
            <span className="text-xs font-medium" style={{ color: '#64748B' }}>EXPLORER</span>
            <button className="ml-auto" style={{ color: '#475569' }}><Plus size={13} /></button>
          </div>
          <div className="p-1.5 space-y-0.5">
            {files.map(f => (
              <button
                key={f.name}
                onClick={() => setActiveFile(f.name)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs"
                style={{
                  background: activeFile === f.name ? 'rgba(59,130,246,0.1)' : 'transparent',
                  color: activeFile === f.name ? '#3B82F6' : '#64748B',
                }}
              >
                <ChevronRight size={10} style={{ opacity: 0.5 }} />
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* File tabs */}
          <div className="flex border-b flex-shrink-0" style={{ background: '#0A0F1A', borderColor: 'rgba(59,130,246,0.08)' }}>
            {files.filter((_, i) => i < 2).map(f => (
              <button
                key={f.name}
                onClick={() => setActiveFile(f.name)}
                className="flex items-center gap-2 px-4 py-2.5 text-xs border-r border-b-2 transition-all"
                style={{
                  borderRightColor: 'rgba(59,130,246,0.08)',
                  borderBottomColor: activeFile === f.name ? '#3B82F6' : 'transparent',
                  color: activeFile === f.name ? '#F1F5F9' : '#475569',
                  background: activeFile === f.name ? '#060A12' : 'transparent',
                }}
              >
                <span className="font-mono">{f.name}</span>
                <X size={10} style={{ opacity: 0.5 }} />
              </button>
            ))}
          </div>

          {/* Code area */}
          <div className="flex-1 relative overflow-hidden" style={{ background: '#060A12' }}>
            <div className="absolute left-0 top-0 bottom-0 w-10 border-r flex flex-col pt-3 text-right pr-2" style={{ background: '#0A0F1A', borderColor: 'rgba(59,130,246,0.06)' }}>
              {code.split('\n').map((_, i) => (
                <span key={i} className="text-xs leading-6 font-mono" style={{ color: '#2D3748', fontSize: '11px' }}>{i + 1}</span>
              ))}
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              className="absolute inset-0 w-full h-full pl-12 pr-4 pt-3 text-sm font-mono outline-none resize-none"
              style={{ background: 'transparent', color: '#F1F5F9', lineHeight: '24px', caretColor: '#3B82F6' }}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right panel — AI Review */}
        {showAI && (
          <div
            className="hidden lg:flex flex-col w-72 flex-shrink-0 border-l"
            style={{ background: '#0D1421', borderColor: 'rgba(139,92,246,0.2)' }}
          >
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(139,92,246,0.15)' }}>
              <div className="flex items-center gap-2">
                <Brain size={15} style={{ color: '#8B5CF6' }} />
                <span className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>AI Code Review</span>
              </div>
              <button onClick={() => setShowAI(false)} style={{ color: '#64748B' }}><X size={15} /></button>
            </div>
            {ran ? (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-center gap-2 mb-3 p-2.5 rounded-lg" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <CheckCircle size={14} style={{ color: '#10B981' }} />
                  <span className="text-xs font-semibold" style={{ color: '#10B981' }}>Score: 92/100</span>
                </div>
                <div className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: '#94A3B8' }}>
                  {aiReview}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <Brain size={32} className="mb-3" style={{ color: '#475569' }} />
                <p className="text-sm" style={{ color: '#64748B' }}>Run your code to get AI feedback and a performance score</p>
                <button
                  onClick={run}
                  className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold gradient-blue-purple text-white"
                >
                  <Play size={12} /> Run Code
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Terminal / Preview */}
      <div
        className="flex-shrink-0 border-t"
        style={{ height: '200px', background: '#030608', borderColor: 'rgba(59,130,246,0.1)' }}
      >
        <div className="flex border-b" style={{ borderColor: 'rgba(59,130,246,0.08)' }}>
          {(['terminal', 'preview'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium capitalize border-b-2 transition-all"
              style={{ borderColor: tab === t ? '#3B82F6' : 'transparent', color: tab === t ? '#3B82F6' : '#475569' }}
            >
              {t === 'terminal' ? <Terminal size={12} /> : <Globe size={12} />}
              {t}
            </button>
          ))}
        </div>

        <div className="p-3 overflow-y-auto h-full font-mono text-xs space-y-0.5" style={{ height: 'calc(100% - 33px)' }}>
          {tab === 'terminal' && (
            <>
              {(ran ? outputLines : [{ type: 'info', text: '$ Ready to run your code...' }]).map((line, i) => (
                <div
                  key={i}
                  style={{
                    color: line.type === 'success' ? '#10B981' : line.type === 'error' ? '#EF4444' : line.type === 'info' ? '#64748B' : '#94A3B8',
                  }}
                >
                  {line.text}
                </div>
              ))}
              {running && (
                <div className="flex items-center gap-2" style={{ color: '#F59E0B' }}>
                  <RefreshCw size={10} className="animate-spin" />
                  <span>Running...</span>
                </div>
              )}
            </>
          )}
          {tab === 'preview' && (
            <div className="text-center pt-8" style={{ color: '#475569' }}>
              Live preview not available for this exercise type
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
