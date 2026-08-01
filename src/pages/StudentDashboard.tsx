import {
  ArrowRight,
  Brain,
  Code2,
  TrendingUp,
  Award,
  Flame,
  BookOpen,
  Clock,
  Target,
  CheckCircle,
  Star,
  Zap,
  Play,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useStudentStats, useAIInsights } from "../hooks/useStudentStats"
import { enrolledCourses, courses } from "../data/mockData"
import ProgressRing from "../components/course/ProgressRing"
import LoadingSpinner from "../components/ui/LoadingSpinner"

function StatCard({
  icon: Icon,
  value,
  label,
  sub,
  color,
}: {
  icon: React.ElementType
  value: string
  label: string
  sub?: string
  color: string
}) {
  return (
    <div
      className="p-5 rounded-2xl"
      style={{
        background: "#0D1421",
        border: "1px solid rgba(59,130,246,0.1)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        {sub && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: "rgba(16,185,129,0.1)", color: "#10B981" }}
          >
            {sub}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold font-display gradient-text">
        {value}
      </div>
      <div className="text-sm mt-0.5" style={{ color: "#64748B" }}>
        {label}
      </div>
    </div>
  )
}

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Flame,
  Code2,
  TrendingUp,
  Award,
  Target,
}

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { data: statsData, isLoading: statsLoading } = useStudentStats()
  const { data: insightsData } = useAIInsights()

  const stats = statsData?.data
  const insights = insightsData?.data || []
  const activeEnrollments = enrolledCourses.filter((c) => c.status === "active")

  if (statsLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#060A12" }}
      >
        <LoadingSpinner size={32} />
      </div>
    )
  }

  return (
    <div
      className="p-4 sm:p-6 lg:p-8 space-y-6"
      style={{ background: "#060A12", minHeight: "100vh" }}
    >
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold font-display"
            style={{ color: "#F1F5F9" }}
          >
            Good morning, <span className="gradient-text">Student</span> 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>
            You have {stats?.activeCourses || 0} active courses ·{" "}
            {stats?.currentStreak || 0}-day streak
          </p>
        </div>
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl self-start"
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.2)",
          }}
        >
          <Flame size={20} style={{ color: "#F59E0B" }} />
          <div>
            <p className="text-sm font-bold" style={{ color: "#F59E0B" }}>
              {stats?.currentStreak || 0}-day streak!
            </p>
            <p className="text-xs" style={{ color: "#64748B" }}>
              Keep it up
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          value={`${stats?.activeCourses || 0}`}
          label="Active Courses"
          sub="In Progress"
          color="#3B82F6"
        />
        <StatCard
          icon={Clock}
          value={`${stats?.totalHours || 0}h`}
          label="Learning Time"
          sub="Total"
          color="#8B5CF6"
        />
        <StatCard
          icon={Target}
          value={`${stats?.lessonsCompleted || 0}/${stats?.totalLessons || 0}`}
          label="Lessons Done"
          sub={`${Math.round(((stats?.lessonsCompleted || 0) / (stats?.totalLessons || 1)) * 100)}%`}
          color="#10B981"
        />
        <StatCard
          icon={Award}
          value={`${stats?.avgScore || 0}%`}
          label="Average Score"
          sub="Great!"
          color="#F59E0B"
        />
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div>
          <h2
            className="text-lg font-bold font-display mb-4"
            style={{ color: "#F1F5F9" }}
          >
            <Brain
              size={18}
              className="inline mr-2"
              style={{ color: "#8B5CF6" }}
            />
            AI Insights
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight) => {
              const Icon = iconMap[insight.icon] || Brain
              return (
                <div
                  key={insight.id}
                  className="p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
                  style={{
                    background: "#0D1421",
                    border: "1px solid rgba(59,130,246,0.1)",
                  }}
                  onClick={() =>
                    insight.actionPath && navigate(insight.actionPath)
                  }
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background:
                          insight.type === "achievement"
                            ? "rgba(245,158,11,0.12)"
                            : insight.type === "recommendation"
                              ? "rgba(59,130,246,0.12)"
                              : insight.type === "tip"
                                ? "rgba(16,185,129,0.12)"
                                : "rgba(139,92,246,0.12)",
                      }}
                    >
                      <Icon
                        size={18}
                        style={{
                          color:
                            insight.type === "achievement"
                              ? "#F59E0B"
                              : insight.type === "recommendation"
                                ? "#3B82F6"
                                : insight.type === "tip"
                                  ? "#10B981"
                                  : "#8B5CF6",
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="font-semibold text-sm"
                        style={{ color: "#F1F5F9" }}
                      >
                        {insight.title}
                      </h3>
                      <p className="text-xs mt-1" style={{ color: "#64748B" }}>
                        {insight.description}
                      </p>
                      {insight.action && (
                        <span
                          className="text-xs font-medium mt-2 inline-flex items-center gap-1"
                          style={{ color: "#3B82F6" }}
                        >
                          {insight.action} <ArrowRight size={10} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Active Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-bold font-display"
            style={{ color: "#F1F5F9" }}
          >
            Continue Learning
          </h2>
          <button
            onClick={() => navigate("/my-courses")}
            className="text-sm font-medium flex items-center gap-1"
            style={{ color: "#3B82F6" }}
          >
            View All <ArrowRight size={14} />
          </button>
        </div>

        <div className="space-y-4">
          {activeEnrollments.map((enrollment) => {
            const course = courses.find((c) => c.id === enrollment.courseId)
            if (!course) return null

            return (
              <div
                key={enrollment.id}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
                style={{
                  background: "#0D1421",
                  border: "1px solid rgba(59,130,246,0.1)",
                }}
                onClick={() => navigate(`/courses/${course.id}/learn`)}
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full sm:w-40 h-28 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className="font-bold font-display"
                        style={{ color: "#F1F5F9" }}
                      >
                        {course.title}
                      </h3>
                      <p className="text-xs mt-1" style={{ color: "#64748B" }}>
                        {course.instructor} · Module{" "}
                        {enrollment.currentModule + 1}, Lesson{" "}
                        {enrollment.currentLesson + 1}
                      </p>
                    </div>
                    <ProgressRing
                      progress={enrollment.progress}
                      size={48}
                      strokeWidth={3}
                    />
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: "rgba(59,130,246,0.1)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${enrollment.progress}%`,
                          background: "#3B82F6",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3">
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                      style={{
                        background: "rgba(59,130,246,0.1)",
                        color: "#3B82F6",
                      }}
                    >
                      <Play size={14} /> Continue
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                      style={{
                        background: "rgba(139,92,246,0.1)",
                        color: "#8B5CF6",
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate("/ai-tutor")
                      }}
                    >
                      <Brain size={14} /> Ask AI
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {activeEnrollments.length === 0 && (
            <div
              className="text-center py-12 rounded-xl"
              style={{
                background: "#0D1421",
                border: "1px solid rgba(59,130,246,0.1)",
              }}
            >
              <BookOpen
                size={48}
                className="mx-auto mb-4"
                style={{ color: "#475569" }}
              />
              <p className="text-lg" style={{ color: "#64748B" }}>
                No active courses
              </p>
              <button
                onClick={() => navigate("/marketplace")}
                className="mt-4 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: "rgba(59,130,246,0.1)", color: "#3B82F6" }}
              >
                Browse Courses
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2
          className="text-lg font-bold font-display mb-4"
          style={{ color: "#F1F5F9" }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              icon: Code2,
              label: "Coding Lab",
              path: "/coding-lab",
              color: "#3B82F6",
            },
            {
              icon: Brain,
              label: "AI Tutor",
              path: "/ai-tutor",
              color: "#8B5CF6",
            },
            {
              icon: Award,
              label: "Certificates",
              path: "/certificates",
              color: "#F59E0B",
            },
            {
              icon: TrendingUp,
              label: "Portfolio",
              path: "/portfolio",
              color: "#10B981",
            },
          ].map(({ icon: Icon, label, path, color }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-[1.02]"
              style={{
                background: "#0D1421",
                border: "1px solid rgba(59,130,246,0.1)",
              }}
            >
              <Icon size={24} style={{ color }} />
              <span
                className="text-sm font-medium"
                style={{ color: "#F1F5F9" }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
