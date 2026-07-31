import { useState } from 'react';
import { Award, Clock, CheckCircle2, XCircle, BarChart3 } from 'lucide-react';
import { assessments } from '../data/mockData';
import type { AssessmentResult } from '../types';

const mockResults: AssessmentResult[] = [
  {
    id: 'res_001',
    assessmentId: 'assess_001',
    userId: 'usr_001',
    answers: {},
    score: 85,
    passed: true,
    timeTaken: 420,
    completedAt: '2026-07-28T14:30:00Z',
  },
  {
    id: 'res_002',
    assessmentId: 'assess_002',
    userId: 'usr_001',
    answers: {},
    score: 65,
    passed: false,
    timeTaken: 540,
    completedAt: '2026-07-29T10:15:00Z',
  },
];

export default function Results() {
  const [selectedResult, setSelectedResult] = useState<AssessmentResult | null>(null);

  const getAssessmentTitle = (id: string) => {
    return assessments.find(a => a.id === id)?.title || 'Unknown Assessment';
  };

  return (
    <div className="min-h-screen" style={{ background: '#060A12' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(59,130,246,0.15)' }}
          >
            <BarChart3 size={20} style={{ color: '#3B82F6' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display" style={{ color: '#F1F5F9' }}>Results</h1>
            <p className="text-xs" style={{ color: '#64748B' }}>Your assessment history</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div
            className="p-4 rounded-xl"
            style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
          >
            <p className="text-2xl font-bold" style={{ color: '#F1F5F9' }}>{mockResults.length}</p>
            <p className="text-xs" style={{ color: '#64748B' }}>Total Attempts</p>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
          >
            <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
              {mockResults.filter(r => r.passed).length}
            </p>
            <p className="text-xs" style={{ color: '#64748B' }}>Passed</p>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
          >
            <p className="text-2xl font-bold" style={{ color: '#3B82F6' }}>
              {Math.round(mockResults.reduce((sum, r) => sum + r.score, 0) / mockResults.length)}%
            </p>
            <p className="text-xs" style={{ color: '#64748B' }}>Avg Score</p>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-3">
          {mockResults.map(result => (
            <div
              key={result.id}
              className="p-4 rounded-xl cursor-pointer transition-all"
              style={{
                background: '#0D1421',
                border: `1px solid ${selectedResult?.id === result.id ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.1)'}`,
              }}
              onClick={() => setSelectedResult(selectedResult?.id === result.id ? null : result)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: result.passed ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }}
                  >
                    {result.passed ? (
                      <Award size={18} style={{ color: '#10B981' }} />
                    ) : (
                      <XCircle size={18} style={{ color: '#EF4444' }} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>
                      {getAssessmentTitle(result.assessmentId)}
                    </p>
                    <p className="text-xs" style={{ color: '#64748B' }}>
                      {new Date(result.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: result.passed ? '#10B981' : '#EF4444' }}>
                      {result.score}%
                    </p>
                    <p className="text-xs" style={{ color: '#64748B' }}>
                      {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
                    </p>
                  </div>
                </div>
              </div>

              {selectedResult?.id === result.id && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#64748B' }}>Status</p>
                      <p className="text-sm font-medium" style={{ color: result.passed ? '#10B981' : '#EF4444' }}>
                        {result.passed ? 'Passed' : 'Failed'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#64748B' }}>Time</p>
                      <p className="text-sm font-medium" style={{ color: '#F1F5F9' }}>
                        {Math.floor(result.timeTaken / 60)} minutes {result.timeTaken % 60} seconds
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
