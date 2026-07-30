import { useState } from 'react'
import {
  Star, Clock, Users, Award, Brain, CheckCircle, ChevronDown,
  Play, Code2, BookOpen, Target, ArrowRight, Zap,
} from 'lucide-react'
import type { Page } from '../types'
import { courses, curriculum } from '../data/mockData'

interface Props { navigate: (p: Page) => void }

const course = courses[0]

export default function CourseDetails({ navigate }: Props) {
  const [openModule, setOpenModule] = useState<number | null>(0)
  const [tab, setTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview')

  return (
    <div style={{ background: '#060A12', minHeight: '100vh' }}>
      {/* Hero */}
      <div
        className="py-12 px-6"
        style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.08) 0%,rgba(139,92,246,0.06) 100%)', borderBottom: '1px solid rgba(59,130,246,0.1)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6' }}>{course.category}</span>
                {course.aiTutor && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1" style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6' }}>
                    <Brain size={10} /> AI Tutor Included
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>{course.level}</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold font-display mb-4" style={{ color: '#F1F5F9' }}>{course.title}</h1>
              <p className="text-base leading-relaxed mb-6" style={{ color: '#94A3B8' }}>{course.description}</p>

              <div className="flex flex-wrap gap-5 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <Star size={16} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                  <span className="font-semibold" style={{ color: '#F59E0B' }}>{course.rating}</span>
                  <span style={{ color: '#64748B' }}>({course.students.toLocaleString()} students)</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: '#64748B' }}>
                  <Clock size={16} />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: '#64748B' }}>
                  <BookOpen size={16} />
                  <span>{course.lessons} lessons</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: '#64748B' }}>
                  <Code2 size={16} />
                  <span>{course.projects} projects</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&h=80&fit=crop&auto=format"
                  alt={course.instructor}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-xs" style={{ color: '#64748B' }}>Instructor</p>
                  <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{course.instructor}</p>
                </div>
              </div>
            </div>

            {/* Pricing card */}
            <div
              className="rounded-2xl overflow-hidden sticky top-20"
              style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.2)', boxShadow: '0 0 40px rgba(59,130,246,0.08)' }}
            >
              <div className="h-44 overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-bold font-display gradient-text">₦{course.price.toLocaleString()}</span>
                </div>
                <p className="text-xs mb-5" style={{ color: '#64748B' }}>One-time payment · Lifetime access</p>

                <button
                  onClick={() => navigate('checkout')}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm mb-3 gradient-blue-purple text-white transition-all hover:opacity-90"
                  style={{ boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
                >
                  Enroll Now
                </button>
                <button
                  onClick={() => navigate('register')}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm border transition-all"
                  style={{ borderColor: 'rgba(59,130,246,0.2)', color: '#94A3B8' }}
                >
                  Try Free Preview
                </button>

                <ul className="mt-5 space-y-2.5 text-xs" style={{ color: '#64748B' }}>
                  {[
                    '✓ Lifetime access to all materials',
                    '✓ AI tutor available 24/7',
                    `✓ ${course.projects} hands-on projects`,
                    '✓ Verified certificate on completion',
                    '✓ 7-day money-back guarantee',
                  ].map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 glass border-b" style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            {(['overview', 'curriculum', 'reviews'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="py-4 text-sm font-medium capitalize border-b-2 transition-all"
                style={{
                  borderColor: tab === t ? '#3B82F6' : 'transparent',
                  color: tab === t ? '#3B82F6' : '#64748B',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="lg:max-w-2xl">
          {tab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold font-display mb-4" style={{ color: '#F1F5F9' }}>What you will learn</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    'Python syntax, functions, and OOP fundamentals',
                    'NumPy and Pandas for data manipulation',
                    'Building ML models with scikit-learn',
                    'Data visualization with Matplotlib and Seaborn',
                    'AI project architecture and design patterns',
                    'Deploying Python applications to the cloud',
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2.5 p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.06)' }}>
                      <CheckCircle size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: '1px' }} />
                      <span className="text-sm" style={{ color: '#94A3B8' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold font-display mb-4" style={{ color: '#F1F5F9' }}>Requirements</h2>
                <ul className="space-y-2">
                  {['Basic computer literacy', 'No prior programming experience needed', 'A computer with internet connection'].map(r => (
                    <li key={r} className="flex items-center gap-2 text-sm" style={{ color: '#94A3B8' }}>
                      <span style={{ color: '#3B82F6' }}>→</span> {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold font-display mb-4" style={{ color: '#F1F5F9' }}>Projects you will build</h2>
                <div className="grid gap-3">
                  {[
                    { name: 'Sentiment Analyzer', desc: 'Build an NLP model that classifies text sentiment with 92% accuracy', icon: Brain },
                    { name: 'Image Classifier', desc: 'CNN-based classifier that recognizes 10 categories from photos', icon: Target },
                    { name: 'Chatbot Assistant', desc: 'Rule-based chatbot with NLP preprocessing and intent detection', icon: Zap },
                  ].map(({ name, desc, icon: Icon }) => (
                    <div key={name} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.1)' }}>
                        <Icon size={18} style={{ color: '#3B82F6' }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1" style={{ color: '#F1F5F9' }}>{name}</p>
                        <p className="text-xs" style={{ color: '#64748B' }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'curriculum' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-display" style={{ color: '#F1F5F9' }}>Course Curriculum</h2>
                <span className="text-sm" style={{ color: '#64748B' }}>
                  {curriculum.reduce((a, m) => a + m.lessons.length, 0)} lessons · {course.duration}
                </span>
              </div>
              {curriculum.map((mod, i) => (
                <div key={i} className="rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(59,130,246,0.12)', background: '#0D1421' }}>
                  <button
                    onClick={() => setOpenModule(openModule === i ? null : i)}
                    className="w-full flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6' }}>
                        {i + 1}
                      </div>
                      <span className="font-semibold text-sm text-left" style={{ color: '#F1F5F9' }}>{mod.module}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: '#64748B' }}>{mod.lessons.length} lessons</span>
                      <ChevronDown size={16} style={{ color: '#64748B', transform: openModule === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </div>
                  </button>
                  {openModule === i && (
                    <div className="border-t" style={{ borderColor: 'rgba(59,130,246,0.08)' }}>
                      {mod.lessons.map((lesson, j) => (
                        <div
                          key={j}
                          className="flex items-center gap-3 px-4 py-3 border-b last:border-0 transition-colors"
                          style={{ borderColor: 'rgba(59,130,246,0.06)', background: lesson.completed ? 'rgba(16,185,129,0.04)' : 'transparent' }}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: lesson.type === 'video' ? 'rgba(59,130,246,0.1)' : lesson.type === 'exercise' ? 'rgba(245,158,11,0.1)' : 'rgba(139,92,246,0.1)' }}>
                            {lesson.type === 'video' ? <Play size={12} style={{ color: '#3B82F6' }} /> : lesson.type === 'exercise' ? <Target size={12} style={{ color: '#F59E0B' }} /> : <Code2 size={12} style={{ color: '#8B5CF6' }} />}
                          </div>
                          <span className="flex-1 text-sm" style={{ color: lesson.completed ? '#64748B' : '#94A3B8', textDecoration: lesson.completed ? 'line-through' : 'none' }}>
                            {lesson.title}
                          </span>
                          <span className="text-xs flex-shrink-0" style={{ color: '#475569' }}>{lesson.duration}</span>
                          {lesson.completed && <CheckCircle size={14} style={{ color: '#10B981', flexShrink: 0 }} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'reviews' && (
            <div className="space-y-5">
              <div className="flex items-center gap-6 p-5 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
                <div className="text-center">
                  <div className="text-6xl font-bold font-display gradient-text">{course.rating}</div>
                  <div className="flex gap-1 justify-center my-1">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="#F59E0B" style={{ color: '#F59E0B' }} />)}
                  </div>
                  <p className="text-xs" style={{ color: '#64748B' }}>Course Rating</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map(n => (
                    <div key={n} className="flex items-center gap-2">
                      <span className="text-xs w-2" style={{ color: '#64748B' }}>{n}</span>
                      <Star size={10} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)' }}>
                        <div className="h-full rounded-full" style={{ background: '#F59E0B', width: `${[82, 12, 4, 1, 1][5 - n]}%` }} />
                      </div>
                      <span className="text-xs w-6 text-right" style={{ color: '#64748B' }}>{[82, 12, 4, 1, 1][5 - n]}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {[
                { name: 'Amaka Eze', date: '2 weeks ago', rating: 5, text: 'Exceptional course! The AI tutor is genuinely helpful — I asked it to explain recursion five different ways until one finally clicked. The projects are challenging in the right way.' },
                { name: 'Tunde Olatunde', date: '1 month ago', rating: 5, text: 'Coming from zero programming background, I was worried this would be too hard. The pace is perfect and the AI tutor fills every gap. Already building my first ML project!' },
                { name: 'Chioma Okafor', date: '3 weeks ago', rating: 4, text: 'Very solid content and well-paced. Would love more advanced project options but the core curriculum is excellent. Certificate looks professional too.' },
              ].map((r, i) => (
                <div key={i} className="p-5 rounded-xl" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.08)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}>
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{r.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={10} fill="#F59E0B" style={{ color: '#F59E0B' }} />)}</div>
                        <span className="text-xs" style={{ color: '#475569' }}>{r.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
