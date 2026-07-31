import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, FileText, MessageSquare, Wrench } from 'lucide-react';
import { courses, curriculum, lessonContents, resources } from '../data/mockData';
import { useLessonProgress } from '../hooks/useLessonProgress';
import CurriculumList from '../components/course/CurriculumList';
import LessonContent from '../components/learning/LessonContent';
import NotesPanel from '../components/learning/NotesPanel';
import ResourcesList from '../components/learning/ResourcesList';
import LoadingSpinner from '../components/ui/LoadingSpinner';

type Tab = 'lesson' | 'notes' | 'resources';

export default function CourseLearning() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const courseId = searchParams.get('courseId') || courses[0].id;
  const moduleIndex = parseInt(searchParams.get('module') || '0', 10);
  const lessonIndex = parseInt(searchParams.get('lesson') || '0', 10);

  const course = courses.find(c => c.id === courseId) || courses[0];
  const currentModule = curriculum[moduleIndex] || curriculum[0];
  const currentLesson = currentModule.lessons[lessonIndex] || currentModule.lessons[0];
  const totalLessons = curriculum.reduce((sum, m) => sum + m.lessons.length, 0);

  const { isCompleted, toggleLesson, progress } = useLessonProgress(courseId, totalLessons);
  const [activeTab, setActiveTab] = useState<Tab>('lesson');
  const [showNotes, setShowNotes] = useState(false);

  const lessonContent = lessonContents[currentLesson.id] || [];
  const lessonResources = resources[currentLesson.id] || [];

  const updateLesson = (newModule: number, newLesson: number) => {
    setSearchParams({ courseId, module: String(newModule), lesson: String(newLesson) });
  };

  const goNext = () => {
    if (lessonIndex < currentModule.lessons.length - 1) {
      updateLesson(moduleIndex, lessonIndex + 1);
    } else if (moduleIndex < curriculum.length - 1) {
      updateLesson(moduleIndex + 1, 0);
    }
  };

  const goPrev = () => {
    if (lessonIndex > 0) {
      updateLesson(moduleIndex, lessonIndex - 1);
    } else if (moduleIndex > 0) {
      const prevModule = curriculum[moduleIndex - 1];
      updateLesson(moduleIndex - 1, prevModule.lessons.length - 1);
    }
  };

  const handleLessonClick = (moduleIdx: number, lessonIdx: number) => {
    updateLesson(moduleIdx, lessonIdx);
  };

  const tabs: { id: Tab; label: string; icon: typeof BookOpen }[] = [
    { id: 'lesson', label: 'Lesson', icon: BookOpen },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'resources', label: 'Resources', icon: Wrench },
  ];

  return (
    <div className="flex flex-col h-screen" style={{ background: '#060A12' }}>
      {/* Top Bar */}
      <div
        className="flex items-center gap-4 px-4 py-3 flex-shrink-0"
        style={{ background: '#0D1421', borderBottom: '1px solid rgba(59,130,246,0.1)' }}
      >
        <button
          onClick={() => navigate('/my-courses')}
          className="flex items-center gap-2 text-sm"
          style={{ color: '#64748B' }}
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">My Courses</span>
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: '#F1F5F9' }}>
            {course.title}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(59,130,246,0.1)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, background: '#3B82F6' }}
            />
          </div>
          <span className="text-xs font-medium" style={{ color: '#3B82F6' }}>{progress}%</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Curriculum */}
        <aside
          className="hidden lg:flex flex-col w-72 flex-shrink-0 overflow-y-auto"
          style={{ background: '#0D1421', borderRight: '1px solid rgba(59,130,246,0.1)' }}
        >
          <div className="p-4">
            <CurriculumList
              modules={curriculum}
              currentModuleIndex={moduleIndex}
              currentLessonIndex={lessonIndex}
              completedLessons={[]}
              onLessonClick={handleLessonClick}
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div
            className="flex items-center gap-1 px-4 py-2 flex-shrink-0"
            style={{ background: '#0D1421', borderBottom: '1px solid rgba(59,130,246,0.1)' }}
          >
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                  style={{
                    background: activeTab === tab.id ? 'rgba(59,130,246,0.1)' : 'transparent',
                    color: activeTab === tab.id ? '#3B82F6' : '#64748B',
                  }}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {activeTab === 'lesson' && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold font-display" style={{ color: '#F1F5F9' }}>
                    {currentLesson.title}
                  </h1>
                  <button
                    onClick={() => toggleLesson(currentLesson.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
                    style={{
                      background: isCompleted(currentLesson.id) ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)',
                      color: isCompleted(currentLesson.id) ? '#10B981' : '#3B82F6',
                      border: `1px solid ${isCompleted(currentLesson.id) ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.3)'}`,
                    }}
                  >
                    <CheckCircle2 size={16} />
                    {isCompleted(currentLesson.id) ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>

                {lessonContent.length > 0 ? (
                  <LessonContent content={lessonContent} />
                ) : (
                  <div
                    className="rounded-xl p-8 text-center"
                    style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
                  >
                    <BookOpen size={48} className="mx-auto mb-4" style={{ color: '#475569' }} />
                    <p className="text-sm" style={{ color: '#64748B' }}>
                      No content available for this lesson yet.
                    </p>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}>
                  <button
                    onClick={goPrev}
                    disabled={moduleIndex === 0 && lessonIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-40"
                    style={{ background: '#0D1421', color: '#94A3B8', border: '1px solid rgba(59,130,246,0.15)' }}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <button
                    onClick={goNext}
                    disabled={moduleIndex === curriculum.length - 1 && lessonIndex === currentModule.lessons.length - 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-40"
                    style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.3)' }}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="max-w-3xl mx-auto">
                <NotesPanel lessonId={currentLesson.id} userId="usr_001" />
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="max-w-3xl mx-auto">
                <ResourcesList resources={lessonResources} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}