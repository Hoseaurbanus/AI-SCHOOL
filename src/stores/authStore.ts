import { create } from "zustand"
import type { AuthState, LoginRequest, RegisterRequest } from "../types"
import { useAuth } from "@clerk/clerk-react"

// This store now wraps Clerk's auth. The actual auth state is managed by Clerk.
// This store is kept for backward compatibility with components that use it directly.
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (_data: LoginRequest) => {
    // Clerk handles login via SignIn component
    set({ isLoading: false })
  },

  register: async (_data: RegisterRequest) => {
    // Clerk handles registration via SignUp component
    set({ isLoading: false })
  },

  logout: () => {
    // Clerk handles logout via signOut
    set({ user: null, token: null, isAuthenticated: false })
  },

  setUser: (user) => set({ user }),
}))

// Hook that syncs Clerk's auth state with the store
export function useSyncAuthStore() {
  const { isSignedIn, getToken, signOut } = useAuth()
  const { setUser, logout } = useAuthStore()

  return {
    ...useAuthStore(),
    syncWithClerk: async () => {
      if (isSignedIn) {
        const token = await getToken()
        if (token) {
          // Decode JWT to get user info (simplified - in production use a proper JWT decoder)
          const payload = JSON.parse(atob(token.split(".")[1]))
          setUser({
            id: payload.sub,
            email: payload.email || "",
            name: payload.name || "",
            phone: payload.phone,
            role: payload.role || "student",
            avatarUrl: payload.avatar_url,
            onboardingCompleted: payload.onboarding_completed ?? true,
            emailVerified: payload.email_verified ?? false,
            createdAt: payload.created_at || new Date().toISOString(),
          })
          useAuthStore.setState({ token, isAuthenticated: true })
        }
      } else {
        useAuthStore.setState({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      }
    },
  }
}
