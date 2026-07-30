import { useState } from 'react'
import { Search, SlidersHorizontal, Star, Brain, Clock, Users, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { courses, categories } from '../data/mockData'

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']
const sortOptions = ['Most Popular', 'Highest Rated', 'Newest', 'Price: Low to High', 'Price: High to Low']

export default function Marketplace() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeLevel, setActiveLevel] = useState('All Levels')
  const [sortBy, setSortBy] = useState('Most Popular')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchCat = activeCategory === 'All' || c.category === activeCategory
    const matchLevel = activeLevel === 'All Levels' || c.level === activeLevel
    return matchSearch && matchCat && matchLevel
  })

  return (
    <div style={{ background: '#060A12', minHeight: '100vh' }}>
      {/* Header */}
      <div
        className="py-12 px-6 text-center"
        style={{ background: 'linear-gradient(180deg, rgba(59,130,246,0.06) 0%, transparent 100%)', borderBottom: '1px solid rgba(59,130,246,0.08)' }}
      >
        <h1 className="text-4xl lg:text-5xl font-bold font-display mb-3" style={{ color: '#F1F5F9' }}>
          Course <span className="gradient-text">Marketplace</span>
        </h1>
        <p className="text-lg mb-8" style={{ color: '#64748B' }}>
          {courses.length} expert-crafted courses across 5 categories
        </p>

        <div className="max-w-2xl mx-auto">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <Search size={18} style={{ color: '#475569', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search for courses, topics, or skills..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: '#F1F5F9' }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-xs px-2 py-1 rounded-md" style={{ color: '#475569' }}>✕</button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Category tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
          {['All', ...categories.map(c => c.name)].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeCategory === cat ? 'rgba(59,130,246,0.15)' : '#0D1421',
                color: activeCategory === cat ? '#3B82F6' : '#94A3B8',
                border: activeCategory === cat ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(59,130,246,0.1)',
              }}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="ml-auto flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: showFilters ? 'rgba(59,130,246,0.15)' : '#0D1421', color: '#94A3B8', border: '1px solid rgba(59,130,246,0.1)' }}
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div
            className="mb-6 p-5 rounded-xl flex flex-wrap gap-6"
            style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
          >
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>LEVEL</p>
              <div className="flex gap-2">
                {levels.map(l => (
                  <button
                    key={l}
                    onClick={() => setActiveLevel(l)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: activeLevel === l ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.05)',
                      color: activeLevel === l ? '#3B82F6' : '#64748B',
                      border: activeLevel === l ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>SORT BY</p>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-xs outline-none"
                style={{ background: 'rgba(59,130,246,0.08)', color: '#94A3B8', border: '1px solid rgba(59,130,246,0.15)' }}
              >
                {sortOptions.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Results bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm" style={{ color: '#64748B' }}>
            <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{filtered.length}</span> courses found
          </p>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs" style={{ color: '#475569' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs px-2 py-1 rounded-lg outline-none"
              style={{ background: '#0D1421', color: '#94A3B8', border: '1px solid rgba(59,130,246,0.1)' }}
            >
              {sortOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Course grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold font-display mb-2" style={{ color: '#F1F5F9' }}>No courses found</h3>
            <p style={{ color: '#64748B' }}>Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All'); setActiveLevel('All Levels') }} className="mt-4 text-sm" style={{ color: '#3B82F6' }}>
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(course => (
              <button
                key={course.id}
                onClick={() => navigate('/courses/1')}
                className="text-left rounded-2xl overflow-hidden border transition-all hover:-translate-y-1 group"
                style={{ background: '#0D1421', borderColor: 'rgba(59,130,246,0.1)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.3)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.1)'}
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(13,20,33,0.85) 0%,transparent 60%)' }} />
                  {course.aiTutor && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold" style={{ background: 'rgba(139,92,246,0.85)', color: '#fff' }}>
                      <Brain size={10} /> AI Tutor
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-xs font-medium" style={{ background: 'rgba(6,10,18,0.85)', color: course.level === 'Beginner' ? '#10B981' : course.level === 'Intermediate' ? '#F59E0B' : '#EF4444' }}>
                    {course.level}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs mb-1.5 font-medium" style={{ color: '#3B82F6' }}>{course.category}</p>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2 font-display leading-tight" style={{ color: '#F1F5F9' }}>{course.title}</h3>
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: '#64748B' }}>{course.description}</p>
                  <div className="flex items-center gap-3 text-xs mb-3" style={{ color: '#475569' }}>
                    <span className="flex items-center gap-1"><Clock size={11} /> {course.duration}</span>
                    <span className="flex items-center gap-1"><Users size={11} /> {course.students.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Star size={11} fill="#F59E0B" style={{ color: '#F59E0B' }} /> {course.rating}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(59,130,246,0.08)' }}>
                    <span className="font-bold gradient-text font-display">₦{course.price.toLocaleString()}</span>
                    <span className="text-xs flex items-center gap-1 font-medium" style={{ color: '#3B82F6' }}>
                      Enroll <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
