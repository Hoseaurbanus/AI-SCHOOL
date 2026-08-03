import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const clerkEnabled = clerkPubKey && clerkPubKey !== "pk_test_your_key_here"

interface Props {
  requiredRole?: "student" | "admin"
}

export default function ProtectedRoute({ requiredRole }: Props) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#060A12" }}
      >
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#3B82F6", borderTopColor: "transparent" }}
        />
      </div>
    )
  }

  if (clerkEnabled && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
