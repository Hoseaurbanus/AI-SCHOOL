import { useState, useEffect, useCallback } from "react"
import { notifications as mockNotifications } from "../data/mockData"
import type { Notification } from "../types"

const STORAGE_KEY = "smugflex_notifications"

function getStoredNotifications(): Notification[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : mockNotifications
  } catch {
    return mockNotifications
  }
}

function saveNotifications(notifications: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    getStoredNotifications(),
  )

  useEffect(() => {
    saveNotifications(notifications)
  }, [notifications])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return { notifications, unreadCount, markAsRead, markAllAsRead, clearAll }
}
