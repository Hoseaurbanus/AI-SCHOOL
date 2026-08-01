import { useState } from "react"
import { ArrowRight, Clock, CheckCircle, BookOpen, Award } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useMyEnrollments } from "../hooks/useLessonProgress"
import ProgressRing from "../components/course/ProgressRing"
import LoadingSpinner from "../components/ui/LoadingSpinner"

const tabs = ["All", "Active", "Completed"]

export default function MyCourses() {
  const navigate = useNavigate()
  const [tab, setTab] = useState("All")
  const { data: enrollments = [], isLoading } = useMyEnrollments()

  const filtered =
    tab === "All"
      ? enrollments
      : tab === "Active"
        ? enrollments.filter((e: { status: string }) => e.status === "active")
        : enrollments.filter(
            (e: { status: string }) => e.status === "completed"
          )

  const activeCount = enrollments.filter(
    (e: { status: string }) => e.status === "active"
  ).length
  const completedCount = enrollments.filter(
    (e: { status: string }) => e.status === "completed"
  ).length

  if (isLoading) {
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
      className="p-4 sm:p-6 lg:p-8"
      style={{ background: "#060A12", minHeight: "100vh" }}
    >
      <div className="mb-6">
        <h1
          className="text-2xl font-bold font-display"
          style={{ color: "#F1F5F9" }}
        >
          My Courses
        </h1>
        <p className="text-sm mt-1" style={{ color: "#64748B" }}>
          Track and continue your learning
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            icon: BookOpen,
            v: activeCount.toString(),
            l: "Active",
            color: "#3B82F6",
          },
          {
            icon: CheckCircle,
            v: completedCount.toString(),
            l: "Completed",
            color: "#10B981",
          },
          {
            icon: Award,
            v: completedCount.toString(),
            l: "Certificates",
            color: "#F59E0B",
          },
        ].map(({ icon: Icon, v, l, color }) => (
          <div
            key={l}
            className="p-4 rounded-xl text-center"
            style={{
              background: "#0D1421",
              border: "1px solid rgba(59,130,246,0.1)",
            }}
          >
            <Icon size={20} className="mx-auto mb-2" style={{ color }} />
            <div className="text-xl font-bold font-display gradient-text">
              {v}
            </div>
            <div className="text-xs" style={{ color: "#64748B" }}>
              {l}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl w-fit"
        style={{ background: "rgba(59,130,246,0.06)" }}
      >
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t ? "#1A2540" : "transparent",
              color: tab === t ? "#3B82F6" : "#64748B",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Course list */}
      <div className="space-y-4">
        {filtered.map(
          (enrollment: {
            id: string
            courseId: string
            progress: number
            status: string
            course?: { title: string; thumbnail?: string; instructor?: string; category?: string }
          }) => (
            <div
              key={enrollment.id}
              className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01]"
              style={{
                background: "#0D1421",
                border: "1px solid rgba(59,130,246,0.1)",
              }}
              onClick={() => navigate(`/courses/${enrollment.courseId}/learn`)}
            >
              <img
                src={enrollment.course?.thumbnail || "/placeholder-course.jpg"}
                alt={enrollment.course?.title || "Course"}
                className="w-full sm:w-40 h-28 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3
                      className="font-bold font-display"
                      style={{ color: "#F1F5F9" }}
                    >
                      {enrollment.course?.title || "Course"}
                    </h3>
                    <p className="text-xs mt-1" style={{ color: "#64748B" }}>
                      {enrollment.course?.instructor || "Instructor"} ·{" "}
                      {enrollment.course?.category || "Category"}
                    </p>
                  </div>
                  <ProgressRing
                    progress={enrollment.progress}
                    size={48}
                    strokeWidth={3}
                  />
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <div
                    className="flex items-center gap-2 text-xs"
                    style={{ color: "#64748B" }}
                  >
                    <Clock size={12} />
                    <span>{Math.round(enrollment.progress)}% complete</span>
                  </div>
                  <div
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background:
                        enrollment.status === "active"
                          ? "rgba(59,130,246,0.12)"
                          : "rgba(16,185,129,0.12)",
                      color:
                        enrollment.status === "active"
                          ? "#3B82F6"
                          : "#10B981",
                    }}
                  >
                    {enrollment.status === "active"
                      ? "In Progress"
                      : "Completed"}
                  </div>
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
                        background:
                          enrollment.status === "completed"
                            ? "#10B981"
                            : "#3B82F6",
                      }}
                    />
                  </div>
                </div>
              </div>

              <ArrowRight
                size={18}
                className="hidden sm:block self-center"
                style={{ color: "#475569" }}
              />
            </div>
          )
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen
              size={48}
              className="mx-auto mb-4"
              style={{ color: "#475569" }}
            />
            <p className="text-lg" style={{ color: "#64748B" }}>
              No courses in this category
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
  )
}
