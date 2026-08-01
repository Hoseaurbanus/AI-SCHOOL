import { Star, Clock, Users, Brain, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { Course } from "../../types"

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate()

  return (
    <div
      className="group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02]"
      style={{
        background: "#0D1421",
        border: "1px solid rgba(59,130,246,0.1)",
      }}
      onClick={() => navigate(`/courses/${course.id}`)}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{
              background: "rgba(6,10,18,0.8)",
              color: "#F1F5F9",
              backdropFilter: "blur(8px)",
            }}
          >
            {course.level}
          </span>
          {course.aiTutor && (
            <span
              className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
              style={{
                background: "rgba(139,92,246,0.2)",
                color: "#A78BFA",
                backdropFilter: "blur(8px)",
              }}
            >
              <Brain size={10} /> AI Tutor
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="text-xs font-medium mb-2" style={{ color: "#3B82F6" }}>
          {course.category}
        </div>
        <h3
          className="font-bold font-display text-lg mb-2 line-clamp-2"
          style={{ color: "#F1F5F9" }}
        >
          {course.title}
        </h3>
        <p className="text-sm mb-4 line-clamp-2" style={{ color: "#94A3B8" }}>
          {course.description}
        </p>

        <div
          className="flex items-center gap-4 text-xs mb-4"
          style={{ color: "#64748B" }}
        >
          <div className="flex items-center gap-1">
            <Star size={12} fill="#F59E0B" style={{ color: "#F59E0B" }} />
            <span className="font-semibold" style={{ color: "#F59E0B" }}>
              {course.rating}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{course.students.toLocaleString()}</span>
          </div>
        </div>

        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: "1px solid rgba(59,130,246,0.1)" }}
        >
          <div>
            <span className="text-xl font-bold font-display gradient-text">
              ₦{course.price.toLocaleString()}
            </span>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: "rgba(59,130,246,0.1)",
              color: "#3B82F6",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/courses/${course.id}`)
            }}
          >
            View Course <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
