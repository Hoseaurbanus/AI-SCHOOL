import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';

const Landing = lazy(() => import('./pages/Landing'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const CourseDetails = lazy(() => import('./pages/CourseDetails'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Auth = lazy(() => import('./pages/Auth'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const MyCourses = lazy(() => import('./pages/MyCourses'));
const CourseLearning = lazy(() => import('./pages/CourseLearning'));
const AITutor = lazy(() => import('./pages/AITutor'));
const CodingLab = lazy(() => import('./pages/CodingLab'));
const Assignment = lazy(() => import('./pages/Assignment'));
const Assessment = lazy(() => import('./pages/Assessment'));
const Results = lazy(() => import('./pages/Results'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Certificate = lazy(() => import('./pages/Certificate'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Checkout = lazy(() => import('./pages/Checkout'));
const PaymentStatus = lazy(() => import('./pages/PaymentStatus'));
const Notifications = lazy(() => import('./pages/Notifications'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminCourses = lazy(() => import('./pages/AdminCourses'));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics'));
const AdminPayments = lazy(() => import('./pages/AdminPayments'));
const AdminCertificates = lazy(() => import('./pages/AdminCertificates'));
const AdminAI = lazy(() => import('./pages/AdminAI'));
const NotFound = lazy(() => import('./pages/NotFound'));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#060A12' }}>
          <LoadingSpinner size={32} />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export default function App() {
  return (
    <SuspenseWrapper>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/forgot-password" element={<Auth mode="forgot" />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentStatus status="success" />} />
        <Route path="/payment-failed" element={<PaymentStatus status="failed" />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/courses/:id/learn" element={<CourseLearning />} />
          <Route path="/ai-tutor" element={<AITutor />} />
          <Route path="/coding-lab" element={<CodingLab />} />
          <Route path="/assignments" element={<Assignment />} />
          <Route path="/assessments" element={<Assessment />} />
          <Route path="/results" element={<Results />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/certificates" element={<Certificate />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/certificates" element={<AdminCertificates />} />
          <Route path="/admin/ai" element={<AdminAI />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </SuspenseWrapper>
  );
}
