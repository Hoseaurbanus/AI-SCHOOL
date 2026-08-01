import { useState } from "react"
import { ChevronDown, Play, BookOpen, Code2, CheckCircle } from "lucide-react"
import type { CourseModule } from "../../types"

interface CurriculumListProps {
  modules: CourseModule[]
  currentModule?: number
  currentLesson?: number
  onLessonClick?: (moduleId: number, lessonId: number) => void
}

const lessonIcons = {
  video: Play,
  reading: BookOpen,
  exercise: Code2,
  quiz: CheckCircle,
}

export default function CurriculumList({
  modules,
  currentModule = 0,
  currentLesson = 0,
  onLessonClick,
}: CurriculumListProps) {
  const [openModule, setOpenModule] = useState<number | null>(0)

  return (
    <div className="space-y-3">
      {modules.map((module, moduleIdx) => {
        const isOpen = openModule === moduleIdx
        const isCurrent = moduleIdx === currentModule
        const completedLessons = module.lessons.filter(
          (l) => l.completed,
        ).length

        return (
          <div
            key={module.id}
            className="rounded-xl overflow-hidden"
            style={{
              background: "#0D1421",
              border: isCurrent
                ? "1px solid rgba(59,130,246,0.3)"
                : "1px solid rgba(59,130,246,0.1)",
            }}
          >
            <button
              onClick={() => setOpenModule(isOpen ? null : moduleIdx)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{
                    background: isCurrent
                      ? "rgba(59,130,246,0.2)"
                      : "rgba(59,130,246,0.08)",
                    color: isCurrent ? "#3B82F6" : "#64748B",
                  }}
                >
                  {moduleIdx + 1}
                </div>
                <div>
                  <h4
                    className="font-semibold text-sm"
                    style={{ color: "#F1F5F9" }}
                  >
                    {module.title}
                  </h4>
                  <p className="text-xs" style={{ color: "#64748B" }}>
                    {module.lessons.length} lessons · {module.duration} ·{" "}
                    {completedLessons}/{module.lessons.length} completed
                  </p>
                </div>
              </div>
              <ChevronDown
                size={18}
                style={{ color: "#64748B" }}
                className={`transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div style={{ borderTop: "1px solid rgba(59,130,246,0.08)" }}>
                {module.lessons.map((lesson, lessonIdx) => {
                  const Icon = lessonIcons[lesson.type]
                  const isActive = isCurrent && lessonIdx === currentLesson
                  const isCompleted = lesson.completed

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => onLessonClick?.(moduleIdx, lessonIdx)}
                      className="w-full flex items-center gap-3 p-4 pl-16 text-left transition-all"
                      style={{
                        background: isActive
                          ? "rgba(59,130,246,0.08)"
                          : "transparent",
                        borderLeft: isActive
                          ? "2px solid #3B82F6"
                          : "2px solid transparent",
                      }}
                    >
                      <Icon
                        size={14}
                        style={{
                          color: isCompleted
                            ? "#10B981"
                            : isActive
                              ? "#3B82F6"
                              : "#64748B",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        className="text-sm flex-1"
                        style={{
                          color: isActive
                            ? "#F1F5F9"
                            : isCompleted
                              ? "#94A3B8"
                              : "#64748B",
                        }}
                      >
                        {lesson.title}
                      </span>
                      <span className="text-xs" style={{ color: "#64748B" }}>
                        {lesson.duration}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
