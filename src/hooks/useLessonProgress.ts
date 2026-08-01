import { useState, useEffect, useCallback } from "react"

const STORAGE_KEY = "smugflex_lesson_progress"

function getStoredProgress(): Record<string, string[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveProgress(progress: Record<string, string[]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function useLessonProgress(courseId: string, totalLessons: number) {
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const progress = getStoredProgress()
    return progress[courseId] || []
  })

  useEffect(() => {
    const progress = getStoredProgress()
    progress[courseId] = completedLessons
    saveProgress(progress)
  }, [courseId, completedLessons])

  const toggleLesson = useCallback((lessonId: string) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId],
    )
  }, [])

  const isCompleted = useCallback(
    (lessonId: string) => {
      return completedLessons.includes(lessonId)
    },
    [completedLessons],
  )

  const progress =
    totalLessons > 0
      ? Math.round((completedLessons.length / totalLessons) * 100)
      : 0

  return { completedLessons, toggleLesson, isCompleted, progress }
}
