import { useState, useMemo } from "react"
import {
  Search,
  Download,
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { useAdminTransactions } from "../hooks/useAdmin"
import StatsCard from "../components/admin/StatsCard"

export default function AdminPayments() {
  const { data: transactions, isLoading } = useAdminTransactions()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  const stats = useMemo(() => {
    if (!transactions) return { total: 0, month: 0, pending: 0 }
    const total = transactions.reduce((sum, tx) => sum + tx.amount, 0)
    const month = transactions
      .filter((tx) => tx.date.startsWith("2025-07"))
      .reduce((sum, tx) => sum + tx.amount, 0)
    const pending = transactions
      .filter((tx) => tx.status === "pending")
      .reduce((sum, tx) => sum + tx.amount, 0)
    return { total, month, pending }
  }, [transactions])

  const filtered = useMemo(() => {
    if (!transactions) return []
    return transactions.filter((tx) => {
      const matchSearch =
        tx.studentName.toLowerCase().includes(search.toLowerCase()) ||
        tx.id.toLowerCase().includes(search.toLowerCase())
      const matchFilter = filter === "all" || tx.status === filter
      return matchSearch && matchFilter
    })
  }, [transactions, search, filter])

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-sm" style={{ color: "#64748B" }}>
          Loading payments...
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
            Payment Management
          </h1>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>
            Track transactions and revenue
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{
            background: "rgba(239,68,68,0.08)",
            color: "#EF4444",
            border: "1px solid rgba(239,68,68,0.15)",
          }}
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatsCard
          icon={DollarSign}
          title="Total Revenue"
          value={`₦${(stats.total / 1000).toFixed(0)}K`}
          trend="+23%"
          color="#10B981"
        />
        <StatsCard
          icon={TrendingUp}
          title="This Month"
          value={`₦${(stats.month / 1000).toFixed(0)}K`}
          color="#3B82F6"
        />
        <StatsCard
          icon={Clock}
          title="Pending"
          value={`₦${(stats.pending / 1000).toFixed(0)}K`}
          color="#F59E0B"
        />
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{
            background: "#0D1421",
            border: "1px solid rgba(239,68,68,0.1)",
            width: "240px",
          }}
        >
          <Search size={15} style={{ color: "#475569" }} />
          <input
            type="text"
            placeholder="Search transactions..."
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
          {["all", "success", "pending", "failed"].map((f) => (
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

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "#0D1421",
          border: "1px solid rgba(239,68,68,0.08)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className="border-b text-xs"
                style={{ borderColor: "rgba(239,68,68,0.08)" }}
              >
                {[
                  "Transaction ID",
                  "Student",
                  "Course",
                  "Amount",
                  "Status",
                  "Date",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 font-semibold"
                    style={{ color: "#475569" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b"
                  style={{ borderColor: "rgba(239,68,68,0.04)" }}
                >
                  <td
                    className="px-5 py-3.5 text-xs font-mono"
                    style={{ color: "#3B82F6" }}
                  >
                    {tx.id}
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm"
                    style={{ color: "#F1F5F9" }}
                  >
                    {tx.studentName}
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs"
                    style={{ color: "#94A3B8" }}
                  >
                    {tx.courseName}
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm font-semibold"
                    style={{ color: "#10B981" }}
                  >
                    ₦{tx.amount.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background:
                          tx.status === "success"
                            ? "rgba(16,185,129,0.1)"
                            : tx.status === "pending"
                              ? "rgba(245,158,11,0.1)"
                              : "rgba(239,68,68,0.1)",
                        color:
                          tx.status === "success"
                            ? "#10B981"
                            : tx.status === "pending"
                              ? "#F59E0B"
                              : "#EF4444",
                      }}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs"
                    style={{ color: "#475569" }}
                  >
                    {tx.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
