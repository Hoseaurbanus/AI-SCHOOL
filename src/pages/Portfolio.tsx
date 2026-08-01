import { Award, BarChart3, TrendingUp } from 'lucide-react'
import PortfolioCard from '../components/portfolio/PortfolioCard'
import SkillsSummary from '../components/portfolio/SkillsSummary'
import CertificateShowcase from '../components/portfolio/CertificateShowcase'
import { portfolioProjects, studentSkills, certificateData } from '../data/mockData'

export default function Portfolio() {
  const completedProjects = portfolioProjects.filter(p => p.status === 'completed').length
  const avgScore = Math.round(portfolioProjects.reduce((a, p) => a + p.aiScore, 0) / portfolioProjects.length)
  const certificatesEarned = certificateData.length

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display" style={{ color: '#F1F5F9' }}>
          Project Portfolio
        </h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>
          Showcase your AI-reviewed projects, skills, and certificates
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div
          className="rounded-xl border p-4"
          style={{ background: '#0D1421', borderColor: 'rgba(59,130,246,0.1)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(59,130,246,0.15)' }}
            >
              <BarChart3 size={20} style={{ color: '#3B82F6' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: '#64748B' }}>Total Projects</p>
              <p className="text-xl font-bold font-display" style={{ color: '#F1F5F9' }}>
                {completedProjects}/{portfolioProjects.length}
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl border p-4"
          style={{ background: '#0D1421', borderColor: 'rgba(139,92,246,0.1)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.15)' }}
            >
              <TrendingUp size={20} style={{ color: '#8B5CF6' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: '#64748B' }}>Avg AI Score</p>
              <p className="text-xl font-bold font-display" style={{ color: '#F1F5F9' }}>
                {avgScore}/100
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl border p-4"
          style={{ background: '#0D1421', borderColor: 'rgba(34,197,94,0.1)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(34,197,94,0.15)' }}
            >
              <Award size={20} style={{ color: '#22C55E' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: '#64748B' }}>Certificates Earned</p>
              <p className="text-xl font-bold font-display" style={{ color: '#F1F5F9' }}>
                {certificatesEarned}
              </p>
            </div>
          </div>
        </div>
      </div>

      <CertificateShowcase />

      <div className="mb-8">
        <h2 className="text-lg font-semibold font-display mb-4" style={{ color: '#F1F5F9' }}>
          Skills & Endorsements
        </h2>
        <SkillsSummary skills={studentSkills} />
      </div>

      <div>
        <h2 className="text-lg font-semibold font-display mb-4" style={{ color: '#F1F5F9' }}>
          Projects
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {portfolioProjects.map(project => (
            <PortfolioCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}
