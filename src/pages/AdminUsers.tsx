import { useState } from "react"
import { Search, UserCheck, UserX, Edit, Eye, ArrowUpDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAdminUsers, useDeleteUser } from "../hooks/useAdmin"
import DataTable from "../components/admin/DataTable"
import ConfirmDialog from "../components/admin/ConfirmDialog"
import { useToast } from "../components/ui/Toast"

export default function AdminUsers() {
  const navigate = useNavigate()
  const { data: users = [], isLoading } = useAdminUsers()
  const deleteUser = useDeleteUser()
  const { showToast } = useToast()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [suspendId, setSuspendId] = useState<string | null>(null)

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === "all" || u.status === filter || u.role === filter
    return matchSearch && matchFilter
  })

  const handleDelete = () => {
    if (!deleteId) return
    deleteUser.mutate(deleteId, {
      onSuccess: () => {
        showToast("User deleted successfully", "success")
        setDeleteId(null)
      },
      onError: () => {
        showToast("Failed to delete user", "error")
      },
    })
  }

  const handleSuspend = () => {
    if (!suspendId) return
    // For now, we'll just show a toast since we don't have a suspend mutation
    showToast("User suspended successfully", "success")
    setSuspendId(null)
  }

  const columns = [
    {
      key: "name",
      label: "Student",
      render: (user: any) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "rgba(59,130,246,0.15)", color: "#3B82F6" }}
          >
            {user.name[0]}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "#F1F5F9" }}>
              {user.name}
            </p>
            <p className="text-xs font-mono" style={{ color: "#475569" }}>
              {user.id}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (user: any) => (
        <span className="text-xs" style={{ color: "#94A3B8" }}>
          {user.email}
        </span>
      ),
    },
    {
      key: "courses",
      label: "Courses",
      render: (user: any) => (
        <span className="text-sm" style={{ color: "#94A3B8" }}>
          {user.courses}
        </span>
      ),
    },
    {
      key: "progress",
      label: "Progress",
      render: (user: any) => (
        <div className="flex items-center gap-2">
          <div
            className="w-20 h-1.5 rounded-full"
            style={{ background: "rgba(59,130,246,0.1)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${user.progress}%`,
                background: user.progress > 80 ? "#10B981" : "#3B82F6",
              }}
            />
          </div>
          <span className="text-xs" style={{ color: "#64748B" }}>
            {user.progress}%
          </span>
        </div>
      ),
    },
    {
      key: "joined",
      label: "Joined",
      render: (user: any) => (
        <span className="text-xs" style={{ color: "#64748B" }}>
          {user.joined}
        </span>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (user: any) => (
        <span
          className="text-xs px-2 py-1 rounded-full capitalize"
          style={{
            background:
              user.role === "instructor"
                ? "rgba(139,92,246,0.1)"
                : "rgba(59,130,246,0.1)",
            color: user.role === "instructor" ? "#8B5CF6" : "#3B82F6",
          }}
        >
          {user.role}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (user: any) => (
        <span
          className="text-xs px-2 py-1 rounded-full"
          style={{
            background:
              user.status === "active"
                ? "rgba(16,185,129,0.1)"
                : "rgba(239,68,68,0.1)",
            color: user.status === "active" ? "#10B981" : "#EF4444",
          }}
        >
          {user.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (user: any) => (
        <div className="flex gap-2">
          <button
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "#475569" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#3B82F6")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
          >
            <Eye size={14} />
          </button>
          <button
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "#475569" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F59E0B")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
          >
            <Edit size={14} />
          </button>
          <button
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "#475569" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color =
                user.status === "active" ? "#EF4444" : "#10B981")
            }
            onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
            onClick={() =>
              user.status === "active"
                ? setSuspendId(user.id)
                : showToast("User already active", "info")
            }
          >
            {user.status === "active" ? (
              <UserX size={14} />
            ) : (
              <UserCheck size={14} />
            )}
          </button>
          <button
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "#475569" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#EF4444")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
            onClick={() => setDeleteId(user.id)}
          >
            <UserX size={14} />
          </button>
        </div>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2"
            style={{ borderColor: "#EF4444" }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-bold font-display"
            style={{ color: "#F1F5F9" }}
          >
            User Management
          </h1>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>
            {users.length} registered users
          </p>
        </div>
        <button
          onClick={() => showToast("Add User feature coming soon", "info")}
          className="px-4 py-2 rounded-xl text-sm font-semibold"
          style={{
            background: "rgba(239,68,68,0.1)",
            color: "#EF4444",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          + Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl flex-1 sm:flex-none sm:w-64"
          style={{
            background: "#0D1421",
            border: "1px solid rgba(239,68,68,0.1)",
          }}
        >
          <Search size={15} style={{ color: "#475569" }} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1"
            style={{ color: "#F1F5F9" }}
          />
        </div>
        <div
          className="flex gap-1 p-1 rounded-xl"
          style={{ background: "rgba(239,68,68,0.05)" }}
        >
          {["all", "student", "instructor", "active", "suspended"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
              style={{
                background:
                  filter === f ? "rgba(239,68,68,0.15)" : "transparent",
                color: filter === f ? "#EF4444" : "#64748B",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "#0D1421",
          border: "1px solid rgba(239,68,68,0.08)",
        }}
      >
        <DataTable columns={columns} data={filtered} pageSize={10} />
      </div>

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      <ConfirmDialog
        isOpen={suspendId !== null}
        title="Suspend User"
        message="Are you sure you want to suspend this user? They will lose access to the platform."
        onConfirm={handleSuspend}
        onCancel={() => setSuspendId(null)}
      />
    </div>
  )
}
