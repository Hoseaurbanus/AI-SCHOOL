import { Calendar, Clock, FileCode, CheckCircle2, RotateCcw, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Assignment } from '../../types';
import { courses } from '../../data/mockData';

interface AssignmentCardProps {
  assignment: Assignment;
}

export default function AssignmentCard({ assignment }: AssignmentCardProps) {
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === assignment.courseId);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const languageIcon: Record<string, string> = {
    python: '🐍',
    html: '🌐',
    javascript: '⚡',
  };

  return (
    <div
      className="group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02]"
      style={{
        background: '#0D1421',
        border: '1px solid rgba(59,130,246,0.1)',
      }}
      onClick={() => navigate(`/assignments?id=${assignment.id}`)}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{languageIcon[assignment.language]}</span>
            <span
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}
            >
              {assignment.language.charAt(0).toUpperCase() + assignment.language.slice(1)}
            </span>
          </div>
          <span
            className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
            style={{
              background: 'rgba(34,197,94,0.1)',
              color: '#22C55E',
            }}
          >
            <FileCode size={12} />
            {assignment.totalPoints} pts
          </span>
        </div>

        <h3
          className="font-bold font-display text-lg mb-2 line-clamp-2"
          style={{ color: '#F1F5F9' }}
        >
          {assignment.title}
        </h3>

        {course && (
          <p className="text-sm mb-3" style={{ color: '#94A3B8' }}>
            {course.title}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs mb-4" style={{ color: '#64748B' }}>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>Due {formatDate(assignment.dueDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{assignment.requirements.length} requirements</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}>
          <p className="text-sm line-clamp-2 flex-1 mr-4" style={{ color: '#94A3B8' }}>
            {assignment.description}
          </p>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0"
            style={{
              background: 'rgba(59,130,246,0.1)',
              color: '#3B82F6',
              border: '1px solid rgba(59,130,246,0.2)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/assignments?id=${assignment.id}`);
            }}
          >
            View <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
