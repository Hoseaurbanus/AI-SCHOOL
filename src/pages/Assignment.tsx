import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AssignmentCard from '../components/assignment/AssignmentCard';
import SubmissionForm from '../components/assignment/SubmissionForm';
import FeedbackPanel from '../components/assignment/FeedbackPanel';
import { assignments, assignmentSubmissions, enrolledCourses, courses } from '../data/mockData';

export default function Assignment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const assignmentId = searchParams.get('id');
  const [submitted, setSubmitted] = useState(false);

  const enrolledIds = enrolledCourses.map((e) => e.courseId);
  const enrolledAssignments = assignments.filter((a) => enrolledIds.includes(a.courseId));
  const assignment = assignmentId ? assignments.find((a) => a.id === assignmentId) : null;
  const submission = assignment
    ? assignmentSubmissions.find((s) => s.assignmentId === assignment.id && s.studentId === 'u1')
    : null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleSubmit = (_code: string) => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 lg:p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(16,185,129,0.15)' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold font-display mb-2" style={{ color: '#F1F5F9' }}>Assignment Submitted!</h2>
        <p className="mb-6 text-center" style={{ color: '#64748B' }}>Your AI tutor is reviewing your submission. You'll get feedback within a few minutes.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-3 rounded-xl font-semibold gradient-blue-purple text-white hover:opacity-90"
        >
          Back to Assignments
        </button>
      </div>
    );
  }

  if (assignment) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl">
          <button
            onClick={() => navigate('/assignments')}
            className="flex items-center gap-2 mb-6 text-sm hover:opacity-80 transition-opacity"
            style={{ color: '#3B82F6' }}
          >
            <ArrowLeft size={16} />
            Back to Assignments
          </button>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}
              >
                {assignment.language.charAt(0).toUpperCase() + assignment.language.slice(1)}
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E' }}
              >
                <FileText size={12} />
                {assignment.totalPoints} points
              </span>
            </div>
            <h1 className="text-3xl font-bold font-display mb-3" style={{ color: '#F1F5F9' }}>
              {assignment.title}
            </h1>
            <p className="text-base" style={{ color: '#94A3B8' }}>
              {courses.find((c) => c.id === assignment.courseId)?.title}
            </p>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-sm" style={{ color: '#F59E0B' }}>
              <Clock size={14} />
              Due {formatDate(assignment.dueDate)}
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#64748B' }}>
              <BookOpen size={14} />
              {assignment.requirements.length} requirements
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
            <div className="space-y-6">
              <div className="p-6 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
                <h3 className="font-semibold mb-4" style={{ color: '#F1F5F9' }}>Description</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
                  {assignment.description}
                </p>
              </div>

              <div className="p-6 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
                <h3 className="font-semibold mb-4" style={{ color: '#F1F5F9' }}>Requirements</h3>
                <div className="space-y-3">
                  {assignment.requirements.map((req, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-3 border-b last:border-0"
                      style={{ borderColor: 'rgba(59,130,246,0.06)' }}
                    >
                      <span className="text-sm" style={{ color: '#94A3B8' }}>{req.text}</span>
                      <span className="font-semibold text-sm" style={{ color: '#3B82F6' }}>{req.points} pts</span>
                    </div>
                  ))}
                </div>
              </div>

              {!submission && (
                <div className="p-6 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
                  <h3 className="font-semibold mb-4" style={{ color: '#F1F5F9' }}>Submit Your Code</h3>
                  <SubmissionForm assignment={assignment} onSubmit={handleSubmit} />
                </div>
              )}
            </div>

            <div>
              {submission ? (
                <FeedbackPanel submission={submission} assignment={assignment} />
              ) : (
                <div className="p-6 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
                  <h3 className="font-semibold mb-3" style={{ color: '#F1F5F9' }}>Starter Code</h3>
                  {assignment.starterCode && (
                    <pre className="p-4 rounded-xl text-sm font-mono overflow-x-auto" style={{ background: '#060A12', color: '#94A3B8', lineHeight: 1.6 }}>
                      {assignment.starterCode}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display mb-2" style={{ color: '#F1F5F9' }}>Assignments</h1>
          <p className="text-base" style={{ color: '#94A3B8' }}>
            Complete assignments for your enrolled courses
          </p>
        </div>

        {enrolledAssignments.length === 0 ? (
          <div className="text-center py-16 rounded-2xl" style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}>
            <FileText size={48} className="mx-auto mb-4" style={{ color: '#334155' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#F1F5F9' }}>No assignments yet</h3>
            <p className="text-sm" style={{ color: '#64748B' }}>Enroll in a course to see assignments.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledAssignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
