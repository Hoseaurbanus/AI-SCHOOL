import { CheckCircle2, AlertCircle, Clock, RotateCcw, FileText } from 'lucide-react';
import type { Assignment, AssignmentSubmission } from '../../types';

interface FeedbackPanelProps {
  submission: AssignmentSubmission;
  assignment: Assignment;
  onRevise?: () => void;
}

export default function FeedbackPanel({ submission, assignment, onRevise }: FeedbackPanelProps) {
  const statusConfig: Record<string, { color: string; bg: string; label: string; icon: React.ReactNode }> = {
    graded: {
      color: '#22C55E',
      bg: 'rgba(34,197,94,0.1)',
      label: 'Graded',
      icon: <CheckCircle2 size={14} />,
    },
    returned: {
      color: '#F59E0B',
      bg: 'rgba(245,158,11,0.1)',
      label: 'Returned for Revision',
      icon: <RotateCcw size={14} />,
    },
    submitted: {
      color: '#64748B',
      bg: 'rgba(100,116,139,0.1)',
      label: 'Pending Review',
      icon: <Clock size={14} />,
    },
    pending: {
      color: '#64748B',
      bg: 'rgba(100,116,139,0.1)',
      label: 'Not Submitted',
      icon: <FileText size={14} />,
    },
  };

  const config = statusConfig[submission.status] || statusConfig.pending;
  const percentage = submission.score !== undefined ? Math.round((submission.score / assignment.totalPoints) * 100) : 0;

  const getRequirementStatus = (reqIndex: number) => {
    if (submission.status !== 'graded' && submission.status !== 'returned') {
      return null;
    }
    const pointsPerReq = assignment.totalPoints / assignment.requirements.length;
    const threshold = pointsPerReq * 0.7;
    return submission.score !== undefined && submission.score / assignment.requirements.length >= threshold * 0.5;
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: '#0D1421',
        border: `1px solid ${config.color}20`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold font-display" style={{ color: '#F1F5F9' }}>
          Feedback & Results
        </h3>
        <span
          className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5"
          style={{ background: config.bg, color: config.color }}
        >
          {config.icon}
          {config.label}
        </span>
      </div>

      {/* Score Display */}
      {submission.score !== undefined && (
        <div
          className="rounded-xl p-6 mb-6 text-center"
          style={{ background: `${config.color}10`, border: `1px solid ${config.color}20` }}
        >
          <div
            className="text-5xl font-bold mb-1 font-display"
            style={{ color: config.color }}
          >
            {submission.score}<span className="text-2xl opacity-60">/{assignment.totalPoints}</span>
          </div>
          <div className="text-sm" style={{ color: '#94A3B8' }}>
            {percentage}% overall score
          </div>
          {submission.gradedAt && (
            <div className="text-xs mt-2" style={{ color: '#64748B' }}>
              Graded on {new Date(submission.gradedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          )}
        </div>
      )}

      {/* Feedback Text */}
      {submission.feedback && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#E2E8F0' }}>
            <AlertCircle size={14} style={{ color: config.color }} />
            Instructor Feedback
          </h4>
          <div
            className="rounded-lg p-4 text-sm leading-relaxed"
            style={{ background: '#1A2332', color: '#CBD5E1', border: '1px solid rgba(59,130,246,0.1)' }}
          >
            {submission.feedback}
          </div>
        </div>
      )}

      {/* Requirement Breakdown */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-3" style={{ color: '#E2E8F0' }}>
          Requirement Breakdown
        </h4>
        <div className="space-y-3">
          {assignment.requirements.map((req, idx) => {
            const isMet = getRequirementStatus(idx);
            const reqPoints = Math.round((req.points / assignment.totalPoints) * (submission.score || 0));
            return (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{
                  background: isMet === true ? 'rgba(34,197,94,0.05)' : isMet === false ? 'rgba(239,68,68,0.05)' : '#1A2332',
                  border: `1px solid ${isMet === true ? 'rgba(34,197,94,0.2)' : isMet === false ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.1)'}`,
                }}
              >
                <div className="mt-0.5">
                  {isMet === true ? (
                    <CheckCircle2 size={16} style={{ color: '#22C55E' }} />
                  ) : isMet === false ? (
                    <AlertCircle size={16} style={{ color: '#EF4444' }} />
                  ) : (
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ background: '#334155' }}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm" style={{ color: '#E2E8F0' }}>
                    {req.text}
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#64748B' }}>
                    {req.points} points
                    {submission.status === 'graded' && (
                      <span style={{ color: isMet ? '#22C55E' : '#EF4444' }}>
                        {' '}· {isMet ? 'Met' : 'Not met'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Return to Revise Button */}
      {submission.status === 'returned' && onRevise && (
        <button
          onClick={onRevise}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: 'rgba(245,158,11,0.15)',
            color: '#F59E0B',
            border: '1px solid rgba(245,158,11,0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(245,158,11,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(245,158,11,0.15)';
          }}
        >
          <RotateCcw size={16} />
          Return to Revise & Resubmit
        </button>
      )}
    </div>
  );
}