import { useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  ArrowRight,
  Play,
  Sparkles,
  Brain,
  Code2,
  Award,
  Target,
  Zap,
  Star,
  ChevronDown,
  CheckCircle,
  Users,
  BookOpen,
  TrendingUp,
} from "lucide-react"
import {
  courses,
  categories,
  testimonials,
  pricingPlans,
  faqs,
} from "../data/mockData"
import CourseCard from "../components/course/CourseCard"
import { useFeaturedCourses } from "../hooks/useCourses"

function StatBadge({ value, label }: { value: string label: string }) {
  return (
    <div
      className="flex flex-col items-center px-4 py-3 rounded-xl"
      style={{
        background: "rgba(59,130,246,0.08)",
        border: "1px solid rgba(59,130,246,0.15)",
      }}
    >
      <span className="text-2xl font-bold font-display gradient-text">
        {value}
      </span>
      <span className="text-xs mt-0.5" style={{ color: "#64748B" }}>
        {label}
      </span>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  color,
}: {
  icon: React.ElementType
  title: string
  desc: string
  color: string
}) {
  return (
    <div
      className="p-6 rounded-2xl transition-all hover:-translate-y-1 group cursor-default"
      style={{
        background: "#0D1421",
        border: "1px solid rgba(59,130,246,0.1)",
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = `${color}30`
        ;(e.currentTarget as HTMLElement).style.background = "#141E30"
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor =
          "rgba(59,130,246,0.1)"
        ;(e.currentTarget as HTMLElement).style.background = "#0D1421"
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `${color}18` }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <h3
        className="font-semibold text-base mb-2 font-display"
        style={{ color: "#F1F5F9" }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
        {desc}
      </p>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { data: featuredData } = useFeaturedCourses()
  const featuredCourses =
    featuredData?.data || courses.filter((c) => c.featured).slice(0, 3)

  return (
    <div style={{ background: "#060A12" }}>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden mesh-bg grid-lines">
        <div className="absolute inset-0">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse-slow"
            style={{
              background: "radial-gradient(circle,#3B82F6,transparent)",
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15 animate-pulse-slow"
            style={{
              background: "radial-gradient(circle,#8B5CF6,transparent)",
              animationDelay: "1.5s",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6"
                style={{
                  background: "rgba(59,130,246,0.12)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  color: "#3B82F6",
                }}
              >
                <Sparkles size={12} />
                <span>AI-Powered Learning Platform</span>
              </div>

              <h1
                className="text-5xl lg:text-6xl xl:text-7xl font-bold font-display leading-[1.05] mb-6"
                style={{ color: "#F1F5F9" }}
              >
                Learn Future Skills With Your{" "}
                <span className="gradient-text">Personal AI Tutor</span>
              </h1>

              <p
                className="text-lg leading-relaxed mb-8 max-w-lg"
                style={{ color: "#64748B" }}
              >
                Master in-demand tech skills through AI-personalized learning
                paths, interactive coding labs, and real project experience —
                then earn verified certificates.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <button
                  onClick={() => navigate("/register")}
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-base gradient-blue-purple text-white transition-all hover:opacity-90 hover:scale-105"
                  style={{ boxShadow: "0 0 30px rgba(59,130,246,0.35)" }}
                >
                  <Zap size={18} />
                  Start Learning Free
                </button>
                <button
                  onClick={() => navigate("/marketplace")}
                  className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-base border transition-all hover:border-blue-500/50"
                  style={{
                    borderColor: "rgba(59,130,246,0.2)",
                    color: "#94A3B8",
                    background: "rgba(59,130,246,0.05)",
                  }}
                >
                  Explore Courses
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                <StatBadge value="12,847+" label="Students Enrolled" />
                <StatBadge value="48" label="Expert Courses" />
                <StatBadge value="4.9★" label="Average Rating" />
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div
                className="relative rounded-2xl overflow-hidden animate-float"
                style={{
                  background: "#0D1421",
                  border: "1px solid rgba(59,130,246,0.2)",
                  boxShadow:
                    "0 0 60px rgba(59,130,246,0.12), 0 40px 80px rgba(0,0,0,0.6)",
                }}
              >
                <div
                  className="p-4 border-b flex items-center gap-2"
                  style={{ borderColor: "rgba(59,130,246,0.1)" }}
                >
                  <div className="flex gap-1.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: "#EF4444" }}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: "#F59E0B" }}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: "#10B981" }}
                    />
                  </div>
                  <div
                    className="flex-1 mx-3 h-5 rounded-md text-xs flex items-center justify-center"
                    style={{
                      background: "rgba(59,130,246,0.06)",
                      color: "#475569",
                    }}
                  >
                    app.smugflex.ai/dashboard
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs mb-1" style={{ color: "#64748B" }}>
                        Good morning
                      </p>
                      <p
                        className="font-semibold font-display"
                        style={{ color: "#F1F5F9" }}
                      >
                        Emeka Okafor 👋
                      </p>
                    </div>
                    <div
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                      style={{
                        background: "rgba(16,185,129,0.12)",
                        color: "#10B981",
                      }}
                    >
                      🔥 12 day streak
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      ["67%", "Course Progress"],
                      ["2,840", "XP Earned"],
                      ["3", "Courses"],
                    ].map(([v, l]) => (
                      <div
                        key={l}
                        className="p-2.5 rounded-xl text-center"
                        style={{ background: "rgba(59,130,246,0.06)" }}
                      >
                        <div className="text-base font-bold font-display gradient-text">
                          {v}
                        </div>
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: "#64748B" }}
                        >
                          {l}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    className="rounded-xl p-3 mb-3"
                    style={{
                      background: "rgba(139,92,246,0.08)",
                      border: "1px solid rgba(139,92,246,0.15)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Brain size={14} style={{ color: "#8B5CF6" }} />
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "#8B5CF6" }}
                      >
                        AI Tutor Suggestion
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: "#94A3B8" }}>
                      You have been spending more time on loops. Try the
                      advanced exercises in Module 2 to solidify your
                      understanding.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p
                      className="text-xs font-medium"
                      style={{ color: "#64748B" }}
                    >
                      Current Course
                    </p>
                    <div
                      className="flex items-center gap-3 p-2.5 rounded-xl"
                      style={{
                        background: "rgba(59,130,246,0.06)",
                        border: "1px solid rgba(59,130,246,0.1)",
                      }}
                    >
                      <div className="w-8 h-8 rounded-lg gradient-blue-purple flex items-center justify-center flex-shrink-0">
                        <Code2 size={14} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-medium truncate"
                          style={{ color: "#F1F5F9" }}
                        >
                          Python for AI
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="flex-1 h-1 rounded-full"
                            style={{ background: "rgba(59,130,246,0.15)" }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{ width: "67%", background: "#3B82F6" }}
                            />
                          </div>
                          <span
                            className="text-xs"
                            style={{ color: "#3B82F6" }}
                          >
                            67%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute -top-4 -right-4 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
                style={{
                  background: "rgba(139,92,246,0.9)",
                  color: "#fff",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 0 20px rgba(139,92,246,0.4)",
                }}
              >
                <Brain size={14} />
                AI Tutor Active
              </div>

              <div
                className="absolute -bottom-4 -left-4 px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(13,20,33,0.95)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(16,185,129,0.15)" }}
                  >
                    <Award size={16} style={{ color: "#10B981" }} />
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "#10B981" }}
                    >
                      Certificate Earned!
                    </p>
                    <p className="text-xs" style={{ color: "#64748B" }}>
                      Machine Learning Fundamentals
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 lg:py-32" style={{ background: "#060A12" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-4"
              style={{ background: "rgba(59,130,246,0.1)", color: "#3B82F6" }}
            >
              <Sparkles size={12} /> Platform Features
            </div>
            <h2
              className="text-4xl lg:text-5xl font-bold font-display mb-4"
              style={{ color: "#F1F5F9" }}
            >
              Everything you need to{" "}
              <span className="gradient-text">master new skills</span>
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "#64748B" }}
            >
              Our AI-first platform combines intelligent tutoring, interactive
              coding, and real projects into one seamless learning experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={Brain}
              title="AI Personal Tutor"
              desc="Your 24/7 AI tutor explains concepts, answers questions, and adapts to your learning style in real time."
              color="#8B5CF6"
            />
            <FeatureCard
              icon={Play}
              title="Interactive Lessons"
              desc="Video lessons, live code examples, and interactive exercises that make complex topics click."
              color="#3B82F6"
            />
            <FeatureCard
              icon={Code2}
              title="Coding Laboratory"
              desc="A full browser-based IDE with terminal, live preview, and instant AI code review and error explanation."
              color="#06B6D4"
            />
            <FeatureCard
              icon={Target}
              title="AI Assessment"
              desc="Intelligent quizzes and coding challenges that adapt to your level and provide detailed feedback."
              color="#F59E0B"
            />
            <FeatureCard
              icon={BookOpen}
              title="Real Projects"
              desc="Build portfolio-ready projects under guidance from your AI mentor. Ship real products, not toy exercises."
              color="#10B981"
            />
            <FeatureCard
              icon={Award}
              title="Verified Certificates"
              desc="Blockchain-verified certificates with unique QR codes recognized by top employers across Africa."
              color="#EC4899"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section
        className="py-20"
        style={{ borderTop: "1px solid rgba(59,130,246,0.08)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2
                className="text-3xl lg:text-4xl font-bold font-display mb-2"
                style={{ color: "#F1F5F9" }}
              >
                Explore <span className="gradient-text">Categories</span>
              </h2>
              <p style={{ color: "#64748B" }}>Find your learning path</p>
            </div>
            <button
              onClick={() => navigate("/marketplace")}
              className="hidden sm:flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: "#3B82F6" }}
            >
              All Courses <ArrowRight size={16} />
            </button>
          </div>

          <div
            className="flex gap-4 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate("/marketplace")}
                className="flex-shrink-0 flex flex-col items-center gap-3 px-6 py-5 rounded-2xl border transition-all hover:-translate-y-1"
                style={{
                  background: "#0D1421",
                  borderColor: "rgba(59,130,246,0.1)",
                  minWidth: "160px",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = `${cat.color}40`
                  ;(e.currentTarget as HTMLElement).style.background = "#141E30"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(59,130,246,0.1)"
                  ;(e.currentTarget as HTMLElement).style.background = "#0D1421"
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
                  style={{ background: `${cat.color}18`, color: cat.color }}
                >
                  {cat.icon}
                </div>
                <div className="text-center">
                  <p
                    className="text-sm font-semibold font-display"
                    style={{ color: "#F1F5F9" }}
                  >
                    {cat.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
                    {cat.count} courses
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        className="py-20 lg:py-32"
        style={{
          background: "#0D1421",
          borderTop: "1px solid rgba(59,130,246,0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl lg:text-5xl font-bold font-display mb-4"
              style={{ color: "#F1F5F9" }}
            >
              How it <span className="gradient-text">works</span>
            </h2>
            <p
              className="text-lg max-w-xl mx-auto"
              style={{ color: "#64748B" }}
            >
              Five steps from zero to certified professional
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                n: "01",
                icon: BookOpen,
                title: "Choose Course",
                desc: "Browse 48+ expert-curated courses across 5 categories",
                color: "#3B82F6",
              },
              {
                n: "02",
                icon: Brain,
                title: "Learn With AI",
                desc: "Your personal AI tutor guides every concept, adapting to you",
                color: "#8B5CF6",
              },
              {
                n: "03",
                icon: Code2,
                title: "Practice",
                desc: "Solve exercises and coding challenges in the interactive lab",
                color: "#06B6D4",
              },
              {
                n: "04",
                icon: Target,
                title: "Build Projects",
                desc: "Ship real portfolio projects with AI mentorship throughout",
                color: "#F59E0B",
              },
              {
                n: "05",
                icon: Award,
                title: "Get Certified",
                desc: "Earn blockchain-verified certificates employers trust",
                color: "#10B981",
              },
            ].map(({ n, icon: Icon, title, desc, color }, i) => (
              <div
                key={n}
                className="relative flex flex-col items-center text-center"
              >
                {i < 4 && (
                  <div
                    className="hidden lg:block absolute top-8 left-1/2 w-full h-px"
                    style={{
                      background: `linear-gradient(90deg, ${color}40, transparent)`,
                      marginLeft: "24px",
                    }}
                  />
                )}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 relative z-10"
                  style={{
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                  }}
                >
                  <Icon size={24} style={{ color }} />
                </div>
                <div
                  className="text-xs font-mono mb-2"
                  style={{ color: "#475569" }}
                >
                  {n}
                </div>
                <h3
                  className="font-semibold mb-2 font-display"
                  style={{ color: "#F1F5F9" }}
                >
                  {title}
                </h3>
                <p className="text-sm" style={{ color: "#64748B" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate("/register")}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold gradient-blue-purple text-white hover:opacity-90 transition-all"
              style={{ boxShadow: "0 0 30px rgba(59,130,246,0.3)" }}
            >
              Start Your Journey <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section
        className="py-20 lg:py-32"
        style={{
          background: "#060A12",
          borderTop: "1px solid rgba(59,130,246,0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2
                className="text-3xl lg:text-4xl font-bold font-display mb-2"
                style={{ color: "#F1F5F9" }}
              >
                Featured <span className="gradient-text">Courses</span>
              </h2>
              <p style={{ color: "#64748B" }}>
                Start with our most popular courses
              </p>
            </div>
            <button
              onClick={() => navigate("/marketplace")}
              className="hidden sm:flex items-center gap-2 text-sm font-medium"
              style={{ color: "#3B82F6" }}
            >
              View All <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        className="py-20 lg:py-32"
        style={{
          background: "#0D1421",
          borderTop: "1px solid rgba(59,130,246,0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2
              className="text-4xl lg:text-5xl font-bold font-display mb-4"
              style={{ color: "#F1F5F9" }}
            >
              Real <span className="gradient-text">success stories</span>
            </h2>
            <p className="text-lg" style={{ color: "#64748B" }}>
              From our community of learners
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl"
                style={{
                  background: "#141E30",
                  border: "1px solid rgba(59,130,246,0.1)",
                }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill="#F59E0B"
                      style={{ color: "#F59E0B" }}
                    />
                  ))}
                </div>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: "#94A3B8" }}
                >
                  &quot;{t.text}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#F1F5F9" }}
                    >
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: "#475569" }}>
                      {t.role}
                    </p>
                  </div>
                </div>
                <div
                  className="mt-3 text-xs px-2 py-1 rounded-md inline-block"
                  style={{
                    background: "rgba(59,130,246,0.08)",
                    color: "#3B82F6",
                  }}
                >
                  {t.course}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        className="py-20 lg:py-32"
        style={{
          background: "#060A12",
          borderTop: "1px solid rgba(59,130,246,0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2
              className="text-4xl lg:text-5xl font-bold font-display mb-4"
              style={{ color: "#F1F5F9" }}
            >
              Simple, transparent <span className="gradient-text">pricing</span>
            </h2>
            <p className="text-lg" style={{ color: "#64748B" }}>
              Start free, scale as you grow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-7 rounded-2xl transition-all ${
                  plan.highlighted ? "scale-105" : ""
                }`}
                style={{
                  background: plan.highlighted
                    ? "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.12))"
                    : "#0D1421",
                  border: plan.highlighted
                    ? "1px solid rgba(99,102,241,0.4)"
                    : "1px solid rgba(59,130,246,0.1)",
                  boxShadow: plan.highlighted
                    ? "0 0 40px rgba(99,102,241,0.15)"
                    : "none",
                }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white gradient-blue-purple">
                    Most Popular
                  </div>
                )}
                <h3
                  className="text-xl font-bold font-display mb-1"
                  style={{ color: "#F1F5F9" }}
                >
                  {plan.name}
                </h3>
                <p className="text-sm mb-5" style={{ color: "#64748B" }}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  {plan.price === 0 ? (
                    <span className="text-4xl font-bold font-display gradient-text">
                      Free
                    </span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold font-display gradient-text">
                        ₦{plan.price.toLocaleString()}
                      </span>
                      <span
                        className="text-sm ml-1"
                        style={{ color: "#475569" }}
                      >
                        {plan.period}
                      </span>
                    </>
                  )}
                </div>
                <ul className="space-y-2.5 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle
                        size={15}
                        style={{
                          color: "#10B981",
                          flexShrink: 0,
                          marginTop: "1px",
                        }}
                      />
                      <span style={{ color: "#94A3B8" }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/register")}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{
                    background: plan.highlighted
                      ? "linear-gradient(135deg,#3B82F6,#8B5CF6)"
                      : "rgba(59,130,246,0.1)",
                    color: plan.highlighted ? "#fff" : "#3B82F6",
                    boxShadow: plan.highlighted
                      ? "0 0 20px rgba(59,130,246,0.3)"
                      : "none",
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="py-20"
        style={{
          background: "#0D1421",
          borderTop: "1px solid rgba(59,130,246,0.08)",
        }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2
              className="text-4xl font-bold font-display mb-4"
              style={{ color: "#F1F5F9" }}
            >
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden border transition-all"
                style={{
                  background: "#141E30",
                  borderColor:
                    openFaq === i
                      ? "rgba(59,130,246,0.3)"
                      : "rgba(59,130,246,0.1)",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span
                    className="text-sm font-semibold pr-4"
                    style={{ color: "#F1F5F9" }}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    style={{
                      color: "#64748B",
                      flexShrink: 0,
                      transform: openFaq === i ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#64748B" }}
                    >
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 lg:py-32 relative overflow-hidden"
        style={{
          background: "#060A12",
          borderTop: "1px solid rgba(59,130,246,0.08)",
        }}
      >
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(59,130,246,0.15), transparent)",
            }}
          />
        </div>
        <div className="relative max-w-3xl mx-auto text-center px-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6"
            style={{ background: "rgba(59,130,246,0.1)", color: "#3B82F6" }}
          >
            <Zap size={12} /> Join 12,847+ learners
          </div>
          <h2
            className="text-4xl lg:text-5xl font-bold font-display mb-6"
            style={{ color: "#F1F5F9" }}
          >
            Ready to build your <span className="gradient-text">future?</span>
          </h2>
          <p className="text-lg mb-8" style={{ color: "#64748B" }}>
            Start your AI-powered learning journey today. First 3 courses are
            free.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold gradient-blue-purple text-white hover:opacity-90 transition-all"
              style={{ boxShadow: "0 0 30px rgba(59,130,246,0.35)" }}
            >
              <Zap size={18} /> Start Learning Free
            </button>
            <button
              onClick={() => navigate("/marketplace")}
              className="flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold border transition-all"
              style={{ borderColor: "rgba(59,130,246,0.2)", color: "#94A3B8" }}
            >
              Browse Courses <ArrowRight size={16} />
            </button>
          </div>
          <div
            className="mt-8 flex flex-wrap justify-center gap-6 text-sm"
            style={{ color: "#475569" }}
          >
            {[
              "No credit card required",
              "7-day money-back guarantee",
              "Cancel anytime",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <CheckCircle size={14} style={{ color: "#10B981" }} />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
