import { Award, ChevronRight } from "lucide-react"
import { certificates } from "../../data/mockData"

interface CertificateShowcaseProps {
  onNavigate?: (page: string) => void
}

export default function CertificateShowcase({
  onNavigate,
}: CertificateShowcaseProps) {
  const issuedCertificates = certificates.filter((c) => c.status === "issued")

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-lg font-semibold font-display"
          style={{ color: "#F1F5F9" }}
        >
          Certificates Earned
        </h2>
        <button
          onClick={() => onNavigate?.("certificate")}
          className="flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: "#3B82F6" }}
        >
          View All <ChevronRight size={14} />
        </button>
      </div>

      <div
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {issuedCertificates.map((cert) => (
          <div
            key={cert.id}
            className="flex-shrink-0 w-64 rounded-xl border p-4 transition-all duration-200 hover:border-opacity-30 cursor-pointer"
            style={{
              background: "#0D1421",
              borderColor: "rgba(34,197,94,0.2)",
            }}
            onClick={() => onNavigate?.(`certificate-${cert.id}`)}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background:
                    cert.status === "issued"
                      ? "rgba(34,197,94,0.15)"
                      : "rgba(251,191,36,0.15)",
                }}
              >
                <Award
                  size={20}
                  style={{
                    color: cert.status === "issued" ? "#22C55E" : "#FBBF24",
                  }}
                />
              </div>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  background:
                    cert.status === "issued"
                      ? "rgba(34,197,94,0.15)"
                      : "rgba(251,191,36,0.15)",
                  color: cert.status === "issued" ? "#22C55E" : "#FBBF24",
                }}
              >
                {cert.status === "issued" ? "Issued" : "Pending"}
              </span>
            </div>

            <h3
              className="font-semibold text-sm mb-1 line-clamp-2"
              style={{ color: "#F1F5F9" }}
            >
              {cert.courseName}
            </h3>

            <div
              className="flex items-center gap-3 mt-3 pt-3 border-t"
              style={{ borderColor: "rgba(59,130,246,0.08)" }}
            >
              <div>
                <p className="text-xs" style={{ color: "#475569" }}>
                  Score
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#8B5CF6" }}
                >
                  {cert.score}%
                </p>
              </div>
              <div
                className="w-px h-8"
                style={{ background: "rgba(59,130,246,0.1)" }}
              />
              <div>
                <p className="text-xs" style={{ color: "#475569" }}>
                  Date
                </p>
                <p className="text-sm font-medium" style={{ color: "#94A3B8" }}>
                  {cert.date}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
