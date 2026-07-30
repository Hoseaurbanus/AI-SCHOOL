import { Brain, Target, Users, Award, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const team = [
  { name: 'Adaora Obi', role: 'CEO & Co-Founder', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&h=120&fit=crop&auto=format', bio: 'Former AI researcher at Google, passionate about democratizing quality education across Africa.' },
  { name: 'Emeka Eze', role: 'CTO & Co-Founder', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format', bio: 'Full-stack engineer with 12+ years experience building scalable EdTech platforms.' },
  { name: 'Ngozi Mensah', role: 'Head of Curriculum', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&auto=format', bio: 'PhD in Educational Technology. Designed AI-adaptive learning systems used by 50,000+ students.' },
  { name: 'Kelechi Okafor', role: 'Head of AI', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format', bio: 'ML engineer specializing in NLP and personalized learning AI. Built the AI tutor from scratch.' },
]

export default function About() {
  const navigate = useNavigate()
  return (
    <div style={{ background: '#060A12', minHeight: '100vh' }}>
      {/* Hero */}
      <section className="relative py-20 lg:py-32 px-6 overflow-hidden mesh-bg">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6" style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}>
            About Smugflex AI Academy
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold font-display mb-6" style={{ color: '#F1F5F9' }}>
            Bridging the global skills gap with <span className="gradient-text">AI-powered education</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto" style={{ color: '#64748B' }}>
            We believe every learner in Africa deserves access to world-class, personalized education. Smugflex AI Academy combines cutting-edge AI with expert curriculum design to make that a reality.
          </p>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-20 px-6" style={{ borderTop: '1px solid rgba(59,130,246,0.08)' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            { icon: Target, title: 'Our Mission', text: 'To democratize high-quality, AI-personalized tech education across Africa — making it accessible, affordable, and deeply effective for every learner regardless of their starting point.', color: '#3B82F6' },
            { icon: Brain, title: 'Our Vision', text: "A future where every African student has a brilliant personal AI tutor guiding them to mastery in the skills that will define tomorrow's economy.", color: '#8B5CF6' },
          ].map(({ icon: Icon, title, text, color }) => (
            <div key={title} className="p-8 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `${color}18` }}>
                <Icon size={24} style={{ color }} />
              </div>
              <h2 className="text-2xl font-bold font-display mb-4" style={{ color: '#F1F5F9' }}>{title}</h2>
              <p className="leading-relaxed" style={{ color: '#94A3B8' }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6" style={{ background: '#0D1421', borderTop: '1px solid rgba(59,130,246,0.08)' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { v: '12,847+', l: 'Students Enrolled', icon: Users },
            { v: '48', l: 'Expert Courses', icon: Brain },
            { v: '78%', l: 'Completion Rate', icon: Target },
            { v: '94%', l: 'Job Placement Rate', icon: Award },
          ].map(({ v, l, icon: Icon }) => (
            <div key={l} className="text-center p-6 rounded-2xl" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.1)' }}>
              <Icon size={24} className="mx-auto mb-3" style={{ color: '#3B82F6' }} />
              <div className="text-3xl font-bold font-display gradient-text mb-1">{v}</div>
              <div className="text-sm" style={{ color: '#64748B' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Smugflex */}
      <section className="py-20 px-6" style={{ borderTop: '1px solid rgba(59,130,246,0.08)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold font-display mb-12 text-center" style={{ color: '#F1F5F9' }}>
            Why <span className="gradient-text">Smugflex AI Academy?</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'AI-First Design', desc: 'Built from the ground up around AI assistance. Not a tool bolted on — the AI tutor is central to every learning experience.' },
              { title: 'African Context', desc: 'Curriculum designed with African students, challenges, and opportunities in mind. Pricing in NGN with local payment methods.' },
              { title: 'Expert Instructors', desc: 'All courses are created by practicing professionals — engineers, data scientists, and researchers at top global companies.' },
              { title: 'Real Projects', desc: 'No toy exercises. Every project is portfolio-ready and reflects real industry problems that employers care about.' },
              { title: 'Career Support', desc: 'Interview prep, portfolio reviews, and job placement assistance. We succeed when you land the role.' },
              { title: 'Blockchain Certs', desc: 'Tamper-proof certificates with unique verification codes. Share on LinkedIn and employers can verify in 5 seconds.' },
            ].map(({ title, desc }) => (
              <div key={title} className="p-6 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.08)' }}>
                <h3 className="font-semibold font-display mb-2" style={{ color: '#F1F5F9' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6" style={{ background: '#0D1421', borderTop: '1px solid rgba(59,130,246,0.08)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold font-display mb-3 text-center" style={{ color: '#F1F5F9' }}>
            Meet the <span className="gradient-text">team</span>
          </h2>
          <p className="text-center mb-12" style={{ color: '#64748B' }}>The people building the future of African education</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(member => (
              <div key={member.name} className="text-center p-6 rounded-2xl" style={{ background: '#141E30', border: '1px solid rgba(59,130,246,0.1)' }}>
                <img src={member.img} alt={member.name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2" style={{ borderColor: 'rgba(59,130,246,0.3)' }} />
                <h3 className="font-semibold font-display mb-1" style={{ color: '#F1F5F9' }}>{member.name}</h3>
                <p className="text-xs mb-3" style={{ color: '#3B82F6' }}>{member.role}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ borderTop: '1px solid rgba(59,130,246,0.08)' }}>
        <h2 className="text-3xl font-bold font-display mb-4" style={{ color: '#F1F5F9' }}>
          Ready to start your journey?
        </h2>
        <p className="mb-8" style={{ color: '#64748B' }}>Join 12,847 learners already building their future.</p>
        <button
          onClick={() => navigate('/register')}
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold gradient-blue-purple text-white hover:opacity-90 transition-all"
          style={{ boxShadow: '0 0 30px rgba(59,130,246,0.3)' }}
        >
          Get Started Free <ArrowRight size={18} />
        </button>
      </section>
    </div>
  )
}
