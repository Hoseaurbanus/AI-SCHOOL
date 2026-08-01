import { Award, ExternalLink } from "lucide-react"
import type { CertificateData } from "../../types"

interface CertificateCardProps {
  certificate: CertificateData
  onView: () => void
}

export default function CertificateCard({
  certificate,
  onView,
}: CertificateCardProps) {
  return (
    <div
      className="p-5 rounded-2xl transition-all"
      style={{
        background: "#0D1421",
        border: "1px solid rgba(59,130,246,0.1)",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(139,92,246,0.15)" }}
        >
          <Award size={24} style={{ color: "#8B5CF6" }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="text-sm font-bold truncate"
            style={{ color: "#F1F5F9" }}
          >
            {certificate.courseName}
          </h3>
          <p className="text-xs mt-1" style={{ color: "#64748B" }}>
            Issued {new Date(certificate.issuedAt).toLocaleDateString()}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <span
              className="px-2 py-1 rounded text-xs font-medium"
              style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}
            >
              Score: {certificate.score}%
            </span>
            <span className="text-xs font-mono" style={{ color: "#475569" }}>
              {certificate.verificationCode}
            </span>
          </div>
        </div>
        <button
          onClick={onView}
          className="p-2 rounded-lg transition-all"
          style={{ color: "#3B82F6" }}
        >
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  )
}
