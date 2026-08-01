import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react"
import { useCallback } from "react"
import type { LoginRequest, RegisterRequest } from "../types"

export function useAuth() {
  const { isLoaded, isSignedIn, getToken, signOut } = useClerkAuth()
  const { user: clerkUser } = useUser()

  const user = clerkUser
    ? {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name:
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
          clerkUser.username ||
          "",
        phone: clerkUser.phoneNumbers[0]?.phoneNumber,
        role: "student" as const,
        avatarUrl: clerkUser.imageUrl,
        onboardingCompleted: true,
        emailVerified:
          clerkUser.emailAddresses[0]?.verification?.status === "verified",
        createdAt:
          clerkUser.createdAt?.toISOString() || new Date().toISOString(),
      }
    : null

  const login = useCallback(async (_data: LoginRequest) => {
    window.location.href = "/login"
  }, [])

  const register = useCallback(async (_data: RegisterRequest) => {
    window.location.href = "/register"
  }, [])

  const logout = useCallback(async () => {
    await signOut()
  }, [signOut])

  return {
    user,
    isAuthenticated: isSignedIn,
    isLoading: !isLoaded,
    isStudent: true,
    isAdmin: false,
    login,
    register,
    logout,
    getToken,
  }
}
