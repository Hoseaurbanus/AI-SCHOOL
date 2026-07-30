import { Code2, Star, ExternalLink, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const projects = [
  {
    id: '1',
    title: 'Sentiment Analyzer',
    course: 'Python for AI',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=220&fit=crop&auto=format',
    description: 'NLP model that classifies text sentiment with 91.4% accuracy using NLTK and scikit-learn.',
    tags: ['Python', 'NLP', 'scikit-learn'],
    aiScore: 94,
    date: 'July 2025',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Data Dashboard',
    course: 'Data Science with Python',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=220&fit=crop&auto=format',
    description: 'Interactive data visualization dashboard built with Pandas and Matplotlib, analyzing Lagos traffic patterns.',
    tags: ['Pandas', 'Matplotlib', 'Seaborn'],
    aiScore: 88,
    date: 'June 2025',
    status: 'completed',
  },
  {
    id: '3',
    title: 'Todo API',
    course: 'Node.js Backend',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=220&fit=crop&auto=format',
    description: 'RESTful API with JWT authentication, CRUD operations, and MongoDB integration.',
    tags: ['Node.js', 'Express', 'MongoDB'],
    aiScore: 91,
    date: 'May 2025',
    status: 'completed',
  },
]

export default function Portfolio() {
  const navigate = useNavigate()
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display" style={{ color: '#F1F5F9' }}>Project Portfolio</h1>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>Showcase your AI-reviewed projects</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold font-display gradient-text">{projects.length} Projects</div>
          <div className="text-xs" style={{ color: '#64748B' }}>Avg AI Score: {Math.round(projects.reduce((a, p) => a + p.aiScore, 0) / projects.length)}/100</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map(project => (
          <div key={project.id} className="rounded-2xl overflow-hidden border" style={{ background: '#0D1421', borderColor: 'rgba(59,130,246,0.1)' }}>
            <div className="relative h-36 overflow-hidden">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(13,20,33,0.9),transparent)' }} />
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold" style={{ background: 'rgba(139,92,246,0.85)', color: '#fff' }}>
                <Star size={10} fill="white" /> AI Score: {project.aiScore}/100
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs mb-1" style={{ color: '#3B82F6' }}>{project.course}</p>
              <h3 className="font-semibold mb-1 font-display" style={{ color: '#F1F5F9' }}>{project.title}</h3>
              <p className="text-xs leading-relaxed mb-3" style={{ color: '#64748B' }}>{project.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-md text-xs" style={{ background: 'rgba(59,130,246,0.08)', color: '#3B82F6' }}>{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(59,130,246,0.08)' }}>
                <span className="text-xs" style={{ color: '#475569' }}>{project.date}</span>
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
          </div>
        ))}
      </div>
    </div>
  )
}
