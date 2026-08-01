import { useState } from "react"
import { Award, Download } from "lucide-react"
import { certificateData } from "../data/mockData"
import CertificateCard from "../components/certificate/CertificateCard"
import CertificatePreview from "../components/certificate/CertificatePreview"
import type { CertificateData } from "../types"

export default function Certificate() {
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null)

  const avgScore =
    certificateData.length > 0
      ? Math.round(
          certificateData.reduce((sum, c) => sum + c.score, 0) /
            certificateData.length,
        )
      : 0

  return (
    <div className="min-h-screen" style={{ background: "#060A12" }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(139,92,246,0.15)" }}
            >
              <Award size={20} style={{ color: "#8B5CF6" }} />
            </div>
            <div>
              <h1
                className="text-xl font-bold font-display"
                style={{ color: "#F1F5F9" }}
              >
                Certificates
              </h1>
              <p className="text-xs" style={{ color: "#64748B" }}>
                Your earned certificates
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div
            className="p-4 rounded-xl"
            style={{
              background: "#0D1421",
              border: "1px solid rgba(59,130,246,0.1)",
            }}
          >
            <p className="text-2xl font-bold" style={{ color: "#F1F5F9" }}>
              {certificateData.length}
            </p>
            <p className="text-xs" style={{ color: "#64748B" }}>
              Total Certificates
            </p>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{
              background: "#0D1421",
              border: "1px solid rgba(59,130,246,0.1)",
            }}
          >
            <p className="text-2xl font-bold" style={{ color: "#10B981" }}>
              {avgScore}%
            </p>
            <p className="text-xs" style={{ color: "#64748B" }}>
              Average Score
            </p>
          </div>
        </div>

        {/* Certificate List */}
        <div className="space-y-3">
          {certificateData.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onView={() => setSelectedCert(cert)}
            />
          ))}
        </div>

        {certificateData.length === 0 && (
          <div
            className="p-12 rounded-2xl text-center"
            style={{
              background: "#0D1421",
              border: "1px solid rgba(59,130,246,0.1)",
            }}
          >
            <Award
              size={48}
              className="mx-auto mb-4"
              style={{ color: "#475569" }}
            />
            <p className="text-sm" style={{ color: "#64748B" }}>
              No certificates yet. Complete courses to earn certificates!
            </p>
          </div>
        )}
      </div>

      {selectedCert && (
        <CertificatePreview
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  )
}
