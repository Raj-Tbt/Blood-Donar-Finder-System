/**
 * Application Root Component
 *
 * Defines the main routing structure and page transitions.
 * Wraps routes with role-based access protection and Framer Motion animations.
 */

import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorSearch from './pages/DonorSearch';
import DonorProfile from './pages/DonorProfile';
import RequestList from './pages/RequestList';
import HospitalDashboard from './pages/HospitalDashboard';
import PostRequest from './pages/PostRequest';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

/**
 * Restricts access to routes based on user authentication and role.
 * Redirects to login if unauthenticated, or home if role is unauthorized.
 */
function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blood-200 border-t-blood-500 rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

/** Page transition animation configuration */
const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3 },
};

/** Wrapper component that applies page transition animations */
function AnimatedPage({ children }) {
  return <motion.div {...pageTransition}>{children}</motion.div>;
}

export default function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
            <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
            <Route path="/donors" element={<AnimatedPage><DonorSearch /></AnimatedPage>} />
            <Route path="/donors/:id" element={<AnimatedPage><DonorProfile /></AnimatedPage>} />
            <Route path="/requests" element={<AnimatedPage><RequestList /></AnimatedPage>} />
            <Route path="/dashboard" element={<ProtectedRoute roles={['hospital']}><AnimatedPage><HospitalDashboard /></AnimatedPage></ProtectedRoute>} />
            <Route path="/dashboard/post" element={<ProtectedRoute roles={['hospital']}><AnimatedPage><PostRequest /></AnimatedPage></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AnimatedPage><AdminDashboard /></AnimatedPage></ProtectedRoute>} />
            <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
