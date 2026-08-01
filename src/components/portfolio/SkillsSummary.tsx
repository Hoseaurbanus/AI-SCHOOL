import { ThumbsUp } from 'lucide-react'
import { StudentSkill } from '../../types'

interface SkillsSummaryProps {
  skills: StudentSkill[]
}

const levelConfig: Record<StudentSkill['level'], { label: string; bg: string; color: string }> = {
  beginner: { label: 'Beginner', bg: 'rgba(148,163,184,0.15)', color: '#94A3B8' },
  intermediate: { label: 'Intermediate', bg: 'rgba(59,130,246,0.15)', color: '#3B82F6' },
  advanced: { label: 'Advanced', bg: 'rgba(34,197,94,0.15)', color: '#22C55E' },
}

export default function SkillsSummary({ skills }: SkillsSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {skills.map(skill => {
        const config = levelConfig[skill.level]
        return (
          <div
            key={skill.name}
            className="rounded-xl border p-4 transition-all duration-200 hover:border-opacity-30"
            style={{
              background: '#0D1421',
              borderColor: 'rgba(59,130,246,0.1)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm" style={{ color: '#F1F5F9' }}>
                {skill.name}
              </h4>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: config.bg, color: config.color }}
              >
                {config.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5" style={{ color: '#64748B' }}>
              <ThumbsUp size={12} />
              <span className="text-xs">{skill.endorsements} endorsements</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
