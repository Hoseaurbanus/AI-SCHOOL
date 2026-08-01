import { useState } from "react"
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Code2,
  ClipboardList,
  FolderKanban,
  Award,
  User,
  Settings,
  Bell,
  LogOut,
  Zap,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"
import type { Page } from "../types"

interface Props {
  children: React.ReactNode
  navigate: (p: Page) => void
  currentPage: Page
  onLogout: () => void
}

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    page: "student-dashboard" as Page,
  },
  { icon: BookOpen, label: "My Courses", page: "my-courses" as Page },
  { icon: MessageSquare, label: "AI Tutor", page: "ai-tutor" as Page },
  { icon: Code2, label: "Coding Lab", page: "coding-lab" as Page },
  { icon: ClipboardList, label: "Assignments", page: "assignment" as Page },
  { icon: FolderKanban, label: "Portfolio", page: "portfolio" as Page },
  { icon: Award, label: "Certificates", page: "certificate" as Page },
]

const bottomItems = [
  { icon: User, label: "Profile", page: "profile" as Page },
  { icon: Settings, label: "Settings", page: "settings" as Page },
]

export default function StudentLayout({
  children,
  navigate,
  currentPage,
  onLogout,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div
        className="p-5 border-b"
        style={{ borderColor: "rgba(59,130,246,0.1)" }}
      >
        <button
          onClick={() => navigate("landing")}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg gradient-blue-purple flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span
            className="font-bold text-base font-display"
            style={{ color: "#F1F5F9" }}
          >
            Smugflex<span className="gradient-text"> AI</span>
          </span>
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p
          className="text-xs font-semibold uppercase tracking-widest px-3 pb-2"
          style={{ color: "#475569" }}
        >
          Learning
        </p>
        {navItems.map(({ icon: Icon, label, page }) => {
          const active = currentPage === page
          return (
            <button
              key={page}
              onClick={() => {
                navigate(page)
                setSidebarOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group"
              style={{
                background: active ? "rgba(59,130,246,0.12)" : "transparent",
                color: active ? "#3B82F6" : "#94A3B8",
              }}
            >
              <Icon size={18} />
              <span className="flex-1 text-left">{label}</span>
              {active && (
                <ChevronRight size={14} style={{ color: "#3B82F6" }} />
              )}
            </button>
          )
        })}
      </nav>

      <div
        className="px-3 py-3 border-t space-y-0.5"
        style={{ borderColor: "rgba(59,130,246,0.1)" }}
      >
        {bottomItems.map(({ icon: Icon, label, page }) => {
          const active = currentPage === page
          return (
            <button
              key={page}
              onClick={() => {
                navigate(page)
                setSidebarOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: active ? "rgba(59,130,246,0.12)" : "transparent",
                color: active ? "#3B82F6" : "#94A3B8",
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          )
        })}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{ color: "#EF4444" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(239,68,68,0.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>

      <div className="px-4 pb-4">
        <div
          className="rounded-xl p-3"
          style={{
            background: "rgba(59,130,246,0.08)",
            border: "1px solid rgba(59,130,246,0.15)",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format"
                alt="Student"
              />
            </div>
            <div className="min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: "#F1F5F9" }}
              >
                Emeka Okafor
              </p>
              <p className="text-xs truncate" style={{ color: "#64748B" }}>
                Scholar Plan
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <div
              className="flex justify-between text-xs"
              style={{ color: "#64748B" }}
            >
              <span>XP Progress</span>
              <span style={{ color: "#3B82F6" }}>2,840 / 5,000</span>
            </div>
            <div
              className="h-1.5 rounded-full"
              style={{ background: "rgba(59,130,246,0.15)" }}
            >
              <div
                className="h-full rounded-full gradient-blue-purple"
                style={{ width: "56%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen" style={{ background: "#060A12" }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r"
        style={{ background: "#0D1421", borderColor: "rgba(59,130,246,0.1)" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className="relative flex flex-col w-72 border-r z-10"
            style={{
              background: "#0D1421",
              borderColor: "rgba(59,130,246,0.1)",
            }}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg"
              style={{ color: "#94A3B8" }}
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header
          className="flex items-center justify-between px-4 sm:px-6 py-4 border-b flex-shrink-0"
          style={{ background: "#0D1421", borderColor: "rgba(59,130,246,0.1)" }}
        >
          <button
            className="lg:hidden p-2 rounded-lg"
            style={{ color: "#94A3B8" }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 lg:max-w-xs">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{
                background: "rgba(59,130,246,0.06)",
                border: "1px solid rgba(59,130,246,0.1)",
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#475569"
                strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search courses, topics..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: "#94A3B8" }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => navigate("notifications")}
              className="relative p-2 rounded-lg transition-colors"
              style={{ color: "#94A3B8" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(59,130,246,0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <Bell size={20} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: "#3B82F6" }}
              />
            </button>
            <button
              onClick={() => navigate("profile")}
              className="w-9 h-9 rounded-full overflow-hidden border-2 transition-all hover:border-blue-500"
              style={{ borderColor: "rgba(59,130,246,0.3)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </header>

        <main
          className="flex-1 overflow-y-auto"
          style={{ background: "#060A12" }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
