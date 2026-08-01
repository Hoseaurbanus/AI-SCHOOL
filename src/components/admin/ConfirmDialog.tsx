import { AlertTriangle, X } from "lucide-react"

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div
        className="relative w-full max-w-md mx-4 p-6 rounded-2xl"
        style={{
          background: "#0D1421",
          border: "1px solid rgba(59,130,246,0.2)",
        }}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4"
          style={{ color: "#64748B" }}
        >
          <X size={18} />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(239,68,68,0.15)" }}
          >
            <AlertTriangle size={20} style={{ color: "#EF4444" }} />
          </div>
          <h3 className="text-lg font-bold" style={{ color: "#F1F5F9" }}>
            {title}
          </h3>
        </div>
        <p className="text-sm mb-6" style={{ color: "#94A3B8" }}>
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ background: "rgba(100,116,139,0.15)", color: "#94A3B8" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: "#EF4444", color: "#FFFFFF" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
