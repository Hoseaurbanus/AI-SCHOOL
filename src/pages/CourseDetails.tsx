import { useState } from 'react';
import {
  Star, Clock, Users, Award, Brain, CheckCircle,
  BookOpen, Code2, Target, ArrowRight, ShoppingCart,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCourse, useCourseModules, useCourseReviews } from '../hooks/useCourses';
import { useCartStore } from '../stores/cartStore';
import CurriculumList from '../components/course/CurriculumList';
import ReviewCard from '../components/course/ReviewCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');

  const { data: courseData, isLoading: courseLoading } = useCourse(id || '');
  const { data: modulesData } = useCourseModules(id || '');
  const { data: reviewsData } = useCourseReviews(id || '');

  const course = courseData?.data;
  const modules = modulesData?.data || [];
  const reviews = reviewsData?.data || [];

  const addItem = useCartStore((s) => s.addItem);
  const isInCart = useCartStore((s) => s.isInCart(id || ''));

  if (courseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060A12' }}>
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060A12' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#F1F5F9' }}>Course not found</h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : course.rating.toString();

  return (
    <div style={{ background: '#060A12', minHeight: '100vh' }}>
      {/* Hero */}
      <div
        className="py-12 px-6"
        style={{
          background: 'linear-gradient(135deg,rgba(59,130,246,0.08) 0%,rgba(139,92,246,0.06) 100%)',
          borderBottom: '1px solid rgba(59,130,246,0.1)',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6' }}
                >
                  {course.category}
                </span>
                {course.aiTutor && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                    style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6' }}
                  >
                    <Brain size={10} /> AI Tutor Included
                  </span>
                )}
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}
                >
                  {course.level}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold font-display mb-4" style={{ color: '#F1F5F9' }}>
                {course.title}
              </h1>
              <p className="text-base leading-relaxed mb-6" style={{ color: '#94A3B8' }}>
                {course.description}
              </p>

              <div className="flex flex-wrap gap-5 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <Star size={16} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                  <span className="font-semibold" style={{ color: '#F59E0B' }}>{avgRating}</span>
                  <span style={{ color: '#64748B' }}>({reviews.length} reviews)</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: '#64748B' }}>
                  <Clock size={16} />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: '#64748B' }}>
                  <BookOpen size={16} />
                  <span>{course.lessons} lessons</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: '#64748B' }}>
                  <Code2 size={16} />
                  <span>{course.projects} projects</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: '#64748B' }}>
                  <Users size={16} />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor)}&background=1A2540&color=3B82F6&size=80`}
                  alt={course.instructor}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-xs" style={{ color: '#64748B' }}>Instructor</p>
                  <p className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{course.instructor}</p>
                </div>
              </div>
            </div>

            {/* Pricing card */}
            <div
              className="rounded-2xl overflow-hidden sticky top-20"
              style={{
                background: '#0D1421',
                border: '1px solid rgba(59,130,246,0.2)',
                boxShadow: '0 0 40px rgba(59,130,246,0.08)',
              }}
            >
              <div className="h-44 overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold font-display gradient-text">
                    ₦{course.price.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => navigate('/checkout', { state: { courseId: course.id } })}
                  className="w-full py-3 rounded-xl font-semibold text-sm mb-3 gradient-blue-purple text-white flex items-center justify-center gap-2"
                >
                  <ArrowRight size={16} />
                  Enroll Now
                </button>

                <button
                  onClick={() => addItem(course.id)}
                  disabled={isInCart}
                  className="w-full py-3 rounded-xl font-semibold text-sm mb-4 flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: isInCart ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)',
                    color: isInCart ? '#10B981' : '#3B82F6',
                    border: `1px solid ${isInCart ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.2)'}`,
                  }}
                >
                  {isInCart ? <CheckCircle size={16} /> : <ShoppingCart size={16} />}
                  {isInCart ? 'Added to Cart' : 'Add to Cart'}
                </button>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3" style={{ color: '#94A3B8' }}>
                    <Clock size={16} style={{ color: '#64748B' }} />
                    <span>{course.duration} of content</span>
                  </div>
                  <div className="flex items-center gap-3" style={{ color: '#94A3B8' }}>
                    <BookOpen size={16} style={{ color: '#64748B' }} />
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-3" style={{ color: '#94A3B8' }}>
                    <Code2 size={16} style={{ color: '#64748B' }} />
                    <span>{course.projects} hands-on projects</span>
                  </div>
                  <div className="flex items-center gap-3" style={{ color: '#94A3B8' }}>
                    <Award size={16} style={{ color: '#64748B' }} />
                    <span>Certificate of completion</span>
                  </div>
                  {course.aiTutor && (
                    <div className="flex items-center gap-3" style={{ color: '#94A3B8' }}>
                      <Brain size={16} style={{ color: '#8B5CF6' }} />
                      <span>AI Tutor access</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-1 p-1 rounded-xl w-fit mb-8" style={{ background: 'rgba(59,130,246,0.06)' }}>
          {(['overview', 'curriculum', 'reviews'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all capitalize"
              style={{
                background: tab === t ? '#1A2540' : 'transparent',
                color: tab === t ? '#3B82F6' : '#64748B',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'overview' && (
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold font-display mb-4" style={{ color: '#F1F5F9' }}>
              What You'll Learn
            </h2>
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {[
                'Build real-world projects from scratch',
                'Master industry-standard tools and frameworks',
                'Get personalized AI-powered guidance',
                'Earn a verified certificate',
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: '#0D1421', border: '1px solid rgba(59,130,246,0.1)' }}
                >
                  <CheckCircle size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: 2 }} />
                  <span className="text-sm" style={{ color: '#94A3B8' }}>{item}</span>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-bold font-display mb-4" style={{ color: '#F1F5F9' }}>
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ background: 'rgba(59,130,246,0.08)', color: '#3B82F6' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {tab === 'curriculum' && (
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold font-display mb-4" style={{ color: '#F1F5F9' }}>
              Course Curriculum
            </h2>
            <p className="text-sm mb-6" style={{ color: '#64748B' }}>
              {modules.length} modules · {course.lessons} lessons · {course.duration}
            </p>
            <CurriculumList modules={modules} />
          </div>
        )}

        {tab === 'reviews' && (
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold font-display gradient-text">{avgRating}</div>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      fill={s <= Math.round(parseFloat(avgRating)) ? '#F59E0B' : 'transparent'}
                      style={{ color: s <= Math.round(parseFloat(avgRating)) ? '#F59E0B' : '#475569' }}
                    />
                  ))}
                </div>
                <div className="text-xs mt-1" style={{ color: '#64748B' }}>
                  {reviews.length} reviews
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
