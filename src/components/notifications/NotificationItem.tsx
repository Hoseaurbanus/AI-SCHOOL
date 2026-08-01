import { BookOpen, Award, Bell, Clock } from "lucide-react"
import type { Notification, NotificationType } from "../../types"

interface NotificationItemProps {
  notification: Notification
  onRead: (id: string) => void
}

const iconMap: Record<NotificationType, typeof BookOpen> = {
  course: BookOpen,
  achievement: Award,
  system: Bell,
  reminder: Clock,
}

const colorMap: Record<NotificationType, string> = {
  course: "#3B82F6",
  achievement: "#10B981",
  system: "#8B5CF6",
  reminder: "#F59E0B",
}

export default function NotificationItem({
  notification,
  onRead,
}: NotificationItemProps) {
  const Icon = iconMap[notification.type]
  const color = colorMap[notification.type]

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all"
      style={{
        background: notification.read ? "transparent" : "rgba(59,130,246,0.05)",
        borderBottom: "1px solid rgba(59,130,246,0.05)",
      }}
      onClick={() => !notification.read && onRead(notification.id)}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15` }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className="text-sm font-medium truncate"
            style={{ color: "#F1F5F9" }}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: "#3B82F6" }}
            />
          )}
        </div>
        <p className="text-xs mt-0.5 line-clamp-2" style={{ color: "#94A3B8" }}>
          {notification.message}
        </p>
        <p className="text-xs mt-1" style={{ color: "#475569" }}>
          {new Date(notification.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  )
}
