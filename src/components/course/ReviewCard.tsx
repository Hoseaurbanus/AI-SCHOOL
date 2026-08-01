import { Star, ThumbsUp } from "lucide-react"
import type { CourseReview } from "../../types"

interface ReviewCardProps {
  review: CourseReview
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div
      className="p-5 rounded-xl"
      style={{
        background: "#0D1421",
        border: "1px solid rgba(59,130,246,0.1)",
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <img
          src={review.userAvatar}
          alt={review.userName}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm" style={{ color: "#F1F5F9" }}>
              {review.userName}
            </h4>
            <span className="text-xs" style={{ color: "#64748B" }}>
              {new Date(review.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={12}
                fill={star <= review.rating ? "#F59E0B" : "transparent"}
                style={{ color: star <= review.rating ? "#F59E0B" : "#475569" }}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm leading-relaxed mb-3" style={{ color: "#94A3B8" }}>
        {review.comment}
      </p>

      <button
        className="flex items-center gap-2 text-xs transition-colors"
        style={{ color: "#64748B" }}
      >
        <ThumbsUp size={12} />
        <span>Helpful ({review.helpful})</span>
      </button>
    </div>
  )
}
