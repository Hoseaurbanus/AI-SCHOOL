import { api } from "../lib/api"
import type { ApiResponse, User, LoginRequest, RegisterRequest } from "../types"

export const authService = {
  async login(data: LoginRequest): Promise<{ user: User token: string }> {
    const response = await api.post<ApiResponse<{ user: User token: string }>>(
      "/auth/login",
      data,
    )
    return response.data.data
  },

  async register(data: RegisterRequest): Promise<{ user: User token: string }> {
    const response = await api.post<ApiResponse<{ user: User token: string }>>(
      "/auth/register",
      data,
    )
    return response.data.data
  },

  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>("/auth/me")
    return response.data.data
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post<ApiResponse<null>>("/auth/forgot-password", { email })
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout")
  },
}
