import { useState } from "react"
import { Bell, CheckCheck, Trash2, Filter } from "lucide-react"
import { useNotifications } from "../hooks/useNotifications"
import NotificationItem from "../components/notifications/NotificationItem"
import type { NotificationType } from "../types"

type FilterType = "all" | "unread" | NotificationType

export default function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } =
    useNotifications()
  const [filter, setFilter] = useState<FilterType>("all")

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true
    if (filter === "unread") return !n.read
    return n.type === filter
  })

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "course", label: "Courses" },
    { id: "achievement", label: "Achievements" },
    { id: "system", label: "System" },
  ]

  return (
    <div className="min-h-screen" style={{ background: "#060A12" }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(59,130,246,0.15)" }}
            >
              <Bell size={20} style={{ color: "#3B82F6" }} />
            </div>
            <div>
              <h1
                className="text-xl font-bold font-display"
                style={{ color: "#F1F5F9" }}
              >
                Notifications
              </h1>
              <p className="text-xs" style={{ color: "#64748B" }}>
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                style={{
                  background: "rgba(59,130,246,0.15)",
                  color: "#3B82F6",
                }}
              >
                <CheckCheck size={12} />
                Mark all read
              </button>
            )}
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
              style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}
            >
              <Trash2 size={12} />
              Clear all
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all"
              style={{
                background:
                  filter === f.id ? "rgba(59,130,246,0.15)" : "transparent",
                color: filter === f.id ? "#3B82F6" : "#64748B",
                border: `1px solid ${
                  filter === f.id ? "rgba(59,130,246,0.3)" : "transparent"
                }`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "#0D1421",
            border: "1px solid rgba(59,130,246,0.1)",
          }}
        >
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={markAsRead}
              />
            ))
          ) : (
            <div className="p-12 text-center">
              <Bell
                size={48}
                className="mx-auto mb-4"
                style={{ color: "#475569" }}
              />
              <p className="text-sm" style={{ color: "#64748B" }}>
                {filter === "all"
                  ? "No notifications"
                  : `No ${filter} notifications`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
