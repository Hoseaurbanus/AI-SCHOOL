import { useState, useMemo } from "react"
import { Award, CheckCircle, Search, Download } from "lucide-react"
import { useAdminCertificates, useVerifyCertificate } from "../hooks/useAdmin"
import StatsCard from "../components/admin/StatsCard"

export default function AdminCertificates() {
  const { data: certificates, isLoading } = useAdminCertificates()
  const verifyMutation = useVerifyCertificate()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const stats = useMemo(() => {
    if (!certificates) return { total: 0, month: 0, pending: 0 }
    const total = certificates.length
    const month = certificates.filter((c) =>
      c.date.startsWith("2026-07"),
    ).length
    const pending = certificates.filter((c) => c.status === "pending").length
    return { total, month, pending }
  }, [certificates])

  const filtered = useMemo(() => {
    if (!certificates) return []
    return certificates.filter((cert) => {
      const matchSearch =
        cert.studentName.toLowerCase().includes(search.toLowerCase()) ||
        cert.id.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === "all" || cert.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [certificates, search, statusFilter])

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-sm" style={{ color: "#64748B" }}>
          Loading certificates...
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
            Certificate Management
          </h1>
          <p className="text-sm mt-1" style={{ color: "#64748B" }}>
            {stats.total} certificates issued
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatsCard
          icon={Award}
          title="Total Issued"
          value={stats.total}
          color="#F59E0B"
        />
        <StatsCard
          icon={Award}
          title="This Month"
          value={stats.month}
          color="#3B82F6"
        />
        <StatsCard
          icon={Award}
          title="Pending"
          value={stats.pending}
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
            placeholder="Search certificates..."
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
          {["all", "issued", "pending"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
              style={{
                background:
                  statusFilter === f ? "rgba(239,68,68,0.15)" : "transparent",
                color: statusFilter === f ? "#EF4444" : "#64748B",
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
        <table className="w-full">
          <thead>
            <tr
              className="border-b text-xs"
              style={{ borderColor: "rgba(239,68,68,0.08)" }}
            >
              {[
                "Certificate ID",
                "Student",
                "Course",
                "Score",
                "Date",
                "Status",
                "Actions",
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
            {filtered.map((cert) => (
              <tr
                key={cert.id}
                className="border-b"
                style={{ borderColor: "rgba(239,68,68,0.04)" }}
              >
                <td
                  className="px-5 py-4 text-xs font-mono"
                  style={{ color: "#3B82F6" }}
                >
                  {cert.id}
                </td>
                <td className="px-5 py-4 text-sm" style={{ color: "#F1F5F9" }}>
                  {cert.studentName}
                </td>
                <td className="px-5 py-4 text-xs" style={{ color: "#94A3B8" }}>
                  {cert.courseName}
                </td>
                <td
                  className="px-5 py-4 text-sm font-semibold"
                  style={{
                    color:
                      cert.score >= 90
                        ? "#10B981"
                        : cert.score >= 70
                          ? "#F59E0B"
                          : "#EF4444",
                  }}
                >
                  {cert.score}/100
                </td>
                <td className="px-5 py-4 text-xs" style={{ color: "#64748B" }}>
                  {cert.date}
                </td>
                <td className="px-5 py-4">
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background:
                        cert.status === "issued"
                          ? "rgba(16,185,129,0.1)"
                          : "rgba(245,158,11,0.1)",
                      color: cert.status === "issued" ? "#10B981" : "#F59E0B",
                    }}
                  >
                    {cert.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => verifyMutation.mutate(cert.id)}
                      disabled={verifyMutation.isPending}
                      className="flex items-center gap-1 text-xs"
                      style={{ color: "#3B82F6" }}
                    >
                      <CheckCircle size={12} /> Verify
                    </button>
                    <button
                      className="flex items-center gap-1 text-xs"
                      style={{ color: "#64748B" }}
                    >
                      <Download size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
