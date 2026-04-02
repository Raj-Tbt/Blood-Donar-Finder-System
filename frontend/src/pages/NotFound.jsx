/**
 * 404 Not Found Page
 *
 * Displayed when a user navigates to a route that does not exist.
 * Provides a link to return to the home page.
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <FiAlertCircle className="w-20 h-20 text-blood-400 mx-auto mb-6" />
        <h1 className="font-display text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-8">Page not found. The page you are looking for does not exist.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </motion.div>
    </div>
  );
}
