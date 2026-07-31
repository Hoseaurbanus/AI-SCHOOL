import { useState } from 'react';
import { ChevronLeft, ChevronRight, Send, BookOpen } from 'lucide-react';
import { assessments } from '../data/mockData';
import { useAssessment } from '../hooks/useAssessment';
import QuestionCard from '../components/assessment/QuestionCard';
import QuizProgress from '../components/assessment/QuizProgress';
import ResultSummary from '../components/assessment/ResultSummary';
import ConfirmDialog from '../components/admin/ConfirmDialog';
import type { Assessment } from '../types';

export default function Assessment() {
  const [selectedAssessment, setSelectedAssessment] = useState(assessments[0]);
  const [quizKey, setQuizKey] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const assessment = selectedAssessment;
  const {
    currentQuestion,
    currentIndex,
    answers,
    setAnswer,
    goNext,
    goPrev,
    goToQuestion,
    submit,
    result,
    timeRemaining,
    isSubmitted,
    totalQuestions,
  } = useAssessment(assessment);

  const handleSubmit = () => {
    setShowSubmitConfirm(true);
  };

  const confirmSubmit = () => {
    submit();
    setShowSubmitConfirm(false);
  };

  const handleRetry = () => {
    setQuizKey(prev => prev + 1);
  };

  const handleAssessmentChange = (id: string) => {
    const found = assessments.find(a => a.id === id);
    if (found) {
      setSelectedAssessment(found);
      setQuizKey(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#060A12' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.15)' }}
            >
              <BookOpen size={20} style={{ color: '#8B5CF6' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display" style={{ color: '#F1F5F9' }}>Assessments</h1>
              <p className="text-xs" style={{ color: '#64748B' }}>Test your knowledge</p>
            </div>
          </div>

          {!isSubmitted && (
            <select
              value={selectedAssessment.id}
              onChange={(e) => handleAssessmentChange(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm"
              style={{ background: '#0D1421', color: '#F1F5F9', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              {assessments.map(a => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
          )}
        </div>

        {isSubmitted && result ? (
          <ResultSummary result={result} assessment={assessment} onRetry={handleRetry} />
        ) : (
          <div className="space-y-6">
            {/* Progress */}
            <QuizProgress
              current={currentIndex}
              total={totalQuestions}
              timeRemaining={timeRemaining}
            />

            {/* Question */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
            >
              <QuestionCard
                key={`${quizKey}-${currentIndex}`}
                question={currentQuestion}
                selectedAnswers={answers[currentQuestion.id] || []}
                onAnswer={(ids) => setAnswer(currentQuestion.id, ids)}
              />
            </div>

            {/* Question Grid */}
            <div className="flex flex-wrap gap-2">
              {assessment.questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => goToQuestion(i)}
                  className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: i === currentIndex ? '#3B82F6' : answers[q.id]?.length ? 'rgba(59,130,246,0.15)' : '#0D1421',
                    color: i === currentIndex ? '#FFFFFF' : answers[q.id]?.length ? '#3B82F6' : '#64748B',
                    border: `1px solid ${i === currentIndex ? '#3B82F6' : 'rgba(59,130,246,0.1)'}`,
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm disabled:opacity-40"
                style={{ background: '#0D1421', color: '#94A3B8', border: '1px solid rgba(59,130,246,0.1)' }}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              {currentIndex === totalQuestions - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium"
                  style={{ background: '#3B82F6', color: '#FFFFFF' }}
                >
                  <Send size={16} />
                  Submit
                </button>
              ) : (
                <button
                  onClick={goNext}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.3)' }}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showSubmitConfirm}
        title="Submit Assessment"
        message="Are you sure you want to submit? You cannot change your answers after submission."
        onConfirm={confirmSubmit}
        onCancel={() => setShowSubmitConfirm(false)}
      />
    </div>
  );
}