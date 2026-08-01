import { ArrowRight, Home } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center px-6 mesh-bg">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold font-display mb-4 gradient-text">
          404
        </div>
        <h1
          className="text-2xl font-bold font-display mb-3"
          style={{ color: "#F1F5F9" }}
        >
          Page not found
        </h1>
        <p className="text-base mb-8" style={{ color: "#64748B" }}>
          This page doesn't exist or has been moved. Let's get you back on
          track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold gradient-blue-purple text-white hover:opacity-90 transition-all"
            style={{ boxShadow: "0 0 20px rgba(59,130,246,0.25)" }}
          >
            <Home size={18} /> Go Home
          </button>
          <button
            onClick={() => navigate("/marketplace")}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border transition-all"
            style={{ borderColor: "rgba(59,130,246,0.2)", color: "#94A3B8" }}
          >
            Browse Courses <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
