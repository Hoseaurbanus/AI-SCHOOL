import { Clock } from 'lucide-react';

interface QuizProgressProps {
  current: number;
  total: number;
  timeRemaining?: number;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function QuizProgress({ current, total, timeRemaining }: QuizProgressProps) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs" style={{ color: '#64748B' }}>
            Question {current + 1} of {total}
          </span>
          <span className="text-xs font-medium" style={{ color: '#3B82F6' }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(59,130,246,0.1)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, background: '#3B82F6' }}
          />
        </div>
      </div>
      {timeRemaining !== undefined && (
        <div className="flex items-center gap-1.5">
          <Clock size={14} style={{ color: timeRemaining < 60 ? '#EF4444' : '#64748B' }} />
          <span
            className="text-sm font-mono font-medium"
            style={{ color: timeRemaining < 60 ? '#EF4444' : '#94A3B8' }}
          >
            {formatTime(timeRemaining)}
          </span>
        </div>
      )}
    </div>
  );
}