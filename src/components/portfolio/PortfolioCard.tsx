import { useState } from 'react'
import { Code2, ExternalLink, Star } from 'lucide-react'
import { PortfolioProject } from '../../types'

interface PortfolioCardProps {
  project: PortfolioProject
}

export default function PortfolioCard({ project }: PortfolioCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="rounded-2xl overflow-hidden border transition-all duration-200 hover:border-opacity-30"
      style={{
        background: '#0D1421',
        borderColor: 'rgba(59,130,246,0.1)',
        cursor: 'pointer',
      }}
      onClick={() => project.codeSnippet && setExpanded(!expanded)}
    >
      <div className="relative h-36 overflow-hidden">
        {project.imageUrl ? (
          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%)',
            }}
          />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(13,20,33,0.9),transparent)' }} />
        <div
          className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold"
          style={{ background: 'rgba(139,92,246,0.85)', color: '#fff' }}
        >
          <Star size={10} fill="white" /> AI Score: {project.aiScore}/100
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs mb-1" style={{ color: '#3B82F6' }}>{project.course}</p>
        <h3 className="font-semibold mb-1 font-display" style={{ color: '#F1F5F9' }}>{project.title}</h3>
        <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: '#64748B' }}>{project.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-md text-xs" style={{ background: 'rgba(59,130,246,0.08)', color: '#3B82F6' }}>{tag}</span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(59,130,246,0.08)' }}>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: '#475569' }}>{project.date}</span>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: project.status === 'completed' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)',
                color: project.status === 'completed' ? '#22C55E' : '#3B82F6',
              }}
            >
              {project.status === 'completed' ? 'Completed' : 'In Progress'}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 text-xs font-medium" style={{ color: '#3B82F6' }}>
              <Code2 size={12} /> Code
            </button>
            <button className="flex items-center gap-1 text-xs font-medium" style={{ color: '#8B5CF6' }}>
              <ExternalLink size={12} /> Demo
            </button>
          </div>
        </div>
      </div>
      {expanded && project.codeSnippet && (
        <div className="border-t p-4" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
          <pre className="text-xs overflow-x-auto" style={{ color: '#E2E8F0', fontFamily: 'monospace' }}>
            <code>{project.codeSnippet}</code>
          </pre>
        </div>
      )}
    </div>
  )
}