import { useState, useEffect } from "react"
import { useSearchParams, useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Wrench,
} from "lucide-react"
import { useCourse } from "../hooks/useCourses"
import { useEnrollment, useCompleteLesson } from "../hooks/useLessonProgress"
import CurriculumList from "../components/course/CurriculumList"
import LessonContent from "../components/learning/LessonContent"
import NotesPanel from "../components/learning/NotesPanel"
import ResourcesList from "../components/learning/ResourcesList"
import LoadingSpinner from "../components/ui/LoadingSpinner"

type Tab = "lesson" | "notes" | "resources"

export default function CourseLearning() {
  const navigate = useNavigate()
  const { courseId: urlCourseId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const courseId = urlCourseId || searchParams.get("courseId") || ""
  const moduleIndex = parseInt(searchParams.get("module") || "0", 10)
  const lessonIndex = parseInt(searchParams.get("lesson") || "0", 10)

  const { data: course, isLoading: courseLoading } = useCourse(courseId)
  const { data: enrollment, isLoading: enrollmentLoading } =
    useEnrollment(courseId)
  const completeLesson = useCompleteLesson()

  const curriculum = course?.modules || []
  const currentModule = curriculum[moduleIndex] || curriculum[0]
  const currentLesson = currentModule?.lessons?.[lessonIndex] || null
  const totalLessons = curriculum.reduce(
    (sum: number, m: { lessons?: unknown[] }) =>
      sum + (m.lessons?.length || 0),
    0
  )

  const completedLessons = enrollment?.modules?.flatMap(
    (m: { lessons: { completed: boolean; id: string }[] }) =>
      m.lessons.filter((l) => l.completed).map((l) => l.id)
  ) || []

  const isCompleted = (lessonId: string) =>
    completedLessons.includes(lessonId)

  const [activeTab, setActiveTab] = useState<Tab>("lesson")

  const lessonContent = currentLesson?.content || []
  const lessonResources = currentLesson?.resources || []

  const updateLesson = (newModule: number, newLesson: number) => {
    setSearchParams({
      courseId,
      module: String(newModule),
      lesson: String(newLesson),
    })
  }

  const goNext = () => {
    if (lessonIndex < (currentModule?.lessons?.length || 0) - 1) {
      updateLesson(moduleIndex, lessonIndex + 1)
    } else if (moduleIndex < curriculum.length - 1) {
      updateLesson(moduleIndex + 1, 0)
    }
  }

  const goPrev = () => {
    if (lessonIndex > 0) {
      updateLesson(moduleIndex, lessonIndex - 1)
    } else if (moduleIndex > 0) {
      const prevModule = curriculum[moduleIndex - 1]
      updateLesson(moduleIndex - 1, (prevModule?.lessons?.length || 1) - 1)
    }
  }

  const handleLessonClick = (moduleIdx: number, lessonIdx: number) => {
    updateLesson(moduleIdx, lessonIdx)
  }

  const handleMarkComplete = () => {
    if (enrollment && currentLesson) {
      completeLesson.mutate({
        enrollmentId: enrollment.id,
        lessonId: currentLesson.id,
      })
    }
  }

  const progress =
    totalLessons > 0
      ? Math.round((completedLessons.length / totalLessons) * 100)
      : 0

  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: "lesson", label: "Lesson", icon: BookOpen },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "resources", label: "Resources", icon: Wrench },
  ]

  if (courseLoading || enrollmentLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#060A12" }}
      >
        <LoadingSpinner size={32} />
      </div>
    )
  }

  if (!course) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#060A12" }}
      >
        <p style={{ color: "#64748B" }}>Course not found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: "#060A12" }}>
      {/* Top Bar */}
      <div
        className="flex items-center gap-4 px-4 py-3 flex-shrink-0"
        style={{
          background: "#0D1421",
          borderBottom: "1px solid rgba(59,130,246,0.1)",
        }}
      >
        <button
          onClick={() => navigate("/my-courses")}
          className="flex items-center gap-2 text-sm"
          style={{ color: "#64748B" }}
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">My Courses</span>
        </button>

        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium truncate"
            style={{ color: "#F1F5F9" }}
          >
            {course.title}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="w-32 h-2 rounded-full overflow-hidden"
            style={{ background: "rgba(59,130,246,0.1)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, background: "#3B82F6" }}
            />
          </div>
          <span className="text-xs font-medium" style={{ color: "#3B82F6" }}>
            {progress}%
          </span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Curriculum */}
        <aside
          className="hidden lg:flex flex-col w-72 flex-shrink-0 overflow-y-auto"
          style={{
            background: "#0D1421",
            borderRight: "1px solid rgba(59,130,246,0.1)",
          }}
        >
          <div className="p-4">
            <CurriculumList
              modules={curriculum}
              currentModule={moduleIndex}
              currentLesson={lessonIndex}
              onLessonClick={handleLessonClick}
              completedLessons={completedLessons}
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div
            className="flex items-center gap-1 px-4 py-2 flex-shrink-0"
            style={{
              background: "#0D1421",
              borderBottom: "1px solid rgba(59,130,246,0.1)",
            }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                  style={{
                    background:
                      activeTab === tab.id
                        ? "rgba(59,130,246,0.1)"
                        : "transparent",
                    color: activeTab === tab.id ? "#3B82F6" : "#64748B",
                  }}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {activeTab === "lesson" && currentLesson && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <h1
                    className="text-2xl font-bold font-display"
                    style={{ color: "#F1F5F9" }}
                  >
                    {currentLesson.title}
                  </h1>
                  <button
                    onClick={handleMarkComplete}
                    disabled={isCompleted(currentLesson.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-50"
                    style={{
                      background: isCompleted(currentLesson.id)
                        ? "rgba(16,185,129,0.15)"
                        : "rgba(59,130,246,0.15)",
                      color: isCompleted(currentLesson.id)
                        ? "#10B981"
                        : "#3B82F6",
                      border: `1px solid ${
                        isCompleted(currentLesson.id)
                          ? "rgba(16,185,129,0.3)"
                          : "rgba(59,130,246,0.3)"
                      }`,
                    }}
                  >
                    <CheckCircle2 size={16} />
                    {isCompleted(currentLesson.id)
                      ? "Completed"
                      : "Mark Complete"}
                  </button>
                </div>

                {lessonContent.length > 0 ? (
                  <LessonContent content={lessonContent} />
                ) : (
                  <div
                    className="rounded-xl p-8 text-center"
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
                    <p className="text-sm" style={{ color: "#64748B" }}>
                      No content available for this lesson yet.
                    </p>
                  </div>
                )}

                {/* Navigation */}
                <div
                  className="flex items-center justify-between pt-4"
                  style={{ borderTop: "1px solid rgba(59,130,246,0.1)" }}
                >
                  <button
                    onClick={goPrev}
                    disabled={moduleIndex === 0 && lessonIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-40"
                    style={{
                      background: "#0D1421",
                      color: "#94A3B8",
                      border: "1px solid rgba(59,130,246,0.15)",
                    }}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <button
                    onClick={goNext}
                    disabled={
                      moduleIndex === curriculum.length - 1 &&
                      lessonIndex === (currentModule?.lessons?.length || 1) - 1
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-40"
                    style={{
                      background: "rgba(59,130,246,0.15)",
                      color: "#3B82F6",
                      border: "1px solid rgba(59,130,246,0.3)",
                    }}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notes" && currentLesson && (
              <div className="max-w-3xl mx-auto">
                <NotesPanel lessonId={currentLesson.id} userId="current" />
              </div>
            )}

            {activeTab === "resources" && (
              <div className="max-w-3xl mx-auto">
                <ResourcesList resources={lessonResources} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
