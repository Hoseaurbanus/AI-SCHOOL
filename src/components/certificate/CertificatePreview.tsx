import { X, Download } from 'lucide-react';
import type { CertificateData } from '../../types';

interface CertificatePreviewProps {
  certificate: CertificateData;
  onClose: () => void;
}

export default function CertificatePreview({ certificate, onClose }: CertificatePreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        className="relative w-full max-w-2xl mx-4 rounded-2xl overflow-hidden"
        style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.2)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(59,130,246,0.1)' }}>
          <h3 className="text-lg font-bold" style={{ color: '#F1F5F9' }}>Certificate</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
              style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}
            >
              <Download size={12} />
              Print
            </button>
            <button onClick={onClose} style={{ color: '#64748B' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-8">
          <div
            className="p-8 rounded-xl text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(59,130,246,0.05) 100%)',
              border: '2px solid rgba(139,92,246,0.2)',
            }}
          >
            {/* Logo */}
            <div className="mb-6">
              <div
                className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
                style={{ background: 'rgba(139,92,246,0.15)' }}
              >
                <span className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>SA</span>
              </div>
            </div>

            <h1 className="text-2xl font-bold font-display mb-2" style={{ color: '#F1F5F9' }}>
              Certificate of Completion
            </h1>
            <p className="text-sm mb-6" style={{ color: '#64748B' }}>
              This certifies that
            </p>

            <h2 className="text-3xl font-bold font-display mb-2" style={{ color: '#8B5CF6' }}>
              {certificate.studentName}
            </h2>

            <p className="text-sm mb-6" style={{ color: '#64748B' }}>
              has successfully completed the course
            </p>

            <h3 className="text-xl font-bold mb-4" style={{ color: '#F1F5F9' }}>
              {certificate.courseName}
            </h3>

            <div className="flex items-center justify-center gap-8 mb-6">
              <div>
                <p className="text-2xl font-bold" style={{ color: '#10B981' }}>{certificate.score}%</p>
                <p className="text-xs" style={{ color: '#64748B' }}>Final Score</p>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>
                  {new Date(certificate.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-xs" style={{ color: '#64748B' }}>Date Issued</p>
              </div>
            </div>

            <div className="pt-4" style={{ borderTop: '1px solid rgba(139,92,246,0.2)' }}>
              <p className="text-xs" style={{ color: '#475569' }}>
                Verification Code: <span className="font-mono">{certificate.verificationCode}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}