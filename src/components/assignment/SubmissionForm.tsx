import { useState } from 'react';
import { Code2, Upload, Send, Loader2 } from 'lucide-react';
import type { Assignment } from '../../types';

interface SubmissionFormProps {
  assignment: Assignment;
  onSubmit: (code: string) => void;
}

const placeholders: Record<string, string> = {
  python: `import random\n\ndef guess_game():\n    # Your code here\n    pass\n\nguess_game()`,
  html: `<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <!-- Your code here -->\n</body>\n</html>`,
  javascript: `// Your code here\nfunction main() {\n  \n}\n\nmain();`,
};

const fileLabels: Record<string, string> = {
  python: '.py',
  html: '.html',
  javascript: '.js',
};

export default function SubmissionForm({ assignment, onSubmit }: SubmissionFormProps) {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setIsSubmitting(true);
    onSubmit(code);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>
          Paste your {assignment.language.charAt(0).toUpperCase() + assignment.language.slice(1)} code
        </label>
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
          <div className="flex items-center gap-2 px-4 py-2" style={{ background: '#0A0F1A' }}>
            <Code2 size={13} style={{ color: '#3B82F6' }} />
            <span className="text-xs font-mono" style={{ color: '#475569' }}>main{fileLabels[assignment.language]}</span>
          </div>
          <textarea
            rows={14}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={placeholders[assignment.language]}
            className="w-full p-4 text-sm font-mono outline-none resize-none"
            style={{ background: '#060A12', color: '#F1F5F9', lineHeight: 1.6 }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#94A3B8' }}>Or upload file</label>
        <div
          className="flex flex-col items-center justify-center py-8 rounded-xl border-2 border-dashed cursor-pointer transition-all"
          style={{ borderColor: 'rgba(59,130,246,0.2)', background: 'rgba(59,130,246,0.03)' }}
        >
          <Upload size={24} className="mb-2" style={{ color: '#475569' }} />
          <p className="text-sm" style={{ color: '#64748B' }}>
            Drop {fileLabels[assignment.language]} file here or click to browse
          </p>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!code.trim() || isSubmitting}
        className="w-full py-3.5 rounded-xl font-semibold gradient-blue-purple text-white hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
        style={{ boxShadow: '0 0 20px rgba(59,130,246,0.25)' }}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            Submit for AI Review
            <Send size={16} />
          </>
        )}
      </button>
    </div>
  );
}
