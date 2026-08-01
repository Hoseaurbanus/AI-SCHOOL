import { useState } from "react"
import { ArrowRight, Clock, CheckCircle, BookOpen, Award } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { enrolledCourses, courses } from "../data/mockData"
import ProgressRing from "../components/course/ProgressRing"

const tabs = ["All", "Active", "Completed", "Saved"]

export default function MyCourses() {
  const navigate = useNavigate()
  const [tab, setTab] = useState("All")

  const filtered =
    tab === "All"
      ? enrolledCourses
      : tab === "Active"
        ? enrolledCourses.filter((c) => c.status === "active")
        : tab === "Completed"
          ? enrolledCourses.filter((c) => c.status === "completed")
          : enrolledCourses.filter((c) => c.status === "saved")

  const activeCount = enrolledCourses.filter(
    (c) => c.status === "active",
  ).length
  const completedCount = enrolledCourses.filter(
    (c) => c.status === "completed",
  ).length
  const certCount = completedCount

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
            v: certCount.toString(),
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
        {filtered.map((enrollment) => {
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
                      {course.instructor} · {course.category}
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
                    <span>
                      Module {enrollment.currentModule + 1}, Lesson{" "}
                      {enrollment.currentLesson + 1}
                    </span>
                  </div>
                  <div
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background:
                        enrollment.status === "active"
                          ? "rgba(59,130,246,0.12)"
                          : enrollment.status === "completed"
                            ? "rgba(16,185,129,0.12)"
                            : "rgba(245,158,11,0.12)",
                      color:
                        enrollment.status === "active"
                          ? "#3B82F6"
                          : enrollment.status === "completed"
                            ? "#10B981"
                            : "#F59E0B",
                    }}
                  >
                    {enrollment.status === "active"
                      ? "In Progress"
                      : enrollment.status === "completed"
                        ? "Completed"
                        : "Saved"}
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
        })}

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
