import { api } from "../lib/api"

export interface Notification {
  id: string
  userId: string
  type: "course" | "achievement" | "reminder" | "system" | "assignment"
  title: string
  message: string
  read: boolean
  createdAt: string
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const { data } = await api.get("/notifications")
    return data.data || data
  },

  async markAsRead(id: string): Promise<void> {
    await api.put(`/notifications/${id}/read`)
  },

  async markAllAsRead(): Promise<void> {
    await api.put("/notifications/read-all")
  },

  async deleteNotification(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`)
  },
}
